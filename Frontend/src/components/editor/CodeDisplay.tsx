import React from 'react';
import Editor from '@monaco-editor/react';
import { CodeFile } from '../../types';

interface CodeDisplayProps {
  file: CodeFile;
  onCodeChange?: (value: string | undefined) => void;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ file, onCodeChange }) => {
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
      default:
        return 'typescript';
    }
  };

  return (
    <div className="flex-1 bg-black">
      <div className="h-full">
        <div className="bg-gray-900 px-4 py-2 border-b border-gray-600 flex items-center justify-between">
          <span className="text-sm text-gray-400">{file.name}</span>
          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
            {file.language}
          </span>
        </div>
        <div className="h-full" style={{ height: 'calc(100% - 41px)' }}>
          <Editor
            height="100%"
            language={getLanguage(file.language)}
            value={file.content}
            onChange={onCodeChange}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
              lineNumbers: 'on',
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              minimap: { enabled: false },
              tabSize: 2,
              insertSpaces: true,
              renderWhitespace: 'selection',
              folding: true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
              glyphMargin: false,
              contextmenu: true,
              mouseWheelZoom: true,
              smoothScrolling: true,
              cursorBlinking: 'blink',
              cursorSmoothCaretAnimation: 'on',
              renderLineHighlight: 'line',
              selectionHighlight: true,
              occurrencesHighlight: 'singleFile',
              codeLens: false,
              folding: true,
              foldingHighlight: true,
              unfoldOnClickAfterEndOfLine: false,
              showFoldingControls: 'mouseover',
            }}
          />
        </div>
      </div>
    </div>
  );
};