import React, { useEffect, useRef, forwardRef } from "react";

interface P5CodePreviewProps {
  code: string;
}

const SimplifiedP5Preview = forwardRef<any, P5CodePreviewProps>(({ code }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<any>(null);

  useEffect(() => {
    // Clean up previous instance
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
    }

    if (!window.p5 || !containerRef.current) return;

    try {
      console.log("Creating p5 sketch with code:", code);
      
      // Create a sketch function that uses the provided code
      const createSketch = (p: any) => {
        // Try to evaluate the code to extract setup and draw
        try {
          // Create a function from the code string
          const userSketch = new Function('p', `
            try {
              ${code}
              return { hasCode: true };
            } catch(e) {
              console.error("Error in user code:", e);
              return { hasError: true, error: e };
            }
          `);
          
          // Call the function with p
          const result = userSketch(p);
          
          if (result.hasError) {
            throw new Error("Error executing user code: " + result.error);
          }
          
          // If no setup function defined, create a default one
          if (!p.setup) {
            p.setup = function() {
              console.log("Using default setup");
              p.createCanvas(600, 450);
            };
          }
          
          // If no draw function defined, create a default one
          if (!p.draw) {
            p.draw = function() {
              console.log("Using default draw");
              p.background(220);
              p.fill(50);
              p.textSize(16);
              p.textAlign(p.CENTER, p.CENTER);
              p.text('Animation running...', p.width/2, p.height/2);
            };
          }
        } catch (e) {
          console.error("Error setting up sketch:", e);
          
          // Override with error display
          p.setup = function() {
            p.createCanvas(600, 450);
          };
          
          p.draw = function() {
            p.background(255, 200, 200);
            p.fill(50);
            p.textSize(16);
            p.textAlign(p.CENTER, p.CENTER);
            p.text('Error: ' + (e instanceof Error ? e.message : String(e)), p.width/2, p.height/2);
          };
        }
      };

      p5InstanceRef.current = new window.p5(createSketch, containerRef.current);
    } catch (e) {
      console.error("Failed to initialize p5:", e);
    }

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
    };
  }, [code]);

  return (
    <div 
      ref={containerRef}
      style={{ width: '600px', height: '450px', background: '#222' }}
    />
  );
});

SimplifiedP5Preview.displayName = 'SimplifiedP5Preview';

export default SimplifiedP5Preview;