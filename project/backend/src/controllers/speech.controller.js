const SpeechService = require('../modules/speech/speech.service');

const SpeechController = {
    relationshipUrl: async (req, res) => {
        const audio = await SpeechService.relationshipUrl(req.body.personId);
        res.json(audio);
    },
    relationshipMp3: async (req, res) => {
        const audio = await SpeechService.relationshipUrl(req.params.id);
        res.json(audio);
    }
};

module.exports = SpeechController;
