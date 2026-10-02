import React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-surface-primary border border-border-primary border-dashed shadow-sm',
        className
      )}
    >
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-surface-secondary border border-border-primary flex items-center justify-center text-text-secondary mb-4 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-base sm:text-lg font-bold text-text-primary tracking-tight uppercase font-mono">{title}</h3>
      {description && (
        <p className="text-xs sm:text-sm text-text-secondary max-w-sm mt-2 leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
