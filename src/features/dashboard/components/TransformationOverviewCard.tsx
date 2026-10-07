import React from 'react';
import { Dumbbell, ListChecks, Flag } from 'lucide-react';

interface TransformationOverviewCardProps {
  currentWeightKg?: number | null;
  targetWeightKg?: number | null;
  currentDayNumber: number;
  exerciseCount: number;
  workoutCompletionPercent: number;
  daysRemaining: number;
  className?: string;
}

export const TransformationOverviewCard: React.FC<TransformationOverviewCardProps> = ({
  currentWeightKg,
  targetWeightKg,
  currentDayNumber,
  exerciseCount,
  workoutCompletionPercent,
  daysRemaining,
  className = '',
}) => {
  const formattedCurrentWeight =
    currentWeightKg !== undefined && currentWeightKg !== null && currentWeightKg > 0
      ? currentWeightKg.toFixed(1)
      : '—';

  const formattedTargetWeight =
    targetWeightKg !== undefined && targetWeightKg !== null && targetWeightKg > 0
      ? targetWeightKg.toFixed(1)
      : '—';

  const formattedDay = `DAY ${String(currentDayNumber).padStart(2, '0')} / 75`;

  return (
    <section
      aria-labelledby="transformation-overview-title"
      className={`relative overflow-hidden rounded-3xl bg-[#151816] border border-[#272D29] p-6 sm:p-7 text-white shadow-card flex flex-col justify-between min-h-[290px] ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, #151816 0%, #151816 38%, rgba(21, 24, 22, 0.75) 72%, rgba(21, 24, 22, 0.32) 100%), url('/assets/tempo_gym_plates.jpg')`,
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4">
        <h2
          id="transformation-overview-title"
          className="text-[11px] font-mono font-bold tracking-[0.18em] text-[#9EA9A1] uppercase select-none"
        >
          TRANSFORMATION OVERVIEW
        </h2>

        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#283C2F] border border-[#3A5342] text-[#C2DAC7] text-xs font-mono font-bold tracking-wider uppercase select-none">
          {formattedDay}
        </span>
      </div>

      {/* Main Weight Hero Progression Row */}
      <div className="my-6 flex items-center">
        {/* Current Weight */}
        <div>
          <div className="flex items-baseline">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
              {formattedCurrentWeight}
            </span>
            {formattedCurrentWeight !== '—' && (
              <span className="text-base sm:text-lg lg:text-xl font-bold text-neutral-300 ml-1.5">
                kg
              </span>
            )}
          </div>
          <span className="block text-xs font-medium text-[#8E9A92] mt-1.5 uppercase tracking-wide">
            Current Weight
          </span>
        </div>

        {/* Dynamic Transition Arrow */}
        <div className="mx-4 sm:mx-8 text-neutral-400 select-none text-xl sm:text-2xl font-light" aria-hidden="true">
          →
        </div>

        {/* Target Weight */}
        <div>
          <div className="flex items-baseline">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#58A672] tracking-tight leading-none">
              {formattedTargetWeight}
            </span>
            {formattedTargetWeight !== '—' && (
              <span className="text-base sm:text-lg lg:text-xl font-bold text-[#58A672]/80 ml-1.5">
                kg
              </span>
            )}
          </div>
          <span className="block text-xs font-medium text-[#8E9A92] mt-1.5 uppercase tracking-wide">
            Target Weight
          </span>
        </div>
      </div>

      {/* Bottom Telemetry Metrics Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-white/10">
        {/* Metric 1: Scheduled Exercises */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#222825] border border-[#303833] flex items-center justify-center shrink-0 text-[#B6D6BE]">
            <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <span className="block text-lg sm:text-xl font-black text-white leading-none">
              {exerciseCount}
            </span>
            <span className="block text-2xs sm:text-xs text-[#8E9A92] truncate mt-0.5">
              Exercises (Today)
            </span>
          </div>
        </div>

        {/* Metric 2: Workout Completion */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#222825] border border-[#303833] flex items-center justify-center shrink-0 text-[#B6D6BE]">
            <ListChecks className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <span className="block text-lg sm:text-xl font-black text-white leading-none">
              {workoutCompletionPercent}%
            </span>
            <span className="block text-2xs sm:text-xs text-[#8E9A92] truncate mt-0.5">
              Workout Completion
            </span>
          </div>
        </div>

        {/* Metric 3: Days Remaining */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#222825] border border-[#303833] flex items-center justify-center shrink-0 text-[#B6D6BE]">
            <Flag className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <span className="block text-lg sm:text-xl font-black text-white leading-none">
              {daysRemaining}
            </span>
            <span className="block text-2xs sm:text-xs text-[#8E9A92] truncate mt-0.5">
              Days Remaining
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
