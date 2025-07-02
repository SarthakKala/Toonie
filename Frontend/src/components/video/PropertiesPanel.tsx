import React from 'react';
import { VideoClip } from '../../types/video';

interface PropertiesPanelProps {
  selectedClip: VideoClip | null;
  onClipUpdate: (clip: VideoClip) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedClip,
  onClipUpdate
}) => {
  if (!selectedClip) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🎬</span>
          </div>
          <p className="text-sm text-gray-400">Select a clip to edit properties</p>
          <p className="text-xs text-gray-500 mt-1">Click on any clip in the timeline or media library</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Clip Info */}
      <div className="p-4 border-b border-gray-600 bg-gray-750 flex-shrink-0">
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${
            selectedClip.type === 'animation' ? 'bg-blue-500' :
            selectedClip.type === 'audio' ? 'bg-green-500' : 'bg-purple-500'
          }`} />
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            {selectedClip.type} clip
          </span>
        </div>
        <h4 className="text-sm font-medium text-white truncate">
          {selectedClip.name}
        </h4>
      </div>

      {/* Properties Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">
            Clip Name
          </label>
          <input
            type="text"
            value={selectedClip.name}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onChange={(e) => onClipUpdate({ ...selectedClip, name: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">
            Duration (seconds)
          </label>
          <input
            type="number"
            value={selectedClip.duration}
            step="0.1"
            min="0.1"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onChange={(e) => onClipUpdate({ ...selectedClip, duration: parseFloat(e.target.value) })}
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">
            Start Time
          </label>
          <input
            type="number"
            value={selectedClip.startTime}
            step="0.1"
            min="0"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onChange={(e) => onClipUpdate({ ...selectedClip, startTime: parseFloat(e.target.value) })}
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">
            Type
          </label>
          <select
            value={selectedClip.type}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onChange={(e) => onClipUpdate({ ...selectedClip, type: e.target.value as VideoClip['type'] })}
          >
            <option value="animation">Animation</option>
            <option value="audio">Audio</option>
            <option value="text">Text</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">
            Content
          </label>
          <textarea
            value={selectedClip.content}
            rows={6}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            onChange={(e) => onClipUpdate({ ...selectedClip, content: e.target.value })}
            placeholder="Enter clip content..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-600 bg-gray-750 flex-shrink-0 space-y-2">
        <button className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium text-white transition-colors">
          Delete Clip
        </button>
        <button className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm font-medium text-white transition-colors">
          Duplicate Clip
        </button>
      </div>
    </div>
  );
};