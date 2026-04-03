import { useRef, useCallback, useState } from 'react';
import { Muxer, ArrayBufferTarget } from 'webm-muxer';

interface RecordingOptions {
  duration?: number;
  frameRate?: number;
  width?: number;
  height?: number;
}

export const useVideoRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const cancelRef = useRef(false);

  const startRecording = useCallback(async (
    canvas: HTMLCanvasElement,
    options: RecordingOptions = {}
  ): Promise<Blob> => {
    const { duration = 10000, frameRate = 60 } = options;
    const totalFrames = Math.ceil((duration / 1000) * frameRate);
    const frameDuration = 1_000_000 / frameRate; // microseconds per frame

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Invalid canvas for recording');
    }

    // Check VideoEncoder support
    if (typeof VideoEncoder === 'undefined') {
      throw new Error('VideoEncoder API is not supported in this browser. Please use Chrome 94+.');
    }

    return new Promise((resolve, reject) => {
      try {
        cancelRef.current = false;
        setIsRecording(true);
        setRecordingProgress(0);

        const muxer = new Muxer({
          target: new ArrayBufferTarget(),
          video: {
            codec: 'V_VP9',
            width: canvas.width,
            height: canvas.height,
            frameRate,
          },
          firstTimestampBehavior: 'offset',
        });

        const encoder = new VideoEncoder({
          output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
          error: (e) => reject(e),
        });

        encoder.configure({
          codec: 'vp09.00.10.08',
          width: canvas.width,
          height: canvas.height,
          bitrate: 10_000_000,
          framerate: frameRate,
        });

        let frameCount = 0;

        const captureFrame = async () => {
          if (cancelRef.current) {
            encoder.close();
            setIsRecording(false);
            setRecordingProgress(0);
            reject(new Error('Recording cancelled'));
            return;
          }

          if (frameCount >= totalFrames) {
            // All frames captured — finalize
            try {
              await encoder.flush();
              muxer.finalize();
              const { buffer } = muxer.target as ArrayBufferTarget;
              const blob = new Blob([buffer], { type: 'video/webm' });
              setIsRecording(false);
              setRecordingProgress(0);
              resolve(blob);
            } catch (e) {
              reject(e);
            }
            return;
          }

          // Capture the current canvas state as a video frame
          try {
            const videoFrame = new VideoFrame(canvas, {
              timestamp: Math.round(frameCount * frameDuration),
            });
            encoder.encode(videoFrame, { keyFrame: frameCount % frameRate === 0 });
            videoFrame.close();
          } catch (e) {
            // If frame capture fails mid-recording, skip and continue
            console.warn('Frame capture failed, skipping:', e);
          }

          frameCount++;
          setRecordingProgress((frameCount / totalFrames) * 100);

          // Schedule next frame capture in sync with display refresh
          requestAnimationFrame(captureFrame);
        };

        requestAnimationFrame(captureFrame);

      } catch (error) {
        setIsRecording(false);
        reject(error);
      }
    });
  }, []);

  const stopRecording = useCallback(() => {
    cancelRef.current = true;
  }, []);

  return {
    isRecording,
    recordingProgress,
    startRecording,
    stopRecording,
  };
};
