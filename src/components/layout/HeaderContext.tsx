import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

  // Mobile Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

  const location = useLocation();
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  // Close drawer automatically whenever route changes (React recommended pattern)
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setIsDrawerOpen(false);
  }

  // Close drawer if window is resized to desktop width (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    if (isDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isDrawerOpen]);

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
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    }),
    [
      headerConfig,
      setHeaderConfig,
      resetHeaderConfig,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    ]
  );

  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
};
