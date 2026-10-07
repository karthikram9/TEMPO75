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
      className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E6EAE2] min-h-screen sticky top-0 z-30 select-none"
    >
      {/* Brand Header */}
      <div className="p-6 pb-5">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A382B] rounded-lg"
          aria-label="Tempo 75 Home"
        >
          <TempoBrandmark size="sm" variant="dark" />
        </NavLink>
      </div>

      <div className="px-4">
        <Divider className="my-1 border-[#E6EAE2]" />
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-2xs font-bold text-[#6E7A72] uppercase tracking-widest font-mono">
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
                  'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all duration-150 min-h-[44px]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A382B]',
                  isActive
                    ? 'bg-[#EBF0EA] text-[#1A382B] font-bold border border-[#DEE5DC] shadow-xs'
                    : 'text-[#48544D] hover:text-[#141815] hover:bg-[#F4F5F0] font-medium'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-colors',
                      isActive ? 'text-[#1A382B]' : 'text-[#6E7A72]'
                    )}
                  />
                  <span className="uppercase tracking-wider text-xs font-bold">{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A382B] ml-auto shrink-0" aria-hidden="true" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        <div className="pt-4 px-1">
          <Divider className="my-2 border-[#E6EAE2]" />
        </div>

        {/* Secondary Navigation */}
        <div className="px-3 py-2 text-2xs font-bold text-[#6E7A72] uppercase tracking-widest font-mono">
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
                  'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all duration-150 min-h-[44px]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A382B]',
                  isActive
                    ? 'bg-[#EBF0EA] text-[#1A382B] font-bold border border-[#DEE5DC] shadow-xs'
                    : 'text-[#48544D] hover:text-[#141815] hover:bg-[#F4F5F0] font-medium'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-colors',
                      isActive ? 'text-[#1A382B]' : 'text-[#6E7A72]'
                    )}
                  />
                  <span className="uppercase tracking-wider text-xs font-bold">{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A382B] ml-auto shrink-0" aria-hidden="true" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Visually Quiet Footer */}
      <div className="p-4 border-t border-[#E6EAE2] flex items-center justify-between text-2xs font-mono text-[#6E7A72] bg-[#F9FAF8]">
        <span>TEMPO 75</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#1A382B]" />
        <span>LOCAL-FIRST</span>
      </div>
    </aside>
  );
};
