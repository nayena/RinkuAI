/**
 * Responsibility: The low-level HTTP call to ElevenLabs TTS.
 * Inputs: text to speak; reads ELEVEN_API_KEY and ELEVEN_VOICE_ID from env.
 * Output: Buffer of audio/mpeg.
 * Keeps third-party details out of services (single responsibility).
 */

import fetch from "node-fetch";
import { env } from "../config/env.js";

export async function synthesizeRelationshipLine(text) {
  if (!env.ELEVEN_API_KEY || !env.ELEVEN_VOICE_ID) throw new Error("Missing ElevenLabs env");
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${env.ELEVEN_VOICE_ID}`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": env.ELEVEN_API_KEY,
      "Content-Type": "application/json",
      "Accept": "audio/mpeg"
    },
    body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings:{ stability:0.5, similarity_boost:0.7 } })
  });
  if (!r.ok) throw new Error(`TTS failed: ${r.status} ${await r.text()}`);
  return Buffer.from(await r.arrayBuffer());
}

