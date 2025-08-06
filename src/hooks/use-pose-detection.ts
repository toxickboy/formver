'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PoseLandmarker, FilesetResolver, Landmark } from '@mediapipe/tasks-vision';

type UsePoseDetectionProps = {
  onPoseResults: (results: Landmark[]) => void;
};

export function usePoseDetection({ onPoseResults }: UsePoseDetectionProps) {
  const [isReady, setIsReady] = useState(false);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const animationFrameId = useRef<number>();
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
      if (animationFrameId.current) {
        requestAnimationFrame(predictWebcam);
      }
      return;
    }

    if (video.currentTime !== (video as any).lastTime) {
      (video as any).lastTime = video.currentTime;
      const startTimeMs = performance.now();
      const results = poseLandmarkerRef.current.detectForVideo(video, startTimeMs);

      if (results.landmarks && results.landmarks.length > 0) {
        onPoseResults(results.landmarks[0]);
      }
    }

    if (animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(predictWebcam);
    }
  }, [onPoseResults]);

  const start = useCallback((videoElement: HTMLVideoElement) => {
    videoRef.current = videoElement;
    if (isReady && !animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(predictWebcam);
    }
  }, [isReady, predictWebcam]);

  const stop = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = undefined;
    }
    videoRef.current = null;
  }, []);

  return { isReady, start, stop };
}
