import { useContext } from 'react';
import { HeaderContext } from '@/components/layout/headerContextDef';

/**
 * Reusable hook to access and control the mobile navigation drawer state.
 */
export function useNavigationDrawer() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useNavigationDrawer must be used within a HeaderProvider');
  }

  return {
    isDrawerOpen: context.isDrawerOpen,
    openDrawer: context.openDrawer,
    closeDrawer: context.closeDrawer,
    toggleDrawer: context.toggleDrawer,
  };
}
