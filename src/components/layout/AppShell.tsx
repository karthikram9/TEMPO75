import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HeaderProvider } from './HeaderContext';
import { MobileHeader } from './MobileHeader';
import { MobileDrawer } from './MobileDrawer';
import { DesktopSidebar } from './DesktopSidebar';

export const AppShell: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <HeaderProvider>
      <div className={`min-h-screen w-full flex ${isDashboard ? 'bg-[#F4F5F0]' : 'bg-background'} text-text-primary antialiased selection:bg-[#1A382B] selection:text-white`}>
        {/* Desktop Sidebar (hidden on /dashboard to match Desktop Reference, active on other pages >=1024px) */}
        {!isDashboard && <DesktopSidebar />}

        {/* Collapsible Left Drawer (available across viewports) */}
        <MobileDrawer />

        {/* Content Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header (hidden on desktop >=1024px, and hidden on /dashboard where HomeHeader is used) */}
          {!isDashboard && (
            <div className="lg:hidden">
              <MobileHeader />
            </div>
          )}

          {/* Main Document Scroll Viewport */}
          <main className="flex-1 w-full" key={location.pathname}>
            <Outlet />
          </main>
        </div>
      </div>
    </HeaderProvider>
  );
};
