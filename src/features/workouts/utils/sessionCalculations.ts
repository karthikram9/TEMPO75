import type { LoggedExercise } from '@/types';

/**
 * Calculates total lifted volume in kg for a workout session.
 * SOP Section 26: Only weighted sets contribute to volume (weightKg * reps).
 * Bodyweight sets (weightKg = 0 or undefined) do not count toward weight volume.
 */
export function calculateSessionVolume(exercises: readonly LoggedExercise[]): number {
  let totalVolume = 0;

  for (const ex of exercises) {
    for (const set of ex.sets) {
      if (set.completed && set.weightKg && set.weightKg > 0 && set.reps && set.reps > 0) {
        totalVolume += set.weightKg * set.reps;
      }
    }
  }

  return Math.round(totalVolume * 10) / 10;
}

/**
 * Counts total completed sets across all exercises.
 */
export function calculateCompletedSetCount(exercises: readonly LoggedExercise[]): number {
  let count = 0;
  for (const ex of exercises) {
    for (const set of ex.sets) {
      if (set.completed) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Counts total prescribed sets across all exercises.
 */
export function calculateTotalPrescribedSets(exercises: readonly LoggedExercise[]): number {
  let count = 0;
  for (const ex of exercises) {
    count += ex.sets.length;
  }
  return count;
}

/**
 * Counts exercises where all prescribed sets have been completed.
 */
export function calculateCompletedExerciseCount(exercises: readonly LoggedExercise[]): number {
  let completedCount = 0;
  for (const ex of exercises) {
    if (ex.sets.length > 0 && ex.sets.every((s) => s.completed)) {
      completedCount++;
    }
  }
  return completedCount;
}

/**
 * Formats workout session duration into a friendly gym display, e.g. "~58 MIN".
 * SOP Section 27: completedAt - startedAt. Display "~58 MIN" rather than overly precise "58:13".
 */
export function formatSessionDuration(startedAt: string, completedAt?: string): string {
  const startMs = new Date(startedAt).getTime();
  const endMs = completedAt ? new Date(completedAt).getTime() : Date.now();
  const diffMinutes = Math.max(1, Math.round((endMs - startMs) / (1000 * 60)));
  return `~${diffMinutes} MIN`;
}

export interface SetValidationResult {
  isValid: boolean;
  error?: string;
  weightKg?: number;
  reps?: number;
  rir?: number;
}

/**
 * Validates set input values according to SOP Section 18:
 * - Weight must be >= 0 (0 kg is valid for bodyweight movements).
 * - Reps must be integer >= 1.
 * - RIR must be integer/number between 0 and 5.
 */
export function validateSetInput(
  weightStr: string,
  repsStr: string,
  rirStr?: string
): SetValidationResult {
  const cleanWeight = weightStr.trim();
  const cleanReps = repsStr.trim();

  if (!cleanReps) {
    return { isValid: false, error: 'Enter reps.' };
  }

  const reps = parseInt(cleanReps, 10);
  if (isNaN(reps) || reps < 1) {
    return { isValid: false, error: 'Reps must be at least 1.' };
  }

  let weightKg = 0;
  if (cleanWeight !== '') {
    const parsedWeight = parseFloat(cleanWeight);
    if (isNaN(parsedWeight) || parsedWeight < 0) {
      return { isValid: false, error: 'Weight must be 0 or greater.' };
    }
    weightKg = parsedWeight;
  }

  let rir: number | undefined = undefined;
  if (rirStr && rirStr.trim() !== '') {
    const parsedRir = parseInt(rirStr.trim(), 10);
    if (isNaN(parsedRir) || parsedRir < 0 || parsedRir > 5) {
      return { isValid: false, error: 'RIR must be between 0 and 5.' };
    }
    rir = parsedRir;
  }

  return {
    isValid: true,
    weightKg,
    reps,
    rir,
  };
}
