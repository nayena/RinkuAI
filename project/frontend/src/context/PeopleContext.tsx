/**
 * People Context - central data store for people-related data and functions
 */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { PeopleAPI } from "../services/people";
import { CreatePersonDto, Person } from "../types/domain";

type Ctx = {
  people: Person[];
  loading: boolean;
  refresh: () => Promise<void>;
  add: (p: Omit<Person, "_id">) => Promise<Person>;
  update: (id: string, updates: Partial<CreatePersonDto>) => Promise<Person>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => Person | undefined;
};

const PeopleCtx = createContext<Ctx | null>(null);

export function PeopleProvider({ children }: { children: React.ReactNode }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const next = await PeopleAPI.list();
      setPeople(next);
    } catch (error) {
      console.error("Failed to load people", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(
    async (p: Omit<Person, "_id">): Promise<Person> => {
      const payload: CreatePersonDto = {
        displayName: p.displayName,
        familiarName: p.familiarName,
        relationship: p.relationship,
        prompts: p.prompts,
        photos: p.photos,
      };
      const newPerson = await PeopleAPI.create(payload);
      await refresh();
      return newPerson;
    },
    [refresh],
  );

  const update = useCallback(
    async (id: string, updates: Partial<CreatePersonDto>): Promise<Person> => {
      const updatedPerson = await PeopleAPI.update(id, updates);
      await refresh();
      return updatedPerson;
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string): Promise<void> => {
      await PeopleAPI.delete(id);
      await refresh();
    },
    [refresh],
  );

  const getById = useCallback(
    (id: string): Person | undefined => {
      return people.find((p) => p._id === id);
    },
    [people],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <PeopleCtx.Provider value={{ people, loading, refresh, add, update, remove, getById }}>
      {children}
    </PeopleCtx.Provider>
  );
}

export const usePeople = () => {
  const ctx = useContext(PeopleCtx);
  if (!ctx) throw new Error("usePeople must be used within PeopleProvider");
  return ctx;
};
