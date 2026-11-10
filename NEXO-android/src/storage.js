import { Capacitor } from '@capacitor/core';

const DB_NAME = 'nexora_db';
const TABLE = 'app_kv';
const cache = new Map();
let sqlite = null;
let writeQueue = Promise.resolve();
let storageErrorHandler = () => {};

function reportError(error) {
  try { storageErrorHandler(error); } catch (_) {}
}

export function onStorageError(handler) {
  storageErrorHandler = typeof handler === 'function' ? handler : () => {};
}

async function openNativeDatabase() {
  // SQLite plugin is provided by @capacitor-community/sqlite on Android.
  const { SQLiteConnection, CapacitorSQLite } = await import('@capacitor-community/sqlite');
  const connection = new SQLiteConnection(CapacitorSQLite);
  sqlite = await connection.createConnection(DB_NAME, false, 'no-encryption', 1, false);
  await sqlite.open();
  await sqlite.execute(`CREATE TABLE IF NOT EXISTS ${TABLE} (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  )`);
  const result = await sqlite.query(`SELECT key, value FROM ${TABLE}`);
  for (const row of (result.values || [])) {
    try { cache.set(row.key, JSON.parse(row.value)); } catch (_) {}
  }
}

export async function initializeStorage() {
  if (Capacitor.isNativePlatform()) {
    // Do not silently fall back to localStorage on Android: that would risk split data.
    await openNativeDatabase();
  } else {
    for (const key of ['nexora_clients_v2', 'nexora_alerted_v3', 'nexora_sep']) {
      try {
        const raw = localStorage.getItem(key);
        if (raw !== null) cache.set(key, JSON.parse(raw));
      } catch (_) {}
    }
  }
  return { native: Capacitor.isNativePlatform() };
}

export function storageGet(key, fallback) {
  return cache.has(key) ? cache.get(key) : fallback;
}

export function storageSet(key, value) {
  cache.set(key, value);
  const serialized = JSON.stringify(value);

  if (!Capacitor.isNativePlatform()) {
    try {
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      reportError(error);
      return false;
    }
  }

  // Serialize writes so rapid edits cannot overtake one another.
  writeQueue = writeQueue.then(async () => {
    if (!sqlite) throw new Error('La base de datos SQLite no está abierta.');
    await sqlite.run(
      `INSERT OR REPLACE INTO ${TABLE} (key, value) VALUES (?, ?)`,
      [key, serialized]
    );
  }).catch(error => {
    // Keep the queue usable for later saves while surfacing the failure to the UI.
    reportError(error);
  });
  // The in-memory cache is updated synchronously; persistence is queued.
  return true;
}

export async function flushStorage() {
  await writeQueue;
}
