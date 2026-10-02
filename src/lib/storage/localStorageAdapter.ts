import type { IStorageAdapter } from './types';

/**
 * LocalStorageAdapter
 * Production-ready implementation of IStorageAdapter using window.localStorage
 * with in-memory fallback for private browsing or restricted environments.
 */
export class LocalStorageAdapter implements IStorageAdapter {
  private fallbackMemory = new Map<string, string>();
  private isLocalStorageAvailable: boolean;

  constructor() {
    this.isLocalStorageAvailable = this.testAvailability();
  }

  private testAvailability(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__tempo_storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      let raw: string | null = null;
      if (this.isLocalStorageAvailable) {
        raw = window.localStorage.getItem(key);
      } else {
        raw = this.fallbackMemory.get(key) ?? null;
      }

      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.error(`[LocalStorageAdapter] Failed to parse key "${key}":`, err);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (this.isLocalStorageAvailable) {
        window.localStorage.setItem(key, serialized);
      } else {
        this.fallbackMemory.set(key, serialized);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tempo-storage-change', { detail: { key } }));
      }
    } catch (err) {
      console.error(`[LocalStorageAdapter] Failed to write key "${key}":`, err);
      // Fallback in case quota is exceeded
      this.fallbackMemory.set(key, JSON.stringify(value));
    }
  }

  async remove(key: string): Promise<void> {
    try {
      if (this.isLocalStorageAvailable) {
        window.localStorage.removeItem(key);
      }
      this.fallbackMemory.delete(key);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tempo-storage-change', { detail: { key } }));
      }
    } catch (err) {
      console.error(`[LocalStorageAdapter] Failed to remove key "${key}":`, err);
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.isLocalStorageAvailable) {
        window.localStorage.clear();
      }
      this.fallbackMemory.clear();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tempo-storage-change', { detail: { key: '*' } }));
      }
    } catch (err) {
      console.error('[LocalStorageAdapter] Failed to clear storage:', err);
    }
  }

  async keys(): Promise<string[]> {
    try {
      if (this.isLocalStorageAvailable) {
        return Object.keys(window.localStorage);
      }
      return Array.from(this.fallbackMemory.keys());
    } catch (err) {
      console.error('[LocalStorageAdapter] Failed to read keys:', err);
      return [];
    }
  }
}
