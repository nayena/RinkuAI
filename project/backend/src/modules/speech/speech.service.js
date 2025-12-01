const PeopleService = require('../people/people.service');
const { synthesizeRelationshipLine } = require('../../libs/tts.elevenlabs');

const cache = new Map();

const SpeechService = {
  relationshipUrl(personId){ return `/speech/relationship/${personId}`; },
  async getOrCreateMp3(personId){
    if (cache.has(personId)) return cache.get(personId);
    const p = await PeopleService.getOrThrow(personId);
    const text = `I think this is ${p.familiarName || p.displayName}, your ${p.relationship}.`;
    const mp3 = await synthesizeRelationshipLine(text);
    cache.set(personId, mp3);
    return mp3;
  }
};

module.exports = SpeechService;
