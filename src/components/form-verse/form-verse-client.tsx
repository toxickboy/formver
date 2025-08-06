'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Landmark } from '@mediapipe/tasks-vision';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { usePoseDetection } from '@/hooks/use-pose-detection';
import { getExercises, getExerciseData, Exercise, relevantJoints, Joint } from '@/lib/exercises';
import { calculateAngle3D } from '@/lib/pose-utils';
import { generatePersonalizedFormFeedback } from '@/ai/flows/generate-personalized-form-feedback';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useToast } from '@/hooks/use-toast';
import { Camera, CameraOff, Loader, PersonStanding } from 'lucide-react';
import WebcamDisplay from './webcam-display';
import FeedbackPanel from './feedback-panel';

type RepState = 'extended' | 'contracted';

export function FormVerseClient() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [exercises] = useState(getExercises());
  const [selectedExerciseKey, setSelectedExerciseKey] = useState<string>(exercises[0].key);
  const [expertise, setExpertise] = useState('beginner');
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  
  const [repCount, setRepCount] = useState(0);
  const [repState, setRepState] = useState<RepState>('extended');
  
  const [feedback, setFeedback] = useState<string>('Start your exercise to get real-time feedback.');
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [jointFeedback, setJointFeedback] = useState<Record<string, boolean>>({});
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const exerciseData = useMemo(() => getExerciseData(selectedExerciseKey), [selectedExerciseKey]);

  const handlePoseResults = useCallback((newLandmarks: Landmark[]) => {
    setLandmarks(newLandmarks);
  }, []);

  const { isReady, start, stop } = usePoseDetection({ onPoseResults: handlePoseResults });

  const toggleWebcam = async () => {
    if (isWebcamOn) {
      stop();
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      videoRef.current!.srcObject = null;
      setIsWebcamOn(false);
      setLandmarks([]);
      setRepCount(0);
      setRepState('extended');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().then(() => {
            setIsWebcamOn(true);
            start(videoRef.current!);
          });
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
        toast({
          title: 'Webcam Error',
          description: 'Could not access the webcam. Please check permissions and try again.',
          variant: 'destructive',
        });
      }
    }
  };
  
  const getFeedback = useCallback(async (angles: Record<string, number>, exercise: Exercise) => {
    setIsGeneratingFeedback(true);
    setAudioUrl(null);
    try {
      const canonicalAngles = exercise.canonicalAngles.contracted;
      const feedbackResponse = await generatePersonalizedFormFeedback({
        userJointAngles: angles,
        canonicalJointAngles: canonicalAngles,
        exerciseName: exercise.name,
        userExpertiseLevel: expertise,
      });

      const newJointFeedback: Record<string, boolean> = {};
      let overallFeedback = feedbackResponse.feedback;

      Object.keys(angles).forEach(joint => {
        const userAngle = angles[joint];
        const canonicalAngle = canonicalAngles[joint as Joint];
        const deviation = Math.abs(userAngle - canonicalAngle);
        newJointFeedback[joint] = deviation <= 25;
      });
      
      setJointFeedback(newJointFeedback);
      setFeedback(overallFeedback);
      
      const audioResponse = await textToSpeech(overallFeedback);
      setAudioUrl(audioResponse.media);

    } catch (error) {
      console.error('Error generating feedback:', error);
      setFeedback('Could not generate feedback at this time.');
    } finally {
      setIsGeneratingFeedback(false);
    }
  }, [expertise]);

  useEffect(() => {
    if (landmarks.length > 0 && isWebcamOn) {
      const { repThresholds, joints } = exerciseData;
      const primaryJointPoints = relevantJoints[repThresholds.joint];
      if (!primaryJointPoints) return;

      const p1 = landmarks[primaryJointPoints[0]];
      const p2 = landmarks[primaryJointPoints[1]];
      const p3 = landmarks[primaryJointPoints[2]];

      if (p1 && p2 && p3 && p1.visibility! > 0.5 && p2.visibility! > 0.5 && p3.visibility! > 0.5) {
        const angle = calculateAngle3D(p1, p2, p3);

        if (repState === 'extended' && angle < repThresholds.contracted) {
          setRepState('contracted');
          const currentAngles: Record<string, number> = {};
          joints.forEach(joint => {
            const jointKey = joint as keyof typeof relevantJoints;
            const j_p1 = landmarks[relevantJoints[jointKey][0]];
            const j_p2 = landmarks[relevantJoints[jointKey][1]];
            const j_p3 = landmarks[relevantJoints[jointKey][2]];
            if(j_p1 && j_p2 && j_p3 && j_p1.visibility! > 0.5 && j_p2.visibility! > 0.5 && j_p3.visibility! > 0.5) {
              currentAngles[joint] = calculateAngle3D(j_p1, j_p2, j_p3);
            }
          });
          getFeedback(currentAngles, exerciseData);
        } else if (repState === 'contracted' && angle > repThresholds.extended) {
          setRepState('extended');
          setRepCount(prev => prev + 1);
        }
      }
    }
  }, [landmarks, isWebcamOn, exerciseData, repState, getFeedback]);

  useEffect(() => {
    setRepCount(0);
    setRepState('extended');
    setFeedback('Start your exercise to get real-time feedback.');
    setJointFeedback({});
    setAudioUrl(null);
  }, [selectedExerciseKey]);

  return (
    <div className="grid md:grid-cols-12 gap-6 p-4 md:p-6 h-full">
      <div className="md:col-span-8 lg:col-span-9">
        <Card className="h-full flex flex-col shadow-lg">
          <CardHeader>
            <CardTitle>Webcam Feed</CardTitle>
            <CardDescription>{isReady ? "Ready to analyze your form." : "Loading model..."}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center relative bg-muted/50 rounded-b-lg overflow-hidden">
            <WebcamDisplay videoRef={videoRef} landmarks={landmarks} jointFeedback={jointFeedback} />
            {!isWebcamOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                <PersonStanding className="w-24 h-24 text-muted-foreground/50 mb-4"/>
                <p className="text-muted-foreground">Turn on your webcam to begin</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-4 lg:col-span-3">
        <div className="flex flex-col gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Controls</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="exercise">Exercise</Label>
                <Select value={selectedExerciseKey} onValueChange={setSelectedExerciseKey} disabled={isWebcamOn}>
                  <SelectTrigger id="exercise">
                    <SelectValue placeholder="Select exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    {exercises.map(ex => (
                      <SelectItem key={ex.key} value={ex.key}>{ex.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expertise">Expertise Level</Label>
                <Select value={expertise} onValueChange={setExpertise} disabled={isWebcamOn}>
                  <SelectTrigger id="expertise">
                    <SelectValue placeholder="Select expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <Button onClick={toggleWebcam} disabled={!isReady}>
                {isWebcamOn ? <CameraOff className="mr-2 h-4 w-4" /> : <Camera className="mr-2 h-4 w-4" />}
                {isWebcamOn ? 'Stop Webcam' : 'Start Webcam'}
                {!isReady && <Loader className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            </CardContent>
          </Card>
          
          <FeedbackPanel
            repCount={repCount}
            feedback={feedback}
            isLoading={isGeneratingFeedback}
            audioUrl={audioUrl}
          />

        </div>
      </div>
    </div>
  );
}
