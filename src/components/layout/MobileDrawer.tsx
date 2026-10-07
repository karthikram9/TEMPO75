import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Dumbbell,
  Flame,
  TrendingUp,
  User,
  Sliders,
  X,
  Menu,
} from 'lucide-react';
import { Divider } from '@/components/ui';
import { TempoBrandmark } from '@/features/auth/components/TempoBrandmark';
import { useNavigationDrawer } from '@/hooks';
import { cn } from '@/lib/utils';

export interface DrawerLinkItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PROTOCOL_LINKS: DrawerLinkItem[] = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/workout', label: 'Workout', icon: Dumbbell },
  { path: '/journey', label: 'Journey', icon: Flame },
  { path: '/progress', label: 'Progress', icon: TrendingUp },
];

const SYSTEM_LINKS: DrawerLinkItem[] = [
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Sliders },
];

export const MobileDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer } = useNavigationDrawer();
  const navigate = useNavigate();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    closeDrawer();
    navigate(path);
  };

  // Accessible focus management
  useEffect(() => {
    if (isDrawerOpen) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
      // Focus close button on open
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else if (previouslyFocusedElementRef.current) {
      // Restore focus on close
      previouslyFocusedElementRef.current.focus();
      previouslyFocusedElementRef.current = null;
    }
  }, [isDrawerOpen]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transition-visibility duration-300',
        isDrawerOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      )}
      aria-hidden={!isDrawerOpen}
    >
      {/* Backdrop overlay */}
      <div
        data-testid="drawer-backdrop"
        onClick={closeDrawer}
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out',
          isDrawerOpen ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
        className={cn(
          'fixed top-0 left-0 bottom-0 z-50 flex flex-col',
          'w-[280px] xs:w-[300px] sm:w-[320px] max-w-[85vw]',
          'bg-surface-base border-r border-border shadow-floating',
          'transition-transform duration-300 ease-out select-none',
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Drawer Header (ChatGPT style top bar) */}
        <div className="h-14 min-h-[56px] px-4 pt-safe flex items-center justify-between border-b border-border bg-white shrink-0">
          <div className="flex items-center gap-2">
            {/* Top-left menu/toggle button */}
            <button
              type="button"
              onClick={closeDrawer}
              className="w-11 h-11 -ml-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-text-primary hover:bg-surface-subtle active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Close navigation menu"
              data-testid="drawer-menu-button"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo */}
            <NavLink
              to="/dashboard"
              onClick={(e) => handleLinkClick(e, '/dashboard')}
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
              aria-label="Tempo 75 Home"
            >
              <TempoBrandmark size="sm" variant="lime" />
            </NavLink>
          </div>

          {/* Explicit Close Button */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeDrawer}
            className="w-11 h-11 -mr-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-subtle active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Close navigation menu"
            data-testid="drawer-close-button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {/* Protocol Section */}
          <div className="px-3 pb-2 text-2xs font-bold text-text-muted uppercase tracking-widest">
            Protocol
          </div>
          {PROTOCOL_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 min-h-[48px]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    isActive
                      ? 'bg-surface-subtle text-text-primary font-bold border border-border shadow-subtle'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-colors',
                        isActive ? 'text-text-primary' : 'text-text-muted'
                      )}
                    />
                    <span className="uppercase tracking-wider text-xs font-bold">
                      {link.label}
                    </span>
                    {isActive && (
                      <span
                        className="w-2 h-2 rounded-full bg-accent ml-auto shrink-0 shadow-pill"
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          <div className="pt-3 px-1">
            <Divider className="my-2 border-border-subtle" />
          </div>

          {/* System Section */}
          <div className="px-3 py-2 text-2xs font-bold text-text-muted uppercase tracking-widest">
            System
          </div>
          {SYSTEM_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 min-h-[48px]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    isActive
                      ? 'bg-surface-subtle text-text-primary font-bold border border-border shadow-subtle'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-colors',
                        isActive ? 'text-text-primary' : 'text-text-muted'
                      )}
                    />
                    <span className="uppercase tracking-wider text-xs font-bold">
                      {link.label}
                    </span>
                    {isActive && (
                      <span
                        className="w-2 h-2 rounded-full bg-accent ml-auto shrink-0 shadow-pill"
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Quiet Footer */}
        <div className="p-4 pb-safe border-t border-border flex items-center justify-between text-2xs font-mono text-text-muted mt-auto bg-surface-base">
          <span>TEMPO 75</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span>LOCAL-FIRST</span>
        </div>
      </aside>
    </div>
  );
};
