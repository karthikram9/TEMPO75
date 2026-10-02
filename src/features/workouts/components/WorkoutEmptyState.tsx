import React from 'react';
import type { ActivityPreferences, RecoveryPreferences } from '@/types';

interface WorkoutEmptyStateProps {
  dayNumber: number;
  totalDays?: number;
  recoveryPreferences?: RecoveryPreferences | null;
  activityPreferences?: ActivityPreferences | null;
  className?: string;
}

export const WorkoutEmptyState: React.FC<WorkoutEmptyStateProps> = ({
  dayNumber,
  totalDays = 75,
  recoveryPreferences,
  activityPreferences,
  className = '',
}) => {
  const dayNumberPadded = String(dayNumber).padStart(2, '0');
  const totalDaysPadded = String(totalDays).padStart(2, '0');

  const sleepHours = recoveryPreferences?.sleepTargetHours ?? 8;
  const stepTarget = activityPreferences?.dailyStepTarget ?? 10000;
  const cardioPref = activityPreferences?.cardioPreference ?? 'walking';
  const cardioDuration = activityPreferences?.cardioDurationMinutes ?? 30;

  return (
    <article
      className={`w-full bg-surface-primary border border-border-primary rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-sm ${className}`}
      aria-labelledby="recovery-day-heading"
    >
      {/* Protocol Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-mono font-bold tracking-wider text-text-tertiary uppercase">
          TEMPO 75
        </span>
        <span className="text-border-primary">•</span>
        <span className="text-xs font-mono font-bold tracking-wider text-text-primary">
          DAY {dayNumberPadded} / {totalDaysPadded}
        </span>
      </div>

      <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-4">
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>

      <h1
        id="recovery-day-heading"
        className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-text-primary mb-2"
      >
        Recovery Day
      </h1>

      <p className="text-sm text-text-secondary max-w-md mb-6 leading-relaxed">
        Today is scheduled recovery. No resistance session prescribed. Focus on tissue adaptation, mobility, and replenishment.
      </p>

      {/* Target Metrics */}
      <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-2xl bg-surface-secondary border border-border-primary flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary mb-1">
            Sleep Target
          </span>
          <span className="text-lg font-bold font-mono text-sky-700">
            {sleepHours} hrs
          </span>
          <span className="text-[11px] text-text-tertiary mt-0.5">Prioritize rest</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-secondary border border-border-primary flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary mb-1">
            Step Target
          </span>
          <span className="text-lg font-bold font-mono text-text-primary">
            {stepTarget.toLocaleString()}
          </span>
          <span className="text-[11px] text-text-tertiary mt-0.5">Low-intensity activity</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-secondary border border-border-primary flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary mb-1">
            Active Recovery
          </span>
          <span className="text-lg font-bold font-mono text-text-primary capitalize">
            {cardioPref === 'none' ? 'Rest' : cardioPref}
          </span>
          <span className="text-[11px] text-text-tertiary mt-0.5">
            {cardioPref === 'none' ? 'Zero impact' : `${cardioDuration} min optional`}
          </span>
        </div>
      </div>

      <div className="text-xs text-text-tertiary font-mono">
        Consistency includes recovery. Your next resistance session unlocks tomorrow.
      </div>
    </article>
  );
};
