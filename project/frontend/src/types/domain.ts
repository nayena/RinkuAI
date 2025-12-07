export type Prompt = { text: string };
export type Photo = { uri: string };

export type Person = {
  _id: string;
  displayName: string;
  familiarName?: string;
  relationship: string;
  prompts?: Prompt[];
  photos?: Photo[];
  relationshipAudioUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreatePersonDto = {
  displayName: string;
  familiarName?: string;
  relationship: string;
  prompts?: Prompt[];
  photos?: Photo[];
};
