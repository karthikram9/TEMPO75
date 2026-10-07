import React from 'react';
import type { Workout, WorkoutSession } from '@/types';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
import { useRestTimer } from '../hooks/useRestTimer';
import { WorkoutProgress } from './WorkoutProgress';
import { ExerciseLogger } from './ExerciseLogger';
import { RestTimer } from './RestTimer';
import { WorkoutCompletion } from './WorkoutCompletion';

interface WorkoutLoggerProps {
  workout: Workout;
  challengeId?: string;
  challengeDayId?: string;
  challengeDayNumber: number;
  onExit: () => void;
  onWorkoutCompleted?: (session: WorkoutSession) => void;
  className?: string;
}

export const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({
  workout,
  challengeId = '',
  challengeDayId = '',
  challengeDayNumber,
  onExit,
  onWorkoutCompleted,
  className = '',
}) => {
  const {
    timerState,
    formattedRemaining,
    progressPercent,
    startTimer,
    pauseTimer,
    resumeTimer,
    addTime,
    subtractTime,
    skipTimer,
  } = useRestTimer();

  const {
    session,
    activeExerciseIndex,
    currentWorkoutExercise,
    currentLoggedExercise,
    previousPerformance,
    progressionRecommendation,
    completedSetsCount,
    totalPrescribedSets,
    isAllRequiredSetsCompleted,
    isSaving,
    error,
    showCompletionModal,
    completedSummary,
    completeCurrentSet,
    editCompletedSet,
    goToNextExercise,
    goToPreviousExercise,
    goToExercise,
    completeWorkout,
    closeCompletionModal,
  } = useWorkoutSession({
    workout,
    challengeId,
    challengeDayId,
    challengeDayNumber,
    onAutoStartRest: (seconds, exerciseName) => {
      startTimer(seconds, exerciseName);
    },
  });

  const handleFinish = () => {
    closeCompletionModal();
    if (session && onWorkoutCompleted) {
      onWorkoutCompleted(session);
    } else {
      onExit();
    }
  };

  return (
    <div className={`w-full flex flex-col gap-5 sm:gap-6 ${className}`}>
      {/* Top Bar: Progress and Exit/Pause Control */}
      <div className="flex flex-col gap-3 p-5 rounded-3xl bg-surface-base border border-border-subtle shadow-daylight">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle/60">
          <button
            type="button"
            onClick={onExit}
            className="text-xs font-mono font-bold text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-colors"
          >
            <span>&larr; Overview</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/25 border border-accent/40 text-text-primary text-[11px] font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-text-primary animate-pulse" aria-hidden="true" />
            <span className="uppercase tracking-wider">
              IN PROGRESS
            </span>
          </div>
        </div>

        <WorkoutProgress
          dayNumber={challengeDayNumber}
          workoutName={workout.name}
          currentExerciseIndex={activeExerciseIndex}
          totalExercises={workout.exercises.length}
          completedSets={completedSetsCount}
          totalSets={totalPrescribedSets}
          totalVolumeKg={session?.totalVolumeKg}
        />
      </div>

      {/* Exercise Quick-Jump Selector Dots / Stepper */}
      <div
        className="flex items-center gap-1.5 overflow-x-auto pb-1 px-1 scrollbar-none"
        role="tablist"
        aria-label="Workout movements"
      >
        {workout.exercises.map((ex, idx) => {
          const isCurrent = idx === activeExerciseIndex;
          const isDone = session?.exercises[idx]?.sets.every((s) => s.completed);

          return (
            <button
              key={ex.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              onClick={() => goToExercise(idx)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 touch-manipulation ${
                isCurrent
                  ? 'bg-[#1A382B] border-transparent text-white font-black shadow-sm'
                  : isDone
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-surface-base border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-surface-subtle shadow-sm'
              }`}
            >
              <span>{idx + 1}</span>
              <span className="hidden sm:inline truncate max-w-[100px]">{ex.name}</span>
              {isDone && <span className="text-[10px]">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Global Error Banner */}
      {error && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={onExit}
            className="text-xs font-bold underline hover:text-rose-950 font-mono"
          >
            Back to Overview
          </button>
        </div>
      )}

      {/* Active Exercise Logger View */}
      {currentWorkoutExercise && currentLoggedExercise ? (
        <ExerciseLogger
          workoutExercise={currentWorkoutExercise}
          loggedExercise={currentLoggedExercise}
          exerciseIndex={activeExerciseIndex}
          totalExercises={workout.exercises.length}
          previousSets={previousPerformance}
          progressionRecommendation={progressionRecommendation}
          isSaving={isSaving}
          onCompleteSet={completeCurrentSet}
          onEditSet={(setId, updates) => editCompletedSet(activeExerciseIndex, setId, updates)}
          onNextExercise={goToNextExercise}
          onPrevExercise={goToPreviousExercise}
          onCompleteWorkout={completeWorkout}
          isAllWorkoutSetsCompleted={isAllRequiredSetsCompleted}
        />
      ) : (
        <div className="p-8 rounded-3xl bg-surface-base border border-border-subtle shadow-daylight flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-text-secondary">INITIALIZING SESSION...</span>
        </div>
      )}

      {/* Complete Workout Action Banner when all required sets are finished */}
      {isAllRequiredSetsCompleted && (
        <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-daylight">
          <div>
            <h4 className="text-sm font-bold font-mono text-emerald-900 uppercase">
              All Required Sets Completed ({completedSetsCount} / {totalPrescribedSets})
            </h4>
            <p className="text-xs text-emerald-700 mt-0.5">
              Ready to finalize today&apos;s protocol record.
            </p>
          </div>

          <button
            type="button"
            onClick={completeWorkout}
            className="w-full sm:w-auto min-h-[50px] px-8 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm uppercase tracking-wider font-mono shadow-md transition-all active:scale-95 touch-manipulation"
          >
            Complete Workout
          </button>
        </div>
      )}

      {/* Sticky Drift-Free Rest Timer */}
      <RestTimer
        timerState={timerState}
        formattedRemaining={formattedRemaining}
        progressPercent={progressPercent}
        onPause={pauseTimer}
        onResume={resumeTimer}
        onAddTime={() => addTime(15)}
        onSubtractTime={() => subtractTime(15)}
        onSkip={skipTimer}
      />

      {/* Workout Completion Modal */}
      {showCompletionModal && completedSummary && (
        <WorkoutCompletion
          summary={completedSummary}
          dayNumber={challengeDayNumber}
          workoutName={workout.name}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
};
