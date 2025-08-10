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
    console.log('Timeline clips:', timelineClips);
    
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
        setExportProgress((i + 1) / timelineClips.length * 10); // 0-10% for loading
        console.log(`Loaded clip ${i + 1}/${timelineClips.length}: ${clipData.metadata.name}`);
      }

      console.log('All clips loaded, starting composition...');
      
      // Create canvas for composition
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 450;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Cannot create canvas context');
      }

      // Set canvas style for better rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Set up MediaRecorder with optimized settings
      const stream = canvas.captureStream(30); // Fixed 30 FPS
      let mimeType = 'video/webm;codecs=vp9';
      
      // Check codec support
      if (!MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
          mimeType = 'video/webm;codecs=vp8';
        } else {
          mimeType = 'video/webm';
        }
      }

      console.log('Using MIME type:', mimeType);
      
      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType,
        videoBitsPerSecond: 2500000 // 2.5 Mbps for better quality
      });
      
      const recordedChunks: Blob[] = [];

    // Set up event handlers
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
        console.log('Recorded chunk:', event.data.size, 'bytes');
      }
    };

    // Start recording
    mediaRecorder.start(200); // Record in 200ms chunks for stability
    console.log('Recording started');

    // Process each clip with better timing
    const targetFPS = 30;
    const frameDuration = 1000 / targetFPS; // ms per frame
    let totalProcessedTime = 0;

    for (let clipIndex = 0; clipIndex < clipsData.length; clipIndex++) {
      const clip = clipsData[clipIndex];
      console.log(`Processing clip ${clipIndex + 1}: ${clip.metadata.name}`);
      
      // Create video element for this clip
      const video = document.createElement('video');
      video.src = URL.createObjectURL(clip.blob);
      video.muted = true;
      video.preload = 'metadata';
      
      await new Promise<void>((resolve, reject) => {
        video.onloadeddata = async () => {
          console.log(`Video loaded: ${video.duration}s, expected: ${clip.metadata.duration}s`);
          
          const actualDuration = Math.min(video.duration, clip.metadata.duration);
          const totalFrames = Math.floor(actualDuration * targetFPS);
          
          console.log(`Rendering ${totalFrames} frames for clip ${clipIndex + 1}`);

          // Pre-load video at start
          video.currentTime = 0;
          
          await new Promise(loadResolve => {
            video.onseeked = () => loadResolve(undefined);
          });

          // Render frames with consistent timing
          for (let frame = 0; frame < totalFrames; frame++) {
            const timeInClip = (frame / targetFPS);
            
            // Only seek if we need to move significantly
            if (Math.abs(video.currentTime - timeInClip) > 0.05) {
              video.currentTime = timeInClip;
              
              // Wait for seek to complete
              await new Promise(seekResolve => {
                const onSeeked = () => {
                  video.removeEventListener('seeked', onSeeked);
                  seekResolve(undefined);
                };
                video.addEventListener('seeked', onSeeked);
              });
            }
            
            // Clear canvas with black background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // CLEAN VERSION: Only draw video frame - NO OVERLAY/WATERMARK
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Update export progress (only in console, not on video)
            const overallProgress = 10 + ((totalProcessedTime + timeInClip) / totalDuration) * 80; // 10-90%
            setExportProgress(Math.min(90, overallProgress));
            
            // Wait for next frame time to maintain consistent FPS
            await new Promise(resolve => setTimeout(resolve, frameDuration));
          }
          
          totalProcessedTime += actualDuration;
          URL.revokeObjectURL(video.src);
          resolve();
        };
        
        video.onerror = () => reject(new Error(`Failed to load video for clip: ${clip.metadata.name}`));
      });
    }

    console.log('All clips processed, finalizing...');
    setExportProgress(95);
    
    // Wait a bit for final frames to be captured
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Stop recording and finalize
    await new Promise<void>((resolve, reject) => {
      mediaRecorder.onstop = () => {
        console.log('Recording stopped, chunks:', recordedChunks.length);
        
        if (recordedChunks.length === 0) {
          reject(new Error('No data was recorded'));
          return;
        }

        const finalBlob = new Blob(recordedChunks, { type: mimeType });
        console.log('Final blob size:', finalBlob.size, 'bytes');
        
        // Download the video
        const url = URL.createObjectURL(finalBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `naya_composition_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setExportProgress(100);
        
        const fileSizeMB = (finalBlob.size / 1024 / 1024).toFixed(2);
        alert(`✅ Video exported successfully!\n📁 File size: ${fileSizeMB} MB\n🎬 Duration: ${totalDuration.toFixed(1)}s\n📊 Quality: 30 FPS`);
        resolve();
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        reject(new Error('Recording failed'));
      };

      // Stop recording
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
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