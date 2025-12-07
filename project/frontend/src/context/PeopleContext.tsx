/**
 * This class acts like a central data
 * store for  all people-related data and functions
 */
import { createContext, useContext, useEffect, useState } from "react";
import { PeopleAPI } from "../services/people";
import { Person } from "../types/domain";

type Ctx = {
  people: Person[];
  refresh: () => Promise<void>;
  add: (p: Omit<Person, "_id">) => Promise<void>;
};

const PeopleCtx = createContext<Ctx | null>(null);

export function PeopleProvider({ children }: { children: React.ReactNode }) {
  const [people, setPeople] = useState<Person[]>([]);
  const refresh = async () => setPeople(await PeopleAPI.list());
  const add = async (p: Omit<Person, "_id">) => {
    await PeopleAPI.create(p as any);
    await refresh();
  };
  useEffect(() => { refresh(); }, []);
  return <PeopleCtx.Provider value={{ people, refresh, add }}>{children}</PeopleCtx.Provider>;
}
export const usePeople = () => {
  const ctx = useContext(PeopleCtx);
  if (!ctx) throw new Error("usePeople outside provider");
  return ctx;
};
