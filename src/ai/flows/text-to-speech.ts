'use server';

/**
 * @fileOverview AI flow to convert text to speech.
 *
 * - textToSpeech - A function that converts text to speech.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
// Import the TTS model
import {tts1} from 'genkitx-openai';

const TextToSpeechOutputSchema = z.object({
  media: z.string().describe("The base64 encoded audio data with a data URI."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;



const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: z.string(),
    outputSchema: TextToSpeechOutputSchema,
  },
  async (query) => {
    try {
      const response = await ai.generate({
        model: tts1,
        voice: "alloy",
        input: query,
        response_format: "mp3"
      });

      const audioBuffer = Buffer.from(await response.arrayBuffer());
      // Return MP3 data directly since we're requesting MP3 format
      return {
        media: 'data:audio/mp3;base64,' + audioBuffer.toString('base64'),
      };
    } catch (error) {
      console.error('Text-to-speech error:', error);
      throw new Error('Failed to generate speech');
    }
  }
);

export async function textToSpeech(input: string): Promise<TextToSpeechOutput> {
    return textToSpeechFlow(input);
}
