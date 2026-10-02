import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, id, leftAddon, rightAddon, disabled, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftAddon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-text-muted">
              {leftAddon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={cn(
              'w-full min-h-[44px] h-11 bg-white text-text-primary placeholder:text-text-muted rounded-xl border text-base sm:text-sm transition-all',
              'px-4 py-2.5 shadow-subtle',
              leftAddon ? 'pl-10' : 'pl-4',
              rightAddon ? 'pr-10' : 'pr-4',
              error
                ? 'border-danger focus:border-danger focus:ring-1 focus:ring-danger'
                : 'border-border focus:border-text-primary focus:ring-2 focus:ring-accent/30 focus:outline-none',
              disabled && 'opacity-50 cursor-not-allowed bg-surface-subtle',
              className
            )}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-text-muted">
              {rightAddon}
            </div>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-danger font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-text-muted">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
