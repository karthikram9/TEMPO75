import type {
  MovementPattern,
  ProgressionConfidence,
  ProgressionRecommendation,
  WorkoutExercise,
} from '@/types';
import { calculateNextLoad, isBodyweightExercise } from './loadIncrements';
import { calculateEstimated1RM, isEligibleForEstimated1RM } from './oneRepMax';
import type { ExerciseHistorySession } from './performanceHistory';
import { getExerciseById } from '../data/exercises';

export interface GenerateRecommendationParams {
  exercise: WorkoutExercise;
  history: readonly ExerciseHistorySession[];
}

/**
 * Generates an advisory progression recommendation using conservative Double Progression.
 *
 * Core Rules:
 * 1. Rep ceiling reached across all sets with RIR >= 1:
 *    -> Status: 'progress' (increase load to next supported increment, drop reps to lower range).
 * 2. Rep ceiling reached but RIR = 0 (grinder/extreme failure):
 *    -> Status: 'maintain' (consolidate reserve before adding load).
 * 3. Rep ceiling reached but RIR is missing:
 *    -> Status: 'progress', but confidence penalized to 'medium'.
 * 4. Below rep ceiling (e.g. 10, 10, 9 in 8-12):
 *    -> Status: 'maintain' (keep load, target additional reps toward ceiling).
 * 5. Bad-Workout Protection (Two-Strike Policy):
 *    -> Strike 1 (single bad session after solid performance): 'maintain' with supportive recovery cue. Never reduce load from a single bad workout.
 *    -> Strike 2 (two consecutive declining sessions): eligible for 'reduce' by 1 supported equipment increment.
 * 6. New Exercise (no history):
 *    -> Status: 'new', confidence 'low'.
 */
