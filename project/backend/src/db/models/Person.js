const { Schema, model } = require('mongoose');

const PromptSchema = new Schema({ text: { type: String, required: true } }, { _id: false });
const PhotoSchema  = new Schema({ uri: { type: String, required: true } }, { _id: false });

const PersonSchema = new Schema({
  displayName: { type: String, required: true },
  familiarName: String,
  relationship: { type: String, required: true },
  prompts: [PromptSchema],
  photos: [PhotoSchema],
  relationshipAudioUrl: String
}, { timestamps: true });

const PersonModel = model('Person', PersonSchema);

module.exports = { PersonModel };
