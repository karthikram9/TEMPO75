import React from 'react';
import type { ProgressionRecommendation, WorkoutExercise } from '@/types';
import { MuscleTag } from './MuscleTag';
import { RestBadge } from './RestBadge';

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  index: number;
  recommendation?: ProgressionRecommendation | null;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index, recommendation }) => {
  const orderPadded = String(exercise.order ?? index + 1).padStart(2, '0');
  const repRangeLabel = `${exercise.prescribedRepRange[0]}–${exercise.prescribedRepRange[1]} REPS`;
  const primaryInstruction = exercise.instructions?.[0] ?? exercise.notes;

  return (
    <article
      className="group relative flex flex-col justify-between bg-surface-base hover:bg-surface-subtle/30 border border-border-subtle rounded-3xl p-5 shadow-daylight transition-all duration-200"
      aria-labelledby={`exercise-title-${exercise.id}`}
    >
      <div>
        {/* Top Header: Order, Name, and Tags */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <span
              className="text-xs font-mono font-black tracking-wider text-white bg-[#1A382B] px-2.5 py-0.5 rounded-full shadow-xs"
              aria-label={`Exercise number ${exercise.order}`}
            >
              {orderPadded}
            </span>
            <h3
              id={`exercise-title-${exercise.id}`}
              className="text-base sm:text-lg font-black uppercase tracking-tight text-text-primary"
            >
              {exercise.name}
            </h3>
          </div>

          {exercise.isAlternative && (
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-50 border border-amber-200 text-amber-800 shrink-0"
              title="Adapted to match your available equipment"
            >
              EQUIPMENT ADAPTED
            </span>
          )}
        </div>

        {/* Target Muscles */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5" aria-label="Target muscle groups">
          {exercise.targetMuscles.map((muscle) => (
            <MuscleTag key={muscle} muscle={muscle} />
          ))}
        </div>

        {/* Core Prescription Badges: Sets, Reps, Rest */}
        <div className="grid grid-cols-3 gap-2 mb-3.5">
          <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-surface-subtle/70 border border-border-subtle/60 text-center">
            <span className="text-[10px] uppercase font-bold text-[#6E7A72] tracking-wider">Sets</span>
            <span className="text-sm sm:text-base font-extrabold text-text-primary font-mono mt-0.5">
              {exercise.targetSets}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-surface-subtle/70 border border-border-subtle/60 text-center">
            <span className="text-[10px] uppercase font-bold text-[#6E7A72] tracking-wider">Reps</span>
            <span className="text-sm sm:text-base font-extrabold text-text-primary font-mono mt-0.5">
              {repRangeLabel}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-surface-subtle/70 border border-border-subtle/60 text-center">
            <span className="text-[10px] uppercase font-bold text-[#6E7A72] tracking-wider">Rest</span>
            <RestBadge seconds={exercise.restSeconds} className="mt-0.5 !border-0 !bg-transparent !p-0 !text-xs !font-bold text-text-primary font-mono" />
          </div>
        </div>

        {/* Short Instruction Cue */}
        {primaryInstruction && (
          <p className="text-xs text-text-secondary leading-relaxed pl-3 border-l-2 border-[#1A382B] mb-3 italic">
            &ldquo;{primaryInstruction}&rdquo;
          </p>
        )}

        {/* Advisory Next Target Chip if history exists */}
        {recommendation && (
          <div className="mb-3 p-3 rounded-2xl bg-[#EDF0EA] border border-[#DEE5DC] flex items-center justify-between text-xs font-mono">
            <span className="text-[#1A382B] font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-white border border-[#DEE5DC]">
              NEXT TARGET
            </span>
            <span className="text-[#141815] font-bold">
              {recommendation.targetLabel}
            </span>
          </div>
        )}
      </div>

      {/* Logging Status Notice */}
      <div className="pt-2.5 mt-1 border-t border-border-subtle/60 flex items-center justify-between text-[11px] text-[#6E7A72]">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
          <span className="font-medium text-text-secondary">Prescription view</span>
        </span>
        <span className="font-mono text-[#6E7A72]">Ready to track in workout logger</span>
      </div>
    </article>
  );
};
