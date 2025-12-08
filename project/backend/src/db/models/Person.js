/**
 * Person model - Mongoose schema for loved ones
 */
import { Schema, model } from 'mongoose';

const PromptSchema = new Schema(
  { text: { type: String, required: true } },
  { _id: false }
);

const PhotoSchema = new Schema(
  { uri: { type: String, required: true } },
  { _id: false }
);

const FaceDataSchema = new Schema(
  {
    bounds: {
      origin: {
        x: Number,
        y: Number,
      },
      size: {
        width: Number,
        height: Number,
      },
    },
    landmarks: {
      leftEye: { x: Number, y: Number },
      rightEye: { x: Number, y: Number },
      nose: { x: Number, y: Number },
      leftMouth: { x: Number, y: Number },
      rightMouth: { x: Number, y: Number },
    },
    rollAngle: Number,
    yawAngle: Number,
    smilingProbability: Number,
    imageUri: String,
    capturedAt: String,
  },
  { _id: false }
);

const PersonSchema = new Schema(
  {
    displayName: { type: String, required: true },
    familiarName: String,
    relationship: { type: String, required: true },
    prompts: [PromptSchema],
    photos: [PhotoSchema],
    faceData: FaceDataSchema,
    relationshipAudioUrl: String,
  },
  { timestamps: true }
);

export const PersonModel = model('Person', PersonSchema);
