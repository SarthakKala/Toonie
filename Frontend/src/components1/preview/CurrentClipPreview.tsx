// Frontend/src/components/preview/CurrentClipPreview.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Download, ArrowRight, Settings, Maximize } from 'lucide-react';
import { CodeFile } from '../../types';

interface CurrentClipPreviewProps {
  activeFile: CodeFile;
  onExportClip: () => void;
  onMoveToVideoEditor: () => void;
}

export const CurrentClipPreview: React.FC<CurrentClipPreviewProps> = ({
  activeFile,
  onExportClip,
  onMoveToVideoEditor
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(5); // Default 5 seconds
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setCurrentTime(prev => {
          const newTime = prev + 0.016; // 60fps
          if (newTime >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, duration]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Simulate p5.js execution based on current time
    try {
      // Simple animation preview based on active file content
      renderCodePreview(ctx, activeFile.content, currentTime);
    } catch (error) {
      // Show error state
      ctx.fillStyle = '#374151';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#EF4444';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Error in code', canvas.width / 2, canvas.height / 2);
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '12px Arial';
      ctx.fillText('Check your p5.js syntax', canvas.width / 2, canvas.height / 2 + 25);
    }
  }, [activeFile.content, currentTime]);

  const renderCodePreview = (ctx: CanvasRenderingContext2D, code: string, time: number) => {
    // Basic simulation of p5.js rendering
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Background
    ctx.fillStyle = '#135096'; // Light blue background
    ctx.fillRect(0, 0, width, height);
    
    // Animated elements based on time
    ctx.fillStyle = '#4A90E2';
    const x = 100 + Math.sin(time * 2) * 50;
    const y = 100 + Math.cos(time * 1.5) * 30;
    ctx.fillRect(x, y, 80, 80);
    
    // Additional elements if code contains specific patterns
    if (code.includes('circle') || code.includes('ellipse')) {
      ctx.fillStyle = '#50C878';
      ctx.beginPath();
      ctx.arc(width - 100, height - 100, 40 + Math.sin(time * 3) * 10, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    if (code.includes('text')) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Hello p5.js!', width / 2, height / 2 + 100);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const formatTime = (time: number) => {
    return `${time.toFixed(1)}s`;
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="h-12 bg-gray-800 border-b border-gray-600 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-sm font-medium text-white">Current Clip Preview</span>
          <span className="text-xs text-gray-400">({activeFile.name})</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onExportClip}
            className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-xs font-medium text-white transition-colors"
            title="Export as standalone clip"
          >
            <Download className="w-3 h-3" />
            <span>Export</span>
          </button>
          
          <button
            onClick={onMoveToVideoEditor}
            className="flex items-center space-x-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-xs font-medium text-white transition-colors"
            title="Move to Video Editor"
          >
            <ArrowRight className="w-3 h-3" />
            <span>To Video Editor</span>
          </button>
          
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4 bg-black">
        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-700">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="max-w-full max-h-full"
          />
          
          {/* Overlay Controls */}
          <div className="absolute top-2 right-2 flex space-x-1">
            <button className="p-1.5 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-75 transition-colors">
              <Maximize className="w-3 h-3" />
            </button>
          </div>
          
          {/* Resolution Info */}
          <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
            400×300
          </div>
          
          {/* Time Display */}
          <div className="absolute bottom-2 right-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="h-16 bg-gray-800 border-t border-gray-600 flex items-center justify-center px-4 flex-shrink-0">
        <div className="flex items-center space-x-4">
          {/* Playback Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRestart}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4 text-gray-300" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 max-w-xs">
            <div className="relative h-2 bg-gray-600 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-75"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Time Display */}
          <div className="text-sm text-gray-300 min-w-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
      
      {/* Quick Actions Footer */}
      <div className="h-10 bg-gray-850 border-t border-gray-700 flex items-center justify-between px-4 text-xs text-gray-400 flex-shrink-0">
        <span>Preview updates automatically when code changes</span>
        <div className="flex items-center space-x-4">
          <span>Quality: Preview</span>
          <span>FPS: 60</span>
        </div>
      </div>
    </div>
  );
};