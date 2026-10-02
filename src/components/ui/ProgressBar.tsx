import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number; // 0 to 100 or current value
  max?: number; // default 100
  label?: string;
  showValueLabel?: boolean;
  variant?: 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValueLabel = false,
  variant = 'accent',
  size = 'md',
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantStyles = {
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  };

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {(label || showValueLabel) && (
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label && <span>{label}</span>}
          {showValueLabel && (
            <span className="font-mono tabular-nums text-text-primary">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        className={cn(
          'w-full bg-surface-subtle overflow-hidden rounded-full border border-border/50',
          sizeStyles[size]
        )}
      >
        <div
          className={cn('h-full transition-all duration-300 ease-out rounded-full', variantStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
