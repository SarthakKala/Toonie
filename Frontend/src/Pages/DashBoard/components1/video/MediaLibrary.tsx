import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Download, Trash2, Edit2, Plus, Search, Filter, Grid, List, Clock, FileVideo, Tag } from 'lucide-react';
import { clipStorage, StoredClip, formatFileSize, formatDuration } from "../../../../utils/clipStorage";

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
  const [clips, setClips] = useState<StoredClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'duration' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [playingClip, setPlayingClip] = useState<string | null>(null);
  const [editingClip, setEditingClip] = useState<string | null>(null);
  const [newClipName, setNewClipName] = useState('');

  // Load clips on mount
  useEffect(() => {
    loadClips();
  }, []);

  const loadClips = async () => {
    setLoading(true);
    try {
      const allClips = await clipStorage.getAllClips();
      setClips(allClips);
    } catch (error) {
      console.error('Failed to load clips:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort clips
  const filteredAndSortedClips = React.useMemo(() => {
    let filtered = clips.filter(clip => {
      const matchesSearch = clip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (clip.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => clip.tags?.includes(tag));
      return matchesSearch && matchesTags;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        case 'size':
          comparison = a.fileSize - b.fileSize;
          break;
        case 'date':
        default:
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [clips, searchTerm, selectedTags, sortBy, sortOrder]);

  // Get all unique tags
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    clips.forEach(clip => {
      clip.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [clips]);

  const handleDeleteClip = async (clipId: string) => {
    if (confirm('Are you sure you want to delete this clip?')) {
      try {
        await clipStorage.deleteClip(clipId);
        setClips(prev => prev.filter(clip => clip.id !== clipId));
        if (playingClip === clipId) setPlayingClip(null);
      } catch (error) {
        console.error('Failed to delete clip:', error);
        alert('Failed to delete clip');
      }
    }
  };

  const handleDownloadClip = async (clipId: string) => {
    try {
      const clipData = await clipStorage.getClip(clipId);
      if (!clipData) {
        alert('Clip not found');
        return;
      }

      const url = URL.createObjectURL(clipData.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${clipData.metadata.name}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download clip:', error);
      alert('Failed to download clip');
    }
  };

  const handleRenameClip = async (clipId: string) => {
    if (!newClipName.trim()) return;

    try {
      await clipStorage.updateClipMetadata(clipId, { name: newClipName.trim() });
      setClips(prev => prev.map(clip => 
        clip.id === clipId ? { ...clip, name: newClipName.trim() } : clip
      ));
      setEditingClip(null);
      setNewClipName('');
    } catch (error) {
      console.error('Failed to rename clip:', error);
      alert('Failed to rename clip');
    }
  };

  const startRename = (clip: StoredClip) => {
    setEditingClip(clip.id);
    setNewClipName(clip.name);
  };

  const cancelRename = () => {
    setEditingClip(null);
    setNewClipName('');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white">Loading clips...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="h-12 bg-gray-800 border-b border-gray-600 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <FileVideo className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">Media Library</span>
          <span className="text-xs text-gray-400">({clips.length} clips)</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex border border-gray-600 rounded">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 text-xs ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 text-xs ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="w-3 h-3" />
            </button>
          </div>

          {/* Sort Controls */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="duration">Duration</option>
            <option value="size">Size</option>
          </select>

          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 text-xs text-gray-400 hover:text-white"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-gray-850 border-b border-gray-700">
        <div className="flex items-center space-x-4 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Filter by tags:</span>
            <div className="flex flex-wrap gap-1">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-2 py-1 text-xs rounded ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clips Grid/List */}
      <div className="flex-1 overflow-auto p-4">
        {filteredAndSortedClips.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <FileVideo className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg mb-2">No clips found</p>
            <p className="text-sm">
              {clips.length === 0 
                ? 'Record your first animation to get started!'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAndSortedClips.map(clip => (
              <ClipCard
                key={clip.id}
                clip={clip}
                isSelected={selectedClipIds.includes(clip.id)}
                isPlaying={playingClip === clip.id}
                isEditing={editingClip === clip.id}
                newName={newClipName}
                onSelect={() => onSelectClip?.(clip.id)}
                onPlay={() => setPlayingClip(playingClip === clip.id ? null : clip.id)}
                onDownload={() => handleDownloadClip(clip.id)}
                onDelete={() => handleDeleteClip(clip.id)}
                onStartRename={() => startRename(clip)}
                onRename={() => handleRenameClip(clip.id)}
                onCancelRename={cancelRename}
                onNameChange={setNewClipName}
                onAddToTimeline={() => onAddToTimeline?.(clip.id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAndSortedClips.map(clip => (
              <ClipListItem
                key={clip.id}
                clip={clip}
                isSelected={selectedClipIds.includes(clip.id)}
                isPlaying={playingClip === clip.id}
                onSelect={() => onSelectClip?.(clip.id)}
                onPlay={() => setPlayingClip(playingClip === clip.id ? null : clip.id)}
                onDownload={() => handleDownloadClip(clip.id)}
                onDelete={() => handleDeleteClip(clip.id)}
                onAddToTimeline={() => onAddToTimeline?.(clip.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer with Storage Info */}
      <div className="h-8 bg-gray-850 border-t border-gray-700 flex items-center justify-between px-4 text-xs text-gray-400">
        <span>
          {filteredAndSortedClips.length} of {clips.length} clips
        </span>
        <span>
          Total size: {formatFileSize(clips.reduce((total, clip) => total + clip.fileSize, 0))}
        </span>
      </div>
    </div>
  );
};

// Clip Card Component for Grid View
interface ClipCardProps {
  clip: StoredClip;
  isSelected: boolean;
  isPlaying: boolean;
  isEditing: boolean;
  newName: string;
  onSelect: () => void;
  onPlay: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onStartRename: () => void;
  onRename: () => void;
  onCancelRename: () => void;
  onNameChange: (name: string) => void;
  onAddToTimeline: () => void;
}

const ClipCard: React.FC<ClipCardProps> = ({
  clip,
  isSelected,
  isPlaying,
  isEditing,
  newName,
  onSelect,
  onPlay,
  onDownload,
  onDelete,
  onStartRename,
  onRename,
  onCancelRename,
  onNameChange,
  onAddToTimeline
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;

    const loadVideo = async () => {
      if (isPlaying) {
        try {
          const clipData = await clipStorage.getClip(clip.id);
          if (clipData) {
            url = URL.createObjectURL(clipData.blob);
            setVideoUrl(url);
          }
        } catch (error) {
          console.error('Failed to load video:', error);
        }
      }
    };

    loadVideo();

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
        setVideoUrl(null);
      }
    };
  }, [clip.id, isPlaying]);

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, videoUrl]);

  return (
    <div 
      className={`bg-gray-800 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
        isSelected ? 'border-blue-500' : 'border-gray-700 hover:border-gray-600'
      }`}
      onClick={onSelect}
    >
      {/* Thumbnail/Video */}
      <div className="relative aspect-video bg-black">
        {clip.thumbnail && !isPlaying ? (
          <img 
            src={clip.thumbnail} 
            alt={clip.name}
            className="w-full h-full object-cover"
          />
        ) : isPlaying && videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            loop
            muted
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileVideo className="w-8 h-8 text-gray-600" />
          </div>
        )}

        {/* Play Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white" />
          )}
        </button>

        {/* Duration Badge */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white">
          {formatDuration(clip.duration)}
        </div>
      </div>

      {/* Clip Info */}
      <div className="p-3">
        {/* Name */}
        {isEditing ? (
          <div className="mb-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onRename();
                if (e.key === 'Escape') onCancelRename();
              }}
              className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white"
              autoFocus
            />
            <div className="flex space-x-1 mt-1">
              <button
                onClick={onRename}
                className="px-2 py-1 text-xs bg-green-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={onCancelRename}
                className="px-2 py-1 text-xs bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <h3 className="font-medium text-white text-sm mb-2 truncate" title={clip.name}>
            {clip.name}
          </h3>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>{formatFileSize(clip.fileSize)}</span>
          <span>{new Date(clip.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Tags */}
        {clip.tags && clip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {clip.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-1.5 py-0.5 text-xs bg-gray-700 text-gray-300 rounded">
                {tag}
              </span>
            ))}
            {clip.tags.length > 2 && (
              <span className="px-1.5 py-0.5 text-xs bg-gray-700 text-gray-300 rounded">
                +{clip.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToTimeline();
              }}
              className="p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs"
              title="Add to Timeline"
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
              title="Download"
            >
              <Download className="w-3 h-3" />
            </button>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartRename();
              }}
              className="p-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs"
              title="Rename"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Clip List Item Component for List View
const ClipListItem: React.FC<{
  clip: StoredClip;
  isSelected: boolean;
  isPlaying: boolean;
  onSelect: () => void;
  onPlay: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onAddToTimeline: () => void;
}> = ({ clip, isSelected, isPlaying, onSelect, onPlay, onDownload, onDelete, onAddToTimeline }) => {
  return (
    <div 
      className={`flex items-center p-3 bg-gray-800 rounded border-2 transition-all cursor-pointer ${
        isSelected ? 'border-blue-500' : 'border-gray-700 hover:border-gray-600'
      }`}
      onClick={onSelect}
    >
      {/* Thumbnail */}
      <div className="w-16 h-12 bg-black rounded overflow-hidden flex-shrink-0 mr-3">
        {clip.thumbnail ? (
          <img src={clip.thumbnail} alt={clip.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileVideo className="w-4 h-4 text-gray-600" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-white text-sm truncate">{clip.name}</h3>
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <span>{formatDuration(clip.duration)}</span>
          <span>{formatFileSize(clip.fileSize)}</span>
          <span>{new Date(clip.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 ml-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToTimeline();
          }}
          className="p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded"
        >
          <Plus className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          <Download className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};