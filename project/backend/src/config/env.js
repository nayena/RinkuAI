/**
 * Environment configuration helper
 * Note: dotenv/config must be imported in server.js before this is used
 */

export function getEnv() {
  return {
    PORT: parseInt(process.env.PORT || '4000', 10),
    MONGO_URL: process.env.MONGO_URL,
    ELEVEN_API_KEY: process.env.ELEVEN_API_KEY || '',
    ELEVEN_VOICE_ID: process.env.ELEVEN_VOICE_ID || '',
  };
}
