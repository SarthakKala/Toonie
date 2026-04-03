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
  totalDuration = 0
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
    <div style={{ height: '100%', width: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', backgroundColor: '#161616', overflow: 'hidden' }}>
      {/* Timeline Header */}
      <div style={{ height: 32, borderBottom: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', flexShrink: 0, backgroundColor: '#161616' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#fff' }}>Timeline</span>
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
          
          <div className="w-px h-4 mx-2" style={{ background: 'rgba(255,255,255,0.12)' }} />
          
          <span className="text-xs text-gray-400">
            {clips.length} clip{clips.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="h-full flex items-center justify-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ fontSize: '0.78rem' }}>Loading timeline...</p>
          </div>
        ) : clips.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>Timeline is empty</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>Add clips from the Media Library to get started</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Time Ruler */}
            <div className="h-1 relative overflow-x-auto flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', backgroundColor: '#161616' }}>
              <div
                className="h-full relative"
                style={{ width: `${Math.max(timelineWidth, timelineWidth * zoom)}px`, minWidth: '100%' }}
              >
                {generateTimeMarkers()}
              </div>
            </div>

            {/* Timeline Track Area */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <div
                ref={timelineRef}
                className="h-full relative"
                style={{
                  minWidth: '100%',
                  width: `${Math.max(timelineWidth, timelineWidth * zoom)}px`,
                  minHeight: '10px',
                  backgroundColor: '#161616',
                }}
              >
                {/* Timeline Track Background */}
                <div
                  ref={timelineTrackRef}
                  className="absolute top-2 bottom-2 rounded cursor-pointer"
                  style={{
                    left: '16px', right: '16px',
                    width: `${timelineWidth * zoom}px`,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
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
                    const displayName = `Clip${index + 1}`;
                    
                    return (
                      <div
                        key={`${clip.id}-${index}`}
                        style={{
                          position: 'absolute', top: 8, height: 48,
                          background: dragOverIndex === index ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.1)',
                          border: `1px solid ${dragOverIndex === index ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.18)'}`,
                          borderRadius: 5, overflow: 'hidden', cursor: 'move',
                          opacity: draggedIndex === index ? 0.5 : 1,
                          left: `${clipLeftPx}px`, width: `${Math.max(80, clipWidthPx)}px`,
                        }}
                        className="transition-all select-none"
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
                          <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
                          <div style={{ color: 'rgba(255,255,255,0.45)' }}>
                            {clip.metadata.duration.toFixed(1)}s
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveClip(clip.id);
                          }}
                          className="absolute -top-2 -right-2 w-5 h-5 text-white rounded-full flex items-center justify-center text-xs z-20 pointer-events-auto"
                          style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
                          title="Remove from timeline"
                        >
                          <X className="w-3 h-3" />
                        </button>

                        {/* Drag Handle (Visual indicator) */}
                        <div className="absolute top-1 left-1 right-1 h-0.5 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.25)' }} />
                      </div>
                    );
                  })}

                  {/* Playhead */}
                  {totalDuration > 0 && (
                    <div
                      className="absolute top-0 bottom-0 w-px z-30 pointer-events-none"
                      style={{
                        left: `${(currentTime / totalDuration) * (timelineWidth * zoom)}px`,
                        background: 'rgba(255,255,255,0.7)',
                        boxShadow: '0 0 4px rgba(255,255,255,0.4)'
                      }}
                    >
                      <div className="absolute -top-1 -left-1.5 w-3 h-2 rounded-sm shadow-lg" style={{ background: 'rgba(255,255,255,0.8)' }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Footer */}
        {clips.length > 0 && (
          <div style={{ height: 28, borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)', flexShrink: 0 }}>
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



