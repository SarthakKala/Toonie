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
      <h1>Sketch</h1>
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
`# Getting Started with p5.js in React

## Project Setup Instructions

### 1. Install Required Dependencies
\`\`\`bash
npm install p5 @types/p5
\`\`\`

### 2. Understanding the Files

#### Sketch.tsx
This file creates a React component that wraps a p5.js sketch:
- A ref (\`sketchRef\`) holds the div where p5 will be mounted
- The useEffect hook initializes p5 and cleans up on unmount
- The sketch function contains your actual p5.js code

#### main.tsx
This file renders the Sketch component within your React application:
- Imports and mounts the Sketch component
- Provides a basic layout for your p5.js sketch

### 3. How to Use the Sketch.tsx File

1. **Add your p5.js code** within the sketch function:
\`\`\`typescript
const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(400, 400);
  };
  
  p.draw = () => {
    p.background(220);
    p.ellipse(p.width/2, p.height/2, 50, 50);
  };
};
\`\`\`

2. **Customize the canvas** by adjusting parameters in \`createCanvas()\`

3. **Access the p5 instance** through the \`p\` parameter in your functions

### 4. p5.js General Tips

- The \`setup()\` function runs once when the sketch starts
- The \`draw()\` function runs continuously in a loop
- Use p5's built-in variables like \`p.width\`, \`p.height\`, \`p.mouseX\`, \`p.mouseY\`
- Common methods:
  - \`p.background(color)\`: Clears the canvas with a color
  - \`p.fill(color)\`: Sets fill color for shapes
  - \`p.stroke(color)\`: Sets outline color
  - \`p.noStroke()\`: Removes outlines
  - \`p.ellipse(x, y, w, h)\`: Draws an ellipse
  - \`p.rect(x, y, w, h)\`: Draws a rectangle

### 5. Handling Props

To make your Sketch component more versatile, you can pass props:
\`\`\`typescript
// In Sketch.tsx
const Sketch: React.FC<{ bgColor?: number }> = ({ bgColor = 220 }) => {
  // ...
  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(400, 400);
    };
    
    p.draw = () => {
      p.background(bgColor);
      // Rest of your code...
    };
  };
  // ...
}

// In main.tsx, you can then use:
<Sketch bgColor={100} />
\`\`\`

### 6. Troubleshooting

- If the canvas doesn't appear, check if the div has proper dimensions
- For responsive canvases, use \`p.windowResized\` function
- Add \`console.log\` statements to debug your sketch

Enjoy creating amazing animations with p5.js and React!`
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