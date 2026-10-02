export * from './domain';

export type NavTabId = 'foundation' | 'dashboard' | 'workout' | 'progress' | 'analytics' | 'profile';

export interface NavItem {
  id: NavTabId;
  label: string;
  path: string;
  iconName: string;
}
