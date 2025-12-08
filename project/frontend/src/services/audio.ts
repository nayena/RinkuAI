/**
 * Audio service - handles audio playback
 * Using expo-av for now (deprecation warning is cosmetic, still works in SDK 54)
 */
import { Audio, AVPlaybackStatus } from 'expo-av';

let currentSound: Audio.Sound | null = null;

/**
 * Configure audio mode for playback
 */
async function configureAudio(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    console.log('[Audio] Mode configured successfully');
  } catch (error) {
    console.warn('[Audio] Failed to configure audio mode:', error);
  }
}
/**
 * Play audio from a URL
 */
export async function playUrl(url: string): Promise<void> {
  console.log('[Audio] Attempting to play:', url);
  
  try {
    // Stop any currently playing audio
    if (currentSound) {
      console.log('[Audio] Stopping previous sound');
      await currentSound.unloadAsync();
      currentSound = null;
    }

    // Configure audio mode
    await configureAudio();

    // Create and play the sound
    console.log('[Audio] Creating sound from URL...');
    const { sound, status } = await Audio.Sound.createAsync(
      { uri: url },
      { 
        shouldPlay: true, 
        volume: 1.0,
        progressUpdateIntervalMillis: 500,
      }
    );

    currentSound = sound;
    console.log('[Audio] Sound created, status:', status);

    // Set up status update handler
    sound.setOnPlaybackStatusUpdate((playbackStatus: AVPlaybackStatus) => {
      if (!playbackStatus.isLoaded) {
        // Error state
        if (playbackStatus.error) {
          console.error('[Audio] Playback error:', playbackStatus.error);
        }
      } else {
        // Loaded state
        if (playbackStatus.didJustFinish) {
          console.log('[Audio] Playback finished');
          sound.unloadAsync();
          currentSound = null;
        }
      }
    });

    // Ensure playback starts
    const playResult = await sound.playAsync();
    console.log('[Audio] Play result:', playResult);
    
  } catch (error: any) {
    console.error('[Audio] Playback failed:', error.message || error);
    throw error;
  }
}

/**
 * Stop any currently playing audio
 */
export async function stopAudio(): Promise<void> {
  if (currentSound) {
    console.log('[Audio] Stopping audio');
    try {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    } catch (e) {
      console.warn('[Audio] Error stopping:', e);
    }
    currentSound = null;
  }
}
