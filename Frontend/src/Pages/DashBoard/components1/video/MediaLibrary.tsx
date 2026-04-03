import React, { useState, useEffect } from 'react';
import { Plus, Film, Clock, Play, Trash2 } from 'lucide-react';
import { clipStorage } from '../../../../utils/ClipStorage';

interface ClipData {
  id: string;
  name: string;
  duration: number;
  type: 'animation' | 'audio' | 'text';
  content: string;
  thumbnail?: string;
  blob: Blob;
}

interface MediaLibraryProps {
  onSelectClip?: (clipId: string) => void;
  onAddToTimeline?: (clipId: string) => void;
  selectedClipIds?: string[];
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onSelectClip,
  onAddToTimeline,
  selectedClipIds = []
}) => {
  const [clips, setClips] = useState<ClipData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClip, setSelectedClip] = useState<ClipData | null>(null);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadClips = async () => {
      setIsLoading(true);
      try {
        const storedClips = await clipStorage.getAllClips();
        const clipData = storedClips.map(stored => ({
          id: stored.metadata.id,
          name: stored.metadata.name,
          duration: stored.metadata.duration,
          type: stored.metadata.type,
          content: stored.metadata.content,
          thumbnail: stored.metadata.thumbnail,
          blob: stored.blob
        }));
        setClips(clipData);
        const urls: Record<string, string> = {};
        clipData.forEach(clip => {
          if (clip.blob.type.startsWith('video/')) urls[clip.id] = URL.createObjectURL(clip.blob);
        });
        setPreviewUrls(urls);
      } catch (error) {
        console.error('Failed to load clips:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadClips();
    return () => { Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url)); };
  }, []);

  const handleClipSelect = (clip: ClipData) => {
    setSelectedClip(clip);
    onSelectClip?.(clip.id);
  };

  const handlePlayClip = (clip: ClipData) => {
    const url = previewUrls[clip.id];
    if (!url) return;
    const video = document.createElement('video');
    video.src = url; video.controls = true; video.autoplay = true;
    video.style.maxWidth = '90vw'; video.style.maxHeight = '90vh';
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;z-index:10000;cursor:pointer;';
    modal.appendChild(video);
    modal.onclick = () => document.body.removeChild(modal);
    document.body.appendChild(modal);
  };

  const handleDeleteClip = async (clipId: string) => {
    if (!confirm('Delete this clip?')) return;
    try {
      await clipStorage.deleteClip(clipId);
      setClips(prev => prev.filter(c => c.id !== clipId));
      if (previewUrls[clipId]) {
        URL.revokeObjectURL(previewUrls[clipId]);
        setPreviewUrls(prev => { const { [clipId]: _, ...rest } = prev; return rest; });
      }
      if (selectedClip?.id === clipId) setSelectedClip(null);
    } catch (error) {
      console.error('Failed to delete clip:', error);
      alert('Failed to delete clip');
    }
  };

  const iconBtn = (onClick: (e: React.MouseEvent) => void, icon: React.ReactNode, label: string) => (
    <button
      onClick={onClick}
      title={label}
      style={{
        padding: '0.2rem 0.45rem',
        borderRadius: 4,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.09)',
        color: 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center',
        transition: 'background 0.12s, color 0.12s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
    >
      {icon}
    </button>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#161616' }}>

      {/* Clips list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
            <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.12)', borderTopColor: 'rgba(255,255,255,0.6)', borderRadius: '50%', margin: '0 auto 0.6rem', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>Loading clips...</p>
          </div>
        ) : clips.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
            <Film size={28} style={{ color: 'rgba(255,255,255,0.12)', margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>No clips yet</p>
            <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.2rem' }}>Record some animations to get started</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {clips.map((clip, index) => {
              const active = selectedClip?.id === clip.id;
              const displayName = `Clip${index + 1}`;
              return (
                <div
                  key={clip.id}
                  onClick={() => handleClipSelect(clip)}
                  style={{
                    padding: '0.5rem 0.6rem',
                    borderRadius: 6,
                    background: active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${active ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer',
                    transition: 'background 0.12s, border-color 0.12s',
                  }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; } }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ padding: '0.3rem', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>
                      <Film size={13} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 6 }}>
                          {displayName}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', flexShrink: 0 }}>
                          <Clock size={9} />
                          <span>{clip.duration.toFixed(1)}s</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: 3 }}>
                          {clip.type}
                        </span>
                        <div style={{ display: 'flex', gap: 3 }} onClick={e => e.stopPropagation()}>
                          {iconBtn(e => { e.stopPropagation(); handlePlayClip(clip); }, <Play size={10} />, 'Play')}
                          {iconBtn(e => { e.stopPropagation(); onAddToTimeline?.(clip.id); }, <Plus size={10} />, 'Add to timeline')}
                          {iconBtn(e => { e.stopPropagation(); handleDeleteClip(clip.id); }, <Trash2 size={10} />, 'Delete')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats footer */}
      <div style={{ padding: '0.5rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)' }}>
          <span>Total Clips: <span style={{ color: 'rgba(255,255,255,0.6)' }}>{clips.length}</span></span>
          <span>Duration: <span style={{ color: 'rgba(255,255,255,0.6)' }}>{clips.reduce((a, c) => a + c.duration, 0).toFixed(1)}s</span></span>
        </div>
      </div>
    </div>
  );
};
