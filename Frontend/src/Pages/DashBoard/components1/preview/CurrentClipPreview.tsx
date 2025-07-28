import React, {useState, useEffect} from 'react';
import { Download, ArrowRight, Settings, Maximize, X } from 'lucide-react';
import { CodeFile } from '../../types';
import P5CodePreview from "./P5CodePreview";
import { useCodeStore } from "@/codeStore";

interface CurrentClipPreviewProps {
  activeFile: CodeFile;
  onExportClip: () => void;
  onMoveToVideoEditor: () => void;
}

export const CurrentClipPreview: React.FC<CurrentClipPreviewProps> = ({
  activeFile,
  onExportClip,
  onMoveToVideoEditor
}) => {
  const code = useCodeStore(state => state.code);
  const [isMaximized, setIsMaximized] = useState(false);
  
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
  
  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="h-12 bg-gray-800 border-b border-gray-600 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-sm font-medium text-white">Current Clip Preview</span>
          <span className="text-xs text-gray-400">({activeFile.name})</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onExportClip}
            className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-xs font-medium text-white transition-colors"
            title="Export as standalone clip"
          >
            <Download className="w-3 h-3" />
            <span>Export</span>
          </button>
          <button
            onClick={onMoveToVideoEditor}
            className="flex items-center space-x-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-xs font-medium text-white transition-colors"
            title="Move to Video Editor"
          >
            <ArrowRight className="w-3 h-3" />
            <span>To Video Editor</span>
          </button>
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4 bg-black">
        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-700">
          <P5CodePreview code={code} />
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
      </div>

      {/* Fullscreen Modal (appears when maximized) */}
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