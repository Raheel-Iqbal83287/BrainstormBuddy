// src/ai/flows/regenerate-analysis.ts
'use server';

/**
 * @fileOverview A flow to regenerate the GTM strategy, feature roadmap, and SWOT analysis with alternative perspectives based on the same input.
 *
 * - regenerateAnalysis - A function that handles the regeneration of the analysis.
 * - RegenerateAnalysisInput - The input type for the regenerateAnalysis function.
 * - RegenerateAnalysisOutput - The return type for the regenerateAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RegenerateAnalysisInputSchema = z.object({
  startupIdea: z.string().describe('The startup idea to generate analysis for.'),
  market: z.string().optional().describe('The market the startup is in.'),
});
export type RegenerateAnalysisInput = z.infer<typeof RegenerateAnalysisInputSchema>;

const RegenerateAnalysisOutputSchema = z.object({
  gtmStrategy: z.object({
    targetUsers: z.string().describe('The target users for the startup.'),
    acquisitionChannels: z.string().describe('The acquisition channels for the startup.'),
    monetizationModel: z.string().describe('The monetization model for the startup.'),
    positioningStatement: z.string().describe('The positioning statement for the startup.'),
  }).describe('The go-to-market strategy for the startup.'),
  featureRoadmap: z.object({
    mvpFeatures: z.string().describe('The MVP features for the startup.'),
    v1Improvements: z.string().describe('The v1.0 improvements for the startup.'),
    stretchFeatures: z.string().describe('List of future or stretch features.'),
  }).describe('The feature roadmap for the startup.'),
  swotAnalysis: z.object({
    strengths: z.string().describe('The strengths of the startup.'),
    weaknesses: z.string().describe('The weaknesses of the startup.'),
    opportunities: z.string().describe('The opportunities for the startup.'),
    threats: z.string().describe('The threats to the startup.'),
  }).describe('The SWOT analysis for the startup.'),
});
export type RegenerateAnalysisOutput = z.infer<typeof RegenerateAnalysisOutputSchema>;

export async function regenerateAnalysis(input: RegenerateAnalysisInput): Promise<RegenerateAnalysisOutput> {
  return regenerateAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'regenerateAnalysisPrompt',
  input: {schema: RegenerateAnalysisInputSchema},
  output: {schema: RegenerateAnalysisOutputSchema},
  prompt: `You are a strategic advisor for early stage startups. Your goal is to provide an alternative perspective to an existing analysis.

You will regenerate a go-to-market strategy, feature roadmap, and SWOT analysis for the given startup idea.

Startup Idea: {{{startupIdea}}}
Market: {{#if market}}{{{market}}}{{else}}General{{/if}}

Provide an alternative analysis to what might have been generated before. Think outside the box.

Output the go-to-market strategy, feature roadmap, and SWOT analysis in JSON format.

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

const regenerateAnalysisFlow = ai.defineFlow(
  {
    name: 'regenerateAnalysisFlow',
    inputSchema: RegenerateAnalysisInputSchema,
    outputSchema: RegenerateAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
