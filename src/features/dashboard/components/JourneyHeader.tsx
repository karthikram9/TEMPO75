import React from 'react';
import type { Challenge, Goal, UserProfile } from '@/types';
import { TempoBrandmark } from '@/features/auth/components/TempoBrandmark';

interface JourneyHeaderProps {
  challenge: Challenge;
  profile?: UserProfile | null;
  goal?: Goal | null;
  className?: string;
}

export const JourneyHeader: React.FC<JourneyHeaderProps> = ({
  challenge,
  profile,
  goal,
  className = '',
}) => {
  const currentDay = challenge.currentDayNumber ?? 1;
  const targetDays = challenge.targetDays ?? 75;
  const progressPercent = Math.min(100, Math.round((currentDay / targetDays) * 100));
  const daysRemaining = Math.max(0, targetDays - currentDay);

  const goalSummary = goal?.targetWeightKg && goal?.startWeightKg
    ? `${goal.startWeightKg} kg → ${goal.targetWeightKg} kg`
    : 'Physique Transformation';

  return (
    <header className={`flex flex-col gap-3.5 ${className}`} aria-label="75-Day Journey Header">
      {/* Top Brand & Day Status Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <TempoBrandmark size="sm" variant="lime" />
          <span className="hidden sm:inline-block text-border-strong">•</span>
          <span className="hidden sm:inline-block text-xs font-mono text-text-muted uppercase tracking-widest">
            Command Center
          </span>
        </div>

        {/* Day Number Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-border font-mono text-xs text-text-primary shadow-subtle">
            <span className="text-text-primary font-black">
              DAY {String(currentDay).padStart(2, '0')}
            </span>
            <span className="text-text-muted">/</span>
            <span className="text-text-muted font-bold">{targetDays}</span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" aria-hidden="true" />
            ACTIVE
          </span>
        </div>
      </div>

      {/* Progress Track & Subtitle */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-mono text-text-muted">
          <span>
            {profile?.name ? `ATHLETE: ${profile.name.toUpperCase()}` : '75-DAY PROTOCOL'}
          </span>
          <span className="text-text-primary font-bold tracking-wider">
            {progressPercent}% <span className="text-text-muted font-normal">({daysRemaining}d remaining)</span>
          </span>
        </div>

        {/* Precision Progress Bar */}
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Transformation Journey Progress"
          className="w-full h-1.5 bg-surface-subtle rounded-full overflow-hidden border border-border/50"
        >
          <div
            className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(2, progressPercent)}%` }}
          />
        </div>

        {/* Goal statement tag */}
        <div className="flex items-center justify-between text-[11px] text-text-muted font-mono pt-0.5">
          <span className="uppercase tracking-wider">
            TARGET: <span className="text-text-secondary font-semibold">{goalSummary}</span>
          </span>
          <span className="uppercase tracking-wider">
            SYSTEM: <span className="text-text-secondary font-semibold">PROGRESSIVE OVERLOAD</span>
          </span>
        </div>
      </div>
    </header>
  );
};
