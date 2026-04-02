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
    <div style={{
      backgroundColor: '#161616',
      padding: '0 0.75rem',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      gap: '2px',
      overflowX: 'auto',
      flexShrink: 0,
    }}>
      {files.map((file) => {
        const active = activeFile.id === file.id;
        return (
          <button
            key={file.id}
            onClick={() => onFileSelect(file)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.45rem 0.75rem',
              borderRadius: '5px 5px 0 0',
              background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderBottom: active ? '1px solid rgba(255,255,255,0.35)' : '1px solid transparent',
              color: active ? '#fff' : 'rgba(255,255,255,0.38)',
              fontSize: '0.78rem',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; }}
          >
            <FileText size={11} />
            <span>{file.name}</span>
          </button>
        );
      })}
    </div>
  );
};
