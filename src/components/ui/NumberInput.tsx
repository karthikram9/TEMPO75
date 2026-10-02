import React, { forwardRef } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  inputMode?: 'decimal' | 'numeric';
  helperText?: string;
  error?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      value,
      onChange,
      label,
      unit,
      step = 1,
      min = 0,
      max = 9999,
      inputMode,
      helperText,
      error,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `num-input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const resolvedInputMode = inputMode ?? (step % 1 !== 0 ? 'decimal' : 'numeric');

    const handleDecrement = () => {
      if (disabled) return;
      const next = Math.max(min, Number((value - step).toFixed(2)));
      onChange(next);
    };

    const handleIncrement = () => {
      if (disabled) return;
      const next = Math.min(max, Number((value + step).toFixed(2)));
      onChange(next);
    };

    const handleDirectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseFloat(e.target.value);
      if (isNaN(parsed)) {
        onChange(min);
      } else {
        onChange(Math.min(max, Math.max(min, parsed)));
      }
    };

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2">
          {/* Decrement Stepper - 44px min touch target */}
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || value <= min}
            aria-label={`Decrease ${label || 'value'}`}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white border border-border text-text-primary hover:bg-surface-elevated active:scale-95 motion-reduce:active:scale-100 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Minus className="w-5 h-5" />
          </button>

          {/* Numeric Field with iOS keyboard compatibility */}
          <div className="relative flex-1 flex items-center">
            <input
              ref={ref}
              id={inputId}
              type="number"
              inputMode={resolvedInputMode}
              value={Number.isFinite(value) ? value : ''}
              onChange={handleDirectChange}
              step={step}
              min={min}
              max={max}
              disabled={disabled}
              className={cn(
                // 16px font-size minimum to prevent iOS Safari auto-zoom
                'w-full min-h-[44px] h-11 bg-white text-text-primary text-center font-mono font-bold text-base sm:text-lg tabular-nums rounded-xl border border-border transition-colors shadow-subtle',
                unit ? 'pr-12' : '',
                error
                  ? 'border-danger focus:border-danger'
                  : 'border-border focus:border-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30',
                disabled && 'opacity-50 cursor-not-allowed bg-surface-subtle',
                className
              )}
              {...props}
            />
            {unit && (
              <span className="absolute right-3.5 text-xs font-semibold text-text-muted select-none uppercase tracking-wider pointer-events-none">
                {unit}
              </span>
            )}
          </div>

          {/* Increment Stepper - 44px min touch target */}
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || value >= max}
            aria-label={`Increase ${label || 'value'}`}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white border border-border text-text-primary hover:bg-surface-elevated active:scale-95 motion-reduce:active:scale-100 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {error ? (
          <p className="text-xs text-danger font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
