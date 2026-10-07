import React from 'react';
import { ArrowRight, Play, Check, Moon } from 'lucide-react';
import type { Workout, WorkoutSession } from '@/types';
import { ExerciseIcon } from './ExerciseIcon';

interface TodayWorkoutCardProps {
  workout: Workout | null;
  activeSession: WorkoutSession | null;
  isTodayCompleted: boolean;
  isTodayRestDay: boolean;
  onStartWorkout: () => void;
  onResumeWorkout: () => void;
  className?: string;
}

export const TodayWorkoutCard: React.FC<TodayWorkoutCardProps> = ({
  workout,
  activeSession,
  isTodayCompleted,
  isTodayRestDay,
  onStartWorkout,
  onResumeWorkout,
  className = '',
}) => {
  // Case 1: Rest & Recovery Day
  if (isTodayRestDay || (!workout && !activeSession)) {
    return (
      <section
        aria-labelledby="today-workout-title"
        className={`rounded-3xl bg-white border border-[#E6EAE2] p-6 sm:p-8 shadow-sm ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F0F2ED]">
          <div>
            <h2
              id="today-workout-title"
              className="text-xl sm:text-2xl font-black uppercase text-[#141815] tracking-tight leading-none"
            >
              TODAY'S <span className="text-[#1A382B]">WORKOUT</span>
            </h2>
            <div className="flex items-center gap-2 mt-2 text-xs font-mono font-semibold">
              <span className="text-[#1A382B] font-bold">REST & RECOVERY</span>
              <span className="text-[#8A968E]">·</span>
              <span className="text-[#6E7A72]">Sleep · Hydration · Active Mobility</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onStartWorkout}
            className="h-11 px-6 rounded-full bg-[#1A382B] hover:bg-[#234A39] active:bg-[#142C22] active:scale-[0.98] text-white text-xs sm:text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <span>Preview Protocol</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="py-8 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF2EA] text-[#1A382B] flex items-center justify-center mb-3">
            <Moon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#141815] uppercase tracking-wide">
            Rest & Neuromuscular Recovery
          </h3>
          <p className="text-xs text-[#6E7A72] leading-relaxed mt-1.5">
            No resistance training scheduled today. Prioritize sleep, adequate hydration, and light walking to prime your central nervous system for tomorrow's training.
          </p>
        </div>
      </section>
    );
  }

  // Case 2: Active or Scheduled Workout
  const exercises = workout?.exercises ?? [];
  const targetMuscles = workout?.targetMuscleGroups?.join(' · ') ?? 'Full Body Focus';
  const workoutName = workout?.name ?? 'Scheduled Workout';

  // Check which exercise IDs have completed sets in the active session
  const completedExerciseIdSet = new Set<string>();
  if (isTodayCompleted) {
    for (const ex of exercises) {
      completedExerciseIdSet.add(ex.id);
    }
  } else if (activeSession) {
    for (const ex of activeSession.exercises) {
      const allSetsDone = ex.sets.length > 0 && ex.sets.every((s) => s.completed);
      if (allSetsDone) {
        completedExerciseIdSet.add(ex.exerciseId);
      }
    }
  }

  return (
    <section
      aria-labelledby="today-workout-title"
      className={`rounded-3xl bg-white border border-[#E6EAE2] p-6 sm:p-8 shadow-sm ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
        <div>
          <h2
            id="today-workout-title"
            className="text-xl sm:text-2xl font-black uppercase text-[#141815] tracking-tight leading-none"
          >
            TODAY'S <span className="text-[#1A382B]">WORKOUT</span>
          </h2>
          <div className="flex items-center flex-wrap gap-2 mt-2 text-xs font-mono font-semibold">
            <span className="text-[#1A382B] font-bold uppercase">{workoutName}</span>
            <span className="text-[#8A968E]">·</span>
            <span className="text-[#6E7A72] uppercase">{targetMuscles}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
          {/* Compact Resume Session button (shown ONLY if active session exists) */}
          {activeSession && (
            <button
              type="button"
              onClick={onResumeWorkout}
              className="h-10 sm:h-11 px-4 sm:px-5 rounded-full bg-[#EBF2EA] hover:bg-[#DFEAE0] active:scale-[0.98] border border-[#D4E2D2] text-[#1A382B] text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer"
              aria-label="Resume active workout session"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Session</span>
            </button>
          )}

          {/* Primary Start Workout button */}
          <button
            type="button"
            onClick={onStartWorkout}
            className="h-10 sm:h-11 px-5 sm:px-6 rounded-full bg-[#1A382B] hover:bg-[#234A39] active:bg-[#142C22] active:scale-[0.98] text-white text-xs sm:text-sm font-black tracking-wider uppercase flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>{isTodayCompleted ? 'Review Workout' : activeSession ? 'Continue' : 'Start Workout'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Column Headers */}
      <div className="flex items-center px-3 sm:px-4 py-2 border-t border-[#F0F2ED] text-2xs sm:text-xs font-mono font-bold text-[#8A968E] uppercase tracking-wider select-none">
        <span className="w-7 sm:w-8 text-center shrink-0">#</span>
        <span className="flex-1 pl-12 sm:pl-14">Exercise</span>
        <span className="text-right pr-9 sm:pr-11">Sets × Reps</span>
      </div>

      {/* Exercise Rows List */}
      <div className="divide-y divide-[#F0F2ED]">
        {exercises.map((ex, idx) => {
          const isDone = completedExerciseIdSet.has(ex.id);
          const repsText = `${ex.prescribedRepRange[0]}–${ex.prescribedRepRange[1]}`;

          return (
            <div
              key={ex.id}
              className="flex items-center px-3 sm:px-4 py-3 sm:py-3.5 hover:bg-[#F9FAF8] transition-colors group"
            >
              {/* Column 1: Index Number */}
              <span className="w-7 sm:w-8 text-center text-xs font-mono font-bold text-[#8A968E] shrink-0">
                {idx + 1}
              </span>

              {/* Column 2: Minimalist Exercise Pictogram */}
              <div className="w-8 h-8 rounded-lg bg-[#F5F6F2] border border-[#ECEFEA] flex items-center justify-center text-[#1A382B] shrink-0 ml-2 group-hover:bg-[#EBF0EA] transition-colors">
                <ExerciseIcon name={ex.name} className="w-5 h-5" />
              </div>

              {/* Column 3: Exercise Name */}
              <span className="flex-1 ml-3 sm:ml-4 text-xs sm:text-sm font-bold text-[#141815] truncate">
                {ex.name}
              </span>

              {/* Column 4: Sets × Reps Pill Badge */}
              <div className="shrink-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#EDF0EA] border border-[#DEE5DC] text-[#141815] font-mono text-2xs sm:text-xs font-bold whitespace-nowrap">
                  {ex.targetSets} × {repsText}
                </span>
              </div>

              {/* Column 5: Completion Circle Indicator */}
              <div className="w-5 h-5 rounded-full ml-3 sm:ml-4 shrink-0 flex items-center justify-center">
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-[#1A382B] text-white flex items-center justify-center shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-[#CCD5CA]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
