import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ id, checked, onChange, label, description, disabled, className }, ref) => {
    const switchId = id || (typeof label === 'string' ? `switch-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    const handleToggle = () => {
      if (!disabled) {
        onChange(!checked);
      }
    };

    return (
      <div
        className={cn(
          'inline-flex items-center justify-between gap-4 py-1.5 min-h-[44px]',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {(label || description) && (
          <div className="flex flex-col flex-1 select-none">
            {label && (
              <span id={`${switchId}-label`} className="text-sm font-medium text-text-primary">
                {label}
              </span>
            )}
            {description && <span className="text-xs text-text-muted mt-0.5">{description}</span>}
          </div>
        )}
        <button
          ref={ref}
          id={switchId}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={label ? `${switchId}-label` : undefined}
          disabled={disabled}
          onClick={handleToggle}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            checked ? 'bg-accent' : 'bg-surface-highlight border-border'
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
              checked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
      </div>
    );
  }
);

Switch.displayName = 'Switch';
