import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type IconButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  'aria-label': string; // Mandatory for accessibility
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  isLoading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      'aria-label': ariaLabel,
      className,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      disabled = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center select-none transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background';

    const variantStyles: Record<IconButtonVariant, string> = {
      primary: 'bg-accent text-white hover:opacity-95 active:opacity-90 border border-transparent shadow-sm',
      secondary:
        'bg-surface-base text-text-primary hover:bg-surface-subtle active:bg-border-subtle/30 border border-border-subtle shadow-daylight',
      outline:
        'bg-transparent text-text-primary border border-border-subtle hover:bg-surface-subtle active:bg-surface-base',
      ghost:
        'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-subtle active:bg-surface-base border border-transparent',
      danger:
        'bg-danger text-white hover:opacity-90 active:bg-danger border border-danger/30',
    };

    const sizeStyles: Record<IconButtonSize, string> = {
      sm: 'w-10 h-10 min-w-[40px] min-h-[40px] rounded-full text-sm',
      md: 'w-11 h-11 min-w-[44px] min-h-[44px] rounded-full text-base', // 44px minimum touch target
      lg: 'w-13 h-13 min-w-[52px] min-h-[52px] rounded-full text-lg',
    };

    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          icon
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
