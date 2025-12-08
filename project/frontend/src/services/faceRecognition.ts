/**
 * Face Recognition Service (MVP Version)
 * 
 * This version works with Expo Go without native modules.
 * For production, you would use:
 * - expo-face-detector (requires dev build)
 * - Cloud face recognition API (AWS Rekognition, Azure Face)
 * - TensorFlow Lite face embeddings
 */
import { Person, FaceData } from '../types/domain';

export interface DetectionResult {
  detected: boolean;
  message: string;
}

export interface MatchResult {
  matched: boolean;
  person: Person | null;
  confidence: number;
  message: string;
}

/**
 * Validate a photo for face recognition (MVP - just checks if photo exists)
 * In production, this would use actual face detection
 */
export async function validateFacePhoto(imageUri: string): Promise<{
  valid: boolean;
  message: string;
}> {
  // MVP: Just validate that we have an image
  if (!imageUri) {
    return { valid: false, message: 'No image provided' };
  }
  
  // In a production app, we would:
  // 1. Use expo-face-detector (requires dev build)
  // 2. Or send to a cloud API for face detection
  // 3. Or use TensorFlow Lite
  
  return { 
    valid: true, 
    message: 'Photo saved! (Face detection requires a development build)',
  };
}

/**
 * Create face data from a photo (MVP version)
 */
export function createFaceData(imageUri: string): FaceData {
  return {
    imageUri,
    capturedAt: new Date().toISOString(),
  };
}

/**
 * Match a photo against stored people (MVP version)
 * Returns the best match based on stored photos
 * 
 * For production, this would compare face embeddings
 */
export async function matchFace(
  _capturedPhotoUri: string,
  people: Person[]
): Promise<MatchResult> {
  // MVP: Match against people who have photos
  // In production, we would compare face embeddings
  
  const peopleWithPhotos = people.filter(p => 
    p.photos && p.photos.length > 0 && p.photos[0].uri
  );
  
  if (peopleWithPhotos.length > 0) {
    // Return the first person with a photo as the "match"
    // This is a placeholder - real face matching would compare embeddings
    const matchedPerson = peopleWithPhotos[0];
    
    return {
      matched: true,
      person: matchedPerson,
      confidence: 0.85, // Placeholder confidence
      message: 'Matched (MVP mode - add development build for real face recognition)',
    };
  }
  
  // If no one has photos, just return the first person
  if (people.length > 0) {
    return {
      matched: true,
      person: people[0],
      confidence: 0.5,
      message: 'No face photos stored - using first person',
    };
  }
  
  return {
    matched: false,
    person: null,
    confidence: 0,
    message: 'No people in memory cards',
  };
}

/**
 * Check if face detection is available
 * (Requires development build with expo-face-detector)
 */
export function isFaceDetectionAvailable(): boolean {
  // In Expo Go, native face detection is not available
  return false;
}

// Re-export FaceData type for convenience
export type { FaceData };
