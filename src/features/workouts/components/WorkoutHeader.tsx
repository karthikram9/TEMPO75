import React from 'react';
import type { MuscleGroup } from '@/types';
import { MuscleTag } from './MuscleTag';

interface WorkoutHeaderProps {
  dayNumber: number;
  totalDays?: number;
  workoutName: string;
  focus: string;
  targetMuscleGroups?: MuscleGroup[];
  status?: 'active' | 'upcoming' | 'completed' | 'missed' | 'rest';
  className?: string;
}

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  dayNumber,
  totalDays = 75,
  workoutName,
  focus,
  targetMuscleGroups = [],
  status = 'active',
  className = '',
}) => {
  const dayNumberPadded = String(dayNumber).padStart(2, '0');
  const totalDaysPadded = String(totalDays).padStart(2, '0');

  // Status badge styling
  const statusConfig = {
    active: {
      label: 'ACTIVE PROTOCOL',
      classes: 'bg-accent/25 border-accent/40 text-text-primary font-bold',
    },
    upcoming: {
      label: 'UPCOMING (VIEW-ONLY)',
      classes: 'bg-surface-subtle border-border-subtle text-text-tertiary font-medium',
    },
    completed: {
      label: 'COMPLETED',
      classes: 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold',
    },
    missed: {
      label: 'PAST DAY',
      classes: 'bg-rose-50 border-rose-200 text-rose-800 font-medium',
    },
    rest: {
      label: 'RECOVERY DAY',
      classes: 'bg-blue-50 border-blue-200 text-blue-800 font-bold',
    },
  }[status] ?? {
    label: status.toUpperCase(),
    classes: 'bg-surface-subtle border-border-subtle text-text-tertiary font-medium',
  };

  return (
    <header className={`w-full ${className}`}>
      {/* Top Protocol Status Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold tracking-wider text-text-tertiary uppercase">
            TEMPO 75
          </span>
          <span className="text-border-subtle">•</span>
          <span className="text-xs font-mono font-bold tracking-wider text-text-primary">
            DAY {dayNumberPadded} / {totalDaysPadded}
          </span>
        </div>

        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border font-mono ${statusConfig.classes}`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Main Workout Name */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-text-primary mb-2">
        {workoutName}
      </h1>

      {/* Training Focus & Targeted Muscle Group Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs sm:text-sm font-semibold text-text-secondary tracking-wide uppercase">
          {focus}
        </span>

        {targetMuscleGroups.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 ml-1">
            {targetMuscleGroups.map((muscle) => (
              <MuscleTag key={muscle} muscle={muscle} />
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
