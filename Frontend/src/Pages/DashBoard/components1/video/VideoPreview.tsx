import React, { useEffect, useRef } from 'react';
import { Maximize, Settings } from 'lucide-react';
import { VideoClip } from '../../types/video';

interface VideoPreviewProps {
  clips: VideoClip[];
  currentTime: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  clips,
  currentTime,
  isPlaying,
  onTimeUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        onTimeUpdate(currentTime + 0.016); // 60fps
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
  }, [isPlaying, currentTime, onTimeUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Find active clips at current time
    const activeClips = clips.filter(
      clip => currentTime >= clip.startTime && currentTime <= clip.endTime
    );

    // Render active clips
    activeClips.forEach((clip, index) => {
      if (clip.type === 'animation') {
        renderAnimationClip(ctx, clip, currentTime - clip.startTime, index);
      } else if (clip.type === 'text') {
        renderTextClip(ctx, clip, currentTime - clip.startTime);
      }
    });

    // Show time indicator if no clips
    if (activeClips.length === 0) {
      ctx.fillStyle = '#374151';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('No active clips at this time', canvas.width / 2, canvas.height / 2);
      ctx.fillText(`${currentTime.toFixed(2)}s`, canvas.width / 2, canvas.height / 2 + 30);
    }
  }, [clips, currentTime]);

  const renderAnimationClip = (ctx: CanvasRenderingContext2D, clip: VideoClip, localTime: number, index: number) => {
    // Simulate p5.js animation rendering
    const colors = ['#4A90E2', '#50C878', '#FF6B6B', '#FFD93D'];
    const color = colors[index % colors.length];
    
    ctx.fillStyle = color;
    ctx.fillRect(50 + index * 20, 50 + Math.sin(localTime * 2) * 20, 200, 150);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.fillText(`${clip.name}`, 60 + index * 20, 70);
    ctx.fillText(`Time: ${localTime.toFixed(2)}s`, 60 + index * 20, 90);
  };

  const renderTextClip = (ctx: CanvasRenderingContext2D, clip: VideoClip, localTime: number) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(clip.content, ctx.canvas.width / 2, ctx.canvas.height / 2 + 100);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-700">
        <canvas
          ref={canvasRef}
          width={600}
          height={450}
          className="max-w-full max-h-full"
        />
        
        {/* Overlay Controls */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="p-2 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-75 transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
          <button className="p-2 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-75 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
        
        {/* Resolution Info */}
        <div className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
          800x600 • 60fps
        </div>
        
        {/* Time Display */}
        <div className="absolute bottom-4 right-4 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
          {currentTime.toFixed(2)}s
        </div>
      </div>
    </div>
  );
};