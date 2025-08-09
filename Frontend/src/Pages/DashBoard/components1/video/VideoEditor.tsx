import React, { useState } from 'react';
import { MediaLibrary } from './MediaLibrary';
import { Timeline } from "./Timeline"

interface VideoEditorProps {
  // Add any props needed
}

export const VideoEditor: React.FC<VideoEditorProps> = () => {
  const [selectedClips, setSelectedClips] = useState<string[]>([]);
  const [timelineClips, setTimelineClips] = useState<string[]>([]);

  const handleSelectClip = (clipId: string) => {
    setSelectedClips(prev => 
      prev.includes(clipId) 
        ? prev.filter(id => id !== clipId)
        : [...prev, clipId]
    );
  };

  const handleAddToTimeline = (clipId: string) => {
    if (!timelineClips.includes(clipId)) {
      setTimelineClips(prev => [...prev, clipId]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Video Editor Header */}
      <div className="h-12 bg-gray-800 border-b border-gray-600 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-sm font-medium text-white">Video Editor</span>
        </div>
      </div>

      {/* Main Editor Layout */}
      <div className="flex-1 flex">
        {/* Media Library - Left Panel */}
        <div className="w-1/3 border-r border-gray-700">
          <MediaLibrary
            onSelectClip={handleSelectClip}
            onAddToTimeline={handleAddToTimeline}
            selectedClipIds={selectedClips}
          />
        </div>

        {/* Timeline and Preview - Right Panel */}
        <div className="flex-1 flex flex-col">
          {/* Preview Area */}
          <div className="h-1/2 bg-black border-b border-gray-700 flex items-center justify-center">
            <div className="text-white text-lg">
              Timeline Preview
              <div className="text-sm text-gray-400 mt-2">
                {timelineClips.length} clips in timeline
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-1/2">
            <Timeline clips={timelineClips} onRemoveClip={(clipId) => {
              setTimelineClips(prev => prev.filter(id => id !== clipId));
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};