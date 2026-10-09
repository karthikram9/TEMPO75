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
      className={`flex items-center gap-2 p-2.5 rounded-xl bg-[#EDF0EA] border border-[#DEE5DC] text-xs ${className}`}
      aria-label="Previous Performance Records"
    >
      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6E7A72] shrink-0">
        LAST TIME
      </span>

      <span className="text-[#DEE5DC]">•</span>

      {completedSets.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto font-mono text-[#141815]">
          {completedSets.map((s, idx) => {
            const weightLabel = s.weightKg && s.weightKg > 0 ? `${s.weightKg} kg` : 'BW';
            return (
              <span
                key={s.id ?? idx}
                className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white border border-[#DEE5DC] text-[11px] font-black text-[#141815] shadow-xs"
              >
                {weightLabel} × {s.reps}
              </span>
            );
          })}
        </div>
      ) : (
        <span className="text-[#6E7A72] italic text-[11px]">
          No previous record
        </span>
      )}
    </div>
  );
};
