import React, { useState } from 'react';
import { VideoPreview } from './VideoPreview';
import { Timeline } from './Timeline';
import { VideoControls } from './VideoControls';
import { MediaLibrary } from './MediaLibrary';
import { PropertiesPanel } from './PropertiesPanel';
import { CollapsibleSidebar } from './CollapsibleSidebar';
import { VideoClip } from '../../types/video';

interface VideoEditorProps {
  clips: VideoClip[];
  onClipSelect: (clip: VideoClip) => void;
  onClipUpdate: (clip: VideoClip) => void;
  onExport: () => void;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({
  clips,
  onClipSelect,
  onClipUpdate,
  onExport
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null);
  const [zoom, setZoom] = useState(1);

  const totalDuration = clips.reduce((acc, clip) => Math.max(acc, clip.endTime), 30);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(Math.max(0, Math.min(totalDuration, time)));
  };

  const handleClipSelect = (clip: VideoClip) => {
    setSelectedClip(clip);
    onClipSelect(clip);
  };

  return (
    <div className="h-full flex bg-gray-900">
      {/* Left Sidebar - Media Library */}
      <CollapsibleSidebar 
        title="Media Library" 
        side="left"
        defaultWidth={280}
        minWidth={200}
        maxWidth={400}
      >
        <MediaLibrary 
          clips={clips} 
          selectedClip={selectedClip}
          onClipSelect={handleClipSelect} 
        />
      </CollapsibleSidebar>

      {/* Center - Preview and Timeline */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Preview Area */}
        <div className="flex-1 bg-black flex items-center justify-center p-4">
          <VideoPreview 
            clips={clips}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onTimeUpdate={handleTimeUpdate}
          />
        </div>

        {/* Controls */}
        <div className="h-16 bg-gray-800 border-t border-gray-600 flex-shrink-0">
          <VideoControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={totalDuration}
            onPlayPause={handlePlayPause}
            onTimeChange={handleTimeUpdate}
            onZoomChange={setZoom}
            zoom={zoom}
          />
        </div>

        {/* Timeline */}
        <div className="h-48 bg-gray-850 border-t border-gray-600 flex-shrink-0">
          <Timeline
            clips={clips}
            currentTime={currentTime}
            selectedClip={selectedClip}
            zoom={zoom}
            onClipSelect={handleClipSelect}
            onClipUpdate={onClipUpdate}
            onTimelineClick={handleTimeUpdate}
          />
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <CollapsibleSidebar 
        title="Properties" 
        side="right"
        defaultWidth={280}
        minWidth={200}
        maxWidth={400}
      >
        <PropertiesPanel 
          selectedClip={selectedClip}
          onClipUpdate={onClipUpdate}
        />
      </CollapsibleSidebar>
    </div>
  );
};