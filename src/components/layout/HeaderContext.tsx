import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  HeaderContext,
  defaultHeaderConfig,
  type MobileHeaderConfig,
} from './headerContextDef';

function areConfigsEqual(
  prev: MobileHeaderConfig,
  next: MobileHeaderConfig,
  prevHasBack: boolean,
  nextHasBack: boolean
): boolean {
  return (
    prev.title === next.title &&
    prev.subtitle === next.subtitle &&
    Boolean(prev.showBack) === Boolean(next.showBack) &&
    prevHasBack === nextHasBack &&
    prev.badge === next.badge &&
    prev.rightAction === next.rightAction
  );
}

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [headerConfig, setHeaderConfigState] = useState<MobileHeaderConfig>(defaultHeaderConfig);
  const currentConfigRef = useRef<MobileHeaderConfig>(defaultHeaderConfig);
  const onBackCallbackRef = useRef<(() => void) | undefined>(undefined);

  const stableOnBack = useCallback(() => {
    if (onBackCallbackRef.current) {
      onBackCallbackRef.current();
    }
  }, []);

  const setHeaderConfig = useCallback(
    (config: MobileHeaderConfig) => {
      onBackCallbackRef.current = config.onBack;

      const prev = currentConfigRef.current;
      const prevHasBack = Boolean(prev.onBack);
      const nextHasBack = Boolean(config.onBack);

      if (areConfigsEqual(prev, config, prevHasBack, nextHasBack)) {
        return;
      }

      const nextConfig: MobileHeaderConfig = {
        ...prev,
        ...config,
        onBack: nextHasBack ? stableOnBack : undefined,
      };

      currentConfigRef.current = nextConfig;
      setHeaderConfigState(nextConfig);
    },
    [stableOnBack]
  );

  const resetHeaderConfig = useCallback(() => {
    onBackCallbackRef.current = undefined;

    const prev = currentConfigRef.current;
    const prevHasBack = Boolean(prev.onBack);
    const defaultHasBack = Boolean(defaultHeaderConfig.onBack);

    if (areConfigsEqual(prev, defaultHeaderConfig, prevHasBack, defaultHasBack)) {
      return;
    }

    currentConfigRef.current = defaultHeaderConfig;
    setHeaderConfigState(defaultHeaderConfig);
  }, []);

  const value = useMemo(
    () => ({
      headerConfig,
      setHeaderConfig,
      resetHeaderConfig,
    }),
    [headerConfig, setHeaderConfig, resetHeaderConfig]
  );

  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
};
