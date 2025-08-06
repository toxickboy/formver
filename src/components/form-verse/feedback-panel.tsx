'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader } from 'lucide-react';
import { useEffect, useRef } from 'react';

type FeedbackPanelProps = {
  repCount: number;
  feedback: string;
  isLoading: boolean;
  audioUrl: string | null;
};

export default function FeedbackPanel({ repCount, feedback, isLoading, audioUrl }: FeedbackPanelProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }
  }, [audioUrl]);


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Analysis</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
          <span className="font-medium text-muted-foreground">Rep Count</span>
          <span className="text-3xl font-bold text-primary">{repCount}</span>
        </div>
        <div className="p-4 rounded-lg border min-h-[120px]">
          <div className="flex items-center gap-2 mb-2">
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <Sparkles className="h-5 w-5 text-accent" />
            )}
            <h3 className="font-semibold text-foreground">AI Feedback</h3>
          </div>
          {isLoading ? (
             <p className="text-sm text-muted-foreground italic">Analyzing your form...</p>
          ) : (
            <p className="text-sm text-muted-foreground">{feedback}</p>
          )}
        </div>
        {audioUrl && <audio ref={audioRef} src={audioUrl} controls className="w-full" hidden />}
      </CardContent>
    </Card>
  );
}
