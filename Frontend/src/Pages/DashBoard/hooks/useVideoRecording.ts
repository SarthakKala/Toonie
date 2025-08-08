import { useRef, useCallback, useState } from 'react';

interface RecordingOptions {
  duration?: number;
  frameRate?: number;
  width?: number;
  height?: number;
}

export const useVideoRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async (
    canvas: HTMLCanvasElement,
    options: RecordingOptions = {}
  ): Promise<Blob> => {
    const { duration = 5000, frameRate = 30 } = options;
    
    return new Promise((resolve, reject) => {
      try {
        console.log('Starting recording...');
        console.log('Canvas:', canvas);
        console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
        
        // Validate canvas
        if (!canvas || canvas.width === 0 || canvas.height === 0) {
          throw new Error('Invalid canvas for recording');
        }
        
        // Check if canvas is actually rendering
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Cannot get canvas context');
        }
        
        // Test if canvas has content
        const imageData = ctx.getImageData(0, 0, Math.min(10, canvas.width), Math.min(10, canvas.height));
        console.log('Canvas has content:', imageData.data.some(pixel => pixel !== 0));
        
        // Get canvas stream
        let stream: MediaStream;
        try {
          stream = canvas.captureStream(frameRate);
          console.log('Canvas stream created:', stream);
          console.log('Stream tracks:', stream.getTracks());
        } catch (streamError) {
          console.error('Failed to capture stream:', streamError);
          throw new Error('Failed to capture canvas stream');
        }
        
        // Check if stream has video tracks
        const videoTracks = stream.getVideoTracks();
        if (videoTracks.length === 0) {
          throw new Error('No video tracks in canvas stream');
        }
        
        console.log('Video track settings:', videoTracks[0].getSettings());
        
        // Create media recorder with fallback options
        let mediaRecorder: MediaRecorder;
        const mimeTypes = [
          'video/webm;codecs=vp9',
          'video/webm;codecs=vp8',
          'video/webm',
          'video/mp4'
        ];
        
        let selectedMimeType = '';
        for (const mimeType of mimeTypes) {
          if (MediaRecorder.isTypeSupported(mimeType)) {
            selectedMimeType = mimeType;
            break;
          }
        }
        
        if (!selectedMimeType) {
          throw new Error('No supported video format found');
        }
        
        console.log('Using mime type:', selectedMimeType);
        
        try {
          mediaRecorder = new MediaRecorder(stream, {
            mimeType: selectedMimeType,
            videoBitsPerSecond: 2500000 // 2.5 Mbps
          });
        } catch (recorderError) {
          console.error('MediaRecorder creation failed:', recorderError);
          // Fallback without options
          mediaRecorder = new MediaRecorder(stream);
        }
        
        chunksRef.current = [];
        mediaRecorderRef.current = mediaRecorder;
        
        // Handle data available
        mediaRecorder.ondataavailable = (event) => {
          console.log('Data available:', event.data.size, 'bytes');
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };
        
        // Handle recording stop
        mediaRecorder.onstop = () => {
          console.log('Recording stopped, chunks:', chunksRef.current.length);
          
          if (chunksRef.current.length === 0) {
            reject(new Error('No data was recorded'));
            return;
          }
          
          const totalSize = chunksRef.current.reduce((total, chunk) => total + chunk.size, 0);
          console.log('Total recorded size:', totalSize, 'bytes');
          
          if (totalSize === 0) {
            reject(new Error('Recorded data has zero size'));
            return;
          }
          
          const blob = new Blob(chunksRef.current, { type: selectedMimeType });
          console.log('Final blob size:', blob.size, 'bytes');
          
          setIsRecording(false);
          setRecordingProgress(0);
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
          
          resolve(blob);
        };
        
        // Handle errors
        mediaRecorder.onerror = (event) => {
          console.error('MediaRecorder error:', event);
          setIsRecording(false);
          setRecordingProgress(0);
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
          
          reject(new Error('Recording failed: ' + (event as any).error?.message || 'Unknown error'));
        };
        
        // Start recording
        setIsRecording(true);
        console.log('Starting MediaRecorder...');
        mediaRecorder.start(100); // Collect data every 100ms
        
        // Progress tracking
        const startTime = Date.now();
        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min((elapsed / duration) * 100, 100);
          setRecordingProgress(progress);
          
          if (elapsed >= duration) {
            clearInterval(progressInterval);
            console.log('Duration reached, stopping recording...');
            mediaRecorder.stop();
          }
        }, 100);
        
      } catch (error) {
        console.error('Failed to start recording:', error);
        setIsRecording(false);
        reject(error);
      }
    });
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log('Manually stopping recording...');
      mediaRecorderRef.current.stop();
    }
  }, []);

  return {
    isRecording,
    recordingProgress,
    startRecording,
    stopRecording
  };
};