const { z } = require('zod');

const PromptDTO = z.object({ text: z.string().min(1) });
const PhotoDTO  = z.object({ uri: z.string().url() });

const CreatePersonDTO = z.object({
    body: z.object({
        displayName: z.string().min(1),
        familiarName: z.string().optional(),
        relationship: z.string().min(1),
        prompts: z.array(PromptDTO).optional(),
        photos: z.array(PhotoDTO).optional()
    })
}); // all propertires are optional because we might only want to update one field

const UpdatePersonDTO = z.object({
    body: z.object({
        displayName: z.string().optional(),
        familiarName: z.string().optional(),
        relationship: z.string().optional(),
        prompts: z.array(PromptDTO).optional(),
        photos: z.array(PhotoDTO).optional()
    }),
    params: z.object({ id: z.string().min(1) })
});

const ParamIdDTO = z.object({ params: z.object({ id: z.string().min(1) }) });

module.exports = { CreatePersonDTO, UpdatePersonDTO, ParamIdDTO };
