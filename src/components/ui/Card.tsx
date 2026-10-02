import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type CardVariant = 'default' | 'base' | 'elevated' | 'outlined' | 'interactive';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const variantStyles: Record<CardVariant, string> = {
      default: 'bg-surface border border-border text-text-primary shadow-subtle',
      base: 'bg-surface border border-border text-text-primary shadow-subtle',
      elevated: 'bg-surface-elevated border border-border-strong text-text-primary shadow-card',
      outlined: 'bg-transparent border border-border-strong text-text-primary',
      interactive:
        'bg-surface border border-border text-text-primary hover:border-accent/40 hover:bg-surface-elevated active:bg-surface-elevated/80 transition-all duration-150 cursor-pointer active:scale-[0.99] motion-reduce:active:scale-100 select-none',
    };

    const paddingStyles: Record<CardPadding, string> = {
      none: '',
      sm: 'p-3',
      md: 'p-4 sm:p-5',
      lg: 'p-5 sm:p-6 lg:p-7',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-2xl transition-colors', variantStyles[variant], paddingStyles[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-between gap-3 mb-3.5', className)} {...props}>
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xs sm:text-sm font-bold uppercase tracking-wider text-text-secondary leading-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('text-text-primary text-sm leading-relaxed', className)} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-4 pt-3.5 border-t border-border flex items-center justify-between text-xs text-text-muted', className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';
