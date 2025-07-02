import React from 'react';
import { EditorHeader } from './EditorHeader';
import { FileTabs } from './FileTabs';
import { FileExplorer } from './FileExplorer';
import { CodeDisplay } from './CodeDisplay';
import { StatusBar } from './StatusBar';
import { CodeFile } from '../../types';

interface CodeEditorProps {
  files: CodeFile[];
  activeFile: CodeFile;
  onFileSelect: (file: CodeFile) => void;
  onRunCode?: () => void;
  onCopyCode?: () => void;
  onDownloadCode?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  files,
  activeFile,
  onFileSelect,
  onRunCode,
  onCopyCode,
  onDownloadCode
}) => {
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

      <div className="flex flex-1">
        <FileExplorer 
          files={files}
          activeFile={activeFile}
          onFileSelect={onFileSelect}
        />
        
        <CodeDisplay file={activeFile} />
      </div>

      <StatusBar language={activeFile.language} />
    </div>
  );
};