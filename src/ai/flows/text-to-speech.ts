'use server';

/**
 * @fileOverview A flow for converting text to speech.
 *
 * - textToSpeech - A function that converts a string of text into audio.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
// @ts-ignore
import * as wav from 'wav';
import openAI, { tts1Hd } from 'genkitx-openai';

const TextToSpeechOutputSchema = z.object({
  media: z.string().describe("The base64 encoded audio data with a data URI."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', function (d: Buffer) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: z.string(),
    outputSchema: TextToSpeechOutputSchema,
  },
  async (query) => {
    const { media } = await ai.generate({
      model: tts1Hd,
      config: {
        voice: 'alloy', // OpenAI voices: alloy, echo, fable, onyx, nova, or shimmer
      },
      prompt: query,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavData = await toWav(audioBuffer);
    return {
      media: 'data:audio/wav;base64,' + wavData,
    };
  }
);

export async function textToSpeech(input: string): Promise<TextToSpeechOutput> {
    return textToSpeechFlow(input);
}
