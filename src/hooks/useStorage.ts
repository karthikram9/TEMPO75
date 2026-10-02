import { useCallback, useEffect, useState } from 'react';
import { storage } from '@/lib/storage';

/**
 * Reactive hook to get and update persisted values through the storage abstraction.
 */
export function useStorage<T>(
  key: string,
  initialValue: T
): [T, (val: T | ((prev: T) => T)) => Promise<void>, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const stored = await storage.get<T>(key);
        if (isMounted) {
          if (stored !== null) {
            setValue(stored);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error(`[useStorage] Error reading key "${key}":`, err);
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [key]);

  const update = useCallback(
    async (updater: T | ((prev: T) => T)) => {
      setValue((current) => {
        const next = typeof updater === 'function' ? (updater as (prev: T) => T)(current) : updater;
        storage.set(key, next).catch((err) => {
          console.error(`[useStorage] Error writing key "${key}":`, err);
        });
        return next;
      });
    },
    [key]
  );

  return [value, update, isLoading];
}
