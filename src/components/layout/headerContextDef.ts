import { createContext } from 'react';
import type React from 'react';

export interface MobileHeaderConfig {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  badge?: React.ReactNode;
}

export interface HeaderContextType {
  headerConfig: MobileHeaderConfig;
  setHeaderConfig: (config: MobileHeaderConfig) => void;
  resetHeaderConfig: () => void;
}

export const defaultHeaderConfig: MobileHeaderConfig = {
  title: 'TEMPO 75',
  subtitle: 'PERFORMANCE',
  showBack: false,
};

export const HeaderContext = createContext<HeaderContextType | undefined>(undefined);
