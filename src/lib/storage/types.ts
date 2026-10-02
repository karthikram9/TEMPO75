/**
 * Storage Adapter Interface
 * All storage operations return Promises to allow seamless future substitution
 * with IndexedDB, OPFS (Origin Private File System), or Cloud Sync backends
 * without breaking feature-level consumers.
 */
export interface IStorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

export type StorageBackendType = 'local_storage' | 'indexed_db' | 'in_memory' | 'cloud_sync';
