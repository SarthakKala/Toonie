// Frontend/src/App.tsx
import React ,{useState, useEffect} from 'react';
import { ResizableLayout } from './components1/layout/ResizableLayout';
import { ChatPanel } from './components1/chat/ChatPanel';
import { TabbedEditor } from './components1/editor/TabbedEditor';
// Update the import path below to the correct location of useApp, for example:
import { useApp } from './hooks/useApp';
import './stylesheet/index.css'
// If the file does not exist, create 'useApp.ts' in the correct folder and export the hook.

function App() {
  const { chat, files, actions, video } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);

  // Custom message handler to track loading state for previews
  const handleSendMessage = async (content: string, isCommand = false) => {
    if (isCommand) {
      setIsGenerating(true);
      await chat.sendMessage(content, true);
      setIsGenerating(false);
    } else {
      await chat.sendMessage(content, false);
    }
  };

  const handleExportClip = async (clipData: { blob: Blob; name: string; duration: number }) => {
    console.log('Exporting clip:', clipData);
    
    // For now, just trigger download - we'll enhance this in Step 2
    const url = URL.createObjectURL(clipData.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clipData.name}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`Clip "${clipData.name}" exported successfully!`);
  };

  const handleMoveToVideoEditor = () => {
    console.log('Moving current clip to video editor');
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
      onSendMessage={handleSendMessage}
      isLoading={chat.isLoading}
    />
  );

  const editorPanel = (
    <TabbedEditor
      // Code Editor Props
      files={files.files}
      activeFile={files.activeFile}
      onFileSelect={(file) => {
        const selected = files.files.find(f => f.name === file.name);
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
      isGenerating={isGenerating} // Add this prop to pass the loading state
    />
  );

  useEffect(() => {
    // Ensure p5.js is loaded
    const checkP5 = () => {
      if (!window.p5) {
        console.log('Loading p5.js...');
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js';
        script.onload = () => {
          console.log('P5.js loaded successfully');
        };
        document.head.appendChild(script);
      } else {
        console.log('P5.js already loaded');
      }
    };
    
    checkP5();
  }, []);

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