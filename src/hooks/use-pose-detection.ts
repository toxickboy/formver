'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PoseLandmarker, FilesetResolver, DrawingUtils, Landmark } from '@mediapipe/tasks-vision';

type UsePoseDetectionProps = {
  onPoseResults: (results: Landmark[], timestamp: number) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
};

export function usePoseDetection({ onPoseResults, videoRef }: UsePoseDetectionProps) {
  const [isReady, setIsReady] = useState(false);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    async function initializePoseLandmarker() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
        );
        const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
          outputSegmentationMasks: false,
        });
        poseLandmarkerRef.current = poseLandmarker;
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing PoseLandmarker:', error);
      }
    }
    initializePoseLandmarker();

    return () => {
      poseLandmarkerRef.current?.close();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const predictWebcam = useCallback(() => {
    const video = videoRef.current;
    if (!video || !poseLandmarkerRef.current) {
      return;
    }

    if (video.currentTime !== video.dataset.lastTime) {
      video.dataset.lastTime = video.currentTime.toString();
      const startTimeMs = performance.now();
      const results = poseLandmarkerRef.current.detectForVideo(video, startTimeMs);

      if (results.landmarks && results.landmarks.length > 0) {
        onPoseResults(results.landmarks[0], video.videoWidth);
      }
    }

    animationFrameId.current = requestAnimationFrame(predictWebcam);
  }, [videoRef, onPoseResults]);

  const start = useCallback(() => {
    if (isReady && !animationFrameId.current) {
      predictWebcam();
    }
  }, [isReady, predictWebcam]);

  const stop = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = undefined;
    }
  }, []);

  return { isReady, start, stop };
}
