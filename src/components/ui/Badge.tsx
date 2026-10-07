import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-surface-subtle text-text-secondary border-border',
    accent: 'bg-[#EDF0EA] text-[#1A382B] border-[#DEE5DC] font-bold',
    success: 'bg-[#EBF2EA] text-[#1A382B] border-[#D4E2D2]',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-red-50 text-red-800 border-red-200',
    outline: 'bg-transparent text-text-primary border-border',
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'text-2xs px-2.5 py-0.5 tracking-wider font-mono font-bold',
    md: 'text-xs px-3 py-1 tracking-wider font-mono font-bold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center uppercase tracking-wider rounded-full border select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
