import { useState, useCallback } from 'react';
import { CodeFile } from '../types';

const DEFAULT_FILES: CodeFile[] = [
  {
    id: '1',
    name: 'App.tsx',
    language: 'typescript',
    content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to your React App</h1>
        <p>Start building something amazing!</p>
      </header>
    </div>
  );
}

export default App;`
  },
  {
    id: '2',
    name: 'components/Header.tsx',
    language: 'typescript',
    content: `import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
    </header>
  );
};

export default Header;`
  },
  {
    id: '3',
    name: 'styles/main.css',
    language: 'css',
    content: `/* Main styles */
.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
}

.header {
  padding: 1rem;
  background: #f0f0f0;
  border-bottom: 1px solid #ddd;
}`
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