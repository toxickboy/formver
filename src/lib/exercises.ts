export type Joint = 
  | 'left_shoulder' | 'right_shoulder' 
  | 'left_elbow' | 'right_elbow'
  | 'left_wrist' | 'right_wrist'
  | 'left_hip' | 'right_hip'
  | 'left_knee' | 'right_knee'
  | 'left_ankle' | 'right_ankle';

export const relevantJoints: Record<Joint, {points: [number, number, number]}> = {
  left_shoulder: { points: [13, 11, 23] },
  right_shoulder: { points: [14, 12, 24] },
  left_elbow: { points: [15, 13, 11] },
  right_elbow: { points: [16, 14, 12] },
  left_hip: { points: [11, 23, 25] },
  right_hip: { points: [12, 24, 26] },
  left_knee: { points: [23, 25, 27] },
  right_knee: { points: [24, 26, 28] },
  left_wrist: { points: [13, 15, 17] }, // Placeholder, not used for angle
  right_wrist: { points: [14, 16, 18] }, // Placeholder, not used for angle
  left_ankle: { points: [25, 27, 31] }, // Placeholder, not used for angle
  right_ankle: { points: [26, 28, 32] }, // Placeholder, not used for angle
};

export type Exercise = {
  key: string;
  name: string;
  joints: Joint[];
  canonicalAngles: {
    contracted: Partial<Record<Joint, number>>;
    extended: Partial<Record<Joint, number>>;
  };
  repThresholds: {
    contracted: number;
    extended: number;
    joint: Joint;
  }
};

export const exercises: Record<string, Exercise> = {
  bicep_curl: {
    key: 'bicep_curl',
    name: 'Bicep Curls',
    joints: ['left_elbow', 'right_elbow'],
    canonicalAngles: {
      contracted: { left_elbow: 30, right_elbow: 30 },
      extended: { left_elbow: 175, right_elbow: 175 },
    },
    repThresholds: {
      contracted: 60,
      extended: 150,
      joint: 'right_elbow',
    }
  },
  squat: {
    key: 'squat',
    name: 'Squats',
    joints: ['left_knee', 'right_knee', 'left_hip', 'right_hip'],
    canonicalAngles: {
      contracted: { left_knee: 70, right_knee: 70, left_hip: 80, right_hip: 80 },
      extended: { left_knee: 175, right_knee: 175, left_hip: 175, right_hip: 175 },
    },
    repThresholds: {
        contracted: 90,
        extended: 170,
        joint: 'right_knee',
    }
  },
  overhead_press: {
    key: 'overhead_press',
    name: 'Overhead Press',
    joints: ['left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow'],
    canonicalAngles: {
      contracted: { left_shoulder: 170, right_shoulder: 170, left_elbow: 170, right_elbow: 170 },
      extended: { left_shoulder: 80, right_shoulder: 80, left_elbow: 80, right_elbow: 80 },
    },
    repThresholds: {
        contracted: 160,
        extended: 90,
        joint: 'right_shoulder'
    }
  },
  lunges: {
    key: 'lunges',
    name: 'Lunges',
    joints: ['left_knee', 'right_knee', 'left_hip', 'right_hip'],
    canonicalAngles: {
      contracted: { left_knee: 90, right_knee: 90, left_hip: 100, right_hip: 100 },
      extended: { left_knee: 175, right_knee: 175, left_hip: 175, right_hip: 175 },
    },
    repThresholds: {
        contracted: 100,
        extended: 160,
        joint: 'right_knee',
    }
  }
};git remote add origin https://github.com/toxickboy/formverse.git
git branch -M main
git push -u origin main

export const getExercises = () => Object.values(exercises).map(({ key, name }) => ({ key, name }));
export const getExerciseData = (key: string) => exercises[key];
