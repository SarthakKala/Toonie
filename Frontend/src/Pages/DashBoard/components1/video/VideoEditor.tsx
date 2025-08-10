import React, { useState, useRef, useEffect } from 'react';
import { MediaLibrary } from './MediaLibrary';
import { Timeline } from "./Timeline";
import { clipStorage } from "../../../../utils/ClipStorage";
import { Play, Pause } from 'lucide-react';

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
  const videoRef = useRef<HTMLVideoElement>(null);
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
      
      // Set the video time relative to the clip start
      let accumulatedTime = 0;
      for (let i = 0; i < currentClipIndex; i++) {
        // We need to calculate this, but for now just start from beginning of clip
      }
      
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
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <span>{timelineClips.length} clips</span>
          <span>{totalDuration.toFixed(1)}s total</span>
        </div>
      </div>

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
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white"
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

                  {/* Debug info */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white">
                    {currentVideoUrl ? 'Video Loaded' : 'No Video'}
                  </div>
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
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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