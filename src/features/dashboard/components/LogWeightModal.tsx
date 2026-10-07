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
        }, 200);
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
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 animate-fade-in"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-[#E6EAE2] bg-white p-6 sm:p-7 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6EAE2]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#EBF0EA] border border-[#DEE5DC] flex items-center justify-center text-[#1A382B]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 id="log-weight-title" className="text-base font-bold text-[#141815] tracking-tight">
                Morning Weigh-In
              </h2>
              <p className="text-xs text-[#6E7A72]">
                Day {String(currentDayNumber).padStart(2, '0')} Protocol Check-in
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close weigh-in modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6E7A72] hover:text-[#141815] hover:bg-[#F4F5F0] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Main Input Display */}
          <div className="text-center py-2 space-y-2">
            <label htmlFor="weight-input" className="text-xs font-bold uppercase tracking-wider text-[#6E7A72] block">
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
                className="w-36 text-center text-4xl md:text-5xl font-black font-mono tabular-nums text-[#141815] bg-transparent border-b-2 border-[#1A382B] focus:border-[#2D5A43] focus:outline-none py-1"
                autoFocus
              />
              <span className="text-xl font-bold font-mono text-[#6E7A72]">kg</span>
            </div>
          </div>

          {/* Stepper Quick-Chips */}
          <div className="flex items-center justify-center gap-2">
            {[-0.5, -0.1, 0.1, 0.5].map((delta) => (
              <button
                key={delta}
                type="button"
                onClick={() => handleAdjust(delta)}
                className="px-3 py-1.5 rounded-full bg-[#F4F5F0] hover:bg-[#EBF0EA] active:bg-[#DFEAE0] border border-[#E6EAE2] text-xs font-mono font-bold text-[#141815] transition-colors touch-manipulation cursor-pointer"
              >
                {delta > 0 ? `+${delta}` : delta}
              </button>
            ))}
          </div>

          {/* Morning Fasted Checkbox */}
          <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#F4F5F0] border border-[#E6EAE2] cursor-pointer hover:bg-[#EBF0EA] transition-colors select-none">
            <input
              type="checkbox"
              checked={isMorningFast}
              onChange={(e) => setIsMorningFast(e.target.checked)}
              className="w-4 h-4 rounded text-[#1A382B] bg-white border-[#CCD5CA] focus:ring-[#1A382B] focus:ring-offset-0 accent-[#1A382B]"
            />
            <span className="text-xs text-[#48544D] font-medium">
              Fasted morning weigh-in (recommended for consistent data)
            </span>
          </label>

          {/* Quick Notes Input */}
          <div className="space-y-1.5">
            <label htmlFor="weight-notes" className="text-xs font-semibold text-[#6E7A72]">
              Notes (Optional)
            </label>
            <input
              id="weight-notes"
              type="text"
              placeholder="e.g., Post rest-day, high carb dinner"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={80}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F5F0] border border-[#E6EAE2] text-xs text-[#141815] placeholder-[#8A968E] focus:border-[#1A382B] focus:bg-white focus:outline-none transition-colors"
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
              className="flex-1 py-3 px-4 rounded-full border border-[#DEE5DC] text-xs font-bold text-[#48544D] hover:text-[#141815] hover:bg-[#F4F5F0] transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-full bg-[#1A382B] hover:bg-[#234A39] active:bg-[#142C22] active:scale-[0.98] text-white text-xs font-black tracking-wide uppercase shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>SAVING...</span>
              ) : successNotice ? (
                <>
                  <Check className="w-4 h-4 text-white stroke-[3]" />
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
