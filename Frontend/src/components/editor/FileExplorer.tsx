import React from 'react';
import { Folder, FileText } from 'lucide-react';
import { CodeFile } from '../../types';

interface FileExplorerProps {
  files: CodeFile[];
  activeFile: CodeFile;
  onFileSelect: (file: CodeFile) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  activeFile, 
  onFileSelect 
}) => {
  return (
    <div className="w-1/4 bg-gray-900 border-r border-gray-600 p-2">
      <div className="flex items-center space-x-2 text-sm font-medium mb-3 text-white">
        <Folder className="w-4 h-4" />
        <span>Explorer</span>
      </div>
      <div className="space-y-1">
        {files.map((file) => (
          <button
            key={file.id}
            onClick={() => onFileSelect(file)}
            className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
              activeFile.id === file.id
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-3 h-3" />
              <span className="truncate">{file.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
