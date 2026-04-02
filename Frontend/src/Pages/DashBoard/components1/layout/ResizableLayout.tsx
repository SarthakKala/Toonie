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
    <div 
      ref={containerRef} 
      className="h-screen flex select-none" 
      style={{ 
        backgroundColor: '#161616',
        color: '#FAF9F6'
      }}
    >
      {/* Left Panel */}
      <div
        style={{ width: `${leftWidth}%`, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' }}
      >
        {leftPanel}
      </div>

      {/* Resizer */}
      <div
        style={{
          width: 4, flexShrink: 0, cursor: 'col-resize',
          background: isDragging ? 'rgba(255,255,255,0.2)' : 'transparent',
          transition: 'background 0.15s',
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={e => { if (!isDragging) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
        onMouseLeave={e => { if (!isDragging) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
      />

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