import React from 'react';
import { ResizableLayout } from './components/layout/ResizableLayout';
import { ChatPanel } from './components/chat/ChatPanel';
import { TabbedEditor } from './components/editor/TabbedEditor';
import { useApp } from './hooks/useApp';

function App() {
  const { chat, files, actions, video } = useApp();

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
      onFileSelect={files.setActiveFile}
      onFileUpdate={files.updateFile}
      onRunCode={actions.handleRunCode}
      
      // Video Editor Props
      clips={video.clips}
      onClipSelect={video.selectClip}
      onClipUpdate={video.updateClip}
      onExport={video.exportVideo}
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