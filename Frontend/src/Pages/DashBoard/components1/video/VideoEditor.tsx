import React, { useState, useRef, useEffect } from 'react';
import { MediaLibrary } from './MediaLibrary';
import { Timeline } from "./Timeline";
import { clipStorage } from "../../../../utils/ClipStorage";
import { Play, Pause, Download, Loader } from 'lucide-react';

// Remove the old VideoEditorProps interface and create a simple one
interface VideoEditorProps {
  // Keep it simple for now
}

export const VideoEditor: React.FC<VideoEditorProps> = () => {
  const [selectedClips, setSelectedClips] = useState<string[]>([]);
  const [timelineClips, setTimelineClips] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);

  const handleSelectClip = (clipId: string) => {
    setSelectedClips(prev => 
      prev.includes(clipId) 
        ? prev.filter(id => id !== clipId)
        : [...prev, clipId]
    );
  };

  const handleAddToTimeline = (clipId: string) => {
    if (!timelineClips.includes(clipId)) {
      setTimelineClips(prev => [...prev, clipId]);
    }
  };

  // Calculate total duration when timeline changes
  useEffect(() => {
    const calculateDuration = async () => {
      if (timelineClips.length === 0) {
        setTotalDuration(0);
        return;
      }

      let total = 0;
      for (const clipId of timelineClips) {
        const clipData = await clipStorage.getClip(clipId);
        if (clipData) {
          total += clipData.metadata.duration;
        }
      }
      setTotalDuration(total);
    };

    calculateDuration();
  }, [timelineClips]);

  // Load and play current clip
  useEffect(() => {
    const loadCurrentClip = async () => {
      if (timelineClips.length === 0) {
        if (currentVideoUrl) {
          URL.revokeObjectURL(currentVideoUrl);
          setCurrentVideoUrl(null);
        }
        return;
      }

      // Find which clip should be playing at current time
      let accumulatedTime = 0;
      let clipToPlay = null;
      let clipIndex = 0;

      for (let i = 0; i < timelineClips.length; i++) {
        const clipData = await clipStorage.getClip(timelineClips[i]);
        if (clipData) {
          if (currentTime >= accumulatedTime && currentTime < accumulatedTime + clipData.metadata.duration) {
            clipToPlay = clipData;
            clipIndex = i;
            break;
          }
          accumulatedTime += clipData.metadata.duration;
        }
      }

      if (clipToPlay && (clipIndex !== currentClipIndex || !currentVideoUrl)) {
        // Clean up previous video URL
        if (currentVideoUrl) {
          URL.revokeObjectURL(currentVideoUrl);
        }

        // Create new video URL
        const newUrl = URL.createObjectURL(clipToPlay.blob);
        setCurrentVideoUrl(newUrl);
        setCurrentClipIndex(clipIndex);
      }
    };

    loadCurrentClip();
  }, [currentTime, timelineClips, currentClipIndex]);

  // Handle video playback
  useEffect(() => {
    if (videoRef.current && currentVideoUrl) {
      videoRef.current.src = currentVideoUrl;
      
      if (isPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentVideoUrl, isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-advance time when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && totalDuration > 0) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 0.016; // ~60fps
          if (newTime >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
      }, 16);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalDuration]);

  // Export functionality - Add debug logging
