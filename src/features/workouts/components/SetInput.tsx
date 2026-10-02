import React, { useState } from 'react';
import { validateSetInput } from '../utils/sessionCalculations';

interface SetInputProps {
  setNumber: number;
  targetRepRange?: [number, number];
  previousWeightKg?: number;
  isBodyweight?: boolean;
  isSaving?: boolean;
  onCompleteSet: (params: { weightKg: number; reps: number; rir?: number }) => void;
  className?: string;
}

export const SetInput: React.FC<SetInputProps> = ({
  setNumber,
  targetRepRange = [8, 12],
  previousWeightKg,
  isBodyweight = false,
  isSaving = false,
  onCompleteSet,
  className = '',
}) => {
  // Pre-fill weight with previous weight if available, or 0 for bodyweight
  const initialWeight =
    previousWeightKg !== undefined && previousWeightKg > 0
      ? String(previousWeightKg)
      : isBodyweight
      ? '0'
      : '';

  const [weightStr, setWeightStr] = useState<string>(initialWeight);
  const [repsStr, setRepsStr] = useState<string>('');
  const [selectedRir, setSelectedRir] = useState<number>(2); // Default RIR 2
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleWeightAdjust = (delta: number) => {
    const current = parseFloat(weightStr) || 0;
    const next = Math.max(0, current + delta);
    setWeightStr(String(Math.round(next * 10) / 10));
    setValidationError(null);
  };

  const handleRepsAdjust = (delta: number) => {
    const current = parseInt(repsStr, 10) || targetRepRange[0];
    const next = Math.max(1, current + delta);
    setRepsStr(String(next));
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    const validation = validateSetInput(weightStr, repsStr, String(selectedRir));
    if (!validation.isValid) {
      setValidationError(validation.error ?? 'Invalid input.');
      return;
    }

    setValidationError(null);
    onCompleteSet({
      weightKg: validation.weightKg ?? 0,
      reps: validation.reps ?? 1,
      rir: validation.rir,
    });

    // Reset reps for next set, preserve weight
    setRepsStr('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-4 sm:p-5 rounded-2xl bg-surface-primary border border-border-primary shadow-sm ${className}`}
      aria-label={`Input for Set ${setNumber}`}
    >
      {/* Set Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-secondary">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent ring-2 ring-accent/30" aria-hidden="true" />
          <h4 className="text-sm sm:text-base font-mono font-bold tracking-tight text-text-primary uppercase">
            ACTIVE SET {setNumber}
          </h4>
        </div>
        <span className="text-xs font-mono text-text-tertiary">
          Target: {targetRepRange[0]}–{targetRepRange[1]} reps
        </span>
      </div>

      {/* Main Input Grid: Weight & Reps */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 mb-4">
        {/* Weight Field */}
        <div className="flex flex-col">
          <label
            htmlFor="set-weight-input"
            className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-secondary mb-1.5"
          >
            {isBodyweight ? 'Weight (BW)' : 'Weight (kg)'}
          </label>

          <div className="relative flex items-center">
            <input
              id="set-weight-input"
              type="text"
              inputMode="decimal"
              value={weightStr}
              onChange={(e) => {
                setWeightStr(e.target.value);
                setValidationError(null);
              }}
              placeholder={isBodyweight ? '0' : '0.0'}
              className="w-full h-14 pl-3.5 pr-8 bg-surface-secondary border border-border-primary focus:border-border-focus focus:bg-surface-primary rounded-xl text-xl sm:text-2xl font-mono font-bold text-text-primary text-center focus:outline-none transition-colors"
              aria-label="Set Weight in kilograms"
            />
            <span className="absolute right-3 text-xs font-mono text-text-tertiary pointer-events-none">
              kg
            </span>
          </div>

          {/* Quick Increment Chips */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => handleWeightAdjust(-2.5)}
              className="min-h-[36px] px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-surface-secondary hover:bg-surface-tertiary active:scale-95 text-text-secondary border border-border-primary/60 transition-colors"
            >
              -2.5
            </button>
            <button
              type="button"
              onClick={() => handleWeightAdjust(2.5)}
              className="min-h-[36px] px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-surface-secondary hover:bg-surface-tertiary active:scale-95 text-text-secondary border border-border-primary/60 transition-colors"
            >
              +2.5
            </button>
            <button
              type="button"
              onClick={() => handleWeightAdjust(5)}
              className="min-h-[36px] px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-surface-secondary hover:bg-surface-tertiary active:scale-95 text-text-secondary border border-border-primary/60 transition-colors"
            >
              +5
            </button>
          </div>
        </div>

        {/* Reps Field */}
        <div className="flex flex-col">
          <label
            htmlFor="set-reps-input"
            className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-secondary mb-1.5"
          >
            Completed Reps
          </label>

          <div className="relative flex items-center">
            <input
              id="set-reps-input"
              type="text"
              inputMode="numeric"
              value={repsStr}
              onChange={(e) => {
                setRepsStr(e.target.value);
                setValidationError(null);
              }}
              placeholder={String(targetRepRange[0])}
              className="w-full h-14 pl-3.5 pr-8 bg-surface-secondary border border-border-primary focus:border-border-focus focus:bg-surface-primary rounded-xl text-xl sm:text-2xl font-mono font-bold text-text-primary text-center focus:outline-none transition-colors"
              aria-label="Completed repetitions"
              autoFocus
            />
            <span className="absolute right-3 text-xs font-mono text-text-tertiary pointer-events-none">
              reps
            </span>
          </div>

          {/* Quick Increment Chips */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => handleRepsAdjust(-1)}
              className="min-h-[36px] px-3 py-1 text-xs font-mono font-bold rounded-lg bg-surface-secondary hover:bg-surface-tertiary active:scale-95 text-text-secondary border border-border-primary/60 transition-colors"
            >
              -1
            </button>
            <button
              type="button"
              onClick={() => handleRepsAdjust(1)}
              className="min-h-[36px] px-3 py-1 text-xs font-mono font-bold rounded-lg bg-surface-secondary hover:bg-surface-tertiary active:scale-95 text-text-secondary border border-border-primary/60 transition-colors"
            >
              +1
            </button>
          </div>
        </div>
      </div>

      {/* RIR Selection (Optional Effort Metric) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-secondary">
            Reps In Reserve (RIR)
          </span>
          <span className="text-[10px] text-text-tertiary font-mono">
            {selectedRir === 0 ? 'Failure' : `${selectedRir} reps left`}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5" role="radiogroup" aria-label="Reps In Reserve">
          {[0, 1, 2, 3, 4].map((val) => {
            const isSelected = selectedRir === val;
            return (
              <button
                key={val}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedRir(val)}
                className={`min-h-[38px] rounded-lg font-mono text-xs font-bold transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-accent text-text-primary font-black shadow-sm border border-transparent'
                    : 'bg-surface-secondary border border-border-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                }`}
              >
                {val === 4 ? '4+' : val}
              </button>
            );
          })}
        </div>
      </div>

      {/* Inline Validation Error */}
      {validationError && (
        <div
          role="alert"
          className="mb-3 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth={2} />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth={2} />
          </svg>
          <span>{validationError}</span>
        </div>
      )}

      {/* Primary CTA: COMPLETE SET */}
      <button
        type="submit"
        disabled={isSaving}
        className={`w-full min-h-[52px] sm:min-h-[56px] rounded-xl font-mono font-black uppercase tracking-wider text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
          isSaving
            ? 'bg-surface-tertiary text-text-muted cursor-not-allowed'
            : 'bg-accent hover:opacity-95 text-text-primary shadow-sm'
        }`}
      >
        {isSaving ? (
          <span>Saving Set...</span>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>COMPLETE SET {setNumber}</span>
          </>
        )}
      </button>
    </form>
  );
};
