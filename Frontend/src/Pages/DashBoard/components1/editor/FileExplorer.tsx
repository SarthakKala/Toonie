import React, { useState, useRef, useCallback } from 'react';
import { Folder, FileText, PanelLeftClose, Plus, Search } from 'lucide-react';
import { CodeFile } from '../../types';

interface FileExplorerProps {
  files: CodeFile[];
  activeFile: CodeFile;
  onFileSelect: (file: CodeFile) => void;
  onNewFile?: () => void;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  defaultCollapsed?: boolean;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  activeFile, 
  onFileSelect,
  onNewFile,
  defaultWidth = 250,
  minWidth = 200,
  maxWidth = 400,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [width, setWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const explorerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  }, [width]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX.current;
    const newWidth = startWidth.current + deltaX;
    
    // Clamp the width within bounds
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setWidth(clampedWidth);
  }, [isDragging, minWidth, maxWidth]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getFileIcon = (file: CodeFile) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return '📄';
      case 'ts':
      case 'tsx':
        return '📘';
      case 'txt':
        return '📄';
      default:
        return '📄';
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isCollapsed) {
    return (
      <div className="bg-gray-900 border-r border-gray-600 flex flex-col items-center py-4 w-12 flex-shrink-0">
        {/* Collapsed Header */}
        <button
          onClick={toggleCollapse}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
          title="Show Explorer"
        >
          <Folder className="w-4 h-4" />
        </button>
        
        {/* Vertical Title */}
        <div className="mt-4 transform rotate-90 text-xs text-gray-400 whitespace-nowrap origin-center">
          Explorer
        </div>
        
        {/* File Count */}
        <div className="mt-6 text-xs text-gray-500 bg-gray-800 rounded-full w-6 h-6 flex items-center justify-center">
          {files.length}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={explorerRef}
      className="bg-gray-900 border-r border-gray-600 flex flex-col flex-shrink-0 relative"
      style={{ width: `${width}px` }}
    >
      {/* Header */}
      <div className="h-12 bg-gray-900 border-b border-gray-600 flex items-center justify-between px-3 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Folder className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-white">Explorer</span>
        </div>
        <div className="flex items-center space-x-1">
          {/* File count */}
          <span className="text-xs text-gray-500">{files.length} files</span>
          {/* New file button */}
          {onNewFile && (
            <button
              onClick={onNewFile}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
              title="New File"
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
          {/* Collapse button */}
          <button
            onClick={toggleCollapse}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
            title="Hide Explorer"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-700 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400">
                {searchTerm ? 'No matching files' : 'No files yet'}
              </p>
              {onNewFile && !searchTerm && (
                <button
                  onClick={onNewFile}
                  className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Create your first file
                </button>
              )}
            </div>
          ) : (
            filteredFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => onFileSelect(file)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors group ${
                  activeFile.id === file.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs">{getFileIcon(file)}</span>
                  <FileText className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate flex-1">{file.name}</span>
                  {file.language && (
                    <span className="text-xs text-gray-500 group-hover:text-gray-400">
                      {file.language}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="p-3 border-t border-gray-700 bg-gray-850 flex-shrink-0">
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>
            {filteredFiles.length} of {files.length} files
          </span>
          <span className="text-gray-500">
            {width}px
          </span>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className={`absolute top-0 bottom-0 w-1 cursor-col-resize transition-colors z-10 ${
          isDragging ? 'bg-blue-500' : 'bg-transparent hover:bg-blue-400'
        }`}
        style={{
          right: '-2px',
          width: '4px'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Visual indicator */}
        <div className="w-full h-full flex items-center justify-center">
          <div className={`w-0.5 h-8 transition-opacity ${
            isDragging ? 'bg-blue-300 opacity-100' : 'bg-gray-500 opacity-0 hover:opacity-100'
          }`} />
        </div>
      </div>

      {/* Drag overlay when dragging */}
      {isDragging && (
        <div className="fixed inset-0 z-50 pointer-events-none" 
             style={{ cursor: 'col-resize' }} />
      )}
    </div>
  );
};