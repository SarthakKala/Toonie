import React from 'react';
import { Plus, Film, Music, Type, Clock } from 'lucide-react';
import { VideoClip } from '../../types/video';

interface MediaLibraryProps {
  clips: VideoClip[];
  selectedClip: VideoClip | null;
  onClipSelect: (clip: VideoClip) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  clips,
  selectedClip,
  onClipSelect
}) => {
  const getClipIcon = (type: VideoClip['type']) => {
    switch (type) {
      case 'animation':
        return <Film className="w-4 h-4" />;
      case 'audio':
        return <Music className="w-4 h-4" />;
      case 'text':
        return <Type className="w-4 h-4" />;
      default:
        return <Film className="w-4 h-4" />;
    }
  };

  const getClipColor = (type: VideoClip['type']) => {
    switch (type) {
      case 'animation':
        return 'text-blue-400 bg-blue-900';
      case 'audio':
        return 'text-green-400 bg-green-900';
      case 'text':
        return 'text-purple-400 bg-purple-900';
      default:
        return 'text-gray-400 bg-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Add Clip Button */}
      <div className="p-4 border-b border-gray-600 flex-shrink-0">
        <button className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Clip</span>
        </button>
      </div>

      {/* Clips List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {clips.length === 0 ? (
          <div className="text-center py-8">
            <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No clips yet</p>
            <p className="text-xs text-gray-500 mt-1">Add some clips to get started</p>
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
              onClick={() => onClipSelect(clip)}
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