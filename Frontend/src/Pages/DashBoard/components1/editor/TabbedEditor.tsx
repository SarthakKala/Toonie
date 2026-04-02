import React, { useState, useEffect } from "react";
import { Code, Video, Monitor, Download, Settings } from "lucide-react";
import { CodeEditor } from "./CodeEditor";
import { VideoEditor } from '../video/VideoEditor';
import { CurrentClipPreview } from "../preview/CurrentClipPreview";
import { VideoClip, EditorMode } from "../../types/video";
import { CodeFile } from "../../types";
import { useCodeStore } from '@/codeStore';

interface TabbedEditorProps {
  files: CodeFile[];
  activeFile: CodeFile;
  onFileSelect: (file: CodeFile) => void;
  onFileUpdate?: (file: CodeFile) => void;
  onRunCode: () => void;
  clips: VideoClip[];
  onClipSelect: (clip: VideoClip) => void;
  onClipUpdate: (clip: VideoClip) => void;
  onExport: () => void;
  onExportClip: (clipData: { blob: Blob; name: string; duration: number }) => Promise<void>;
  onMoveToVideoEditor?: () => void;
  isGenerating?: boolean;
}

export const TabbedEditor: React.FC<TabbedEditorProps> = ({
  files,
  activeFile,
  onFileSelect,
  onFileUpdate,
  onRunCode,
  clips,
  onClipSelect,
  onClipUpdate,
  onExport,
  onExportClip,
  onMoveToVideoEditor,
  isGenerating = false,
}) => {
  const [editorMode, setEditorMode] = useState<EditorMode>("code");
  const { code, explanation } = useCodeStore();

  useEffect(() => {
    if (code && onFileUpdate && activeFile.name === 'Sketch.tsx') {
      const existingCode = activeFile.content;
      const sketchMatch = existingCode.indexOf('const sketch = (p: p5) => {');
      if (sketchMatch !== -1) {
        const newContent = existingCode.replace(
          '        // Replace this with your custom animation code\n      };',
          `        p.setup = () => {
              p.createCanvas(800, 600);
            };

            p.draw = () => {
              p.background(220);
              ${code}
            };
          `
        );
        if (newContent !== existingCode) {
          onFileUpdate({ ...activeFile, content: newContent });
        }
      }
    }
  }, [code, activeFile, onFileUpdate]);

  const handleMoveToVideoEditor = (clipId?: string) => {
    setEditorMode("video");
    if (onMoveToVideoEditor) onMoveToVideoEditor();
    if (clipId) console.log('New clip added to video editor:', clipId);
  };

  const tabBtn = (mode: EditorMode, icon: React.ReactNode, label: string) => {
    const active = editorMode === mode;
    return (
      <button
        onClick={() => setEditorMode(mode)}
        title={label}
        aria-pressed={active}
        style={{
          padding: '0.48rem 0.8rem',
          borderRadius: '7px',
          background: active ? 'rgba(255,255,255,0.94)' : 'rgba(255,255,255,0.06)',
          border: active ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.1)',
          color: active ? '#161616' : 'rgba(255,255,255,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.42rem',
          minWidth: '98px',
          fontSize: '0.76rem',
          fontWeight: 600,
          letterSpacing: '0.01em',
          cursor: 'pointer',
          boxShadow: active ? '0 0 0 1px rgba(255,255,255,0.15), 0 5px 14px rgba(0,0,0,0.35)' : 'none',
          transition: 'background 0.15s, color 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
            e.currentTarget.style.color = '#fff';
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
          }
        }}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  const actionBtn = (onClick: () => void, icon: React.ReactNode, label: string, primary = false) => (
    <button
      onClick={onClick}
      title={label}
      style={{
        padding: '0.45rem 0.7rem',
        borderRadius: '6px',
        background: primary ? 'rgba(255,255,255,0.92)' : 'transparent',
        border: primary ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
        color: primary ? '#161616' : 'rgba(255,255,255,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.15s, color 0.15s',
      }}
      onMouseEnter={e => {
        if (!primary) e.currentTarget.style.color = '#fff';
        else e.currentTarget.style.background = '#fff';
      }}
      onMouseLeave={e => {
        if (!primary) e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
        else e.currentTarget.style.background = 'rgba(255,255,255,0.92)';
      }}
    >
      {icon}
    </button>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#161616' }}>

      {/* Header */}
      <div style={{
        height: '56px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        backgroundColor: '#161616',
        flexShrink: 0,
      }}>
        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          gap: '0.38rem',
          marginLeft: '-0.1rem',
        }}>
          {tabBtn("code", <Code size={15} />, "Code")}
          {tabBtn("preview", <Monitor size={15} />, "Preview")}
          {tabBtn("video", <Video size={15} />, "Video")}
        </div>

        {/* Center label */}
        <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.78rem' }}>
          {editorMode === "code" && "Write and edit your p5.js animations"}
          {editorMode === "preview" && "Preview your animation before adding to timeline"}
          {editorMode === "video" && "Compose and timeline your video clips"}
        </span>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {editorMode === "video" && actionBtn(onExport, <Download size={15} />, "Export", true)}
          {actionBtn(() => {}, <Settings size={15} />, "Settings")}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {editorMode === "code" && (
          <>
            {isGenerating && (
              <div style={{
                position: 'absolute', top: 60, right: 16, zIndex: 10,
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', padding: '0.3rem 0.8rem', borderRadius: '6px',
                fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}>
                <div style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Generating code...
              </div>
            )}
            <CodeEditor
              files={files}
              activeFile={activeFile}
              onFileSelect={onFileSelect}
              onFileUpdate={onFileUpdate}
              onRunCode={onRunCode}
              onNewFile={() => console.log("Create new file")}
            />
            {explanation && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', padding: '1rem' }}>
                <h3 style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', marginBottom: '0.4rem' }}>AI Explanation</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}>{explanation}</p>
              </div>
            )}
          </>
        )}
        {editorMode === "preview" && (
          <CurrentClipPreview
            activeFile={activeFile}
            onExportClip={onExportClip || (() => console.log("Export clip"))}
            onMoveToVideoEditor={handleMoveToVideoEditor}
            isLoading={isGenerating}
          />
        )}
        {editorMode === "video" && <VideoEditor />}
      </div>
    </div>
  );
};
