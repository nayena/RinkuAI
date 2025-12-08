/**
 * ElevenLabs TTS integration
 * Handles the low-level HTTP call to ElevenLabs API
 */

/**
 * Synthesizes text to speech using ElevenLabs API
 * @param {string} text - The text to synthesize
 * @returns {Promise<Buffer>} - The audio/mpeg buffer
 */
export async function synthesizeRelationshipLine(text) {
  const apiKey = process.env.ELEVEN_API_KEY;
  const voiceId = process.env.ELEVEN_VOICE_ID;

  if (!apiKey || !voiceId) {
    const err = new Error('Missing ElevenLabs environment variables (ELEVEN_API_KEY, ELEVEN_VOICE_ID)');
    err.status = 503;
    throw err;
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const err = new Error(`ElevenLabs TTS failed: ${response.status} - ${errorText}`);
    err.status = 502;
    throw err;
  }

  return Buffer.from(await response.arrayBuffer());
}
