import type { IStorageAdapter } from './types';
import { LocalStorageAdapter } from './localStorageAdapter';

const DB_NAME = 'tempo75_db';
const DB_VERSION = 1;
const STORE_NAME = 'keyval';
const MIGRATION_FLAG_KEY = 'tempo:migrated:idb:v1';

/**
 * IndexedDBAdapter
 * High-performance, structured, asynchronous storage adapter with automatic
 * non-destructive migration from localStorage and dual-layer fallback.
 */
export class IndexedDBAdapter implements IStorageAdapter {
  private localFallback = new LocalStorageAdapter();
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private isIDBAvailable: boolean;

  constructor() {
    this.isIDBAvailable = typeof window !== 'undefined' && 'indexedDB' in window && Boolean(window.indexedDB);
    if (this.isIDBAvailable) {
      this.dbPromise = this.initDB();
    }
  }

  private async initDB(): Promise<IDBDatabase | null> {
    try {
      if (!this.isIDBAvailable) return null;

      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = (event) => {
          const targetDB = (event.target as IDBOpenDBRequest).result;
          if (!targetDB.objectStoreNames.contains(STORE_NAME)) {
            targetDB.createObjectStore(STORE_NAME);
          }
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error ?? new Error('Failed to open IndexedDB'));
        req.onblocked = () => {
          console.warn('[IndexedDBAdapter] Database opening blocked by older connection');
        };
      });

      // Execute one-time lossless migration from localStorage
      await this.migrateFromLocalStorage(db);

      // Proactively request persistent storage from browser if supported
      this.requestPersistentStorage().catch(() => {});

      return db;
    } catch (err) {
      console.warn('[IndexedDBAdapter] IndexedDB initialization failed, falling back to localStorage:', err);
      this.dispatchStorageWarning('IndexedDB unavailable, operating in local-storage fallback mode');
      return null;
    }
  }

  /**
   * One-time non-destructive migration from localStorage into IndexedDB.
   * Copies existing data without deleting or overwriting valid IndexedDB records.
   */
  private async migrateFromLocalStorage(db: IDBDatabase): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;

      const hasMigrated = await this.readKeyFromStore(db, MIGRATION_FLAG_KEY);
      if (hasMigrated) return;

      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (!key || !key.startsWith('tempo:')) continue;

        try {
          const raw = window.localStorage.getItem(key);
          if (raw !== null) {
            const parsed = JSON.parse(raw);
            // Non-destructive: put item into store
            store.put(parsed, key);
          }
        } catch {
          // If not JSON, save raw string
          const raw = window.localStorage.getItem(key);
          if (raw !== null) {
            store.put(raw, key);
          }
        }
      }

      store.put(true, MIGRATION_FLAG_KEY);

      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(new Error('Migration transaction aborted'));
      });

      console.log('[IndexedDBAdapter] Non-destructive data migration from localStorage completed successfully.');
    } catch (err) {
      console.warn('[IndexedDBAdapter] Migration from localStorage encountered an issue:', err);
    }
  }

  private readKeyFromStore<T>(db: IDBDatabase, key: string): Promise<T | null> {
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);

        req.onsuccess = () => {
          resolve((req.result as T) ?? null);
        };
        req.onerror = () => {
          resolve(null);
        };
      } catch {
        resolve(null);
      }
    });
  }

  private dispatchStorageWarning(message: string, error?: unknown) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('tempo-storage-warning', {
          detail: { message, error, timestamp: Date.now() },
        })
      );
    }
  }

  /**
   * Request persistent storage from the browser/OS so stored data
   * is not evicted under device storage pressure.
   */
  public async requestPersistentStorage(): Promise<boolean> {
    try {
      if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        return isPersisted;
      }
      return false;
    } catch {
      return false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const db = this.dbPromise ? await this.dbPromise : null;
      if (!db) {
        return this.localFallback.get<T>(key);
      }

      const val = await this.readKeyFromStore<T>(db, key);
      if (val !== null) {
        return val;
      }

      // Fallback check in localStorage in case written before DB connected
      const fallbackVal = await this.localFallback.get<T>(key);
      if (fallbackVal !== null) {
        // Backfill to IDB
        void this.set(key, fallbackVal);
        return fallbackVal;
      }

      return null;
    } catch (err) {
      console.error(`[IndexedDBAdapter] Error reading key "${key}":`, err);
      return this.localFallback.get<T>(key);
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      // 1. Dual-write to localStorage for immediate synchronous fallback
      try {
        await this.localFallback.set<T>(key, value);
      } catch {
        // LocalStorage quota may be exceeded; proceed to IndexedDB
      }

      // 2. Write to IndexedDB
      const db = this.dbPromise ? await this.dbPromise : null;
      if (db) {
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          store.put(value, key);

          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error ?? new Error('IDB Put transaction failed'));
          tx.onabort = () => reject(new Error('IDB Put transaction aborted'));
        });
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tempo-storage-change', { detail: { key } }));
      }
    } catch (err) {
      console.error(`[IndexedDBAdapter] Failed to set key "${key}":`, err);
      this.dispatchStorageWarning(`Failed to persist data for key: ${key}`, err);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await this.localFallback.remove(key);

      const db = this.dbPromise ? await this.dbPromise : null;
      if (db) {
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          store.delete(key);

          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error ?? new Error('IDB Delete transaction failed'));
          tx.onabort = () => reject(new Error('IDB Delete transaction aborted'));
        });
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tempo-storage-change', { detail: { key } }));
      }
    } catch (err) {
      console.error(`[IndexedDBAdapter] Failed to remove key "${key}":`, err);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.localFallback.clear();

      const db = this.dbPromise ? await this.dbPromise : null;
      if (db) {
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          store.clear();

          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error ?? new Error('IDB Clear transaction failed'));
          tx.onabort = () => reject(new Error('IDB Clear transaction aborted'));
        });
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tempo-storage-change', { detail: { key: '*' } }));
      }
    } catch (err) {
      console.error('[IndexedDBAdapter] Failed to clear storage:', err);
    }
  }

  async keys(): Promise<string[]> {
    try {
      const db = this.dbPromise ? await this.dbPromise : null;
      if (!db) {
        return this.localFallback.keys();
      }

      return new Promise<string[]>((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.getAllKeys();

          req.onsuccess = () => {
            const rawKeys = req.result;
            const strKeys = rawKeys.map((k) => String(k)).filter((k) => k !== MIGRATION_FLAG_KEY);
            resolve(strKeys);
          };
          req.onerror = () => {
            resolve(this.localFallback.keys());
          };
        } catch {
          resolve(this.localFallback.keys());
        }
      });
    } catch (err) {
      console.error('[IndexedDBAdapter] Failed to read keys:', err);
      return this.localFallback.keys();
    }
  }
}
