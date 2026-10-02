import { LocalStorageAdapter } from './localStorageAdapter';
import type { IStorageAdapter } from './types';

export * from './types';
export * from './keys';
export * from './localStorageAdapter';

/**
 * Global storage instance for TEMPO 75.
 * Can be swapped for an IndexedDB or Cloud adapter without updating feature code.
 */
export const storage: IStorageAdapter = new LocalStorageAdapter();
