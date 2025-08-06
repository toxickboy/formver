import type { Landmark } from "@mediapipe/tasks-vision";

type Point3D = { x: number; y: number; z: number };

export function calculateAngle3D(a: Point3D, b: Point3D, c: Point3D): number {
  const v1 = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  const v2 = { x: c.x - b.x, y: c.y - b.y, z: c.z - b.z };

  const dotProduct = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const magnitude1 = Math.sqrt(v1.x ** 2 + v1.y ** 2 + v1.z ** 2);
  const magnitude2 = Math.sqrt(v2.x ** 2 + v2.y ** 2 + v2.z ** 2);
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  const cosTheta = dotProduct / (magnitude1 * magnitude2);
  
  // Clamp cosTheta to the range [-1, 1] to avoid floating point errors
  const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta));
  
  const angle = Math.acos(clampedCosTheta) * (180 / Math.PI);
  return angle;
}


const POSE_CONNECTIONS: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8], [9, 10],
    [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
    [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20], [11, 23],
    [12, 24], [23, 24], [23, 25], [24, 26], [25, 27], [26, 28], [27, 29],
    [28, 30], [29, 31], [30, 32], [27, 31], [28, 32]
];

export function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  feedbackForJoints: Record<string, boolean>
) {
  if (!landmarks) return;
  const landmarkIndices = {
    left_hip: 23,
    right_hip: 24,
    left_shoulder: 11,
    right_shoulder: 12,
    left_elbow: 13,
    right_elbow: 14,
    left_wrist: 15,
    right_wrist: 16,
    left_knee: 25,
    right_knee: 26,
    left_ankle: 27,
    right_ankle: 28,
  };

  const jointIndices = Object.values(landmarkIndices);

  ctx.fillStyle = 'rgba(160, 89, 245, 0.8)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 2;
  
  landmarks.forEach((landmark, i) => {
    const isKeyJoint = jointIndices.includes(i);
    if (isKeyJoint) {
      const jointName = Object.keys(landmarkIndices).find(key => landmarkIndices[key as keyof typeof landmarkIndices] === i);
      const isGood = feedbackForJoints[jointName!] ?? true;
      ctx.fillStyle = isGood ? 'rgba(160, 89, 245, 0.9)' : 'rgba(233, 30, 99, 0.9)';
    } else {
      ctx.fillStyle = 'rgba(160, 89, 245, 0.6)';
    }

    ctx.beginPath();
    ctx.arc(landmark.x * ctx.canvas.width, landmark.y * ctx.canvas.height, isKeyJoint ? 6 : 3, 0, 2 * Math.PI);
    ctx.fill();
    if(isKeyJoint) ctx.stroke();
  });
}

export function drawConnections(ctx: CanvasRenderingContext2D, landmarks: Landmark[]) {
  if (!landmarks) return;
  ctx.strokeStyle = 'rgba(240, 231, 255, 0.8)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  POSE_CONNECTIONS.forEach((pair) => {
    const [start, end] = pair;
    if (landmarks[start] && landmarks[end]) {
      if (landmarks[start].visibility > 0.5 && landmarks[end].visibility > 0.5) {
        ctx.beginPath();
        ctx.moveTo(landmarks[start].x * ctx.canvas.width, landmarks[start].y * ctx.canvas.height);
        ctx.lineTo(landmarks[end].x * ctx.canvas.width, landmarks[end].y * ctx.canvas.height);
        ctx.stroke();
      }
    }
  });
}
