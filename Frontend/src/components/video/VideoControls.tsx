import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, ZoomIn, ZoomOut } from 'lucide-react';

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onTimeChange: (time: number) => void;
  onZoomChange: (zoom: number) => void;
  zoom: number;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onTimeChange,
  onZoomChange,
  zoom
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex items-center justify-between px-4 bg-gray-800">
      <div className="flex items-center space-x-4">
        {/* Play Controls */}
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-700 rounded transition-colors">
            <SkipBack className="w-4 h-4" />
          </button>
          <button 
            onClick={onPlayPause}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button className="p-2 hover:bg-gray-700 rounded transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Time Display */}
        <div className="text-sm text-gray-300">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4" />
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="50"
            className="w-20 h-1 bg-gray-600 rounded-lg appearance-none"
          />
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => onZoomChange(Math.max(0.25, zoom - 0.25))}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-sm text-gray-300 w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button 
          onClick={() => onZoomChange(Math.min(4, zoom + 0.25))}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};