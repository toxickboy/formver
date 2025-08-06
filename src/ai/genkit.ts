import {genkit} from 'genkit';
import openAI, { gpt4o } from 'genkitx-openai';

export const ai = genkit({
  plugins: [openAI({ apiKey: process.env.OPENAI_API_KEY })],
  model: gpt4o,
});
