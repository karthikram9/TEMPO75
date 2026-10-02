import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Dumbbell,
  Flame,
  TrendingUp,
  User,
  Sliders,
} from 'lucide-react';
import { Divider } from '@/components/ui';
import { cn } from '@/lib/utils';

import { TempoBrandmark } from '@/features/auth/components/TempoBrandmark';

interface SidebarLink {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRIMARY_LINKS: SidebarLink[] = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/workout', label: 'Workout', icon: Dumbbell },
  { path: '/journey', label: 'Journey', icon: Flame },
  { path: '/progress', label: 'Progress', icon: TrendingUp },
];

const SECONDARY_LINKS: SidebarLink[] = [
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Sliders },
];

export const DesktopSidebar: React.FC = () => {
  return (
    <aside
      aria-label="Desktop Sidebar Navigation"
      className="hidden lg:flex flex-col w-64 bg-white border-r border-border min-h-screen sticky top-0 z-30 select-none"
    >
      {/* Brand Header */}
      <div className="p-6 pb-5">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
          aria-label="Tempo 75 Home"
        >
          <TempoBrandmark size="sm" variant="lime" />
        </NavLink>
      </div>

      <div className="px-4">
        <Divider className="my-1 border-border-subtle" />
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-2xs font-bold text-text-muted uppercase tracking-widest">
          Protocol
        </div>
        {PRIMARY_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 min-h-[44px]',
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
                  <span className="uppercase tracking-wider text-xs font-bold">{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent ml-auto shrink-0" aria-hidden="true" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        <div className="pt-4 px-1">
          <Divider className="my-2 border-border-subtle" />
        </div>

        {/* Secondary Navigation */}
        <div className="px-3 py-2 text-2xs font-bold text-text-muted uppercase tracking-widest">
          System
        </div>
        {SECONDARY_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 min-h-[44px]',
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
                  <span className="uppercase tracking-wider text-xs font-bold">{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent ml-auto shrink-0" aria-hidden="true" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Visually Quiet Footer */}
      <div className="p-4 border-t border-border flex items-center justify-between text-2xs font-mono text-text-muted">
        <span>TEMPO 75</span>
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span>LOCAL-FIRST</span>
      </div>
    </aside>
  );
};
