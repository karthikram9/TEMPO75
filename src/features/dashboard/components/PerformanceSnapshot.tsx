import React from 'react';
import { TrendingUp, ShieldAlert, Award, ChevronRight } from 'lucide-react';
import type { ProgressionRecommendation } from '@/types';

interface PerformanceSnapshotProps {
  progression: ProgressionRecommendation | null;
  exerciseName?: string;
  onViewWorkouts?: () => void;
}

export const PerformanceSnapshot: React.FC<PerformanceSnapshotProps> = ({
  progression,
  exerciseName = 'Primary Compound Lift',
  onViewWorkouts,
}) => {
  const isBaseline = !progression || progression.status === 'new';

  const statusConfig = {
    progress: {
      label: '↑ PROGRESS',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    maintain: {
      label: '→ MAINTAIN',
      badgeClass: 'bg-surface-subtle text-text-primary border-border',
    },
    reduce: {
      label: '↓ DELOAD / REDUCE',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    new: {
      label: '✦ BASELINE',
      badgeClass: 'bg-surface-subtle text-text-muted border-border',
    },
  };

  const currentStatus = progression?.status ?? 'new';
  const statusInfo = statusConfig[currentStatus] || statusConfig.new;

  const confidenceLabels = {
    high: 'HIGH CONFIDENCE',
    medium: 'MEDIUM CONFIDENCE',
    low: 'CALIBRATING',
  };

  return (
    <div
      role="region"
      aria-label="Progressive Overload Target"
      className="rounded-3xl border border-border bg-white p-6 sm:p-7 shadow-daylight transition-colors hover:border-neutral-300"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-text-primary">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-text-muted">
            Primary Overload Target
          </span>
        </div>

        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wide border ${statusInfo.badgeClass}`}
        >
          {statusInfo.label}
        </span>
      </div>

      {/* Exercise name */}
      <div className="mb-4">
        <h3 className="text-xl md:text-2xl font-black text-text-primary tracking-tight uppercase">
          {exerciseName}
        </h3>
        <p className="text-xs text-text-muted mt-0.5">
          Primary compound overload anchor for today
        </p>
      </div>

      {isBaseline ? (
        /* Baseline / Empty State */
        <div className="py-2 space-y-2">
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-surface-subtle border border-border text-text-secondary text-xs">
            <Award className="w-4 h-4 text-text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-text-primary">BASELINE CALIBRATION: </span>
              Log your first session of this exercise to unlock double-progression targets and calculated 1RM analytics.
            </div>
          </div>
          <p className="text-[11px] text-text-muted italic pt-1">
            Targets calibrate automatically from your completed sets, reps, and RIR.
          </p>
        </div>
      ) : (
        /* Active Progression Recommendation */
        <div className="space-y-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-text-primary tracking-tight">
              {progression.suggestedLoadKg !== undefined && progression.suggestedLoadKg > 0
                ? `${progression.suggestedLoadKg} kg`
                : 'Bodyweight'}
            </div>
            <div className="text-lg md:text-xl font-bold font-mono text-text-primary">
              × {progression.suggestedRepRange[0]}–{progression.suggestedRepRange[1]} reps
            </div>
            {progression.currentLoadKg !== undefined && (
              <span className="text-xs font-mono text-text-muted font-bold">
                (Prev: {progression.currentLoadKg} kg)
              </span>
            )}
          </div>

          {/* Metric capsules */}
          <div className="flex flex-wrap gap-2 pt-1">
            {progression.confidence && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-surface-subtle border border-border text-text-secondary uppercase">
                {confidenceLabels[progression.confidence] ?? progression.confidence.toUpperCase()}
              </span>
            )}
            {progression.estimated1RMKg !== undefined && progression.estimated1RMKg > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-surface-subtle border border-border text-text-primary">
                e1RM: {progression.estimated1RMKg.toFixed(1)} kg
              </span>
            )}
          </div>

          {/* Explanation cue */}
          {progression.explanation && (
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-normal">
              {progression.explanation}
            </p>
          )}

          {/* Advisory notice */}
          <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-text-muted italic">
              <ShieldAlert className="w-3.5 h-3.5 text-text-muted shrink-0" />
              <span>Advisory target based on logged history. You decide the weight in the gym.</span>
            </div>
            {onViewWorkouts && (
              <button
                type="button"
                onClick={onViewWorkouts}
                className="text-xs text-text-primary hover:text-black font-bold inline-flex items-center gap-0.5 shrink-0 uppercase tracking-wider"
              >
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
