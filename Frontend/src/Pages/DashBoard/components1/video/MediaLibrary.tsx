import React, { useState, useEffect } from 'react';
import { Plus, Film, Clock, Play, Trash2 } from 'lucide-react';
import { clipStorage } from '../../../../utils/clipStorage';

interface ClipData {
  id: string;
  name: string;
  duration: number;
  type: 'animation' | 'audio' | 'text';
  content: string;
  thumbnail?: string;
  blob: Blob;
}

interface MediaLibraryProps {
  onSelectClip?: (clipId: string) => void;
  onAddToTimeline?: (clipId: string) => void;
  selectedClipIds?: string[];
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onSelectClip,
  onAddToTimeline,
  selectedClipIds = []
}) => {
  const [clips, setClips] = useState<ClipData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClip, setSelectedClip] = useState<ClipData | null>(null);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  // Load clips from storage
  useEffect(() => {
    const loadClips = async () => {
      setIsLoading(true);
      try {
        const storedClips = await clipStorage.getAllClips();
        const clipData = storedClips.map(stored => ({
          id: stored.metadata.id,
          name: stored.metadata.name,
          duration: stored.metadata.duration,
          type: stored.metadata.type,
          content: stored.metadata.content,
          thumbnail: stored.metadata.thumbnail,
          blob: stored.blob
        }));
        
        setClips(clipData);
        
        // Create preview URLs for videos
        const urls: Record<string, string> = {};
        clipData.forEach(clip => {
          if (clip.blob.type.startsWith('video/')) {
            urls[clip.id] = URL.createObjectURL(clip.blob);
          }
        });
        setPreviewUrls(urls);
        
      } catch (error) {
        console.error('Failed to load clips:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClips();

    // Cleanup URLs on unmount
    return () => {
      Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleClipSelect = (clip: ClipData) => {
    setSelectedClip(clip);
    onSelectClip?.(clip.id);
  };

  const handleAddToTimeline = (clipId: string) => {
    onAddToTimeline?.(clipId);
  };

  const handlePlayClip = (clip: ClipData) => {
    const url = previewUrls[clip.id];
    if (url) {
      // Create a temporary video element to play the clip
      const video = document.createElement('video');
      video.src = url;
      video.controls = true;
      video.autoplay = true;
      video.style.maxWidth = '90vw';
      video.style.maxHeight = '90vh';
      
      // Create modal
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
      `;
      
      modal.appendChild(video);
      modal.onclick = () => {
        document.body.removeChild(modal);
      };
      
      document.body.appendChild(modal);
    }
  };

  const handleDeleteClip = async (clipId: string) => {
    if (confirm('Are you sure you want to delete this clip?')) {
      try {
        await clipStorage.deleteClip(clipId);
        setClips(prev => prev.filter(clip => clip.id !== clipId));
        
        // Cleanup preview URL
        if (previewUrls[clipId]) {
          URL.revokeObjectURL(previewUrls[clipId]);
          setPreviewUrls(prev => {
            const { [clipId]: deleted, ...rest } = prev;
            return rest;
          });
        }
        
        if (selectedClip?.id === clipId) {
          setSelectedClip(null);
        }
      } catch (error) {
        console.error('Failed to delete clip:', error);
        alert('Failed to delete clip');
      }
    }
  };

  const getClipIcon = (type: string) => {
    switch (type) {
      case 'animation': return <Film className="w-4 h-4" />;
      case 'audio': return <div className="w-4 h-4 bg-green-500 rounded-full" />;
      case 'text': return <div className="w-4 h-4 bg-purple-500 rounded" />;
      default: return <Film className="w-4 h-4" />;
    }
  };

  const getClipColor = (type: string) => {
    switch (type) {
      case 'animation': return 'text-blue-400 bg-blue-900';
      case 'audio': return 'text-green-400 bg-green-900';
      case 'text': return 'text-purple-400 bg-purple-900';
      default: return 'text-gray-400 bg-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-600 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Media Library</h3>
          <button 
            onClick={() => window.location.reload()} // Simple refresh to reload clips
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Refresh
          </button>
        </div>
        <button className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors">
          <Plus className="w-4 h-4" />
          <span>Import Clip</span>
        </button>
      </div>

      {/* Clips List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading clips...</p>
          </div>
        ) : clips.length === 0 ? (
          <div className="text-center py-8">
            <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No clips yet</p>
            <p className="text-xs text-gray-500 mt-1">Record some animations to get started</p>
          </div>
        ) : (
          clips.map((clip) => (
            <div
              key={clip.id}
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                selectedClip?.id === clip.id
                  ? 'bg-blue-600 border-blue-400'
                  : 'bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => handleClipSelect(clip)}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded ${getClipColor(clip.type)}`}>
                  {getClipIcon(clip.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {clip.name}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getClipColor(clip.type)}`}>
                      {clip.type}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{clip.duration.toFixed(1)}s</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-1 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayClip(clip);
                      }}
                      className="p-1 bg-green-600 hover:bg-green-700 rounded text-white text-xs"
                      title="Play clip"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToTimeline(clip.id);
                      }}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs"
                      title="Add to timeline"
                    >
                      Add
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClip(clip.id);
                      }}
                      className="p-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs"
                      title="Delete clip"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="p-4 border-t border-gray-600 bg-gray-750 flex-shrink-0">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Total Clips:</span>
            <span className="text-white">{clips.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Duration:</span>
            <span className="text-white">
              {clips.reduce((acc, clip) => acc + clip.duration, 0).toFixed(1)}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};