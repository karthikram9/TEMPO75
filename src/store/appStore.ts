import type { AppSettings } from '@/types';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { storage } from '@/lib/storage';

export const DEFAULT_APP_SETTINGS: AppSettings = {
  version: '1.0.0',
  storageVersion: 1,
  activeChallengeId: null,
  debugMode: false,
  notificationsEnabled: false,
};

export async function getAppSettings(): Promise<AppSettings> {
  const settings = await storage.get<AppSettings>(STORAGE_KEYS.APP_SETTINGS);
  return settings ?? DEFAULT_APP_SETTINGS;
}

export async function updateAppSettings(
  partial: Partial<AppSettings>
): Promise<AppSettings> {
  const current = await getAppSettings();
  const updated: AppSettings = { ...current, ...partial };
  await storage.set(STORAGE_KEYS.APP_SETTINGS, updated);
  return updated;
}
