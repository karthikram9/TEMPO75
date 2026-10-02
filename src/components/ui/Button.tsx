import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center select-none font-semibold transition-all duration-150 ' +
      'active:scale-[0.98] motion-reduce:active:scale-100 motion-reduce:transition-none ' +
      'disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background';

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-accent text-text-primary font-black hover:bg-accent-hover active:bg-accent-active shadow-pill border border-black/5',
      secondary:
        'bg-white text-text-primary font-bold hover:bg-surface-elevated active:bg-surface-subtle border border-border shadow-subtle',
      outline:
        'bg-transparent text-text-primary font-bold border border-border hover:bg-white hover:border-neutral-400 active:bg-surface-elevated',
      ghost:
        'bg-transparent text-text-secondary font-semibold hover:text-text-primary hover:bg-surface-subtle active:bg-surface-elevated border border-transparent',
      danger:
        'bg-danger text-white font-bold hover:opacity-90 active:bg-danger shadow-subtle border border-danger/30',
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'h-9 px-4 text-xs rounded-full uppercase tracking-wider min-h-[36px]',
      md: 'h-11 px-6 text-sm rounded-full min-h-[44px]', // Standard 44px touch target
      lg: 'h-13 px-8 text-sm sm:text-base rounded-full uppercase tracking-wider font-black min-h-[50px]', // Signature 50px Pill CTA
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
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
            <span>Loading...</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
