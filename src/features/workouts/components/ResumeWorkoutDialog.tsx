import React, { useState } from 'react';
import type { WorkoutSession } from '@/types';
import { calculateCompletedSetCount, calculateTotalPrescribedSets } from '../utils/sessionCalculations';

interface ResumeWorkoutDialogProps {
  session: WorkoutSession;
  onResume: () => void;
  onRestart: () => void;
  onDismiss?: () => void;
}

export const ResumeWorkoutDialog: React.FC<ResumeWorkoutDialogProps> = ({
  session,
  onResume,
  onRestart,
  onDismiss,
}) => {
  const [showRestartConfirm, setShowRestartConfirm] = useState<boolean>(false);

  const completedSets = calculateCompletedSetCount(session.exercises);
  const totalSets = calculateTotalPrescribedSets(session.exercises);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-md bg-surface-primary border border-border-primary rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col items-center text-center">
        {/* Animated Icon */}
        <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/40 text-text-primary flex items-center justify-center mb-4">
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>

        <h3 id="resume-dialog-title" className="text-xl sm:text-2xl font-black uppercase tracking-tight text-text-primary mb-1.5">
          Resume Workout?
        </h3>

        <p className="text-xs sm:text-sm text-text-secondary mb-4">
          An in-progress training session was detected for Day {session.challengeDayNumber}.
        </p>

        {/* Workout Progress Badge */}
        <div className="w-full p-4 rounded-2xl bg-surface-secondary border border-border-primary mb-6 flex flex-col items-center">
          <span className="text-sm font-bold font-mono text-text-primary uppercase">
            {session.title}
          </span>
          <span className="text-xs font-mono font-bold text-text-secondary mt-1">
            <span className="text-text-primary font-black">{completedSets}</span> / {totalSets} SETS COMPLETED
          </span>
        </div>

        {/* Confirm Restart Warning Sub-view */}
        {showRestartConfirm ? (
          <div className="w-full flex flex-col gap-2 p-4 rounded-2xl bg-rose-50 border border-rose-200 mb-4 animate-in fade-in">
            <span className="text-xs font-bold text-rose-700 uppercase">
              Abandon Current Session?
            </span>
            <p className="text-[11px] text-rose-800 leading-relaxed">
              Starting over will mark your {completedSets} completed sets as abandoned and begin a fresh session.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={onRestart}
                className="flex-1 min-h-[44px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase font-mono transition-colors shadow-sm"
              >
                Yes, Start Over
              </button>
              <button
                type="button"
                onClick={() => setShowRestartConfirm(false)}
                className="flex-1 min-h-[44px] rounded-xl bg-surface-secondary hover:bg-surface-tertiary text-text-primary font-mono text-xs border border-border-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-2.5">
            {/* Primary Resume CTA */}
            <button
              type="button"
              onClick={onResume}
              className="w-full min-h-[52px] rounded-xl bg-accent hover:opacity-90 text-text-primary font-mono font-black text-sm uppercase tracking-wider shadow-sm transition-all active:scale-[0.98]"
            >
              Resume Workout
            </button>

            {/* Secondary Start Over Option */}
            <button
              type="button"
              onClick={() => setShowRestartConfirm(true)}
              className="w-full min-h-[44px] rounded-xl bg-surface-secondary hover:bg-surface-tertiary text-text-secondary hover:text-text-primary font-mono text-xs font-semibold border border-border-primary transition-colors"
            >
              Start Over
            </button>

            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="w-full min-h-[36px] text-text-tertiary hover:text-text-primary text-[11px] font-mono transition-colors"
              >
                View Prescription Overview
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
