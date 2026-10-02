import type { MuscleGroup, Workout, WorkoutExercise } from '@/types';

/**
 * Estimates the duration in minutes for a given workout.
 * Model:
 *   execution time (~45 sec / set)
 *   + rest time (restSeconds per set)
 *   + transition buffer (~30 sec between exercises)
 *
 * Output is rounded to nearest 5 minutes.
 */
export function calculateEstimatedMinutes(exercises: readonly WorkoutExercise[]): number {
  if (exercises.length === 0) return 0;

  let totalSeconds = 0;

  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];
    if (!ex) continue;
    // ~45s lifting per set
    const workSeconds = ex.targetSets * 45;
    // Rest between sets (last set rest might be transition)
    const restSeconds = Math.max(0, ex.targetSets - 1) * ex.restSeconds;
    // ~30s transition between exercises
    const transitionSeconds = 30;

    totalSeconds += workSeconds + restSeconds + transitionSeconds;
  }

  const rawMinutes = totalSeconds / 60;
  // Round to nearest 5 minutes, min 15 min
  const rounded = Math.max(15, Math.round(rawMinutes / 5) * 5);
  return rounded;
}

/**
 * Formats duration as a friendly athletic readout: "~60 min"
 */
export function formatEstimatedDuration(minutes: number): string {
  return `~${minutes} min`;
}

/**
 * Checks whether user's selected session duration differs substantially (> 15 min)
 * from the program's estimated duration and generates an advisory note.
 */
export function getDurationNotice(
  estimatedMinutes: number,
  preferredDurationMinutes?: number
): string | null {
  if (!preferredDurationMinutes) return null;

  const diff = Math.abs(estimatedMinutes - preferredDurationMinutes);
  if (diff > 15) {
    return `Your selected session duration is ${preferredDurationMinutes} min. This session is estimated at ~${estimatedMinutes} min.`;
  }

  return null;
}

/**
 * Computes weekly direct set volume per muscle group across scheduled workouts.
 */
export function calculateWeeklyVolume(
  workouts: readonly (Workout | null)[]
): Partial<Record<MuscleGroup, number>> {
  const volumeMap: Partial<Record<MuscleGroup, number>> = {};

  for (const workout of workouts) {
    if (!workout) continue;

    for (const ex of workout.exercises) {
      for (const muscle of ex.targetMuscles) {
        volumeMap[muscle] = (volumeMap[muscle] ?? 0) + ex.targetSets;
      }
    }
  }

  return volumeMap;
}
