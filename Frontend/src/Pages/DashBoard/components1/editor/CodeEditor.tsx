import React from 'react';
import { EditorHeader } from './EditorHeader';
import { FileTabs } from './FileTabs';
import { FileExplorer } from './FileExplorer';
import { CodeDisplay } from './CodeDisplay';
import { StatusBar } from './StatusBar';
import { CodeFile } from '../../types';
import { useCodeStore } from '@/codeStore'; 

interface CodeEditorProps {
  files: CodeFile[];
  activeFile: CodeFile;
  onFileSelect: (file: CodeFile) => void;
  onFileUpdate?: (file: CodeFile) => void;
  onRunCode?: () => void;
  onCopyCode?: () => void;
  onDownloadCode?: () => void;
  onNewFile?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  files,
  activeFile,
  onFileSelect,
  onFileUpdate,
  onRunCode,
  onCopyCode,
  onDownloadCode,
  onNewFile
}) => {
  const { code } = useCodeStore(); 
  
  const p5Template = `
      function setup() {
        createCanvas(400, 400);
      }
      
      function draw() {
        background(220);
      }`;
  
  const handleNewFile = () => {
  const newFile = {
    id: Date.now().toString(),
    name: 'Sketch.tsx',
    language: "typescript" as "typescript",
    content: code || p5Template,
  };
    
    if (onFileUpdate) {
      onFileUpdate(newFile);
    }
  };


  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    if (onCopyCode) onCopyCode();
  };

  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([activeFile.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = activeFile.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    if (onDownloadCode) onDownloadCode();
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined && onFileUpdate) {
      onFileUpdate({ ...activeFile, content: value });
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      <EditorHeader 
        onRunCode={onRunCode}
        onCopyCode={handleCopyCode}
        onDownloadCode={handleDownloadCode}
      />
      
      <FileTabs 
        files={files}
        activeFile={activeFile}
        onFileSelect={onFileSelect}
      />

      <div className="flex flex-1 min-h-0">
        <FileExplorer 
          files={files}
          activeFile={activeFile}
          onFileSelect={onFileSelect}
          onNewFile={handleNewFile}
          defaultWidth={250}
          minWidth={200}
          maxWidth={400}
        />
        
        <CodeDisplay 
          file={activeFile} 
          onCodeChange={handleCodeChange}
        />
      </div>

      <StatusBar language={activeFile.language} />
    </div>
  );
};