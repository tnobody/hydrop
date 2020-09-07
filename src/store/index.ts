import { reactive, readonly, inject, onMounted, watch, computed } from "vue";
import { DrinkDataEntry, useDb, createDb } from "@/db";
import { getTime, startOfDay, endOfDay } from "date-fns";

export type CurrentView = "chart" | "table";

export const StoreSymbol = Symbol("store");
export const createStore = (db: ReturnType<typeof createDb>) => {
  const state = reactive({
    currentView: "chart" as CurrentView,
    date: getTime(new Date()),
    drank: [] as Omit<DrinkDataEntry, "$key">[],
  });

  async function loadData() {
    const newData = await db.readAll({
      fromDate: getTime(startOfDay(state.date)),
      toDate: getTime(endOfDay(state.date)),
    })
    state.drank.splice(0, state.drank.length, ...newData);
  }

  const setDate = async (date: number) => {
    state.date = date;
    await loadData()
  };

  async function insert(amount: number, date = Date.now()) {
    const entry = { date, amount };
    await db.insert(entry);
    await loadData()
  }

  async function update(entry: DrinkDataEntry, update: Partial<Omit<DrinkDataEntry, '$key'>>) {
    const {$key, ...next} = {...entry, ...update}
    await db.deleteEntry(entry)
    await db.insert(next)
    await loadData()
  }

  const toggleCurrentView = () => {
    state.currentView = state.currentView === "chart" ? "table" : "chart";
  };

  const deleteEntry = async (e: DrinkDataEntry) => {
    await db.deleteEntry(e)
    await loadData()
  }

  const drankAccumulated = computed(() => {
    return [...state.drank]
      .sort((a, b) => a.date - b.date)
      .reduce((acc, curr) => {
        const lastAccItem = acc[acc.length - 1];
        const last = lastAccItem ? lastAccItem.amountAccumulated : 0;
        return [...acc, { ...curr, amountAccumulated: last + curr.amount }];
      }, [] as (Omit<DrinkDataEntry, "$key"> & { amountAccumulated: number })[]);
  });
  const drankToday = computed(() => {
    return drankAccumulated.value
      .reduce(
        (max, { amountAccumulated }) => Math.max(max, amountAccumulated),
        0
      )
      .toFixed(1);
  });

  loadData()

  return {
    drankAccumulated,
    drankToday,
    loadData,
    deleteEntry,
    insert,
    update,
    setDate,
    toggleCurrentView,
    state: readonly(state),
  };
};

export const useStore = () =>
  inject<ReturnType<typeof createStore>>(StoreSymbol)!;
