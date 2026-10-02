import React from 'react';
import type { LoggedExercise, LoggedSet, ProgressionRecommendation, WorkoutExercise } from '@/types';
import { MuscleTag } from './MuscleTag';
import { RestBadge } from './RestBadge';
import { PreviousPerformance } from './PreviousPerformance';
import { ProgressionTarget } from './ProgressionTarget';
import { SetRow } from './SetRow';
import { SetInput } from './SetInput';

interface ExerciseLoggerProps {
  workoutExercise: WorkoutExercise;
  loggedExercise: LoggedExercise;
  exerciseIndex: number;
  totalExercises: number;
  previousSets: readonly LoggedSet[];
  progressionRecommendation?: ProgressionRecommendation | null;
  isSaving: boolean;
  onCompleteSet: (params: { weightKg: number; reps: number; rir?: number }) => void;
  onEditSet: (setId: string, updates: { weightKg?: number; reps?: number; rir?: number }) => void;
  onNextExercise: () => void;
  onPrevExercise: () => void;
  onCompleteWorkout?: () => void;
  isAllWorkoutSetsCompleted?: boolean;
  className?: string;
}

export const ExerciseLogger: React.FC<ExerciseLoggerProps> = ({
  workoutExercise,
  loggedExercise,
  exerciseIndex,
  totalExercises,
  previousSets,
  progressionRecommendation,
  isSaving,
  onCompleteSet,
  onEditSet,
  onNextExercise,
  onPrevExercise,
  onCompleteWorkout,
  isAllWorkoutSetsCompleted = false,
  className = '',
}) => {
  const completedSets = loggedExercise.sets.filter((s) => s.completed);
  const nextIncompleteSet = loggedExercise.sets.find((s) => !s.completed);
  const isExerciseFinished = !nextIncompleteSet && loggedExercise.sets.length > 0;

  // Determine previous successful weight to prefill:
  // - If sets were already completed in THIS session (Set 2+), ALWAYS carry forward user's completed weight
  // - If Set 1 (untouched), provide progression target suggested load if available, or previous sets weight
  const lastRecordedWeight =
    completedSets.length > 0
      ? completedSets[completedSets.length - 1]?.weightKg
      : progressionRecommendation?.suggestedLoadKg !== undefined
      ? progressionRecommendation.suggestedLoadKg
      : previousSets.length > 0
      ? previousSets[0]?.weightKg
      : undefined;

  const isBodyweight =
    workoutExercise.name.toLowerCase().includes('pull-up') ||
    workoutExercise.name.toLowerCase().includes('push-up') ||
    workoutExercise.name.toLowerCase().includes('plank') ||
    workoutExercise.name.toLowerCase().includes('hanging knee');

  return (
    <article
      aria-labelledby="active-exercise-title"
      className={`w-full flex flex-col gap-4 bg-surface-primary border border-border-primary rounded-3xl p-4 sm:p-6 shadow-sm ${className}`}
    >
      {/* 1. Header with Navigation Arrows and Title */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-text-primary font-black px-2 py-0.5 rounded bg-accent text-[11px] shadow-xs">
              #{String(exerciseIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-text-tertiary">
              EXERCISE {exerciseIndex + 1} OF {totalExercises}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrevExercise}
              disabled={exerciseIndex === 0}
              className="min-h-[36px] px-2.5 py-1 rounded-lg bg-surface-secondary hover:bg-surface-tertiary text-text-secondary disabled:opacity-40 disabled:pointer-events-none text-xs font-mono font-semibold border border-border-primary active:scale-95 transition-colors"
              aria-label="Previous Exercise"
            >
              &larr; Prev
            </button>
            <button
              type="button"
              onClick={onNextExercise}
              disabled={exerciseIndex === totalExercises - 1}
              className="min-h-[36px] px-2.5 py-1 rounded-lg bg-surface-secondary hover:bg-surface-tertiary text-text-secondary disabled:opacity-40 disabled:pointer-events-none text-xs font-mono font-semibold border border-border-primary active:scale-95 transition-colors"
              aria-label="Next Exercise"
            >
              Next &rarr;
            </button>
          </div>
        </div>

        <h2
          id="active-exercise-title"
          className="text-xl sm:text-2xl font-black uppercase tracking-tight text-text-primary"
        >
          {workoutExercise.name}
        </h2>

        {/* Muscle Targets and Prescription Row */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {workoutExercise.targetMuscles.map((muscle) => (
            <MuscleTag key={muscle} muscle={muscle} />
          ))}

          <span className="text-text-tertiary">•</span>

          <span className="text-xs font-mono font-semibold text-text-secondary">
            {workoutExercise.targetSets} SETS
          </span>

          <span className="text-xs font-mono font-semibold text-text-secondary">
            {workoutExercise.prescribedRepRange[0]}–{workoutExercise.prescribedRepRange[1]} REPS
          </span>

          <RestBadge seconds={workoutExercise.restSeconds} className="!text-[11px] !py-0.5 !px-2" />
        </div>

        {/* Short Cue Instruction */}
        {workoutExercise.instructions?.[0] && (
          <p className="text-xs text-text-secondary italic pl-2.5 border-l-2 border-accent mt-1">
            &ldquo;{workoutExercise.instructions[0]}&rdquo;
          </p>
        )}
      </div>

      {/* 2. Previous Performance Reference (Historical Actuals) */}
      <PreviousPerformance sets={previousSets} />

      {/* 3. Advisory Progression Target (Advisory Next Session Target) */}
      {progressionRecommendation && (
        <ProgressionTarget recommendation={progressionRecommendation} />
      )}

      {/* 4. Completed Sets History */}
      {completedSets.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-tertiary px-1">
            Completed Sets ({completedSets.length} / {workoutExercise.targetSets})
          </span>
          <div className="flex flex-col gap-1.5">
            {completedSets.map((s, idx) => (
              <SetRow
                key={s.id}
                set={s}
                index={idx}
                onEditSet={onEditSet}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. Active Set Input OR Exercise Completed Banner */}
      {!isExerciseFinished && nextIncompleteSet ? (
        <SetInput
          key={nextIncompleteSet.id}
          setNumber={nextIncompleteSet.setNumber}
          targetRepRange={workoutExercise.prescribedRepRange}
          previousWeightKg={lastRecordedWeight}
          isBodyweight={isBodyweight}
          isSaving={isSaving}
          onCompleteSet={onCompleteSet}
        />
      ) : (
        <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h4 className="text-base font-bold font-mono text-emerald-800 uppercase">
            All Sets Complete
          </h4>
          <p className="text-xs text-text-secondary mt-1 mb-4">
            {workoutExercise.name} finished. Proceed to the next movement.
          </p>

          {exerciseIndex < totalExercises - 1 ? (
            <button
              type="button"
              onClick={onNextExercise}
              className="w-full sm:w-auto min-h-[48px] px-6 rounded-xl bg-accent hover:opacity-95 text-text-primary font-mono font-black text-sm uppercase tracking-wider transition-colors active:scale-95 shadow-sm"
            >
              Next Exercise &rarr;
            </button>
          ) : isAllWorkoutSetsCompleted && onCompleteWorkout ? (
            <button
              type="button"
              onClick={onCompleteWorkout}
              className="w-full sm:w-auto min-h-[48px] px-6 rounded-xl bg-surface-inverse hover:opacity-90 text-text-inverse font-mono font-black text-sm uppercase tracking-wider transition-colors active:scale-95 shadow-md"
            >
              Finish Workout Session
            </button>
          ) : null}
        </div>
      )}

      {/* 5. Pending Future Sets Indicator */}
      {!isExerciseFinished &&
        loggedExercise.sets.length > (nextIncompleteSet?.setNumber ?? 1) && (
          <div className="flex items-center gap-2 px-1 text-xs text-text-tertiary font-mono">
            <span>Remaining:</span>
            {loggedExercise.sets
              .filter((s) => !s.completed && s.id !== nextIncompleteSet?.id)
              .map((s) => (
                <span key={s.id} className="px-2 py-0.5 rounded bg-surface-secondary border border-border-secondary text-text-secondary">
                  Set {s.setNumber}
                </span>
              ))}
          </div>
        )}
    </article>
  );
};
