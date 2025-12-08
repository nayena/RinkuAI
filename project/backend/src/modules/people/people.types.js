/**
 * People DTOs - Zod schemas for request validation
 */
import { z } from 'zod';

const PromptDTO = z.object({ text: z.string().min(1) });
const PhotoDTO = z.object({ uri: z.string() });

const FaceDataDTO = z.object({
  bounds: z.object({
    origin: z.object({ x: z.number(), y: z.number() }),
    size: z.object({ width: z.number(), height: z.number() }),
  }),
  landmarks: z.object({
    leftEye: z.object({ x: z.number(), y: z.number() }).optional(),
    rightEye: z.object({ x: z.number(), y: z.number() }).optional(),
    nose: z.object({ x: z.number(), y: z.number() }).optional(),
    leftMouth: z.object({ x: z.number(), y: z.number() }).optional(),
    rightMouth: z.object({ x: z.number(), y: z.number() }).optional(),
  }).optional(),
  rollAngle: z.number().optional(),
  yawAngle: z.number().optional(),
  smilingProbability: z.number().optional(),
  imageUri: z.string(),
  capturedAt: z.string(),
}).optional();

export const CreatePersonDTO = z.object({
  body: z.object({
    displayName: z.string().min(1),
    familiarName: z.string().optional(),
    relationship: z.string().min(1),
    prompts: z.array(PromptDTO).optional(),
    photos: z.array(PhotoDTO).optional(),
    faceData: FaceDataDTO,
  }),
});

export const UpdatePersonDTO = z.object({
  body: z.object({
    displayName: z.string().optional(),
    familiarName: z.string().optional(),
    relationship: z.string().optional(),
    prompts: z.array(PromptDTO).optional(),
    photos: z.array(PhotoDTO).optional(),
    faceData: FaceDataDTO,
  }),
  params: z.object({ id: z.string().min(1) }),
});

export const ParamIdDTO = z.object({
  params: z.object({ id: z.string().min(1) }),
});
