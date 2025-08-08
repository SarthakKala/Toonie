import React, { useState, useEffect, useRef } from 'react';
import { Download, ArrowRight, Settings, Maximize, X, Loader, Video, Square } from 'lucide-react';
import { CodeFile } from '../../types';
import P5CodePreview, { P5CodePreviewRef } from "./p5CodePreview";
import { useCodeStore } from "@/codeStore";
import { useVideoRecording } from '../../hooks/useVideoRecording';
import { clipStorage, generateThumbnail } from "../../../../utils/clipStorage";

interface CurrentClipPreviewProps {
  activeFile: CodeFile;
  onExportClip: (clipData: { blob: Blob; name: string; duration: number }) => void;
  onMoveToVideoEditor: (clipId?: string) => void; // Pass clipId when moving to video editor
  isLoading?: boolean;
}

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
  
  // Prevent scrolling when maximized
  useEffect(() => {
    if (isMaximized) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMaximized]);

  // Record and Download directly
  const handleRecordAndDownload = async () => {
    const blob = await recordAnimation();
    if (!blob) return;

    // Generate clip name and download
    const clipName = `${activeFile.name.replace('.tsx', '')}_animation`;
    
    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clipName}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert(`✅ Animation downloaded as "${clipName}.webm"!`);
  };

  // Record and Move to Video Editor
  const handleRecordAndMoveToVideoEditor = async () => {
    const blob = await recordAnimation();
    if (!blob) return;

    setIsSaving(true);
    
    try {
      console.log('Generating thumbnail...');
      const thumbnail = await generateThumbnail(blob);
      
      console.log('Saving clip to IndexedDB...');
      const clipName = `${activeFile.name.replace('.tsx', '')} Animation`;
      
      const clipId = await clipStorage.saveClip({
        name: clipName,
        duration: recordingDuration,
        blob: blob,
        thumbnail: thumbnail,
        tags: ['p5js', 'animation'],
        description: `Generated from ${activeFile.name}`
      });
      
      console.log('Clip saved with ID:', clipId);
      
      // Move to video editor with the new clip
      onMoveToVideoEditor(clipId);
      
      alert(`✅ Clip "${clipName}" saved and added to video editor!`);
      
    } catch (saveError) {
      console.error('Failed to save clip:', saveError);
      alert('Failed to save clip to library. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Shared recording logic
  const recordAnimation = async (): Promise<Blob | null> => {
    const canvas = p5PreviewRef.current?.getCanvas();
    if (!canvas) {
      alert('Canvas not ready for recording. Please wait for the animation to load.');
      return null;
    }
    
    if (canvas.width === 0 || canvas.height === 0) {
      alert('Canvas has invalid dimensions. Please refresh and try again.');
      return null;
    }

    try {
      console.log('Restarting animation for clean recording...');
      p5PreviewRef.current?.restart();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const freshCanvas = p5PreviewRef.current?.getCanvas();
      if (!freshCanvas) {
        throw new Error('Canvas lost after restart');
      }
      
      const blob = await startRecording(freshCanvas, {
        duration: recordingDuration * 1000,
        frameRate: 30
      });
      
      if (blob.size === 0) {
        throw new Error('Recorded video has no content');
      }
      
      return blob;
      
    } catch (error) {
      console.error('Recording failed:', error);
      alert(`Recording failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  };

  const handleStopRecording = () => {
    stopRecording();
  };
  
  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="h-12 bg-gray-800 border-b border-gray-600 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-sm font-medium text-white">Current Clip Preview</span>
          <span className="text-xs text-gray-400">({activeFile.name})</span>
          {isRecording && (
            <span className="text-xs text-orange-400">
              Recording... {recordingProgress.toFixed(0)}%
            </span>
          )}
          {isSaving && (
            <span className="text-xs text-blue-400">
              Saving clip...
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {/* Recording Duration Input */}
          <div className="flex items-center space-x-2 mr-2">
            <input
              type="number"
              value={recordingDuration}
              onChange={(e) => setRecordingDuration(Math.max(1, parseInt(e.target.value) || 5))}
              className="w-16 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
              min="1"
              max="30"
              disabled={isRecording || isSaving}
            />
            <span className="text-xs text-gray-400">sec</span>
          </div>
          
          {/* Recording Controls */}
          {!isRecording ? (
            <>
              {/* Record & Download Button */}
              <button
                onClick={handleRecordAndDownload}
                className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-xs font-medium text-white transition-colors"
                title="Record and Download"
                disabled={isLoading || isSaving}
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>

              {/* Record & Move to Video Editor Button */}
              <button
                onClick={handleRecordAndMoveToVideoEditor}
                className="flex items-center space-x-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-xs font-medium text-white transition-colors"
                title="Record and Move to Video Editor"
                disabled={isLoading || isSaving}
              >
                <ArrowRight className="w-3 h-3" />
                <span>{isSaving ? 'Saving...' : 'To Video Editor'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleStopRecording}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 rounded text-xs font-medium text-white transition-colors"
              title="Stop Recording"
            >
              <Square className="w-3 h-3" />
              <span>Stop</span>
            </button>
          )}
          
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recording Progress Bar */}
      {isRecording && (
        <div className="h-1 bg-gray-700">
          <div 
            className="h-full bg-red-500 transition-all duration-100"
            style={{ width: `${recordingProgress}%` }}
          />
        </div>
      )}

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4 bg-black">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader className="w-10 h-10 text-white animate-spin" />
            <p className="text-white text-sm">Generating animation...</p>
          </div>
        ) : (
          <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-700">
            <P5CodePreview ref={p5PreviewRef} code={code} />
            
            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-2 left-2 flex items-center space-x-2 bg-red-600 px-2 py-1 rounded text-white text-xs">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span>REC {Math.ceil((100 - recordingProgress) * recordingDuration / 100)}s</span>
              </div>
            )}
            
            {/* Overlay Controls */}
            <div className="absolute top-2 right-2 flex space-x-1 z-10">
              <button
                className="p-1.5 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-75 transition-colors"
                onClick={() => setIsMaximized(true)}
                title="Maximize"
              >
                <Maximize className="w-3 h-3" />
              </button>
            </div>
            {/* Resolution Info */}
            <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
              600x450
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isMaximized && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-[90vw] h-[80vh] bg-black rounded-lg overflow-hidden border border-gray-700">
            <P5CodePreview code={code} />
            <button
              className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
              onClick={() => setIsMaximized(false)}
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
              600x450 (Fullscreen View)
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Footer */}
      <div className="h-10 bg-gray-850 border-t border-gray-700 flex items-center justify-between px-4 text-xs text-gray-400 flex-shrink-0">
        <span>Preview updates automatically when code changes</span>
        <div className="flex items-center space-x-4">
          <span>Quality: Preview</span>
          <span>FPS: 60</span>
        </div>
      </div>
    </div>
  );
};