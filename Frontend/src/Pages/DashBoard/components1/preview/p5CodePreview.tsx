import React, { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";

declare global {
  interface Window {
    p5?: any;
  }
}

interface P5CodePreviewProps {
  code: string;
}

export interface P5CodePreviewRef {
  getCanvas: () => HTMLCanvasElement | null;
  restart: () => void;
}

const P5CodePreview = forwardRef<P5CodePreviewRef, P5CodePreviewProps>(({ code }, ref) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useImperativeHandle(ref, () => ({
    getCanvas: () => {
      // Try multiple ways to get the canvas
      if (canvasRef.current) {
        console.log('Canvas found via ref:', canvasRef.current);
        return canvasRef.current;
      }
      
      // Fallback: search in the sketch container
      const canvas = sketchRef.current?.querySelector('canvas');
      if (canvas) {
        console.log('Canvas found via querySelector:', canvas);
        canvasRef.current = canvas as HTMLCanvasElement;
        return canvasRef.current;
      }
      
      console.warn('No canvas found');
      return null;
    },
    restart: () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
        canvasRef.current = null;
      }
      // Small delay to ensure cleanup
      setTimeout(() => {
        createSketch();
      }, 100);
    }
  }), []);

  const createSketch = useCallback(() => {
    if (!window.p5 || !sketchRef.current) {
      console.log('P5 not loaded or ref not ready');
      return;
    }

    try {
      let sketchFunction;
      
      // Check if code contains a complete sketch function
      if (code.includes('const sketch') || code.includes('function sketch')) {
        // Execute the code to get the sketch function
        sketchFunction = new Function(`${code}\nreturn sketch;`)();
      } else {
        // Wrap the code in a sketch function
        sketchFunction = new Function("p", code);
      }
      
      // Create wrapper to capture canvas
      const wrappedSketch = (p: any) => {
        // Call original sketch function and get result
        const result = sketchFunction(p);
        
        // Handle both object-style and direct assignment
        let setupFunc = result?.setup || p.setup;
        let drawFunc = result?.draw || p.draw;
        
        // Wrap setup to capture canvas
        const originalSetup = setupFunc;
        p.setup = () => {
          console.log('Setup called');
          
          if (originalSetup) {
            originalSetup.call(p);
          } else {
            // Default setup if none provided
            p.createCanvas(600, 450);
          }
          
          // Multiple attempts to capture canvas
          const captureCanvas = () => {
            const canvas = sketchRef.current?.querySelector('canvas');
            if (canvas) {
              canvasRef.current = canvas as HTMLCanvasElement;
              console.log('Canvas captured successfully:', canvas);
              console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
              
              // Ensure canvas has proper size
              if (canvas.width === 0 || canvas.height === 0) {
                console.warn('Canvas has zero dimensions, setting default size');
                canvas.width = 600;
                canvas.height = 450;
              }
            } else {
              console.warn('Canvas not found in setup');
            }
          };
          
          // Try immediately and with delays
          captureCanvas();
          setTimeout(captureCanvas, 50);
          setTimeout(captureCanvas, 200);
        };
        
        // Ensure draw exists
        if (drawFunc) {
          p.draw = drawFunc;
        } else if (!p.draw) {
          p.draw = () => {
            p.background(220);
            p.fill(50);
            p.textAlign(p.CENTER, p.CENTER);
            p.text('Animation running...', p.width/2, p.height/2);
          };
        }
      };
      
      p5Instance.current = new window.p5(wrappedSketch, sketchRef.current);
      console.log('P5 instance created successfully');
      
    } catch (e) {
      console.error("Error creating p5 sketch:", e);
      
      // Fallback sketch that definitely creates a canvas
      const fallbackSketch = (p: any) => {
        p.setup = () => {
          console.log('Fallback setup called');
          p.createCanvas(600, 450);
          
          setTimeout(() => {
            const canvas = sketchRef.current?.querySelector('canvas');
            if (canvas) {
              canvasRef.current = canvas as HTMLCanvasElement;
              console.log('Fallback canvas captured:', canvas);
            }
          }, 100);
        };
        
        p.draw = () => {
          p.background(220, 100, 100);
          p.fill(255);
          p.textAlign(p.CENTER, p.CENTER);
          p.text('Error in code - using fallback', p.width/2, p.height/2);
        };
      };
      
      p5Instance.current = new window.p5(fallbackSketch, sketchRef.current);
    }
  }, [code]);

  useEffect(() => {
    // Clean up previous instance
    if (p5Instance.current) {
      p5Instance.current.remove();
      p5Instance.current = null;
      canvasRef.current = null;
    }
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(createSketch, 100);
    
    return () => {
      clearTimeout(timer);
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, [createSketch]);

  return (
    <div 
      ref={sketchRef} 
      style={{ 
        width: '600px', 
        height: '450px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#222'
      }} 
    />
  );
});

P5CodePreview.displayName = 'P5CodePreview';

export default P5CodePreview;