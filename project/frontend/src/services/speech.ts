/**
 * Speech API service - handles TTS requests to backend
 */
import { API } from './api';

export const SpeechAPI = {
  /**
   * Get the audio URL for a person's relationship announcement
   */
  relationshipUrl: async (personId: string): Promise<string> => {
    try {
      const { data } = await API.post('/speech/relationship', { personId });
      
      // data.url is a relative path; build absolute URL
      const base = API.defaults.baseURL?.replace(/\/$/, '') || '';
      const fullUrl = `${base}${data.url}`;
      
      console.log('Speech URL:', fullUrl);
      return fullUrl;
    } catch (error: any) {
      console.error('Speech API error:', error.response?.data || error.message);
      
      // Provide more context about the error
      if (error.response?.status === 503) {
        throw new Error('Speech service unavailable - ElevenLabs not configured');
      }
      if (error.response?.status === 404) {
        throw new Error('Person not found');
      }
      
      throw error;
    }
  },
};
