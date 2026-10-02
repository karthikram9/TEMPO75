import type { Goal, MuscleGroup, RecoveryPreferences, TrainingPreferences, Workout, WorkoutExercise } from '@/types';
import { selectCompatibleExercise } from './exerciseSelector';
import { getTemplateForDay } from './splitGenerator';
import { calculateEstimatedMinutes } from '../utils/workoutCalculations';

export interface GenerateWorkoutParams {
  challengeDayNumber: number; // 1 to 75
  challengeId?: string;
  challengeDayId?: string;
  trainingPreferences: TrainingPreferences;
  recoveryPreferences?: RecoveryPreferences;
  goal?: Goal | null;
  status?: 'active' | 'upcoming' | 'completed' | 'missed' | 'rest';
}

/**
 * Reorders exercises to place priority muscles earlier in the session
 * while preserving the primary compound anchor at index 0.
 */
function applyPriorityMuscleOrdering(
  exercises: WorkoutExercise[],
  priorityMuscles: readonly MuscleGroup[] = []
): WorkoutExercise[] {
  if (priorityMuscles.length === 0 || exercises.length <= 2) {
    return exercises;
  }

  // Anchor the first primary heavy compound movement
  const anchor = exercises[0];
  if (!anchor) {
    return exercises;
  }
  const remaining = exercises.slice(1);

  // Score remaining: exercises targeting a priority muscle move to the front
  const scored = remaining.map((ex, originalIndex) => {
    const hasPriority = ex.targetMuscles.some((m) => priorityMuscles.includes(m));
    return {
      ex,
      originalIndex,
      priorityRank: hasPriority ? 0 : 1,
    };
  });

  // Stable sort by priorityRank, keeping original order within same tier
  scored.sort((a, b) => {
    if (a.priorityRank !== b.priorityRank) {
      return a.priorityRank - b.priorityRank;
    }
    return a.originalIndex - b.originalIndex;
  });

  const ordered: WorkoutExercise[] = [anchor, ...scored.map((s) => s.ex)];

  // Re-index orders 1..N
  return ordered.map((ex, idx): WorkoutExercise => ({
    ...ex,
    order: idx + 1,
  }));
}

/**
 * Deterministically generates a Workout for a specific 75-day challenge day.
 * Returns null if the day is a rest/recovery day.
 */
export function generateWorkout({
  challengeDayNumber,
  challengeId,
  challengeDayId,
  trainingPreferences,
  recoveryPreferences,
  goal,
  status,
}: GenerateWorkoutParams): Workout | null {
  const template = getTemplateForDay(
    challengeDayNumber,
    trainingPreferences.daysPerWeek,
    trainingPreferences.preferredSplit,
    recoveryPreferences?.restDayPreference ?? 'sunday'
  );

  // If this day is scheduled recovery, return null
  if (!template) {
    return null;
  }

  // Map each exercise from the template with equipment matching & alternatives
  const mappedExercises: WorkoutExercise[] = template.exercises.map((tmplEx, idx) => {
    const selected = selectCompatibleExercise(
      tmplEx.exerciseId,
      trainingPreferences.availableEquipment
    );

    return {
      id: `wo_ex_${challengeDayNumber}_${idx + 1}`,
      exerciseId: selected.exercise.id,
      name: selected.exercise.name,
      order: idx + 1,
      targetSets: tmplEx.targetSets,
      prescribedRepRange: tmplEx.prescribedRepRange,
      restSeconds: tmplEx.restSeconds,
      targetMuscles: selected.exercise.primaryMuscles,
      movementPattern: selected.exercise.movementPattern,
      instructions: selected.exercise.instructions,
      notes: tmplEx.notes,
      isAlternative: selected.isAlternative,
      originalExerciseId: selected.originalExerciseId,
    };
  });

  // Apply priority muscle reordering if priority muscles are set
  const orderedExercises = applyPriorityMuscleOrdering(
    mappedExercises,
    goal?.priorityMuscles ?? []
  );

  const estimatedDurationMinutes = calculateEstimatedMinutes(orderedExercises);

  return {
    id: `workout_day_${String(challengeDayNumber).padStart(2, '0')}`,
    challengeId,
    challengeDayId,
    dayNumber: challengeDayNumber,
    name: template.name,
    focus: template.focus,
    dayOfWeek: (challengeDayNumber - 1) % 7,
    exercises: orderedExercises,
    estimatedDurationMinutes,
    targetMuscleGroups: template.targetMuscleGroups,
    status: status ?? (challengeDayNumber === 1 ? 'active' : 'upcoming'),
  };
}
