import React from 'react';
import { Code, GitBranch, Copy, Download } from 'lucide-react';

interface EditorHeaderProps {
  onCopyCode?: () => void;
  onDownloadCode?: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  onCopyCode,
  onDownloadCode
}) => {
  return (
    <div
      className="px-4 flex items-center justify-between"
      style={{
        height: '52px',
        backgroundColor: '#161616',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-white" />
          <h2 className="font-semibold">Code Editor</h2>
        </div>
        <div className="flex items-center space-x-1 text-sm">
          <GitBranch className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">main</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={onCopyCode}
          className="p-2 hover:bg-gray-800 rounded transition-colors" 
          title="Copy Code"
        >
          <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
        </button>
        <button 
          onClick={onDownloadCode}
          className="p-2 hover:bg-gray-800 rounded transition-colors" 
          title="Download"
        >
          <Download className="w-4 h-4 text-gray-400 hover:text-white" />
        </button>
      </div>
    </div>
  );
};