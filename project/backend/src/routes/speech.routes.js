/**
 * Speech routes - TTS audio generation and streaming
 */
import { Router } from 'express';
import SpeechController from '../controllers/speech.controller.js';
import { validate } from '../middlewares/validate.js';
import { SpeakDTO, ParamIdDTO } from '../modules/speech/speech.types.js';

const speechRouter = Router();

speechRouter.post('/relationship', validate(SpeakDTO), SpeechController.relationshipUrl);
speechRouter.get('/relationship/:id', validate(ParamIdDTO), SpeechController.relationshipMp3);

export default speechRouter;
