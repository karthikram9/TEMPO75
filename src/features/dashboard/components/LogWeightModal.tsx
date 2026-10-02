import React, { useState, useEffect } from 'react';
import { X, Scale, AlertCircle, Check } from 'lucide-react';

interface LogWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDayNumber: number;
  initialWeightKg: number;
  onSaveWeight: (weightKg: number, isMorningFast?: boolean, notes?: string) => Promise<boolean>;
}

export const LogWeightModal: React.FC<LogWeightModalProps> = ({
  isOpen,
  onClose,
  currentDayNumber,
  initialWeightKg,
  onSaveWeight,
}) => {
  const [weightValue, setWeightValue] = useState<string>(
    initialWeightKg > 0 ? initialWeightKg.toFixed(1) : '75.0'
  );
  const [isMorningFast, setIsMorningFast] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<boolean>(false);


  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAdjust = (delta: number) => {
    const current = parseFloat(weightValue) || 75.0;
    const next = Math.max(30, Math.min(300, current + delta));
    setWeightValue(next.toFixed(1));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const numeric = parseFloat(weightValue);
    if (isNaN(numeric) || numeric < 30 || numeric > 300) {
      setErrorMessage('Please enter a realistic weight between 30 kg and 300 kg.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const ok = await onSaveWeight(numeric, isMorningFast, notes.trim() || undefined);
      if (ok) {
        setSuccessNotice(true);
        setTimeout(() => {
          onClose();
        }, 300);
      } else {
        setErrorMessage('Failed to record weight entry. Please try again.');
        setIsSubmitting(false);
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="log-weight-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-primary/40 backdrop-blur-sm animate-fade-in"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-border-subtle bg-surface-base p-6 shadow-floating space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-text-primary">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 id="log-weight-title" className="text-base font-bold text-text-primary tracking-tight">
                Morning Weigh-In
              </h2>
              <p className="text-xs text-text-secondary">
                Day {String(currentDayNumber).padStart(2, '0')} Protocol Check-in
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close weigh-in modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-subtle transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Main Input Display */}
          <div className="text-center py-2 space-y-2">
            <label htmlFor="weight-input" className="text-xs font-bold uppercase tracking-wider text-text-tertiary block">
              Today&apos;s Body Weight
            </label>
            <div className="inline-flex items-baseline justify-center gap-2">
              <input
                id="weight-input"
                type="number"
                step="0.1"
                min="30"
                max="300"
                required
                value={weightValue}
                onChange={(e) => {
                  setWeightValue(e.target.value);
                  setErrorMessage(null);
                }}
                className="w-36 text-center text-4xl md:text-5xl font-extrabold font-mono tabular-nums text-text-primary bg-transparent border-b-2 border-text-primary focus:border-accent focus:outline-none py-1"
                autoFocus
              />
              <span className="text-xl font-bold font-mono text-text-secondary">kg</span>
            </div>
          </div>

          {/* Stepper Quick-Chips */}
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleAdjust(-0.5)}
              className="px-3 py-1.5 rounded-full bg-surface-subtle hover:bg-border-subtle active:bg-border-subtle/80 border border-border-subtle text-xs font-mono font-bold text-text-primary transition-colors touch-manipulation"
            >
              -0.5
            </button>
            <button
              type="button"
              onClick={() => handleAdjust(-0.1)}
              className="px-3 py-1.5 rounded-full bg-surface-subtle hover:bg-border-subtle active:bg-border-subtle/80 border border-border-subtle text-xs font-mono font-bold text-text-primary transition-colors touch-manipulation"
            >
              -0.1
            </button>
            <button
              type="button"
              onClick={() => handleAdjust(0.1)}
              className="px-3 py-1.5 rounded-full bg-surface-subtle hover:bg-border-subtle active:bg-border-subtle/80 border border-border-subtle text-xs font-mono font-bold text-text-primary transition-colors touch-manipulation"
            >
              +0.1
            </button>
            <button
              type="button"
              onClick={() => handleAdjust(0.5)}
              className="px-3 py-1.5 rounded-full bg-surface-subtle hover:bg-border-subtle active:bg-border-subtle/80 border border-border-subtle text-xs font-mono font-bold text-text-primary transition-colors touch-manipulation"
            >
              +0.5
            </button>
          </div>

          {/* Morning Fasted Checkbox */}
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-subtle border border-border-subtle cursor-pointer hover:bg-border-subtle/40 transition-colors select-none">
            <input
              type="checkbox"
              checked={isMorningFast}
              onChange={(e) => setIsMorningFast(e.target.checked)}
              className="w-4 h-4 rounded text-text-primary bg-white border-border-subtle focus:ring-accent focus:ring-offset-0"
            />
            <span className="text-xs text-text-secondary font-medium">
              Fasted morning weigh-in (recommended for consistent data)
            </span>
          </label>

          {/* Quick Notes Input */}
          <div className="space-y-1.5">
            <label htmlFor="weight-notes" className="text-xs font-semibold text-text-secondary">
              Notes (Optional)
            </label>
            <input
              id="weight-notes"
              type="text"
              placeholder="e.g., Post rest-day, high carb dinner"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={80}
              className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border-subtle text-xs text-text-primary placeholder-text-tertiary focus:border-text-primary focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-full border border-border-subtle text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-full bg-accent hover:opacity-95 active:opacity-90 text-text-primary text-xs font-black tracking-wide uppercase shadow-pill transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>SAVING...</span>
              ) : successNotice ? (
                <>
                  <Check className="w-4 h-4 text-text-primary" />
                  <span>SAVED</span>
                </>
              ) : (
                <span>CONFIRM WEIGH-IN</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
