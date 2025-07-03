  // Frontend/src/components/editor/TabbedEditor.tsx
  import React, { useState } from "react";
  import { Code, Video, Play, Download, Settings, Monitor } from "lucide-react";
  import { CodeEditor } from "./CodeEditor";
  import { VideoEditor } from "../video/VideoEditor";
  import { CurrentClipPreview } from "../preview/CurrentClipPreview";
  import { VideoClip, EditorMode } from "../../types/video";
  import { CodeFile } from "../../types";

  interface TabbedEditorProps {
    // Code Editor Props
    files: CodeFile[];
    activeFile: CodeFile;
    onFileSelect: (file: CodeFile) => void;
    onFileUpdate?: (file: CodeFile) => void;
    onRunCode: () => void;

    // Video Editor Props
    clips: VideoClip[];
    onClipSelect: (clip: VideoClip) => void;
    onClipUpdate: (clip: VideoClip) => void;
    onExport: () => void;
    
    // Preview Props
    onExportClip?: () => void;
    onMoveToVideoEditor?: () => void;
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
  }) => {
    const [editorMode, setEditorMode] = useState<EditorMode>("code");

    const handleMoveToVideoEditor = () => {
      setEditorMode("video");
      if (onMoveToVideoEditor) {
        onMoveToVideoEditor();
      }
    };

    return (
      <div className="h-full flex flex-col bg-gray-900">
        {/* Header with Tab Selection */}
        <div className="h-14 bg-gray-800 border-b border-gray-600 flex items-center justify-between px-4">
          {/* Left - Tab Selection (Icon Only) */}
          <div className="flex items-center space-x-1 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setEditorMode("code")}
              className={`p-3 rounded-md transition-all ${
                editorMode === "code"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-gray-600"
              }`}
              title="Code Editor"
            >
              <Code className="w-5 h-5" />
            </button>

            <button
              onClick={() => setEditorMode("preview")}
              className={`p-3 rounded-md transition-all ${
                editorMode === "preview"
                  ? "bg-orange-600 text-white shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-gray-600"
              }`}
              title="Preview"
            >
              <Monitor className="w-5 h-5" />
            </button>

            <button
              onClick={() => setEditorMode("video")}
              className={`p-3 rounded-md transition-all ${
                editorMode === "video"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-gray-600"
              }`}
              title="Video Editor"
            >
              <Video className="w-5 h-5" />
            </button>
          </div>

          {/* Center - Mode Description (Optional, can be hidden on smaller screens) */}
          <div className="hidden lg:block text-sm text-gray-400">
            {editorMode === "code" && "Write and edit your p5.js animations"}
            {editorMode === "preview" && "Preview your animation before adding to timeline"}
            {editorMode === "video" && "Compose and timeline your video clips"}
          </div>

          {/* Right - Action Buttons (Icon Only) */}
          <div className="flex items-center space-x-2">
            {editorMode === "code" && (
              <>
                <button
                  onClick={onRunCode}
                  className="p-3 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                  title="Run Code"
                >
                  <Play className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setEditorMode("preview")}
                  className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  title="Preview Animation"
                >
                  <Monitor className="w-5 h-5" />
                </button>
              </>
            )}
            
            {/* REMOVED THE EXPORT BUTTON FROM PREVIEW MODE - IT'S HANDLED IN CurrentClipPreview COMPONENT */}
            
            {editorMode === "video" && (
              <>
                <button
                  onClick={onExport}
                  className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                  title="Export Video"
                >
                  <Download className="w-5 h-5" />
                </button>
              </>
            )}
            
            <button 
              className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-hidden">
          {editorMode === "code" && (
            <CodeEditor
              files={files}
              activeFile={activeFile}
              onFileSelect={onFileSelect}
              onFileUpdate={onFileUpdate}
              onRunCode={onRunCode}
              onNewFile={() => {
                console.log("Create new file");
              }}
            />
          )}
          
          {editorMode === "preview" && (
            <CurrentClipPreview
              activeFile={activeFile}
              onExportClip={onExportClip || (() => console.log("Export clip"))}
              onMoveToVideoEditor={handleMoveToVideoEditor}
            />
          )}
          
          {editorMode === "video" && (
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