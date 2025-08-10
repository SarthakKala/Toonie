import { useState } from 'react';
import { useChat } from './UseChat';
import { useFiles } from './useFiles';
import { VideoClip } from '../types/video';

// Mock video clips data
const mockClips: VideoClip[] = [
  {
    id: '1',
    name: 'Cat Flying Animation',
    duration: 10.0,
    startTime: 0,
    endTime: 5,
    type: 'animation',
    content: 'function setup() {\n  createCanvas(800, 600);\n}\n\nfunction draw() {\n  background(135, 206, 235);\n  // Cat flying animation\n}'
  },
  {
    id: '2',
    name: 'Background Music',
    duration: 15.0,
    startTime: 0,
    endTime: 15,
    type: 'audio',
    content: 'background-music.mp3'
  },
  {
    id: '3',
    name: 'Title Text',
    duration: 3.0,
    startTime: 1,
    endTime: 4,
    type: 'text',
    content: 'Amazing Cat Adventure!'
  }
];

export const useApp = () => {
  const { messages, sendMessage, isLoading } = useChat();
  const { files, activeFile, setActiveFile, updateFile } = useFiles();
  const [clips, setClips] = useState(mockClips);
  const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null);

  const handleRunCode = () => {
    console.log('Running p5.js code:', activeFile?.content);
    // Execute p5.js code logic here
  };

  const handleFileUpdate = (updatedFile: any) => {
    updateFile(updatedFile.id, updatedFile.content);
  };

  const selectClip = (clip: VideoClip) => {
    setSelectedClip(clip);
  };

  const updateClip = (updatedClip: VideoClip) => {
    setClips(clips.map(clip => 
      clip.id === updatedClip.id ? { ...updatedClip, endTime: updatedClip.startTime + updatedClip.duration } : clip
    ));
    if (selectedClip?.id === updatedClip.id) {
      setSelectedClip({ ...updatedClip, endTime: updatedClip.startTime + updatedClip.duration });
    }
  };

  const exportVideo = () => {
    console.log('Exporting video with clips:', clips);
    alert('Video export started! This would render your animation clips into a video file.');
  };

  return {
    chat: { messages, sendMessage, isLoading },
    files: { files, activeFile, setActiveFile, updateFile: handleFileUpdate },
    actions: { handleRunCode },
    video: {
      clips,
      selectedClip,
      selectClip,
      updateClip,
      exportVideo
    }
  };
};