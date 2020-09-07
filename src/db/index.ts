import { insert, readAll, deleteEntry } from "./db";
import { inject } from "vue";

export { DrinkDataEntry } from "./db";
export const DbSymbol = Symbol("db");

export const createDb = () => {
  return {
    insert,
    readAll,
    deleteEntry
  };
};

export const useDb = () => inject<ReturnType<typeof createDb>>(DbSymbol)!;