export function generateProgressionRecommendation(
  params: GenerateRecommendationParams
): ProgressionRecommendation {
  const { exercise, history } = params;
  const [minPrescribedReps, maxPrescribedReps] = exercise.prescribedRepRange;
  const exerciseEquipment = exercise.equipment ?? getExerciseById(exercise.exerciseId)?.equipment ?? [];
  const isBw = isBodyweightExercise(exercise.name, exerciseEquipment, 0);

  // 1. Case: New Exercise (no previous completed sessions)
  if (!history || history.length === 0) {
    return {
      exerciseId: exercise.exerciseId,
      status: 'new',
      suggestedRepRange: exercise.prescribedRepRange,
      confidence: 'low',
      explanation: 'First time logging this exercise. Establish a baseline.',
      targetLabel: isBw
        ? `BW × ${minPrescribedReps}–${maxPrescribedReps}`
        : `Target ${minPrescribedReps}–${maxPrescribedReps} reps`,
    };
  }

  const latestSession = history[0];
  if (!latestSession) {
    return {
      exerciseId: exercise.exerciseId,
      status: 'new',
      suggestedRepRange: exercise.prescribedRepRange,
      confidence: 'low',
      explanation: 'First time logging this exercise. Establish a baseline.',
      targetLabel: `Target ${minPrescribedReps}–${maxPrescribedReps} reps`,
    };
  }

  const validSets = latestSession.sets.filter((s) => s.completed && (s.reps ?? 0) > 0);

  if (validSets.length === 0) {
    return {
      exerciseId: exercise.exerciseId,
      status: 'new',
      suggestedRepRange: exercise.prescribedRepRange,
      confidence: 'low',
      explanation: 'No completed sets found in previous session. Establish a baseline.',
      targetLabel: `Target ${minPrescribedReps}–${maxPrescribedReps} reps`,
    };
  }

  // Extract load and reps from latest session
  const latestReps = validSets.map((s) => s.reps ?? 0);
  const latestLoadKg = validSets[0]?.weightKg ?? 0;
  const rirValues = validSets
    .map((s) => s.rir)
    .filter((r): r is number => typeof r === 'number');
  const hasRirData = rirValues.length > 0;
  const avgRir = hasRirData
    ? rirValues.reduce((a, b) => a + b, 0) / rirValues.length
    : undefined;

  // Calculate estimated 1RM if eligible
  let estimated1RMKg: number | undefined;
  if (
    isEligibleForEstimated1RM({
      name: exercise.name,
      movementPattern: exercise.movementPattern as MovementPattern | undefined,
      weightKg: latestSession.topSetLoadKg,
      reps: latestSession.topSetReps,
    })
  ) {
    const e1rm = calculateEstimated1RM(latestSession.topSetLoadKg, latestSession.topSetReps);
    if (e1rm !== null) {
      estimated1RMKg = e1rm;
    }
  }

  // Check if rep ceiling reached across all completed sets
  // Required sets: either prescribed targetSets or completed set count, whichever is applicable
  const requiredSetsCount = Math.min(exercise.targetSets, validSets.length);
  const allSetsAtCeiling =
    validSets.length >= requiredSetsCount &&
    latestReps.slice(0, requiredSetsCount).every((reps) => reps >= maxPrescribedReps);

  // 2. Case: Two-Strike Bad-Workout Protection
  if (history.length >= 2) {
    const prevSession = history[1];
    if (prevSession) {
      const prevAvgReps = prevSession.avgReps;
      const currentAvgReps = latestSession.avgReps;

      // Check Strike 2 first: Two consecutive sessions depressed compared to prior baseline
      if (history.length >= 3) {
        const baselineSession = history[2];
        if (baselineSession) {
          const isPrevDepressed =
            prevSession.avgLoadKg >= baselineSession.avgLoadKg &&
            (prevSession.avgReps <= baselineSession.avgReps * 0.75 ||
              prevSession.normalizedWorkload <= baselineSession.normalizedWorkload * 0.8);
          const isLatestDepressed =
            latestSession.avgLoadKg >= baselineSession.avgLoadKg &&
            (latestSession.avgReps <= baselineSession.avgReps * 0.75 ||
              latestSession.normalizedWorkload <= baselineSession.normalizedWorkload * 0.8);

          if (isPrevDepressed && isLatestDepressed) {
            // Strike 2: Eligible for Reduce
            const reducedLoad = calculateNextLoad(
              {
                name: exercise.name,
                movementPattern: exercise.movementPattern as MovementPattern | undefined,
                equipment: exerciseEquipment,
                currentLoadKg: latestLoadKg,
              },
              true
            );

            return {
              exerciseId: exercise.exerciseId,
              status: 'reduce',
              currentLoadKg: latestLoadKg,
              suggestedLoadKg: reducedLoad,
              currentReps: latestReps,
              suggestedRepRange: exercise.prescribedRepRange,
              confidence: 'medium',
              explanation: 'Multiple sessions showed reduced performance. Rebuilding at a lower load recommended.',
              targetLabel: isBw
                ? `BW • Focus on form & control`
                : `${reducedLoad} kg × ${minPrescribedReps}–${maxPrescribedReps}`,
              estimated1RMKg,
            };
          }
        }
      }

      // Check Strike 1: One-off performance drop compared to previous session
      const isSignificantDrop =
        latestSession.avgLoadKg >= prevSession.avgLoadKg &&
        (currentAvgReps <= prevAvgReps * 0.7 ||
          latestSession.normalizedWorkload <= prevSession.normalizedWorkload * 0.75);

      if (isSignificantDrop) {
        // Strike 1: One-off bad workout -> Maintain
        return {
          exerciseId: exercise.exerciseId,
          status: 'maintain',
          currentLoadKg: latestLoadKg,
          suggestedLoadKg: latestLoadKg,
          currentReps: latestReps,
          suggestedRepRange: exercise.prescribedRepRange,
          confidence: 'medium',
          explanation: 'Performance was lower than usual. Maintain weight and recover for next session.',
          targetLabel: isBw
            ? `Maintain BW • ${minPrescribedReps}–${maxPrescribedReps} reps`
            : `Maintain ${latestLoadKg} kg • ${minPrescribedReps}–${maxPrescribedReps} reps`,
          estimated1RMKg,
        };
      }
    }
  }

  // 3. Case: Rep Ceiling Reached Across All Sets
  if (allSetsAtCeiling) {
    // Check if RIR was 0 on any working set (maximum grinder)
    const hasZeroRir = hasRirData && rirValues.some((r) => r === 0);

    if (hasZeroRir) {
      return {
        exerciseId: exercise.exerciseId,
        status: 'maintain',
        currentLoadKg: latestLoadKg,
        suggestedLoadKg: latestLoadKg,
        currentReps: latestReps,
        suggestedRepRange: exercise.prescribedRepRange,
        confidence: 'medium',
        explanation: 'Target reps reached, but at maximum effort (0 RIR). Consolidate reserve before increasing load.',
        targetLabel: isBw
          ? `Maintain BW • Consolidate reps`
          : `Maintain ${latestLoadKg} kg • Aim for 1+ RIR`,
        estimated1RMKg,
      };
    }

    // Progression is appropriate!
    const nextLoad = calculateNextLoad({
      name: exercise.name,
      movementPattern: exercise.movementPattern as MovementPattern | undefined,
      equipment: exerciseEquipment,
      currentLoadKg: latestLoadKg,
    });

    const lowerRangeMax = Math.min(minPrescribedReps + 2, maxPrescribedReps);
    const suggestedRepRange: [number, number] = [minPrescribedReps, lowerRangeMax];

    // Confidence determination:
    // Missing RIR is capped at 'medium' because true fatigue reserve is unverified
    let confidence: ProgressionConfidence = 'medium';
    if (hasRirData && history.length >= 3 && (avgRir ?? 0) >= 1) {
      confidence = 'high';
    } else if (!hasRirData) {
      confidence = 'medium';
    }

    return {
      exerciseId: exercise.exerciseId,
      status: 'progress',
      currentLoadKg: latestLoadKg,
      suggestedLoadKg: nextLoad,
      currentReps: latestReps,
      suggestedRepRange,
      confidence,
      explanation: hasRirData
        ? 'You reached the top of the rep range across all sets with good reserve. Increase load.'
        : 'You hit the top of the rep range across all sets. Ready to increase load.',
      targetLabel: isBw
        ? `BW × ${minPrescribedReps}–${lowerRangeMax} (Add tempo/form)`
        : `${nextLoad} kg × ${minPrescribedReps}–${lowerRangeMax}`,
      estimated1RMKg,
    };
  }

  // 4. Case: Below Rep Ceiling (Case A: Building Reps)
  const maxHit = Math.max(...latestReps);
  const targetNextRepsMin = Math.min(maxHit + 1, maxPrescribedReps);
  const suggestedReps: [number, number] = [targetNextRepsMin, maxPrescribedReps];

  let confidence: ProgressionConfidence = 'low';
  if (history.length >= 3 && hasRirData) {
    confidence = 'high';
  } else if (history.length >= 2) {
    confidence = 'medium';
  }

  return {
    exerciseId: exercise.exerciseId,
    status: 'maintain',
    currentLoadKg: latestLoadKg,
    suggestedLoadKg: latestLoadKg,
    currentReps: latestReps,
    suggestedRepRange: suggestedReps,
    confidence,
    explanation: `You're still building reps at this weight. Target ${targetNextRepsMin}–${maxPrescribedReps} reps before increasing load.`,
    targetLabel: isBw
      ? `Aim for ${targetNextRepsMin}–${maxPrescribedReps} reps`
      : `Maintain ${latestLoadKg} kg • Aim for ${targetNextRepsMin}–${maxPrescribedReps} reps`,
    estimated1RMKg,
  };
}
