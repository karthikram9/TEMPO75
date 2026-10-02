import React from 'react';
import { cn } from '@/lib/utils';

export type PageContainerWidth = 'compact' | 'focused' | 'standard' | 'full';

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: PageContainerWidth;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  maxWidth = 'standard',
  ...props
}) => {
  const maxWidthStyles: Record<PageContainerWidth, string> = {
    compact: 'max-w-xl', // 576px - Quick inputs, single-card dialogues
    focused: 'max-w-3xl', // 768px - Workout logger, profile forms
    standard: 'max-w-7xl', // 1280px - SOP recommended standard content limit
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        // Responsive horizontal padding: 16px mobile, 24px tablet, 32px desktop
        'w-full mx-auto px-4 sm:px-6 lg:px-8',
        // Responsive vertical rhythm with bottom safe clearance for mobile navigation bar
        'py-4 sm:py-6 lg:py-8',
        'pb-28 sm:pb-32 lg:pb-12',
        // Strict boundary to prevent horizontal overflow
        'overflow-x-hidden',
        maxWidthStyles[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
