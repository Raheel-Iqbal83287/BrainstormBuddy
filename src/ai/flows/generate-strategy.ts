// src/ai/flows/generate-strategy.ts
'use server';
/**
 * @fileOverview A flow for generating a go-to-market strategy, feature roadmap, and SWOT analysis from a startup idea.
 *
 * - generateStrategy - A function that handles the strategy generation process.
 * - GenerateStrategyInput - The input type for the generateStrategy function.
 * - GenerateStrategyOutput - The return type for the generateStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStrategyInputSchema = z.object({
  startupIdea: z.string().describe('A one-line description of the startup idea.'),
  market: z.string().optional().describe('Optional: The market the startup is in.'),
});
export type GenerateStrategyInput = z.infer<typeof GenerateStrategyInputSchema>;

const GenerateStrategyOutputSchema = z.object({
  gtmStrategy: z.object({
    targetUsers: z.string().describe('Description of the target users.'),
    acquisitionChannels: z.string().describe('List of acquisition channels.'),
    monetizationModel: z.string().describe('Description of the monetization model.'),
    positioningStatement: z.string().describe('The positioning statement.'),
  }).describe('Go-to-market strategy.'),
  featureRoadmap: z.object({
    mvpFeatures: z.string().describe('List of MVP features.'),
    v1Improvements: z.string().describe('List of v1.0 improvements.'),
    stretchFeatures: z.string().describe('List of future or stretch features.'),
  }).describe('Feature roadmap.'),
  swotAnalysis: z.object({
    strengths: z.string().describe('List of strengths.'),
    weaknesses: z.string().describe('List of weaknesses.'),
    opportunities: z.string().describe('List of opportunities.'),
    threats: z.string().describe('List of threats.'),
  }).describe('SWOT analysis.'),
});
export type GenerateStrategyOutput = z.infer<typeof GenerateStrategyOutputSchema>;

export async function generateStrategy(input: GenerateStrategyInput): Promise<GenerateStrategyOutput> {
  return generateStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStrategyPrompt',
  input: {schema: GenerateStrategyInputSchema},
  output: {schema: GenerateStrategyOutputSchema},
  prompt: `You are a startup strategy expert. Given a startup idea and market, you will generate a go-to-market strategy, feature roadmap, and SWOT analysis.

Startup Idea: {{{startupIdea}}}
Market: {{{market}}}

Output the go-to-market strategy, feature roadmap, and SWOT analysis in JSON format.

Make the SWOT, GTM and feature roadmap specific and relevant to the provided idea.

Here's the format:
{
  "gtmStrategy": {
    "targetUsers": "Description of the target users.",
    "acquisitionChannels": "List of acquisition channels.",
    "monetizationModel": "Description of the monetization model.",
    "positioningStatement": "The positioning statement."
  },
  "featureRoadmap": {
    "mvpFeatures": "List of MVP features.",
    "v1Improvements": "List of v1.0 improvements.",
    "stretchFeatures": "List of future or stretch features."
  },
  "swotAnalysis": {
    "strengths": "List of strengths.",
    "weaknesses": "List of weaknesses.",
    "opportunities": "List of opportunities.",
    "threats": "List of threats."
  }
}
`,
});

const generateStrategyFlow = ai.defineFlow(
  {
    name: 'generateStrategyFlow',
    inputSchema: GenerateStrategyInputSchema,
    outputSchema: GenerateStrategyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
