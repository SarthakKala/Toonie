// Frontend/src/App.tsx
import React from 'react';
import { ResizableLayout } from './components1/layout/ResizableLayout';
import { ChatPanel } from './components1/chat/ChatPanel';
import { TabbedEditor } from './components1/editor/TabbedEditor';
// Update the import path below to the correct location of useApp, for example:
import { useApp } from './hooks/useApp';
import './stylesheet/index.css'
// If the file does not exist, create 'useApp.ts' in the correct folder and export the hook.

function App() {
  const { chat, files, actions, video } = useApp();

  const handleExportClip = () => {
    console.log('Exporting current clip:', files.activeFile.content);
    // Implementation for exporting the current animation as a standalone clip
    alert('Clip exported successfully! This would save your animation as a video file.');
  };

  const handleMoveToVideoEditor = () => {
    console.log('Moving current clip to video editor');
    // Implementation for adding the current animation to the video editor timeline
    const newClip = {
      id: Date.now().toString(),
      name: `${files.activeFile.name} Animation`,
      duration: 5.0,
      startTime: 0,
      endTime: 5,
      type: 'animation' as const,
      content: files.activeFile.content
    };
    video.updateClip(newClip);
    alert('Clip added to video editor timeline!');
  };

  const chatPanel = (
    <ChatPanel 
      messages={chat.messages} 
      onSendMessage={chat.sendMessage}
      isLoading={chat.isLoading}
    />
  );

  const editorPanel = (
    <TabbedEditor
      // Code Editor Props
      files={files.files}
      activeFile={files.activeFile}
      onFileSelect={(file) => {
        const selected = files.files.find(f => f.name === file.name && f.content === file.content);
        if (selected) {
          files.setActiveFile(selected);
        }
      }}
      onFileUpdate={files.updateFile}
      onRunCode={actions.handleRunCode}
      
      // Video Editor Props
      clips={video.clips}
      onClipSelect={video.selectClip}
      onClipUpdate={video.updateClip}
      onExport={video.exportVideo}
      
      // Preview Props
      onExportClip={handleExportClip}
      onMoveToVideoEditor={handleMoveToVideoEditor}
    />
  );

  return (
    <ResizableLayout 
      leftPanel={chatPanel}
      rightPanel={editorPanel}
      initialLeftWidth={35}
      minWidth={25}
      maxWidth={60}
    />
  );
}

export default App;