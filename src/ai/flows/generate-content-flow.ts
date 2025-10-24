'use server';
/**
 * @fileOverview Un flujo de IA para generar contenido de notas.
 *
 * - generateNoteContent - Una función que maneja la generación de contenido.
 * - GenerateNoteInput - El tipo de entrada para la función.
 * - GenerateNoteOutput - El tipo de retorno para la función.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateNoteInputSchema = z.object({
  prompt: z.string().describe('La idea o tema para generar la nota.'),
});
export type GenerateNoteInput = z.infer<typeof GenerateNoteInputSchema>;

const GenerateNoteOutputSchema = z.object({
  title: z.string().describe('El título generado para la nota.'),
  content: z.string().describe('El contenido generado para la nota.'),
});
export type GenerateNoteOutput = z.infer<typeof GenerateNoteOutputSchema>;

export async function generateNoteContent(
  input: GenerateNoteInput
): Promise<GenerateNoteOutput> {
  return generateNoteContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNoteContentPrompt',
  input: { schema: GenerateNoteInputSchema },
  output: { schema: GenerateNoteOutputSchema },
  prompt: `Eres un asistente experto en creación de contenido. A partir de la siguiente idea, genera un título conciso y un contenido para una nota. El contenido debe ser claro, estructurado y útil.

Idea: {{{prompt}}}`,
});

const generateNoteContentFlow = ai.defineFlow(
  {
    name: 'generateNoteContentFlow',
    inputSchema: GenerateNoteInputSchema,
    outputSchema: GenerateNoteOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

    