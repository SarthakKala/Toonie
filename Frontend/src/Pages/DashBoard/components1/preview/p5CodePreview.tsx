import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";

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

const BASE_CANVAS_WIDTH = 600;
const BASE_CANVAS_HEIGHT = 450;
const DISPLAY_CANVAS_WIDTH = 850;
const DISPLAY_CANVAS_HEIGHT = 580;

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

    console.log('----------------------------------------');
    console.log('Creating sketch with code:');
    console.log(code);
    console.log('----------------------------------------');

    try {
      let sketchFunction;
      
      // Check if code contains a complete sketch function
      if (code.includes('const sketch') || code.includes('function sketch')) {
        console.log('Using existing sketch function from code');
        // Execute the code to get the sketch function
        sketchFunction = new Function(`${code}\nreturn sketch;`)();
      } else {
        console.log('Wrapping code in sketch function');
        // Wrap the code in a sketch function
        sketchFunction = new Function("p", code);
      }
      
      // Create wrapper to capture canvas
      const wrappedSketch = (p: any) => {
        // Call original sketch function and get result
        console.log('Executing sketch function');
        const result = sketchFunction(p);
        console.log('Sketch function result:', result);
        
        // Handle both object-style and direct assignment
        let setupFunc = result?.setup || p.setup;
        let drawFunc = result?.draw || p.draw;

        console.log('Found setup function:', !!setupFunc);
        console.log('Found draw function:', !!drawFunc);
        
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

              // Scale preview canvas for better on-screen visibility.
              canvas.style.width = `${DISPLAY_CANVAS_WIDTH}px`;
              canvas.style.height = `${DISPLAY_CANVAS_HEIGHT}px`;
              canvas.style.backgroundColor = '#161616';
              
              // Ensure canvas has proper size
              if (canvas.width === 0 || canvas.height === 0) {
                console.warn('Canvas has zero dimensions, setting default size');
                canvas.width = BASE_CANVAS_WIDTH;
                canvas.height = BASE_CANVAS_HEIGHT;
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
            p.background(22, 22, 22);
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
      if (e instanceof Error) {
        console.error("Error details:", {
          message: e.message,
          stack: e.stack,
          code: code.substring(0, 200) + '...' // First 200 chars of code
        });
      } else {
        console.error("Error details:", {
          message: String(e),
          stack: undefined,
          code: code.substring(0, 200) + '...' // First 200 chars of code
        });
      }
      
      
      // Fallback sketch that definitely creates a canvas
      const fallbackSketch = (p: any) => {
        p.setup = () => {
          console.log('Fallback setup called');
          p.createCanvas(BASE_CANVAS_WIDTH, BASE_CANVAS_HEIGHT);
          
          setTimeout(() => {
            const canvas = sketchRef.current?.querySelector('canvas');
            if (canvas) {
              canvasRef.current = canvas as HTMLCanvasElement;
              console.log('Fallback canvas captured:', canvas);
            }
          }, 100);
        };
        
        p.draw = () => {
          p.background(22, 22, 22);
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
        width: `${DISPLAY_CANVAS_WIDTH}px`, 
        height: `${DISPLAY_CANVAS_HEIGHT}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#161616'
      }} 
    />
  );
});

P5CodePreview.displayName = 'P5CodePreview';

export default P5CodePreview;