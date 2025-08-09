import React, { useState, useEffect } from 'react';
import { X, Play, Pause } from 'lucide-react';
import { clipStorage, StoredClip } from "../../../../utils/clipStorage";
interface TimelineProps {
  clips: string[]; // Array of clip IDs
  onRemoveClip: (clipId: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ clips, onRemoveClip }) => {
  const [clipData, setClipData] = useState<StoredClip[]>([]);
  const [loading, setLoading] = useState(false);

  // Load clip metadata when clip IDs change
  useEffect(() => {
    const loadClipData = async () => {
      if (clips.length === 0) {
        setClipData([]);
        return;
      }

      setLoading(true);
      try {
        const promises = clips.map(async (clipId) => {
          const clipInfo = await clipStorage.getClip(clipId);
          return clipInfo?.metadata;
        });

        const results = await Promise.all(promises);
        const validClips = results.filter((clip): clip is StoredClip => clip !== undefined);
        setClipData(validClips);
      } catch (error) {
        console.error('Failed to load clip data for timeline:', error);
        setClipData([]);
      } finally {
        setLoading(false);
      }
    };

    loadClipData();
  }, [clips]);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Timeline Header */}
      <div className="h-10 bg-gray-800 border-b border-gray-600 flex items-center justify-between px-4">
        <span className="text-sm font-medium text-white">Timeline</span>
        <div className="flex items-center space-x-2">
          <button className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs">
            <Play className="w-3 h-3" />
          </button>
          <span className="text-xs text-gray-400">
            {clips.length} clip{clips.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 p-4">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p>Loading clips...</p>
          </div>
        ) : clips.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">Timeline is empty</p>
              <p className="text-sm">Add clips from the Media Library to get started</p>
            </div>
          </div>
        ) : (
          <div className="flex space-x-2 overflow-x-auto">
            {clips.map((clipId, index) => {
              const clipInfo = clipData.find(clip => clip.id === clipId);
              
              return (
                <div key={`${clipId}-${index}`} className="relative flex-shrink-0">
                  <div className="w-32 h-20 bg-gray-700 rounded border border-gray-600 overflow-hidden">
                    {clipInfo?.thumbnail ? (
                      <img 
                        src={clipInfo.thumbnail} 
                        alt={clipInfo.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-white">Clip {index + 1}</span>
                      </div>
                    )}
                    
                    {/* Clip Info Overlay */}
                    {clipInfo && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 px-2 py-1">
                        <div className="text-xs text-white truncate">{clipInfo.name}</div>
                        <div className="text-xs text-gray-300">
                          {Math.round(clipInfo.duration)}s
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveClip(clipId)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs"
                    title="Remove from timeline"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  
                  {/* Timeline Position Indicator */}
                  <div className="absolute -bottom-6 left-0 right-0 text-center">
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Timeline Footer with Total Duration */}
      {clips.length > 0 && (
        <div className="h-8 bg-gray-850 border-t border-gray-700 flex items-center justify-between px-4 text-xs text-gray-400">
          <span>{clips.length} clips in timeline</span>
          <span>
            Total duration: {Math.round(clipData.reduce((total, clip) => total + clip.duration, 0))}s
          </span>
        </div>
      )}
    </div>
  );
};