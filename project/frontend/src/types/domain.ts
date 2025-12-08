export type Prompt = { text: string };
export type Photo = { uri: string };

export type FaceData = {
  bounds?: {
    origin: { x: number; y: number };
    size: { width: number; height: number };
  };
  landmarks?: {
    leftEye?: { x: number; y: number };
    rightEye?: { x: number; y: number };
    nose?: { x: number; y: number };
    leftMouth?: { x: number; y: number };
    rightMouth?: { x: number; y: number };
  };
  rollAngle?: number;
  yawAngle?: number;
  smilingProbability?: number;
  imageUri: string;
  capturedAt: string;
};

export type Person = {
  _id: string;
  displayName: string;
  familiarName?: string;
  relationship: string;
  prompts?: Prompt[];
  photos?: Photo[];
  faceData?: FaceData;
  relationshipAudioUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreatePersonDto = {
  displayName: string;
  familiarName?: string;
  relationship: string;
  prompts?: Prompt[];
  photos?: Photo[];
  faceData?: FaceData;
};
