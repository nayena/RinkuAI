/**
 * Speech controller - handles TTS audio generation and streaming
 */
import SpeechService from '../modules/speech/speech.service.js';

const SpeechController = {
  /**
   * POST /speech/relationship - returns URL to stream the audio
   */
  async relationshipUrl(req, res, next) {
    try {
      const url = SpeechService.getRelationshipUrl(req.body.personId);
      res.json({ url });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /speech/relationship/:id - streams the MP3 audio
   */
  async relationshipMp3(req, res, next) {
    try {
      const mp3Buffer = await SpeechService.getOrCreateMp3(req.params.id);
      res.set('Content-Type', 'audio/mpeg');
      res.set('Content-Length', mp3Buffer.length);
      res.send(mp3Buffer);
    } catch (err) {
      next(err);
    }
  },
};

export default SpeechController;
