export type Joint = 
  | 'left_shoulder' | 'right_shoulder' 
  | 'left_elbow' | 'right_elbow'
  | 'left_wrist' | 'right_wrist'
  | 'left_hip' | 'right_hip'
  | 'left_knee' | 'right_knee'
  | 'left_ankle' | 'right_ankle';

export const relevantJoints = {
  left_shoulder: ['left_elbow', 'left_shoulder', 'left_hip'],
  right_shoulder: ['right_elbow', 'right_shoulder', 'right_hip'],
  left_elbow: ['left_wrist', 'left_elbow', 'left_shoulder'],
  right_elbow: ['right_wrist', 'right_elbow', 'right_shoulder'],
  left_hip: ['left_shoulder', 'left_hip', 'left_knee'],
  right_hip: ['right_shoulder', 'right_hip', 'right_knee'],
  left_knee: ['left_hip', 'left_knee', 'left_ankle'],
  right_knee: ['right_hip', 'right_knee', 'right_ankle'],
};

export type Exercise = {
  key: string;
  name: string;
  joints: Joint[];
  canonicalAngles: {
    contracted: Record<Joint, number>;
    extended: Record<Joint, number>;
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
  }
};

export const getExercises = () => Object.values(exercises).map(({ key, name }) => ({ key, name }));
export const getExerciseData = (key: string) => exercises[key];
