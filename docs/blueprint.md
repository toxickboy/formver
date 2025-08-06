# **App Name**: FormVerse

## Core Features:

- Exercise Selection: Exercise selection from a predefined list. Exercise data is requested from backend at selection.
- Fetch Exercise Data: Fetch canonical pose data from the backend for the selected exercise.
- Webcam Integration: Access user's webcam stream to capture video frames.
- Pose Detection: Process video frames using MediaPipe Pose to extract 33 3D landmark coordinates in real-time.
- Joint Angle Calculation: Calculate joint angles based on landmark coordinates for relevant body parts.
- Form Validation & Feedback: Validate user's joint angles against the canonical data, providing feedback on form correctness. The feedback provided can be seen as the application of a tool in service of helping the user meet certain criteria.
- Real-time Feedback Display: Display visual cues and real-time feedback on the user's form via a Canvas/SVG overlay. Provide repetition counts.
- List exercises: API endpoint to list all available exercises
- Exercise data: API endpoint to return canonical data for selected exercise

## Style Guidelines:

- Primary color: A vibrant purple (#A059F5) to convey energy and sophistication.
- Background color: A desaturated light purple (#F0E7FF).
- Accent color: A contrasting magenta (#E91E63) to draw attention to key feedback elements and calls to action.
- Body and headline font: 'Inter', a grotesque-style sans-serif, for a clean and modern look. It's suitable for both headlines and body text in this app.
- Use clear, minimalist icons to represent exercises and settings.
- A clean and structured layout with clear sections for exercise selection, webcam view, and feedback display.
- Smooth transitions and subtle animations to provide engaging form correction feedback.