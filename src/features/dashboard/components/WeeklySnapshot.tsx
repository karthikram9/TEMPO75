import React from 'react';
import { Calendar, BarChart2, Clock, CheckCircle2 } from 'lucide-react';
import type { WeeklyStats } from '../hooks/useDashboardData';

interface WeeklySnapshotProps {
  weeklyStats: WeeklyStats;
  daysPerWeekTarget: number;
}

export const WeeklySnapshot: React.FC<WeeklySnapshotProps> = ({
  weeklyStats,
  daysPerWeekTarget,
}) => {
  const { completedCount, totalVolumeKg, totalDurationMinutes, adherencePercent } = weeklyStats;
  const targetCount = daysPerWeekTarget > 0 ? daysPerWeekTarget : 5;

  const isWeeklyEmpty = completedCount === 0;

  return (
    <div
      role="region"
      aria-label="Weekly Training Summary"
      className="rounded-3xl border border-border bg-white p-6 sm:p-7 shadow-daylight transition-colors hover:border-neutral-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-text-primary">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted font-mono">
              Weekly Volume &amp; Adherence
            </h3>
          </div>
        </div>

        <span className="text-[11px] font-mono text-text-muted font-bold">
          ROLLING 7 DAYS
        </span>
      </div>

      {isWeeklyEmpty ? (
        /* Empty State */
        <div className="py-4 text-center space-y-2">
          <div className="text-3xl font-black font-mono text-text-muted">
            0 / {targetCount}
          </div>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            0 workouts completed in the last 7 days. Start today&apos;s session to build weekly momentum.
          </p>
        </div>
      ) : (
        /* Populated Metrics */
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Workouts */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Workouts
              </span>
              <div className="text-2xl md:text-3xl font-black font-mono tabular-nums text-text-primary">
                {completedCount} <span className="text-text-muted text-lg font-normal">/ {targetCount}</span>
              </div>
              <p className="text-[11px] text-text-muted">Target frequency</p>
            </div>

            {/* Total Volume */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                <BarChart2 className="w-3.5 h-3.5 text-text-primary" />
                Total Volume
              </span>
              <div className="text-2xl md:text-3xl font-black font-mono tabular-nums text-text-primary">
                {totalVolumeKg.toLocaleString()}
                <span className="text-xs font-normal text-text-muted ml-1">kg</span>
              </div>
              <p className="text-[11px] text-text-muted">Completed workload</p>
            </div>

            {/* Total Time */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-text-primary" />
                Training Time
              </span>
              <div className="text-2xl md:text-3xl font-black font-mono tabular-nums text-text-primary">
                {totalDurationMinutes}
                <span className="text-xs font-normal text-text-muted ml-1">min</span>
              </div>
              <p className="text-[11px] text-text-muted">Active under bar</p>
            </div>

            {/* Adherence */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted">
                Adherence Rate
              </span>
              <div className="text-2xl md:text-3xl font-black font-mono tabular-nums text-emerald-700">
                {adherencePercent}%
              </div>
              <p className="text-[11px] text-text-muted">Protocol compliance</p>
            </div>
          </div>

          {/* Adherence progress bar */}
          <div className="space-y-1.5 pt-1">
            <div
              role="progressbar"
              aria-label="Weekly adherence"
              aria-valuenow={adherencePercent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="w-full h-2 rounded-full bg-surface-subtle border border-border/50 overflow-hidden"
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  adherencePercent >= 100
                    ? 'bg-emerald-600'
                    : adherencePercent >= 70
                    ? 'bg-accent'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, adherencePercent)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
              <span>Goal: {targetCount} sessions/week</span>
              <span className="font-bold text-text-primary">{completedCount} of {targetCount} complete</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
