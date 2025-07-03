import React, { useState, useRef, useEffect } from 'react';

interface ResizableLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  initialLeftWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  leftPanel,
  rightPanel,
  initialLeftWidth = 50,
  minWidth = 20,
  maxWidth = 80,
}) => {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newLeftWidth));
    setLeftWidth(clampedWidth);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isDragging]);

  return (
    <div ref={containerRef} className="h-screen text-white flex select-none" style={{ backgroundColor: '#161616' }}>
      {/* Left Panel */}
      <div 
        style={{ width: `${leftWidth}%` }}
        className="border-r border-gray-600 flex flex-col"
      >
        {leftPanel}
      </div>

      {/* Resizer */}
      <div
        className={`w-1 bg-gray-600 hover:bg-gray-400 cursor-col-resize flex-shrink-0 transition-colors ${
          isDragging ? 'bg-blue-500' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="w-full h-full relative">
          <div className="absolute inset-y-0 left-0 w-1 hover:w-2 bg-transparent hover:bg-gray-300 transition-all opacity-0 hover:opacity-100" />
        </div>
      </div>

      {/* Right Panel */}
      <div 
        style={{ width: `${100 - leftWidth}%` }}
        className="flex flex-col"
      >
        {rightPanel}
      </div>
    </div>
  );
};