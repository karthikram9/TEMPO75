import React from 'react';
import { Scale, Plus, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import type { WeightSnapshot } from '../hooks/useDashboardData';

interface TransformationSnapshotProps {
  weightSnapshot: WeightSnapshot;
  currentDayNumber: number;
  completedDaysCount: number;
  onOpenLogWeight: () => void;
}

export const TransformationSnapshot: React.FC<TransformationSnapshotProps> = ({
  weightSnapshot,
  currentDayNumber,
  completedDaysCount,
  onOpenLogWeight,
}) => {
  const { startWeightKg, currentWeightKg, targetWeightKg, deltaKg, entriesCount } = weightSnapshot;

  const deltaFormatted =
    deltaKg > 0 ? `+${deltaKg.toFixed(1)}` : deltaKg < 0 ? `${deltaKg.toFixed(1)}` : '0.0';

  const isLosingGoal = targetWeightKg < startWeightKg;
  const isGainingGoal = targetWeightKg > startWeightKg;

  // Evaluate if change is in the desired direction
  let deltaColor = 'text-text-secondary';
  let DeltaIcon = Minus;
  if (deltaKg !== 0) {
    if (isLosingGoal) {
      deltaColor = deltaKg < 0 ? 'text-emerald-700' : 'text-amber-800';
      DeltaIcon = deltaKg < 0 ? TrendingDown : TrendingUp;
    } else if (isGainingGoal) {
      deltaColor = deltaKg > 0 ? 'text-emerald-700' : 'text-amber-800';
      DeltaIcon = deltaKg > 0 ? TrendingUp : TrendingDown;
    } else {
      deltaColor = 'text-text-primary';
      DeltaIcon = deltaKg > 0 ? TrendingUp : TrendingDown;
    }
  }

  const completionPct = Math.min(100, Math.round((completedDaysCount / 75) * 100));
  const daysRemaining = Math.max(0, 75 - currentDayNumber);

  return (
    <div
      role="region"
      aria-label="Transformation Snapshot"
      className="rounded-2xl border border-border-subtle bg-surface-base p-5 md:p-6 shadow-daylight"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-surface-subtle border border-border-subtle flex items-center justify-center text-text-secondary">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
              Transformation Snapshot
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenLogWeight}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-subtle hover:bg-border-subtle active:bg-border-subtle/80 text-text-primary text-xs font-bold border border-border-subtle transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-text-primary/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>LOG WEIGHT</span>
        </button>
      </div>

      {/* 4 Metric Columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-5 border-b border-border-subtle/60">
        {/* Start */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            Start Weight
          </span>
          <div className="text-2xl md:text-3xl font-extrabold font-mono tabular-nums text-text-primary">
            {startWeightKg > 0 ? `${startWeightKg.toFixed(1)}` : '—'}
            <span className="text-xs font-normal text-text-tertiary ml-1">kg</span>
          </div>
          <p className="text-[11px] text-text-tertiary">Day 01 Baseline</p>
        </div>

        {/* Current */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            Current Weight
          </span>
          <div className="text-2xl md:text-3xl font-extrabold font-mono tabular-nums text-text-primary">
            {currentWeightKg > 0 ? `${currentWeightKg.toFixed(1)}` : '—'}
            <span className="text-xs font-normal text-text-tertiary ml-1">kg</span>
          </div>
          <p className="text-[11px] text-text-tertiary">
            {entriesCount > 0 ? `${entriesCount} check-in${entriesCount > 1 ? 's' : ''}` : 'Baseline'}
          </p>
        </div>

        {/* Target */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            Target Goal
          </span>
          <div className="text-2xl md:text-3xl font-extrabold font-mono tabular-nums text-text-primary">
            {targetWeightKg > 0 ? `${targetWeightKg.toFixed(1)}` : '—'}
            <span className="text-xs font-normal text-text-tertiary ml-1">kg</span>
          </div>
          <p className="text-[11px] text-text-tertiary">Day 75 Destination</p>
        </div>

        {/* Delta */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            Net Change
          </span>
          <div className={`text-2xl md:text-3xl font-extrabold font-mono tabular-nums flex items-center gap-1 ${deltaColor}`}>
            <DeltaIcon className="w-5 h-5 shrink-0" />
            <span>{deltaFormatted}</span>
            <span className="text-xs font-normal text-text-tertiary ml-0.5">kg</span>
          </div>
          <p className="text-[11px] text-text-tertiary">Since Protocol Start</p>
        </div>
      </div>

      {/* 75-Day Journey Bar */}
      <div className="pt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-text-secondary">
            <span className="text-text-primary font-bold">{completedDaysCount}</span> / 75 DAYS COMPLETE
          </span>
          <span className="font-mono text-text-tertiary">
            {daysRemaining} DAYS REMAINING
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={completionPct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="w-full h-2 rounded-full bg-surface-subtle overflow-hidden"
        >
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${Math.max(completionPct, 1)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
