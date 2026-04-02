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
    e.preventDefault(); e.stopPropagation();
    setIsDragging(true);
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  }, [width]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, startWidth.current + (e.clientX - startX.current)));
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

  const getFileType = (file: CodeFile) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ext === 'tsx' || ext === 'ts' ? 'typescript' : ext === 'txt' ? 'txt' : ext || '';
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isCollapsed) {
    return (
      <div style={{
        backgroundColor: '#161616', borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '0.75rem 0', width: 44, flexShrink: 0,
      }}>
        <button
          onClick={() => setIsCollapsed(false)}
          title="Show Explorer"
          style={{ padding: '0.4rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', borderRadius: 5 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
        >
          <Folder size={15} />
        </button>
        <div style={{ marginTop: '0.75rem', transform: 'rotate(90deg)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Explorer
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {files.length}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={explorerRef}
      style={{
        backgroundColor: '#161616', borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'relative',
        width: `${width}px`,
      }}
    >
      {/* Header */}
      <div style={{
        height: 44, borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 0.75rem', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Folder size={13} style={{ color: 'rgba(255,255,255,0.4)' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>Explorer</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginRight: '0.25rem' }}>{files.length} files</span>
          {onNewFile && (
            <button onClick={onNewFile} title="New File"
              style={{ padding: '0.2rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', borderRadius: 4 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
            ><Plus size={12} /></button>
          )}
          <button onClick={() => setIsCollapsed(true)} title="Hide Explorer"
            style={{ padding: '0.2rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', borderRadius: 4 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
          ><PanelLeftClose size={13} /></button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <Search size={11} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%', paddingLeft: 26, paddingRight: 8, paddingTop: 6, paddingBottom: 6,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6, color: '#fff', fontSize: '0.75rem', outline: 'none',
              fontFamily: 'inherit', boxSizing: 'border-box',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
        </div>
      </div>

      {/* File list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.4rem' }}>
        {filteredFiles.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
            <FileText size={28} style={{ color: 'rgba(255,255,255,0.12)', margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
              {searchTerm ? 'No matching files' : 'No files yet'}
            </p>
            {onNewFile && !searchTerm && (
              <button onClick={onNewFile}
                style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', background: 'none', border: 'none', cursor: 'pointer' }}
              >Create your first file</button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredFiles.map(file => {
              const active = activeFile.id === file.id;
              return (
                <button
                  key={file.id}
                  onClick={() => onFileSelect(file)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '0.4rem 0.6rem',
                    borderRadius: 5,
                    background: active ? 'rgba(255,255,255,0.09)' : 'transparent',
                    border: active ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                    color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                    fontSize: '0.78rem', cursor: 'pointer',
                    transition: 'background 0.12s, color 0.12s',
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; } }}
                >
                  <FileText size={11} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                  {file.language && (
                    <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.22)', flexShrink: 0 }}>{getFileType(file)}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '0.4rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'rgba(255,255,255,0.22)' }}>
          <span>{filteredFiles.length} of {files.length} files</span>
        </div>
      </div>

      {/* Resize handle */}
      <div
        style={{
          position: 'absolute', top: 0, bottom: 0, right: -2, width: 4,
          cursor: 'col-resize', zIndex: 10,
          background: isDragging ? 'rgba(255,255,255,0.25)' : 'transparent',
          transition: 'background 0.15s',
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
        onMouseLeave={e => { if (!isDragging) e.currentTarget.style.background = 'transparent'; }}
      />
      {isDragging && <div style={{ position: 'fixed', inset: 0, zIndex: 50, cursor: 'col-resize', pointerEvents: 'none' }} />}
    </div>
  );
};
