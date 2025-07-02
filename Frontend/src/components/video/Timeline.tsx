import React, { useRef } from 'react';
import { VideoClip } from '../../types/video';

interface TimelineProps {
  clips: VideoClip[];
  currentTime: number;
  selectedClip: VideoClip | null;
  zoom: number;
  onClipSelect: (clip: VideoClip) => void;
  onClipUpdate: (clip: VideoClip) => void;
  onTimelineClick: (time: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  clips,
  currentTime,
  selectedClip,
  zoom,
  onClipSelect,
  onClipUpdate,
  onTimelineClick
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const pixelsPerSecond = 50 * zoom;
  const totalDuration = 60; // 60 seconds timeline

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 80; // Account for track labels
    const time = Math.max(0, x / pixelsPerSecond);
    onTimelineClick(time);
  };

  const renderTimeMarks = () => {
    const marks = [];
    const interval = zoom > 2 ? 1 : zoom > 1 ? 5 : 10;
    
    for (let i = 0; i <= totalDuration; i += interval) {
      const x = i * pixelsPerSecond;
      marks.push(
        <div
          key={i}
          className="absolute top-0 h-8 border-l border-gray-600 text-xs text-gray-400 pl-1 flex items-center"
          style={{ left: `${x}px` }}
        >
          {i > 0 && <span>{Math.floor(i / 60)}:{(i % 60).toString().padStart(2, '0')}</span>}
        </div>
      );
    }
    return marks;
  };

  const renderClip = (clip: VideoClip, trackIndex: number) => {
    const left = clip.startTime * pixelsPerSecond;
    const width = (clip.endTime - clip.startTime) * pixelsPerSecond;
    const isSelected = selectedClip?.id === clip.id;
    
    const colorMap = {
      animation: 'bg-blue-600',
      audio: 'bg-green-600',
      text: 'bg-purple-600'
    };

    return (
      <div
        key={clip.id}
        className={`absolute h-10 rounded cursor-pointer border-2 transition-all
          ${colorMap[clip.type]} ${isSelected ? 'border-white' : 'border-transparent'}
          hover:opacity-80 flex items-center px-2 text-white text-xs font-medium`}
        style={{
          left: `${left}px`,
          width: `${width}px`,
          top: `${trackIndex * 50 + 40}px`
        }}
        onClick={() => onClipSelect(clip)}
        title={`${clip.name} (${clip.duration.toFixed(2)}s)`}
      >
        <span className="truncate">{clip.name}</span>
      </div>
    );
  };

  // Group clips by tracks to avoid overlap
  const tracks: VideoClip[][] = [];
  clips.forEach(clip => {
    let placed = false;
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      const hasOverlap = track.some(existingClip => 
        !(clip.endTime <= existingClip.startTime || clip.startTime >= existingClip.endTime)
      );
      if (!hasOverlap) {
        track.push(clip);
        placed = true;
        break;
      }
    }
    if (!placed) {
      tracks.push([clip]);
    }
  });

  return (
    <div className="h-full bg-gray-850 overflow-hidden">
      {/* Timeline Header */}
      <div className="h-8 bg-gray-800 border-b border-gray-600 relative overflow-hidden">
        <div className="absolute left-20 right-0 h-full">
          <div 
            className="relative h-full"
            style={{ width: `${totalDuration * pixelsPerSecond}px` }}
          >
            {renderTimeMarks()}
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div 
        ref={timelineRef}
        className="flex-1 relative overflow-x-auto overflow-y-auto cursor-pointer"
        onClick={handleTimelineClick}
        style={{ height: 'calc(100% - 32px)' }}
      >
        <div 
          className="relative"
          style={{ 
            width: `${80 + totalDuration * pixelsPerSecond}px`,
            height: `${Math.max(150, tracks.length * 50 + 60)}px`
          }}
        >
          {/* Track Labels */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gray-800 border-r border-gray-600 z-10">
            {tracks.map((_, index) => (
              <div
                key={index}
                className="h-10 flex items-center justify-center text-xs text-gray-400 border-b border-gray-700"
                style={{ top: `${40 + index * 50}px`, position: 'absolute', width: '80px' }}
              >
                Track {index + 1}
              </div>
            ))}
          </div>

          {/* Clips */}
          <div className="absolute inset-0" style={{ left: '80px' }}>
            {tracks.map((track, trackIndex) =>
              track.map(clip => renderClip(clip, trackIndex))
            )}
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none"
            style={{ left: `${80 + currentTime * pixelsPerSecond}px` }}
          >
            <div className="absolute -top-1 -left-2 w-4 h-4 bg-red-500 transform rotate-45" />
          </div>
        </div>
      </div>
    </div>
  );
};