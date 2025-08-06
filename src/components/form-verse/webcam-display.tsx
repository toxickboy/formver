'use client';

import { useEffect, useRef } from 'react';
import type { Landmark } from '@mediapipe/tasks-vision';
import { drawConnections, drawLandmarks } from '@/lib/pose-utils';

type WebcamDisplayProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
  landmarks: Landmark[];
  jointFeedback: Record<string, boolean>;
};

export default function WebcamDisplay({ videoRef, landmarks, jointFeedback }: WebcamDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (landmarks && landmarks.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawConnections(ctx, landmarks);
        drawLandmarks(ctx, landmarks, jointFeedback);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

  }, [landmarks, videoRef, jointFeedback]);

  return (
    <div className="relative w-full aspect-video">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover rounded-b-lg transform scaleX(-1)"
      ></video>
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="absolute inset-0 w-full h-full object-contain"
      ></canvas>
    </div>
  );
}
