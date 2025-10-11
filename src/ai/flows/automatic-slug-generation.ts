'use server';

/**
 * @fileOverview Generates a URL-friendly slug from a title using Genkit.
 *
 * - generateSlug - A function that generates a slug from a title.
 * - GenerateSlugInput - The input type for the generateSlug function.
 * - GenerateSlugOutput - The return type for the generateSlug function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSlugInputSchema = z.object({
  title: z.string().describe('The title to generate a slug from.'),
});
export type GenerateSlugInput = z.infer<typeof GenerateSlugInputSchema>;

const GenerateSlugOutputSchema = z.object({
  slug: z.string().describe('The generated URL-friendly slug.'),
});
export type GenerateSlugOutput = z.infer<typeof GenerateSlugOutputSchema>;

export async function generateSlug(input: GenerateSlugInput): Promise<GenerateSlugOutput> {
  return generateSlugFlow(input);
}

const slugPrompt = ai.definePrompt({
  name: 'slugPrompt',
  input: {schema: GenerateSlugInputSchema},
  output: {schema: GenerateSlugOutputSchema},
  prompt: `Generate a URL-friendly slug from the following title:

Title: {{{title}}}

Slug:`,
});

const generateSlugFlow = ai.defineFlow(
  {
    name: 'generateSlugFlow',
    inputSchema: GenerateSlugInputSchema,
    outputSchema: GenerateSlugOutputSchema,
  },
  async input => {
    const {output} = await slugPrompt(input);
    return output!;
  }
);
