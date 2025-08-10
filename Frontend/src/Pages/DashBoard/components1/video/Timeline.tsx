import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { clipStorage, StoredClip } from '../../../../utils/ClipStorage';

interface TimelineProps {
  clips: string[];
  onRemoveClip: (clipId: string) => void;
  onReorderClips?: (newOrder: string[]) => void;
  onSeekTo?: (time: number) => void;
  currentTime?: number;
  totalDuration?: number;
  isPlaying?: boolean;
}

interface ClipData extends StoredClip {
  id: string;
  startTime: number;
  endTime: number;
}

export const Timeline: React.FC<TimelineProps> = ({ 
  clips, 
  onRemoveClip, 
  onReorderClips,
  onSeekTo,
  currentTime = 0,
  totalDuration = 0,
  isPlaying = false
}) => {
  const [clipData, setClipData] = useState<ClipData[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [timelineWidth, setTimelineWidth] = useState(800); // Set default width
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineTrackRef = useRef<HTMLDivElement>(null);

  // Load clip metadata and calculate timing
  useEffect(() => {
    const loadClipData = async () => {
      if (clips.length === 0) {
        setClipData([]);
        return;
      }

      setLoading(true);
      try {
        let currentTime = 0;
        const clipDataWithTiming: ClipData[] = [];

        for (const clipId of clips) {
          const storedClip = await clipStorage.getClip(clipId);
          if (storedClip) {
            const clipDuration = storedClip.metadata.duration;
            clipDataWithTiming.push({
              ...storedClip,
              id: clipId,
              startTime: currentTime,
              endTime: currentTime + clipDuration
            });
            currentTime += clipDuration;
          }
        }

        setClipData(clipDataWithTiming);
      } catch (error) {
        console.error('Failed to load clip data for timeline:', error);
        setClipData([]);
      } finally {
        setLoading(false);
      }
    };

    loadClipData();
  }, [clips]);

  // Update timeline width
  useEffect(() => {
    const updateWidth = () => {
      if (timelineRef.current) {
        setTimelineWidth(timelineRef.current.offsetWidth - 32); // Account for padding
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Calculate pixels per second based on zoom
  const pixelsPerSecond = Math.max(100, (timelineWidth * zoom) / Math.max(totalDuration, 1));

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    
    // Add visual feedback
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '0.5';
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newClips = [...clips];
    const draggedClip = newClips[draggedIndex];
    
    // Remove from old position
    newClips.splice(draggedIndex, 1);
    
    // Insert at new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newClips.splice(insertIndex, 0, draggedClip);

    onReorderClips?.(newClips);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Handle timeline click for seeking
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineTrackRef.current || totalDuration === 0) return;

    const rect = timelineTrackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const timelineActualWidth = rect.width;
    const clickTime = (clickX / timelineActualWidth) * totalDuration;
    
    onSeekTo?.(Math.max(0, Math.min(clickTime, totalDuration)));
  };

  // Time markers
  const generateTimeMarkers = () => {
    if (totalDuration === 0) return [];
    
    const markers = [];
    const markerInterval = Math.max(0.5, 2 / zoom); // More markers when zoomed in
    const timelineActualWidth = timelineWidth * zoom;
    
    for (let time = 0; time <= totalDuration; time += markerInterval) {
      const position = (time / totalDuration) * timelineActualWidth;
      
      markers.push(
        <div
          key={time}
          className="absolute top-0 h-full flex flex-col"
          style={{ left: `${position}px` }}
        >
          <div className="w-px h-4 bg-gray-400" />
          <span className="text-xs text-gray-400 whitespace-nowrap mt-1">
            {time.toFixed(1)}s
          </span>
        </div>
      );
    }
    
    return markers;
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Timeline Header */}
      <div className="h-8 bg-gray-800 border-b border-gray-600 flex items-center justify-between px-4 flex-shrink-0">
        <span className="text-xs font-medium text-white">Timeline</span>
        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
            className="p-1 text-gray-400 hover:text-white rounded text-xs"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="text-xs text-gray-400 min-w-[3rem] text-center">
            {(zoom * 100).toFixed(0)}%
          </span>
          <button
            onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
            className="p-1 text-gray-400 hover:text-white rounded text-xs"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
          
          <div className="w-px h-4 bg-gray-600 mx-2" />
          
          <span className="text-xs text-gray-400">
            {clips.length} clip{clips.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p>Loading timeline...</p>
          </div>
        ) : clips.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">Timeline is empty</p>
              <p className="text-sm">Add clips from the Media Library to get started</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Time Ruler */}
            <div className="h-1 bg-gray-800 border-b border-gray-600 relative overflow-x-auto flex-shrink-0"> {/* Reduced from h-8 to h-6 */}
              <div 
                className="h-full relative"
                style={{ 
                  width: `${Math.max(timelineWidth, timelineWidth * zoom)}px`,
                  minWidth: '100%'
                }}
              >
                {generateTimeMarkers()}
              </div>
            </div>

            {/* Timeline Track Area */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <div 
                ref={timelineRef}
                className="h-full relative bg-gray-850"
                style={{ 
                  minWidth: '100%',
                  width: `${Math.max(timelineWidth, timelineWidth * zoom)}px`,
                  minHeight: '10px' // Reduced from 120px
                }}
              >
                {/* Timeline Track Background */}
                <div 
                  ref={timelineTrackRef}
                  className="absolute top-2 bottom-2 bg-gray-800 rounded cursor-pointer" // Reduced top/bottom from 4px to 2px
                  style={{ 
                    left: '16px',
                    right: '16px',
                    width: `${timelineWidth * zoom}px`
                  }}
                  onClick={handleTimelineClick}
                />

                {/* Clips Container */}
                <div 
                  className="relative h-full"
                  style={{ 
                    width: `${timelineWidth * zoom}px`,
                    padding: '4px 16px' // Reduced vertical padding from 16px to 8px
                  }}
                >
                  {clipData.map((clip, index) => {
                    const clipWidthPx = (clip.metadata.duration / totalDuration) * (timelineWidth * zoom);
                    const clipLeftPx = (clip.startTime / totalDuration) * (timelineWidth * zoom);
                    
                    return (
                      <div
                        key={`${clip.id}-${index}`}
                        className={`absolute top-2 h-12 bg-blue-600 rounded border-2 overflow-hidden cursor-move transition-all select-none ${
                          draggedIndex === index ? 'opacity-50 scale-105 z-10' : ''
                        } ${
                          dragOverIndex === index ? 'border-blue-300' : 'border-blue-500'
                        }`}
                        style={{
                          left: `${clipLeftPx}px`,
                          width: `${Math.max(80, clipWidthPx)}px`, // Minimum width for usability
                        }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragEnter={(e) => e.preventDefault()}
                      >
                        {/* Clip Thumbnail */}
                        {clip.metadata.thumbnail && (
                          <img 
                            src={clip.metadata.thumbnail} 
                            alt={clip.metadata.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                            draggable={false}
                          />
                        )}
                        
                        {/* Clip Info */}
                        <div className="absolute inset-0 p-1 flex flex-col justify-between text-white text-xs pointer-events-none">
                          <div className="font-medium truncate">{clip.metadata.name}</div>
                          <div className="text-blue-200">
                            {clip.metadata.duration.toFixed(1)}s
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveClip(clip.id);
                          }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs z-20 pointer-events-auto"
                          title="Remove from timeline"
                        >
                          <X className="w-3 h-3" />
                        </button>

                        {/* Drag Handle (Visual indicator) */}
                        <div className="absolute top-1 left-1 right-1 h-1 bg-blue-400 opacity-50 rounded-full pointer-events-none" />
                      </div>
                    );
                  })}

                  {/* Playhead */}
                  {totalDuration > 0 && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 pointer-events-none"
                      style={{
                        left: `${(currentTime / totalDuration) * (timelineWidth * zoom)}px`,
                        boxShadow: '0 0 4px rgba(239, 68, 68, 0.8)'
                      }}
                    >
                      {/* Playhead Handle */}
                      <div className="absolute -top-1 -left-2 w-4 h-3 bg-red-500 rounded-sm shadow-lg" />
                      {/* Playhead Line Extension */}
                      <div className="absolute top-0 bottom-0 -left-0.5 w-1 bg-red-500 opacity-60" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Footer */}
        {clips.length > 0 && (
          <div className="h-5 bg-gray-850 border-t border-gray-700 flex items-center justify-between px-4 text-xs text-gray-400 flex-shrink-0"> {/* Reduced from h-8 to h-6 */}
            <div className="flex items-center space-x-4">
              <span>{clips.length} clips</span>
              <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Duration: {totalDuration.toFixed(1)}s</span>
              <span>Current: {currentTime.toFixed(1)}s</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



