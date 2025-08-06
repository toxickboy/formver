import { genkit } from 'genkit';
import { openAI } from 'genkitx-openai';

const openAIPlugin = openAI({
  apiKey: process.env.OPENAI_API_KEY!,
  models: {
    gpt4: 'gpt-4',    // Named alias 'gpt4'
    tts: 'tts-1-hd',
  },
});

export const ai = genkit({
  plugins: [openAIPlugin],
});
