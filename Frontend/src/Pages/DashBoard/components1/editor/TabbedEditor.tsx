  import React, { useState,useEffect } from "react";
  import { Code, Video, Play, Download, Settings, Monitor } from "lucide-react";
  import { CodeEditor } from "./CodeEditor";
  import { VideoEditor } from "../video/VideoEditor";
  import { CurrentClipPreview } from "../preview/CurrentClipPreview";
  import { VideoClip, EditorMode } from "../../types/video";
  import { CodeFile } from "../../types";

  import { useCodeStore } from '@/codeStore';
  
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

     // Get generated code from store
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

          const updatedFile = {
            ...activeFile,
            content: newContent
          };
          
          onFileUpdate(updatedFile);
        }
      }
    }, [code, activeFile, onFileUpdate]);

    
    const handleNewFile = () => {
      const newFile = {
        id: Date.now().toString(),
        name: 'Sketch.tsx',
        language: 'typescript',
        content: code || '// Your p5.js animation code here\n',
      };
      
      if (onFileUpdate) {
        onFileUpdate(newFile);
      }
    };

    const handleMoveToVideoEditor = () => {
      setEditorMode("video");
      if (onMoveToVideoEditor) {
        onMoveToVideoEditor();
      }
    };
  
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: '#161616' }}>
        {/* Header with Tab Selection */}
        <div className="h-14 border-b border-gray-600 flex items-center justify-between px-4" style={{ backgroundColor: '#000000' }}>
          {/* Left - Tab Selection (Icon Only) */}
          <div className="flex items-center space-x-1 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setEditorMode("code")}
              className={`p-3 rounded-md transition-all ${
                editorMode === "code"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "hover:bg-gray-600"
              }`}
              style={{ 
                color: editorMode === "code" ? '#ffffff' : '#FAF9F6'
              }}
              title="Code Editor"
            >
              <Code className="w-5 h-5" />
            </button>
  
            <button
              onClick={() => setEditorMode("preview")}
              className={`p-3 rounded-md transition-all ${
                editorMode === "preview"
                  ? "bg-orange-600 text-white shadow-sm"
                  : "hover:bg-gray-600"
              }`}
              style={{ 
                color: editorMode === "preview" ? '#ffffff' : '#FAF9F6'
              }}
              title="Preview"
            >
              <Monitor className="w-5 h-5" />
            </button>
  
            <button
              onClick={() => setEditorMode("video")}
              className={`p-3 rounded-md transition-all ${
                editorMode === "video"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "hover:bg-gray-600"
              }`}
              style={{ 
                color: editorMode === "video" ? '#ffffff' : '#FAF9F6'
              }}
              title="Video Editor"
            >
              <Video className="w-5 h-5" />
            </button>
          </div>
  
          {/* Center - Mode Description */}
          <div className="hidden lg:block text-sm" style={{ color: '#9CA3AF' }}>
            {editorMode === "code" && "Write and edit your p5.js animations"}
            {editorMode === "preview" && "Preview your animation before adding to timeline"}
            {editorMode === "video" && "Compose and timeline your video clips"}
          </div>
  
          {/* Right - Action Buttons */}
          <div className="flex items-center space-x-2">
            {editorMode === "code" && (
              <>
                <button
                  onClick={onRunCode}
                  className="p-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  style={{ color: '#ffffff' }}
                  title="Run Code"
                >
                  <Play className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setEditorMode("preview")}
                  className="p-3 hover:bg-gray-700 rounded-lg transition-colors"
                  style={{ color: '#FAF9F6' }}
                  title="Preview Animation"
                >
                  <Monitor className="w-5 h-5" />
                </button>
              </>
            )}
            
            {editorMode === "video" && (
              <>
                <button
                  onClick={onExport}
                  className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  style={{ color: '#ffffff' }}
                  title="Export Video"
                >
                  <Download className="w-5 h-5" />
                </button>
              </>
            )}
            
            <button 
              className="p-3 hover:bg-gray-700 rounded-lg transition-colors"
              style={{ color: '#FAF9F6' }}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
  
        {/* Editor Content */}
        <div className="flex-1 overflow-hidden">
          {editorMode === "code" && (
          <>
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
            {explanation && (
              <div className="border-t border-gray-600 bg-gray-800 p-4">
                <h3 className="text-sm font-medium text-white mb-2">AI Explanation</h3>
                <p className="text-sm text-gray-300">{explanation}</p>
              </div>
            )}
          </>
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