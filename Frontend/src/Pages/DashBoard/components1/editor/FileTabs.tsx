import React from 'react';
import { FileText } from 'lucide-react';
import { CodeFile } from '../../types';

interface FileTabsProps {
  files: CodeFile[];
  activeFile: CodeFile;
  onFileSelect: (file: CodeFile) => void;
}

export const FileTabs: React.FC<FileTabsProps> = ({ files, activeFile, onFileSelect }) => {
  return (
    <div className="bg-gray-900 px-4 py-2 border-b border-gray-600 flex space-x-1 overflow-x-auto">
      {files.map((file) => (
        <button
          key={file.id}
          onClick={() => onFileSelect(file)}
          className={`px-3 py-1 rounded text-sm whitespace-nowrap transition-colors ${
            activeFile.id === file.id
              ? 'bg-white text-black'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <FileText className="w-3 h-3" />
            <span>{file.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};