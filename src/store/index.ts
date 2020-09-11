import { reactive, readonly, inject, computed, ref } from "vue";
import { DrinkDataEntry, createDb } from "@/db";
import { getTime, startOfDay, endOfDay, isToday as isTodayFn } from "date-fns";

export type CurrentView = "chart" | "table";

export const StoreSymbol = Symbol("store");
export const createStore = (db: ReturnType<typeof createDb>) => {
  const date = ref(getTime(new Date()));
  const drank = ref([] as Omit<DrinkDataEntry, "$key">[]);
  // isToday: computed(() => isToday(state.date)),
  const isToday = computed(() => isTodayFn(date.value));

  // const isTodayState = computed(() => isToday(state.date))

  async function loadData() {
    const newData = await db.readAll({
      fromDate: getTime(startOfDay(date.value)),
      toDate: getTime(endOfDay(date.value)),
    });
    drank.value.splice(0, drank.value.length, ...newData);
  }

  const setDate = async (newDate: number) => {
    date.value = newDate;
    await loadData();
  };

  async function insert(amount: number, date = Date.now()) {
    const entry = { date, amount };
    await db.insert(entry);
    await loadData();
  }

  async function update(
    entry: DrinkDataEntry,
    update: Partial<Omit<DrinkDataEntry, "$key">>
  ) {
    const { $key, ...next } = { ...entry, ...update };
    await db.deleteEntry(entry);
    await db.insert(next);
    await loadData();
  }

  const deleteEntry = async (e: DrinkDataEntry) => {
    await db.deleteEntry(e);
    await loadData();
  };

  const drankAccumulated = computed(() => {
    return [...drank.value]
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

  loadData();

  return {
    drankAccumulated,
    drankToday,
    //...readonly({ date, drank, isToday }),
    date,
    drank,
    isToday,
    loadData,
    deleteEntry,
    insert,
    update,
    setDate,
    // isToday: isTodayState,
  };
};

export const useStore = () =>
  inject<ReturnType<typeof createStore>>(StoreSymbol)!;
