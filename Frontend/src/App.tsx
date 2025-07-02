import React from 'react';
import { ChatPanel } from './components/chat/ChatPanel';
import { CodeEditor } from "./components/editor/CodeEditor";
import { useChat } from './hooks/UseChat';
import { useFiles } from './hooks/useFiles';

function App() {
  const { messages, sendMessage, isLoading } = useChat();
  const { files, activeFile, setActiveFile } = useFiles();

  const handleRunCode = () => {
    console.log('Running code:', activeFile.content);
    // Implement code execution logic
  };

  return (
    <div className="h-screen bg-black text-white flex">
      <ChatPanel 
        messages={messages} 
        onSendMessage={sendMessage}
        isLoading={isLoading}
      />
      <CodeEditor 
        files={files}
        activeFile={activeFile}
        onFileSelect={setActiveFile}
        onRunCode={handleRunCode}
      />
    </div>
  );
}

export default App;