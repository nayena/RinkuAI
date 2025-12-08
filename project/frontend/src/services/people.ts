import { API } from "./api";
import { CreatePersonDto, Person } from "../types/domain";

export const PeopleAPI = {
  list: async (): Promise<Person[]> => {
    const { data } = await API.get("/people");
    return data;
  },

  get: async (id: string): Promise<Person> => {
    const { data } = await API.get(`/people/${id}`);
    return data;
  },

  create: async (dto: CreatePersonDto): Promise<Person> => {
    const { data } = await API.post("/people", dto);
    return data;
  },

  update: async (id: string, dto: Partial<CreatePersonDto>): Promise<Person> => {
    const { data } = await API.put(`/people/${id}`, dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await API.delete(`/people/${id}`);
  },
};
