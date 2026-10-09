import React from 'react';

interface WorkoutProgressProps {
  dayNumber: number;
  totalDays?: number;
  workoutName: string;
  currentExerciseIndex: number;
  totalExercises: number;
  completedSets: number;
  totalSets: number;
  totalVolumeKg?: number;
  className?: string;
}

export const WorkoutProgress: React.FC<WorkoutProgressProps> = ({
  dayNumber,
  totalDays = 75,
  workoutName,
  currentExerciseIndex,
  totalExercises,
  completedSets,
  totalSets,
  totalVolumeKg = 0,
  className = '',
}) => {
  const dayPadded = String(dayNumber).padStart(2, '0');
  const totalDaysPadded = String(totalDays).padStart(2, '0');

  const setsPercent = totalSets > 0 ? Math.min(100, Math.round((completedSets / totalSets) * 100)) : 0;

  return (
    <header className={`w-full flex flex-col gap-2.5 ${className}`}>
      {/* Top Protocol Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-[#6E7A72]">
          <span>DAY {dayPadded} / {totalDaysPadded}</span>
          <span className="text-[#DEE5DC]">•</span>
          <span className="text-[#141815] font-black">{workoutName}</span>
        </div>

        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#1A382B] text-white text-[11px] font-mono font-black shadow-xs">
          {completedSets} / {totalSets} SETS
        </span>
      </div>

      {/* Subtle Linear Progress Bar */}
      <div className="w-full h-1.5 bg-[#E6EAE2] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1A382B] transition-all duration-300 rounded-full"
          style={{ width: `${setsPercent}%` }}
          role="progressbar"
          aria-valuenow={completedSets}
          aria-valuemin={0}
          aria-valuemax={totalSets}
          aria-label="Sets completed progress"
        />
      </div>

      {/* Bottom Sub-row: Exercise Index & Volume */}
      <div className="flex items-center justify-between text-xs text-[#6E7A72] font-mono">
        <span>
          EXERCISE {currentExerciseIndex + 1} OF {totalExercises}
        </span>

        {totalVolumeKg > 0 && (
          <span className="text-[#48544D] font-bold">
            {totalVolumeKg.toLocaleString()} kg lifted
          </span>
        )}
      </div>
    </header>
  );
};
