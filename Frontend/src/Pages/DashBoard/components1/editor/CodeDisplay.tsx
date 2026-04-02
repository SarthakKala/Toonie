import React, { useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { CodeFile } from '../../types';

interface CodeDisplayProps {
  file: CodeFile;
  onCodeChange?: (value: string | undefined) => void;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ file, onCodeChange }) => {
  const monaco = useMonaco();
  
  // Configure Monaco to disable red squiggly lines when the editor loads
  useEffect(() => {
    if (monaco) {
      // Disable TypeScript validation
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      });
      
      // Also disable JavaScript validation
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      });
    }
  }, [monaco]);
  
  const getLanguage = (fileLanguage: string) => {
    switch (fileLanguage.toLowerCase()) {
      case 'typescript':
      case 'tsx':
        return 'typescript';
      case 'javascript':
      case 'jsx':
        return 'javascript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      case 'txt':
        return 'plaintext';
      default:
        return 'typescript';
    }
  };

  return (
    <div className="flex-1" style={{ backgroundColor: '#161616' }}>
      <div className="h-full">
        <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: '#161616', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{file.name}</span>
        </div>
        <Editor
          height="90vh"
          language={getLanguage(file.language)}
          value={file.content}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            // Disable additional validation options
            formatOnType: false,
            formatOnPaste: false,
          }}
        />
      </div>
    </div>
  );
};