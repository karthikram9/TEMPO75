import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HeaderProvider } from './HeaderContext';
import { MobileHeader } from './MobileHeader';
import { BottomNavigation } from './BottomNavigation';
import { DesktopSidebar } from './DesktopSidebar';

export const AppShell: React.FC = () => {
  const location = useLocation();

  return (
    <HeaderProvider>
      <div className="min-h-screen w-full flex bg-background text-text-primary antialiased selection:bg-accent selection:text-text-primary">
        {/* Desktop Sidebar (hidden on <1024px, fixed width on >=1024px) */}
        <DesktopSidebar />

        {/* Content Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header (hidden on desktop >=1024px) */}
          <div className="lg:hidden">
            <MobileHeader />
          </div>

          {/* Main Document Scroll Viewport */}
          <main className="flex-1 w-full" key={location.pathname}>
            <Outlet />
          </main>

          {/* Mobile Bottom Navigation (hidden on desktop >=768px) */}
          <BottomNavigation />
        </div>
      </div>
    </HeaderProvider>
  );
};
