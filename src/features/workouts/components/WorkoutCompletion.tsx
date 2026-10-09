import React from 'react';
import type { WorkoutSessionSummary } from '@/types';

interface WorkoutCompletionProps {
  summary: WorkoutSessionSummary;
  dayNumber: number;
  workoutName: string;
  onFinish: () => void;
  className?: string;
}

export const WorkoutCompletion: React.FC<WorkoutCompletionProps> = ({
  summary,
  dayNumber,
  workoutName,
  onFinish,
  className = '',
}) => {
  const dayPadded = String(dayNumber).padStart(2, '0');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 animate-in fade-in"
    >
      <div className={`w-full max-w-lg bg-white border border-[#E6EAE2] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center ${className}`}>
        {/* Celebration Trophy / Flame Badge */}
        <div className="w-16 h-16 rounded-2xl bg-[#EDF0EA] border border-[#DEE5DC] text-[#1A382B] flex items-center justify-center mb-4">
          <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A382B] mb-1">
          DAY {dayPadded} • PROTOCOL COMPLETED
        </span>

        <h2 id="completion-title" className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#141815] mb-1">
          Session Complete
        </h2>

        <p className="text-xs sm:text-sm text-[#6E7A72] mb-6 font-mono">
          {workoutName}
        </p>

        {/* 4 Summary Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-[#EDF0EA] border border-[#DEE5DC] flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#6E7A72] mb-0.5">
              Duration
            </span>
            <span className="text-lg sm:text-xl font-black font-mono text-[#141815]">
              {summary.durationLabel}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EDF0EA] border border-[#DEE5DC] flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#6E7A72] mb-0.5">
              Exercises
            </span>
            <span className="text-lg sm:text-xl font-black font-mono text-[#141815]">
              {summary.exerciseCount} Exercises
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EDF0EA] border border-[#DEE5DC] flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#6E7A72] mb-0.5">
              Volume
            </span>
            <span className="text-lg sm:text-xl font-black font-mono text-[#141815]">
              {summary.totalVolumeKg.toLocaleString()} kg
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EDF0EA] border border-[#DEE5DC] flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#6E7A72] mb-0.5">
              Sets Logged
            </span>
            <span className="text-lg sm:text-xl font-black font-mono text-[#1A382B]">
              {summary.totalSets} Sets
            </span>
          </div>
        </div>

        {/* Return / Finish CTA */}
        <button
          type="button"
          onClick={onFinish}
          className="w-full min-h-[54px] rounded-full bg-[#1A382B] hover:bg-[#234A39] active:bg-[#142C22] text-white font-mono font-black text-base uppercase tracking-wider shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          Finish & Return
        </button>
      </div>
    </div>
  );
};
