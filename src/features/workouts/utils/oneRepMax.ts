import type { MovementPattern } from '@/types';
import { isIsolationMovement } from './loadIncrements';

/**
 * Checks whether an exercise and set are eligible for estimated 1RM calculation.
 *
 * Strict Rules:
 * 1. Must be a compound resistance movement (not an isolation movement or pure bodyweight).
 * 2. Weight must be positive (> 0 kg).
 * 3. Reps must be strictly between 1 and 12 (reps <= 12). Above 12 reps, Epley estimation
 *    breaks down and becomes unreliable.
 */
export function isEligibleForEstimated1RM(params: {
  name: string;
  movementPattern?: MovementPattern;
  weightKg?: number;
  reps?: number;
}): boolean {
  const { name, movementPattern, weightKg = 0, reps = 0 } = params;

  // 1. Must have positive weight and valid reps within conservative cutoff (<= 12)
  if (weightKg <= 0 || reps <= 0 || reps > 12) {
    return false;
  }

  // 2. Reject bodyweight movements
  const lowerName = name.toLowerCase();
  if (
    lowerName.includes('push-up') ||
    lowerName.includes('pull-up') ||
    lowerName.includes('chin-up') ||
    lowerName.includes('dip') ||
    lowerName.includes('plank') ||
    lowerName.includes('crunch') ||
    lowerName.includes('hanging')
  ) {
    return false;
  }

  // 3. Reject isolation movements (curls, lateral raises, extensions, calf raises)
  if (isIsolationMovement(name, movementPattern)) {
    return false;
  }

  // 4. Must be a recognized compound movement pattern or exercise
  const compoundPatterns: MovementPattern[] = [
    'horizontal-push',
    'vertical-push',
    'horizontal-pull',
    'vertical-pull',
    'knee-dominant',
    'hip-hinge',
  ];

  if (movementPattern && compoundPatterns.includes(movementPattern)) {
    return true;
  }

  return (
    lowerName.includes('press') ||
    lowerName.includes('squat') ||
    lowerName.includes('deadlift') ||
    lowerName.includes('rdl') ||
    lowerName.includes('row')
  );
}

/**
 * Calculates estimated 1 Rep Max using the standard Epley formula:
 * 1RM = weight * (1 + reps / 30)
 *
 * Analytical metric only. Returns null if reps > 12, weight <= 0, or reps <= 0.
 * Rounded to 1 decimal place.
 */
export function calculateEstimated1RM(
  weightKg: number,
  reps: number
): number | null {
  if (weightKg <= 0 || reps <= 0 || reps > 12) {
    return null;
  }

  // Exact 1 rep is just the weight itself
  if (reps === 1) {
    return Math.round(weightKg * 10) / 10;
  }

  const epley = weightKg * (1 + reps / 30);
  return Math.round(epley * 10) / 10;
}

/**
 * Helper to format estimated 1RM for UI display.
 */
export function formatEstimated1RM(oneRepMaxKg: number | null | undefined): string | null {
  if (oneRepMaxKg === null || oneRepMaxKg === undefined || oneRepMaxKg <= 0) {
    return null;
  }
  return `e1RM: ${oneRepMaxKg} kg`;
}
