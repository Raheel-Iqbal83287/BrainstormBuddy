'use server';

import { z } from 'zod';
import { generateStrategy, GenerateStrategyOutput } from '@/ai/flows/generate-strategy';
import { regenerateAnalysis } from '@/ai/flows/regenerate-analysis';

const strategySchema = z.object({
  startupIdea: z.string().min(10, { message: 'Please describe your idea in at least 10 characters.' }).max(500, { message: 'Idea is too long, please keep it under 500 characters.'}),
  market: z.string().optional(),
});

type ActionFn = (input: {startupIdea: string; market?: string}) => Promise<any>;

async function performStrategyAction(action: ActionFn, formData: FormData) {
    const marketValue = formData.get('market');
    const formValues = {
        startupIdea: formData.get('startupIdea') as string,
        market: marketValue?.toString(),
    };

    try {
        const validatedFields = strategySchema.safeParse(formValues);

        if (!validatedFields.success) {
            return {
                data: null,
                error: validatedFields.error.errors.map(e => e.message).join(', '),
            };
        }

        const result = await action(validatedFields.data);
        
        return { data: result, error: null };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { data: null, error: `Failed to generate strategy. ${errorMessage}` };
    }
}

export async function getStrategyAction(formData: FormData) {
    return performStrategyAction(generateStrategy, formData);
}

export async function regenerateStrategyAction(formData: FormData) {
    return performStrategyAction(regenerateAnalysis, formData);
}
