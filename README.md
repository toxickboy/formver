# FormVerse: AI-Powered Exercise Form Coach

FormVerse is an interactive web application that acts as your personal AI-powered exercise coach. By using your device's webcam, it analyzes your workout form in real-time, provides instant, actionable feedback, and counts your repetitions to help you achieve your fitness goals safely and effectively.

## Features

- **Real-Time Pose Analysis**: Utilizes MediaPipe to track 33 key body landmarks from your webcam feed.
- **AI-Driven Feedback**: Leverages Genkit and Google's Gemini models to compare your form against canonical exercise data and provide personalized improvement tips.
- **Voice-Guided Coaching**: Delivers AI feedback via audible voice cues, allowing you to focus on your workout without looking at the screen.
- **Automatic Rep Counting**: Intelligently detects and counts repetitions for a variety of exercises.
- **Extensible Exercise Library**: Easily add new exercises by defining their key joint angles and movement thresholds.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI/ML**:
    - [Genkit](https://firebase.google.com/docs/genkit): For building and managing AI flows.
    - [Google Gemini](https://ai.google.dev/): Powers the personalized feedback and text-to-speech capabilities.
    - [MediaPipe](https://developers.google.com/mediapipe): For in-browser pose detection.
- **UI**:
    - [React](https://react.dev/)
    - [Tailwind CSS](https://tailwindcss.com/)
    - [shadcn/ui](https://ui.shadcn.com/): For pre-built, accessible UI components.

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- `npm` (comes with Node.js)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example:
    ```bash
    cp .env.example .env
    ```
    You will need to add your Google AI API key to this file. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

    ```env
    # .env
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

4.  **Run the Genkit developer server:**
    Genkit runs its own server to manage the AI flows. Run the following command in a separate terminal:
    ```bash
    npm run genkit:watch
    ```
    This will start the Genkit server and watch for any changes in your AI flows.

5.  **Run the Next.js development server:**
    In another terminal, start the main application server:
    ```bash
    npm run dev
    ```

6.  **Open the application:**
    Navigate to `http://localhost:9002` in your web browser. You may need to grant camera permissions for the application to function correctly.

## How It Works

The application captures video from the webcam and feeds it into the **MediaPipe PoseLandmarker** model, which runs entirely in the browser. This model detects the 3D coordinates of the user's body joints.

When the user completes a repetition (e.g., reaching the bottom of a squat), the application captures the current joint angles and sends them to a **Genkit flow**. This flow uses the **Gemini AI model** to compare the user's angles to the "ideal" angles defined for that exercise.

The AI generates personalized, constructive feedback, which is then sent to a **Text-to-Speech (TTS) flow** to be converted into audio. The feedback text is displayed on the screen, and the audio is played back to the user.

## Adding New Exercises

You can easily expand the app's capabilities by adding new exercises.

1.  Navigate to `src/lib/exercises.ts`.
2.  Add a new entry to the `exercises` object, following the existing structure. You will need to define:
    - A unique `key` and `name`.
    - The `joints` to be analyzed.
    - The `canonicalAngles` for both contracted and extended positions.
    - The `repThresholds` to define what counts as a rep.
