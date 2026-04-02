import React, { useState, useEffect, useRef } from 'react';
import { Download, ArrowRight, X, Loader, Video, Square, Monitor } from 'lucide-react';
import { CodeFile } from '../../types';
import P5CodePreview, { P5CodePreviewRef } from "./p5CodePreview";
import { useCodeStore } from "@/codeStore";
import { useVideoRecording } from "../../hooks/useVideoRecording";
import { clipStorage } from "../../../../utils/ClipStorage";

interface CurrentClipPreviewProps {
  activeFile: CodeFile;
  onExportClip: (clipData: { blob: Blob; name: string; duration: number }) => Promise<void>;
  onMoveToVideoEditor: () => void;
  isLoading?: boolean;
}

const pillBtn = (
  onClick: () => void,
  icon: React.ReactNode,
  label: string,
  disabled = false,
  title = ''
) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    style={{
      display: 'flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.3rem 0.75rem',
      borderRadius: '6px',
      border: '1px solid rgba(255,255,255,0.12)',
      background: 'rgba(255,255,255,0.05)',
      color: disabled ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.7)',
      fontSize: '0.75rem',
      fontWeight: 500,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background 0.15s, color 0.15s, border-color 0.15s',
    }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; } }}
    onMouseLeave={e => { if (!disabled) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; } }}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export const CurrentClipPreview: React.FC<CurrentClipPreviewProps> = ({
  activeFile,
  onExportClip,
  onMoveToVideoEditor,
  isLoading = false
}) => {
  const code = useCodeStore(state => state.code);
  const [isMaximized, setIsMaximized] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(5);
  const [isSaving, setIsSaving] = useState(false);
  const p5PreviewRef = useRef<P5CodePreviewRef>(null);

  const { isRecording, recordingProgress, startRecording, stopRecording } = useVideoRecording();

  useEffect(() => {
    if (isMaximized) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMaximized]);

  const handleRecord = async () => {
    const canvas = p5PreviewRef.current?.getCanvas();
    if (!canvas) { alert('Canvas not ready. Please wait for the animation to load.'); return; }
    if (canvas.width === 0 || canvas.height === 0) { alert('Canvas has invalid dimensions. Please refresh and try again.'); return; }
    try {
      p5PreviewRef.current?.restart();
      await new Promise(resolve => setTimeout(resolve, 1000));
      const freshCanvas = p5PreviewRef.current?.getCanvas();
      if (!freshCanvas) throw new Error('Canvas lost after restart');
      const blob = await startRecording(freshCanvas, { duration: recordingDuration * 1000, frameRate: 30 });
      if (blob.size === 0) throw new Error('Recorded video has no content');
      setIsSaving(true);
      const clipName = `${activeFile.name.replace('.tsx', '')} Animation`;
      const clipId = await clipStorage.saveClip({ blob, name: clipName, duration: recordingDuration, type: 'animation', content: code });
      console.log('Clip saved with ID:', clipId);
      onExportClip({ blob, name: clipName, duration: recordingDuration });
      alert(`Recording completed! Clip "${clipName}" saved. Size: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
    } catch (error) {
      console.error('Recording failed:', error);
      alert(`Recording failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportDownload = async () => {
    const canvas = p5PreviewRef.current?.getCanvas();
    if (!canvas) { alert('Canvas not ready for export.'); return; }
    try {
      p5PreviewRef.current?.restart();
      await new Promise(resolve => setTimeout(resolve, 1000));
      const freshCanvas = p5PreviewRef.current?.getCanvas();
      if (!freshCanvas) throw new Error('Canvas lost after restart');
      const blob = await startRecording(freshCanvas, { duration: recordingDuration * 1000, frameRate: 30 });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeFile.name.replace('.tsx', '')}_animation.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#161616' }}>

      {/* Header */}
      <div style={{
        height: '52px', borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1rem', flexShrink: 0, backgroundColor: '#161616',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Monitor size={16} color="#ffffff" />
          <span style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>Current Clip Preview</span>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>({activeFile.name})</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Duration input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <input
              type="number"
              value={recordingDuration}
              onChange={e => setRecordingDuration(Math.max(1, parseInt(e.target.value) || 5))}
              min="1" max="30"
              disabled={isRecording || isSaving}
              style={{
                width: '44px', padding: '0.2rem 0.4rem', fontSize: '0.72rem',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '5px', color: '#fff', outline: 'none', textAlign: 'center',
              }}
            />
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>sec</span>
          </div>

          {!isRecording ? (
            <>
              {pillBtn(handleRecord, <Video size={11} />, isSaving ? 'Saving...' : 'Record & Save', isLoading || isSaving, 'Record and save to library')}
              {pillBtn(handleExportDownload, <Download size={11} />, 'Export', isLoading || isSaving, 'Export as file')}
            </>
          ) : (
            pillBtn(stopRecording, <Square size={11} />, 'Stop', false, 'Stop recording')
          )}

          {pillBtn(onMoveToVideoEditor, <ArrowRight size={11} />, 'To Video Editor', false, 'Move to video editor')}
        </div>
      </div>

      {/* Recording progress */}
      {isRecording && (
        <div style={{ height: 2, background: 'rgba(255,255,255,0.08)' }}>
          <div style={{ height: '100%', background: 'rgba(255,255,255,0.6)', width: `${recordingProgress}%`, transition: 'width 0.1s' }} />
        </div>
      )}

      {/* Saving banner */}
      {isSaving && (
        <div style={{ height: 28, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <Loader size={11} style={{ animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>Saving clip to library...</span>
        </div>
      )}

      {/* Preview area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backgroundColor: '#161616' }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <Loader size={28} style={{ color: 'rgba(255,255,255,0.4)', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>Generating animation...</p>
          </div>
        ) : (
          <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            <P5CodePreview ref={p5PreviewRef} code={code} />
            {isRecording && (
              <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(0,0,0,0.65)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'pulse 1s ease-in-out infinite' }} />
                <span style={{ fontSize: '0.7rem', color: '#fff' }}>REC {Math.ceil((100 - recordingProgress) * recordingDuration / 100)}s</span>
              </div>
            )}
            <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.5)', borderRadius: '3px', padding: '0.15rem 0.4rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>
              850 x 580
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      {isMaximized && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '90vw', height: '80vh', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <P5CodePreview ref={p5PreviewRef} code={code} />
            <button
              onClick={() => setIsMaximized(false)}
              style={{ position: 'absolute', top: 12, right: 12, padding: '0.35rem', background: 'rgba(30,30,30,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', color: '#fff', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
            <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.5)', borderRadius: '3px', padding: '0.15rem 0.4rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>
              720x540 (Fullscreen)
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        height: 36, borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1rem', flexShrink: 0,
      }}>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>Preview updates automatically when code changes</span>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>Quality: Preview</span>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>FPS: 30</span>
        </div>
      </div>
    </div>
  );
};