const handleExportVideo = async () => {
  console.log('Export button clicked!');
  
  if (timelineClips.length === 0) {
    alert('Please add clips to the timeline before exporting.');
    return;
  }

  setIsExporting(true);
  setExportProgress(0);

  try {
    // Load all clips first
    console.log('Loading clips for export...');
    const clipsData = [];
    
    for (let i = 0; i < timelineClips.length; i++) {
      const clipId = timelineClips[i];
      const clipData = await clipStorage.getClip(clipId);
      
      if (!clipData) {
        throw new Error(`Could not load clip: ${clipId}`);
      }
      
      clipsData.push(clipData);
      setExportProgress((i + 1) / timelineClips.length * 10);
      console.log(`Loaded clip ${i + 1}/${timelineClips.length}: ${clipData.metadata.name}`);
    }

    console.log('All clips loaded, starting composition...');
    
    // Create canvas with consistent dimensions
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 450;
    const ctx = canvas.getContext('2d', { alpha: false }); // Disable alpha for performance
    
    if (!ctx) {
      throw new Error('Cannot create canvas context');
    }

    // Set canvas style for better rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // IMPORTANT: Match capture FPS with render FPS for consistency
    const targetFPS = 30; // Set both recording and rendering to same FPS
    const stream = canvas.captureStream(targetFPS);
    
    // Choose best codec for smoothness
    let mimeType = 'video/webm;codecs=vp9'; // VP9 generally provides better quality
    
    // Check codec support
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        mimeType = 'video/webm;codecs=vp8';
      } else {
        mimeType = 'video/webm';
      }
    }

    console.log('Using MIME type:', mimeType);
    
    // Use higher bit rate for animation clarity
    const mediaRecorder = new MediaRecorder(stream, { 
      mimeType,
      videoBitsPerSecond: 5000000 // 5 Mbps for better animation quality
    });
    
    const recordedChunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.start(1000); // Larger chunks for stability
    console.log('Recording started');

    // Pre-create all video elements to improve performance
    const videoElements = await Promise.all(clipsData.map(async (clip) => {
      const video = document.createElement('video');
      video.muted = true;
      video.preload = 'auto'; // Ensure videos are fully loaded
      video.playsInline = true;
      video.src = URL.createObjectURL(clip.blob);
      
      // Wait for metadata to load
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => resolve(); // Don't fail if one video has issues
      });
      
      return { video, duration: clip.metadata.duration };
    }));

    // Calculate total duration for progress tracking
    const totalDuration = videoElements.reduce((sum, item) => sum + item.duration, 0);
    let accumulatedTime = 0;
    let startTime: number | null = null;
    let rafId: number | null = null;
    let lastFrameTime = 0;
    
    // Use requestAnimationFrame for smooth rendering
    const renderFrame = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsedTime = (timestamp - startTime) / 1000; // in seconds
      
      // Ensure we maintain consistent FPS by checking time since last frame
      const timeSinceLastFrame = timestamp - lastFrameTime;
      const targetFrameTime = 1000 / targetFPS;
      
      if (timeSinceLastFrame >= targetFrameTime || lastFrameTime === 0) {
        lastFrameTime = timestamp;
        
        // Find which clip to render based on elapsed time
        let currentTime = elapsedTime;
        let clipIndex = 0;
        let timeWithinClip = 0;
        let accumulatedDuration = 0;
        
        // Find the current clip based on elapsed time
        for (let i = 0; i < videoElements.length; i++) {
          const { duration } = videoElements[i];
          if (currentTime < accumulatedDuration + duration) {
            clipIndex = i;
            timeWithinClip = currentTime - accumulatedDuration;
            break;
          }
          accumulatedDuration += duration;
        }
        
        // If we've reached the end, stop the animation
        if (clipIndex >= videoElements.length) {
          console.log('Animation complete');
          if (rafId !== null) cancelAnimationFrame(rafId);
          mediaRecorder.stop();
          return;
        }
        
        // Get the current video element
        const { video } = videoElements[clipIndex];
        
        // Set current time within the clip - use precise seeking
        if (Math.abs(video.currentTime - timeWithinClip) > 0.01) {
          video.currentTime = timeWithinClip;
        }
        
        // Clear canvas with black background for consistent frames
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the current frame from the video
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Update progress (10-90%)
        const progress = 10 + (elapsedTime / totalDuration) * 80;
        setExportProgress(Math.min(90, progress));
      }
      
      // Continue animation if we haven't reached the end
      if (elapsedTime < totalDuration) {
        rafId = requestAnimationFrame(renderFrame);
      } else {
        console.log('Animation complete, stopping recorder');
        mediaRecorder.stop();
      }
    };
    
    // Start the animation loop
    rafId = requestAnimationFrame(renderFrame);
    
    // Wait for recording to complete
    await new Promise<void>((resolve, reject) => {
      mediaRecorder.onstop = () => {
        if (recordedChunks.length === 0) {
          reject(new Error('No data was recorded'));
          return;
        }

        const finalBlob = new Blob(recordedChunks, { type: mimeType });
        console.log('Final blob size:', finalBlob.size, 'bytes');
        
        // Clean up video elements
        videoElements.forEach(({ video }) => {
          URL.revokeObjectURL(video.src);
        });
        
        // Download the video
        const url = URL.createObjectURL(finalBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SmoothAnimation${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setExportProgress(100);
        
        const fileSizeMB = (finalBlob.size / 1024 / 1024).toFixed(2);
        alert(`✅ Video exported successfully!\n📁 File size: ${fileSizeMB} MB\n🎬 Duration: ${totalDuration.toFixed(1)}s\n📊 Quality: ${targetFPS} FPS`);
        resolve();
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        reject(new Error('Recording failed'));
      };
    });

  } catch (error) {
    console.error('Export failed:', error);
    alert(`❌ Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    setIsExporting(false);
    setExportProgress(0);
  }
};

  // Cleanup video URL on unmount
  useEffect(() => {
    return () => {
      if (currentVideoUrl) {
        URL.revokeObjectURL(currentVideoUrl);
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Video Editor Header */}
      <div className="h-12 bg-gray-800 border-b border-gray-600 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-sm font-medium text-white">Video Editor</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>{timelineClips.length} clips</span>
            <span>{totalDuration.toFixed(1)}s total</span>
          </div>
          
          {/* Export Button */}
          <button
            onClick={handleExportVideo}
            disabled={isExporting || timelineClips.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm font-medium text-white transition-colors"
            title="Export Video Composition"
          >
            {isExporting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Exporting... {exportProgress.toFixed(0)}%</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Video</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Export Progress Bar */}
      {isExporting && (
        <div className="h-2 bg-gray-700">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${exportProgress}%` }}
          />
        </div>
      )}

      {/* Main Editor Layout */}
      <div className="flex-1 flex">
        {/* Media Library - Left Panel */}
        <div className="w-1/3 border-r border-gray-700">
          <MediaLibrary
            onSelectClip={handleSelectClip}
            onAddToTimeline={handleAddToTimeline}
            selectedClipIds={selectedClips}
          />
        </div>

        {/* Timeline and Preview - Right Panel */}
        <div className="flex-1 flex flex-col">
          {/* Preview Area - Increased height */}
          <div className="flex-grow bg-black border-b border-gray-700 flex flex-col" style={{ minHeight: '0' }}>
            {/* Preview Header */}
            <div className="h-10 bg-gray-800 border-b border-gray-600 flex items-center justify-between px-4">
              <span className="text-sm font-medium text-white">Timeline Preview</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePlayPause}
                  disabled={isExporting}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded text-xs text-white"
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <span className="text-xs text-gray-400">
                  {currentTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
                </span>
              </div>
            </div>

            {/* Video Preview - Now takes most of the space */}
            <div className="flex-1 flex items-center justify-center p-4 bg-black">
              {timelineClips.length === 0 ? (
                <div className="text-center text-gray-400">
                  <div className="text-lg mb-2">Timeline Preview</div>
                  <div className="text-sm">Add clips to timeline to see preview</div>
                  <div className="text-xs mt-2 text-gray-500">
                    Use "Add" buttons in Media Library to add clips to timeline
                  </div>
                </div>
              ) : (
                <div className="bg-black flex items-center justify-center relative">
                  <video
                    ref={videoRef}
                    className="rounded-lg border border-gray-600"
                    width={600}
                    height={450}
                    style={{
                      width: '600px',
                      height: '450px',
                      display: 'block',
                      objectFit: 'cover'
                    }}
                    muted
                    controls={false}
                    playsInline
                  />
                  
                  {/* Video overlay info - positioned absolutely on the video */}
                  <div className="absolute top-4 left-4 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white">
                    Clip {currentClipIndex + 1} of {timelineClips.length}
                  </div>
                  
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white">
                    {currentTime.toFixed(1)}s
                  </div>

                  {/* Export status overlay */}
                  {isExporting && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 text-center">
                        <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-green-500" />
                        <div className="text-white text-sm">Exporting Video...</div>
                        <div className="text-gray-400 text-xs mt-1">{exportProgress.toFixed(0)}% complete</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {totalDuration > 0 && (
              <div className="h-2 bg-gray-700 relative">
                <div 
                  className="h-full bg-green-500 transition-all duration-75"
                  style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max={totalDuration}
                  step="0.1"
                  value={currentTime}
                  onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                  disabled={isExporting}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>
            )}
          </div>

          {/* Timeline - Reduced to fixed small height */}
          <div className="flex-shrink-0" style={{ height: '140px' }}>
            <Timeline 
              clips={timelineClips} 
              onRemoveClip={(clipId) => {
                setTimelineClips(prev => prev.filter(id => id !== clipId));
                setCurrentTime(0);
                setIsPlaying(false);
              }}
              onReorderClips={(newOrder) => {
                setTimelineClips(newOrder);
                setCurrentTime(0);
                setIsPlaying(false);
              }}
              onSeekTo={(time) => {
                setCurrentTime(time);
                setIsPlaying(false);
              }}
              currentTime={currentTime}
              totalDuration={totalDuration}
              isPlaying={isPlaying}
            />
          </div>
        </div>
      </div>
    </div>
  );
};