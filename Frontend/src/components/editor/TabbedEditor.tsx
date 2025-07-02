import React, { useState } from 'react';
import { Code, Video, Play, Download, Settings } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { VideoEditor } from '../video/VideoEditor';
import { VideoClip, EditorMode } from '../../types/video';

interface TabbedEditorProps {
  // Code Editor Props
  files: { name: string; content: string }[];
  activeFile: { name: string; content: string };
  onFileSelect: (file: { name: string; content: string }) => void;
  onFileUpdate?: (file: { name: string; content: string }) => void;
  onRunCode: () => void;
  
  // Video Editor Props
  clips: VideoClip[];
  onClipSelect: (clip: VideoClip) => void;
  onClipUpdate: (clip: VideoClip) => void;
  onExport: () => void;
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
  onExport
}) => {
  const [editorMode, setEditorMode] = useState<EditorMode>('code');

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header with Tab Selection */}
      <div className="h-14 bg-gray-800 border-b border-gray-600 flex items-center justify-between px-4">
        {/* Left - Tab Selection */}
        <div className="flex items-center space-x-1 bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setEditorMode('code')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all text-sm font-medium ${
              editorMode === 'code'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Code Editor</span>
          </button>
          
          <button
            onClick={() => setEditorMode('video')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all text-sm font-medium ${
              editorMode === 'video'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Editor</span>
          </button>
        </div>

        {/* Center - Mode Description */}
        <div className="text-sm text-gray-400">
          {editorMode === 'code' 
            ? 'Write and edit your p5.js animations' 
            : 'Compose and timeline your video clips'
          }
        </div>

        {/* Right - Action Buttons */}
        <div className="flex items-center space-x-2">
          {editorMode === 'code' ? (
            <>
              <button
                onClick={onRunCode}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium text-white transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Run Code</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onExport}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Video</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        {editorMode === 'code' ? (
          <CodeEditor 
            files={files}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
            onFileUpdate={onFileUpdate}
            onRunCode={onRunCode}
          />
        ) : (
          <VideoEditor
            clips={clips}
            onClipSelect={onClipSelect}
            onClipUpdate={onClipUpdate}
            onExport={onExport}
          />
        )}
      </div>
    </div>
  );
};