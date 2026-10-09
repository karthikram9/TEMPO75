import React from 'react';
import { formatEstimatedDuration, getDurationNotice } from '../utils/workoutCalculations';

interface WorkoutSummaryProps {
  exerciseCount: number;
  totalSets: number;
  estimatedDurationMinutes: number;
  preferredDurationMinutes?: number;
  className?: string;
}

export const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({
  exerciseCount,
  totalSets,
  estimatedDurationMinutes,
  preferredDurationMinutes,
  className = '',
}) => {
  const durationText = formatEstimatedDuration(estimatedDurationMinutes);
  const durationNotice = getDurationNotice(estimatedDurationMinutes, preferredDurationMinutes);

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      {/* 3 Metric Pills */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <div className="flex flex-col p-3.5 rounded-2xl bg-surface-base border border-border-subtle shadow-daylight">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E7A72]">
            Estimated Time
          </span>
          <span className="text-base sm:text-lg font-black font-mono text-text-primary mt-0.5">
            {durationText}
          </span>
        </div>

        <div className="flex flex-col p-3.5 rounded-2xl bg-surface-base border border-border-subtle shadow-daylight">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E7A72]">
            Movements
          </span>
          <span className="text-base sm:text-lg font-black font-mono text-text-primary mt-0.5">
            {exerciseCount} exercises
          </span>
        </div>

        <div className="flex flex-col p-3.5 rounded-2xl bg-surface-base border border-border-subtle shadow-daylight">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E7A72]">
            Total Volume
          </span>
          <span className="text-base sm:text-lg font-black font-mono text-text-primary mt-0.5">
            {totalSets} sets
          </span>
        </div>
      </div>

      {/* Neutral Duration Notice if substantial variance (>15 min) */}
      {durationNotice && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium">
          <svg
            className="w-4 h-4 text-blue-700 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="leading-relaxed">{durationNotice}</span>
        </div>
      )}
    </div>
  );
};
