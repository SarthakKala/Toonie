import React, { useEffect, useRef } from "react";

interface P5CodePreviewProps {
  code: string;
}

const P5CodePreview: React.FC<P5CodePreviewProps> = ({ code }) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<any>(null);

  useEffect(() => {
    if (!window.p5) return;
    if (p5Instance.current) {
      p5Instance.current.remove();
    }

    try {
      // Check if code is already wrapped in a function
      let sketchFn;
      
      if (code.trim().startsWith('const sketch') || code.trim().startsWith('function sketch')) {
        // Code is already a sketch function, evaluate it and get the function
        // eslint-disable-next-line no-new-func
        const evalCode = new Function(`
          ${code}
          return sketch;
        `)();
        sketchFn = evalCode;
      } else {
        // Direct instance mode code, wrap it in a function
        // eslint-disable-next-line no-new-func
        sketchFn = new Function("p", code);
      }
      
      // Create the p5 instance with our sketch function
      p5Instance.current = new window.p5(sketchFn, sketchRef.current);
    } catch (e) {
      console.error("Error creating p5 sketch:", e);
    }
    
    return () => {
      if (p5Instance.current) p5Instance.current.remove();
    };
  }, [code]);

  return <div ref={sketchRef} style={{ width: 600, height: 450 }} />;
};

export default P5CodePreview;