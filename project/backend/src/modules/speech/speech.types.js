/**
 * Speech DTOs - Zod schemas for request validation
 */
import { z } from 'zod';

export const SpeakDTO = z.object({
  body: z.object({
    personId: z.string().min(1),
  }),
});

export const ParamIdDTO = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
