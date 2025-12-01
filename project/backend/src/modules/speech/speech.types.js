const { z } = require('zod');

const SpeakDTO = z.object({ body: z.object({ personId: z.string().min(1) }) });
const ParamIdDTO = z.object({ params: z.object({ id: z.string().min(1) }) });

module.exports = { SpeakDTO, ParamIdDTO };
