import { useContext, useEffect } from 'react';
import {
  HeaderContext,
  type MobileHeaderConfig,
} from '@/components/layout/headerContextDef';

/**
 * Reusable hook for child routes/screens to declaratively configure the MobileHeader.
 * Automatically resets when the component unmounts.
 */
export function useMobileHeader(config?: MobileHeaderConfig) {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useMobileHeader must be used within a HeaderProvider');
  }

  const { setHeaderConfig, resetHeaderConfig } = context;

  // Extract primitive dependencies to prevent perpetual re-renders on inline literals
  const title = config?.title;
  const subtitle = config?.subtitle;
  const showBack = config?.showBack;
  const onBack = config?.onBack;
  const rightAction = config?.rightAction;
  const badge = config?.badge;

  useEffect(() => {
    if (
      title !== undefined ||
      subtitle !== undefined ||
      showBack !== undefined ||
      onBack !== undefined ||
      rightAction !== undefined ||
      badge !== undefined
    ) {
      setHeaderConfig({
        title,
        subtitle,
        showBack,
        onBack,
        rightAction,
        badge,
      });
    }
  }, [title, subtitle, showBack, onBack, rightAction, badge, setHeaderConfig]);

  // Clean up on component unmount only
  useEffect(() => {
    return () => {
      resetHeaderConfig();
    };
  }, [resetHeaderConfig]);

  return context;
}
