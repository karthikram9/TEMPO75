import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Dumbbell,
  Flame,
  TrendingUp,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavItemConfig {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItemConfig[] = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/workout', label: 'Workout', icon: Dumbbell },
  { path: '/journey', label: 'Journey', icon: Flame },
  { path: '/progress', label: 'Progress', icon: TrendingUp },
  { path: '/profile', label: 'Profile', icon: User },
];

export const BottomNavigation: React.FC = () => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-border pb-safe transition-all select-none"
    >
      <div className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              aria-label={item.label}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center flex-1 py-1 h-full min-h-[44px] min-w-[44px] rounded-xl transition-all duration-150',
                  'active:scale-95 motion-reduce:active:scale-100',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
                  isActive
                    ? 'text-text-primary font-bold'
                    : 'text-text-muted hover:text-text-secondary active:text-text-primary'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative flex items-center justify-center">
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-transform duration-150',
                        isActive ? 'text-text-primary scale-110 motion-reduce:scale-100' : 'text-text-muted'
                      )}
                    />
                    {isActive && (
                      <span
                        className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-accent"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-2xs mt-1 tracking-wider uppercase leading-none',
                      isActive ? 'font-black text-text-primary' : 'font-medium text-text-muted'
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
