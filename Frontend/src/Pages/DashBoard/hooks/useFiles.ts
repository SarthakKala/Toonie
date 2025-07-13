import { useState, useCallback } from 'react';
import { CodeFile } from '../types';

const DEFAULT_FILES: CodeFile[] = [
  {
    id: '1',
    name: 'Sketch.tsx',
    language: 'typescript',
    content: 
`import React, { useRef, useEffect } from "react";
import p5 from "p5";

const Sketch: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
        // Replace this with your custom animation code
      };
    };

    const myP5 = new p5(sketch, sketchRef.current!);

    return () => {
      myP5.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default Sketch;`
  },


  {
    id: '2',
    name: 'main.tsx',
    language: 'typescript',
    content: 
`import React from "react";
import ReactDOM from "react-dom/client";
import Sketch from "./Sketch";

const App: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>My p5.js Sketch</h1>
      <Sketch />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);`
  },


  {
    id: '3',
    name: 'instructions.txt',
    language: 'txt',
    content:
`Welcome to the project!
This will contain all the instructions you need to get started.`
  }
];

export const useFiles = () => {
  const [files, setFiles] = useState<CodeFile[]>(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState<CodeFile>(DEFAULT_FILES[0]);

  const updateFile = useCallback((fileId: string, newContent: string) => {
    setFiles(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, content: newContent }
          : file
      )
    );
    
    if (activeFile.id === fileId) {
      setActiveFile(prev => ({ ...prev, content: newContent }));
    }
  }, [activeFile.id]);

  const addFile = useCallback((file: Omit<CodeFile, 'id'>) => {
    const newFile: CodeFile = {
      ...file,
      id: Date.now().toString()
    };
    setFiles(prev => [...prev, newFile]);
    return newFile;
  }, []);

  const deleteFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    if (activeFile.id === fileId && files.length > 1) {
      const remainingFiles = files.filter(file => file.id !== fileId);
      setActiveFile(remainingFiles[0]);
    }
  }, [activeFile.id, files]);

  return {
    files,
    activeFile,
    setActiveFile,
    updateFile,
    addFile,
    deleteFile
  };
};