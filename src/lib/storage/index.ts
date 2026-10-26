import { IndexedDBAdapter } from './indexedDBAdapter';
import type { IStorageAdapter } from './types';

export * from './types';
export * from './keys';
export * from './localStorageAdapter';
export * from './indexedDBAdapter';

/**
 * Global canonical storage instance for TEMPO 75.
 * Backed by IndexedDB for high-capacity, structured offline persistence,
 * with automatic non-destructive migration from localStorage and dual-layer fallback.
 */
export const storage: IStorageAdapter = new IndexedDBAdapter();
