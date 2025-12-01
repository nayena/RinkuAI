const { Router } = require('express');
const SpeechController = require('../controllers/speech.controller');
const { validate } = require('../middlewares/validate');
const { SpeakDTO, ParamIdDTO } = require('../modules/speech/speech.types');

const speechRouter = Router();
speechRouter.post('/relationship', validate(SpeakDTO), SpeechController.relationshipUrl);
speechRouter.get('/relationship/:id', validate(ParamIdDTO), SpeechController.relationshipMp3);

module.exports = speechRouter;
