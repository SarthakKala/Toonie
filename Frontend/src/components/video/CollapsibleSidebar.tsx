import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelRightClose } from 'lucide-react';

interface CollapsibleSidebarProps {
  children: React.ReactNode;
  title: string;
  side: 'left' | 'right';
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  defaultCollapsed?: boolean;
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  children,
  title,
  side,
  defaultWidth = 256,
  minWidth = 200,
  maxWidth = 400,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [width, setWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
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
    let newWidth;
    
    if (side === 'left') {
      newWidth = startWidth.current + deltaX;
    } else {
      newWidth = startWidth.current - deltaX;
    }
    
    // Clamp the width within bounds
    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setWidth(newWidth);
  }, [isDragging, side, minWidth, maxWidth]);

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

  if (isCollapsed) {
    return (
      <div className={`bg-gray-800 flex flex-col items-center py-4 w-12 flex-shrink-0 ${
        side === 'left' ? 'border-r' : 'border-l'
      } border-gray-600`}>
        {/* Collapsed Header */}
        <button
          onClick={toggleCollapse}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          title={`Show ${title}`}
        >
          {side === 'left' ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
        
        {/* Vertical Title */}
        <div className="mt-4 transform rotate-90 text-xs text-gray-400 whitespace-nowrap origin-center">
          {title}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={sidebarRef}
      className={`bg-gray-800 flex flex-col flex-shrink-0 relative ${
        side === 'left' ? 'border-r' : 'border-l'
      } border-gray-600`}
      style={{ width: `${width}px` }}
    >
      {/* Header */}
      <div className="h-12 bg-gray-800 border-b border-gray-600 flex items-center justify-between px-4 flex-shrink-0">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <div className="flex items-center space-x-1">
          {/* Width indicator */}
          <span className="text-xs text-gray-500">{width}px</span>
          <button
            onClick={toggleCollapse}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title={`Hide ${title}`}
          >
            {side === 'left' ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelRightClose className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Resize Handle */}
      <div
        className={`absolute top-0 bottom-0 w-1 cursor-col-resize transition-colors z-10 ${
          isDragging ? 'bg-blue-500' : 'bg-transparent hover:bg-blue-400'
        }`}
        style={{
          [side === 'left' ? 'right' : 'left']: '-2px',
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