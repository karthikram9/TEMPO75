import React from 'react';
import type { LoggedSet } from '@/types';

interface PreviousPerformanceProps {
  sets: readonly LoggedSet[];
  className?: string;
}

export const PreviousPerformance: React.FC<PreviousPerformanceProps> = ({
  sets,
  className = '',
}) => {
  const completedSets = sets.filter((s) => s.completed);

  return (
    <div
      className={`flex items-center gap-2 p-2.5 rounded-xl bg-surface-secondary border border-border-primary/60 text-xs ${className}`}
      aria-label="Previous Performance Records"
    >
      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-tertiary shrink-0">
        LAST TIME
      </span>

      <span className="text-border-primary">•</span>

      {completedSets.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto font-mono text-text-primary">
          {completedSets.map((s, idx) => {
            const weightLabel = s.weightKg && s.weightKg > 0 ? `${s.weightKg} kg` : 'BW';
            return (
              <span
                key={s.id ?? idx}
                className="inline-flex items-center px-2 py-0.5 rounded-lg bg-surface-primary border border-border-secondary text-[11px] font-semibold text-text-primary shadow-xs"
              >
                {weightLabel} × {s.reps}
              </span>
            );
          })}
        </div>
      ) : (
        <span className="text-text-tertiary italic text-[11px]">
          No previous record
        </span>
      )}
    </div>
  );
};
