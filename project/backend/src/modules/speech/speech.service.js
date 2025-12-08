/**
 * Speech service - TTS generation with in-memory caching
 */
import PeopleService from '../people/people.service.js';
import { synthesizeRelationshipLine } from '../../libs/tts.elevenlabs.js';

// In-memory cache for MP3 buffers (keyed by personId)
const cache = new Map();

const SpeechService = {
  /**
   * Returns the URL path to stream the relationship audio
   */
  getRelationshipUrl(personId) {
    return `/speech/relationship/${personId}`;
  },

  /**
   * Generates or retrieves cached MP3 for the relationship line
   */
  async getOrCreateMp3(personId) {
    // Return cached version if available
    if (cache.has(personId)) {
      return cache.get(personId);
    }

    // Get the person to build the text
    const person = await PeopleService.getOrThrow(personId);
    const text = `I think this is ${person.familiarName || person.displayName}, your ${person.relationship}.`;

    // Generate the MP3
    const mp3Buffer = await synthesizeRelationshipLine(text);

    // Cache it
    cache.set(personId, mp3Buffer);

    return mp3Buffer;
  },

  /**
   * Clears the cache for a specific person (useful when person is updated)
   */
  clearCache(personId) {
    cache.delete(personId);
  },
};

export default SpeechService;
