import React from 'react';
import { ResizableLayout } from './components/layout/ResizableLayout';
import { ChatPanel } from './components/chat/ChatPanel';
import { CodeEditor } from './components/editor/CodeEditor';
import { useApp } from './hooks/useApp';

function App() {
  const { chat, files, actions } = useApp();

  const chatPanel = (
    <ChatPanel 
      messages={chat.messages} 
      onSendMessage={chat.sendMessage}
      isLoading={chat.isLoading}
    />
  );

  const codePanel = (
    <CodeEditor 
      files={files.files}
      activeFile={files.activeFile}
      onFileSelect={files.setActiveFile}
      onRunCode={actions.handleRunCode}
    />
  );

  return (
    <ResizableLayout 
      leftPanel={chatPanel}
      rightPanel={codePanel}
      initialLeftWidth={50}
    />
  );
}

export default App;