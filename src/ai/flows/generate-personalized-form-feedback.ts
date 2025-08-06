// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview AI flow to generate personalized feedback on exercise form.
 *
 * - generatePersonalizedFormFeedback - A function that generates personalized feedback based on user's form and canonical exercise data.
 * - GeneratePersonalizedFormFeedbackInput - The input type for the generatePersonalizedFormFeedback function.
 * - GeneratePersonalizedFormFeedbackOutput - The return type for the generatePersonalizedFormFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedFormFeedbackInputSchema = z.object({
  userJointAngles: z.record(z.string(), z.number()).describe('The joint angles of the user during the exercise, as a map of joint name to angle in degrees.'),
  canonicalJointAngles: z.record(z.string(), z.number()).describe('The canonical joint angles for the exercise, as a map of joint name to angle in degrees.'),
  exerciseName: z.string().describe('The name of the exercise being performed.'),
  userExpertiseLevel: z.string().describe('The level of expertise of the user, e.g., beginner, intermediate, advanced.'),
});

export type GeneratePersonalizedFormFeedbackInput = z.infer<
  typeof GeneratePersonalizedFormFeedbackInputSchema
>;

const GeneratePersonalizedFormFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Personalized feedback on the user’s exercise form.'),
});

export type GeneratePersonalizedFormFeedbackOutput = z.infer<
  typeof GeneratePersonalizedFormFeedbackOutputSchema
>;

export async function generatePersonalizedFormFeedback(
  input: GeneratePersonalizedFormFeedbackInput
): Promise<GeneratePersonalizedFormFeedbackOutput> {
  return generatePersonalizedFormFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedFormFeedbackPrompt',
  input: {
    schema: GeneratePersonalizedFormFeedbackInputSchema,
  },
  output: {
    schema: GeneratePersonalizedFormFeedbackOutputSchema,
  },
  prompt: `You are an expert AI personal trainer providing personalized feedback on exercise form.

  Provide feedback to the user based on their joint angles compared to the canonical joint angles for the exercise.
  Adapt the feedback to the user's expertise level ({{{userExpertiseLevel}}}), providing more detailed and technical feedback to advanced users, and simpler, more encouraging feedback to beginners.

  Exercise Name: {{{exerciseName}}}
  User Expertise Level: {{{userExpertiseLevel}}}

  User Joint Angles:
  {{#each userJointAngles}}
  - {{key}}: {{value}} degrees
  {{/each}}

  Canonical Joint Angles:
  {{#each canonicalJointAngles}}
  - {{key}}: {{value}} degrees
  {{/each}}

  Provide specific, actionable feedback on how the user can improve their form, focusing on the most significant deviations from the canonical form.
  Be encouraging and motivational, and avoid overly negative or critical language.
  Keep the feedback concise and easy to understand.
  Always address the feedback to "the user".
  `,
});

const generatePersonalizedFormFeedbackFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedFormFeedbackFlow',
    inputSchema: GeneratePersonalizedFormFeedbackInputSchema,
    outputSchema: GeneratePersonalizedFormFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
