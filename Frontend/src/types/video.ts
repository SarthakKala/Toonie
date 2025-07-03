// Frontend/src/types/video.ts
export interface VideoClip {
  id: string;
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
  type: 'animation' | 'audio' | 'text';
  content: string;
  thumbnail?: string;
}

export interface TimelineTrack {
  id: string;
  name: string;
  clips: VideoClip[];
  isLocked: boolean;
  isVisible: boolean;
}

export type EditorMode = 'code' | 'preview' | 'video';