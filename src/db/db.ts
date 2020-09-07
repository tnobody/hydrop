export const DB_NAME = "drinky";
export const DB_COLLECTION = "drink-events";

export const getDb = (version = 1) =>
  new Promise<IDBDatabase>((res, rej) => {
    try {
      const request = indexedDB.open(DB_NAME, version);
      request.onupgradeneeded = (event) => {
        try {
          const db = (event.target as any).result as IDBDatabase;
          db.createObjectStore("drink-events", {
            keyPath: "id",
            autoIncrement: true,
          });
        } catch (e) {
          rej(e);
        }
      };
      request.onsuccess = (event) => {
        try {
          const db = (event.target as any).result as IDBDatabase;
          res(db);
        } catch (e) {
          rej(e);
        }
      };
    } catch (e) {
      rej(e);
    }
  });

export const insert = ({ amount, date }: { amount: number; date: number }) =>
  new Promise((res, rej) => {
    getDb().then((db) => {
      const store = db
        .transaction(DB_COLLECTION, "readwrite")
        .objectStore(DB_COLLECTION);
      const req = store.add({ amount, date });
      req.onerror = (e) => rej((e.target as any).error);
      req.onsuccess = res;
    });
  });

export interface DrinkDataEntry {
  amount: number;
  date: number;
  $key: string;
}

export const deleteEntry = async (e: DrinkDataEntry) => {
  const db = await getDb();
  const req = db
    .transaction(DB_COLLECTION, "readwrite")
    .objectStore(DB_COLLECTION)
    .delete(Number(e.$key));

  return new Promise((res, rej) => {
    req.onsuccess = res;
    req.onerror = rej;
  });
};

export const readAll = async ({
  fromDate = -Infinity,
  toDate = Infinity,
}: {
  fromDate?: number;
  toDate?: number;
} = {}) => {
  const db = await getDb();
  return new Promise<DrinkDataEntry[]>((res, rej) => {
    const data: DrinkDataEntry[] = [];
    db
      .transaction(DB_COLLECTION)
      .objectStore(DB_COLLECTION)
      .openCursor().onsuccess = (event) => {
      const cursor = (event.target as any).result as IDBCursorWithValue;
      if (cursor) {
        const { amount, date } = cursor.value;
        if (date >= fromDate && date < toDate) {
          data.push({
            $key: cursor.key.toString(),
            amount: amount,
            date: date,
          });
        }
        cursor.continue();
      } else {
        res([...data].sort((a, b) => a.date - b.date));
      }
    };
  });
};
