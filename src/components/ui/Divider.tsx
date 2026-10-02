import React from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  className,
}) => {
  if (orientation === 'vertical') {
    return <div className={cn('w-px bg-border self-stretch min-h-[16px]', className)} />;
  }

  if (label) {
    return (
      <div className={cn('relative flex items-center w-full my-4', className)}>
        <div className="flex-grow border-t border-border" />
        <span className="flex-shrink mx-3 text-2xs uppercase tracking-widest text-text-muted font-semibold">
          {label}
        </span>
        <div className="flex-grow border-t border-border" />
      </div>
    );
  }

  return <hr className={cn('w-full border-t border-border my-4', className)} />;
};
