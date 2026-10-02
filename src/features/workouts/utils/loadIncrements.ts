import type { Equipment, MovementPattern } from '@/types';

export interface ExerciseLoadContext {
  name: string;
  movementPattern?: MovementPattern;
  equipment?: Equipment[];
  currentLoadKg: number;
}

/**
 * Checks whether an exercise is an isolation movement.
 */
export function isIsolationMovement(
  name: string,
  movementPattern?: MovementPattern
): boolean {
  const isolationPatterns: MovementPattern[] = [
    'lateral-raise',
    'elbow-flexion',
    'elbow-extension',
    'calf',
    'core-flexion',
    'core-stability',
  ];

  if (movementPattern && isolationPatterns.includes(movementPattern)) {
    return true;
  }

  const lowerName = name.toLowerCase();
  return (
    lowerName.includes('curl') ||
    lowerName.includes('lateral raise') ||
    lowerName.includes('pushdown') ||
    lowerName.includes('extension') ||
    lowerName.includes('fly') ||
    lowerName.includes('rear delt') ||
    lowerName.includes('calf') ||
    lowerName.includes('crunch') ||
    lowerName.includes('plank')
  );
}

/**
 * Checks whether an exercise is a lower-body compound movement.
 */
export function isLowerBodyCompound(
  name: string,
  movementPattern?: MovementPattern
): boolean {
  if (movementPattern === 'knee-dominant' || movementPattern === 'hip-hinge') {
    return true;
  }

  const lowerName = name.toLowerCase();
  return (
    lowerName.includes('squat') ||
    lowerName.includes('leg press') ||
    lowerName.includes('deadlift') ||
    lowerName.includes('rdl') ||
    lowerName.includes('hack squat') ||
    lowerName.includes('lunge')
  );
}

/**
 * Checks whether an exercise is purely bodyweight with no external base load.
 */
export function isBodyweightExercise(
  name: string,
  equipment?: Equipment[],
  currentLoadKg = 0
): boolean {
  if (currentLoadKg > 0) return false;

  const lower = name.toLowerCase();
  const isBwName =
    lower.includes('push-up') ||
    lower.includes('pull-up') ||
    lower.includes('chin-up') ||
    lower.includes('dip') ||
    lower.includes('hanging knee') ||
    lower.includes('hanging leg') ||
    lower.includes('plank');

  const onlyBwEquipment =
    equipment &&
    equipment.length > 0 &&
    equipment.every((eq) => eq === 'bodyweight' || eq === 'pullup_bar');

  return isBwName || Boolean(onlyBwEquipment);
}

/**
 * Rounds a target load to realistic gym equipment increments.
 * - Barbell / Smith: 2.5 kg increments
 * - Dumbbell: 2.0 kg or 2.5 kg increments
 * - Cable / Machine: 2.5 kg increments
 * - Bodyweight: 0 kg
 */
export function roundToEquipmentStep(
  loadKg: number,
  equipment: Equipment[] = []
): number {
  if (loadKg <= 0) return 0;

  const hasBarbell = equipment.includes('barbell') || equipment.includes('smith_machine');
  const hasDumbbell = equipment.includes('dumbbell');
  const hasCable = equipment.includes('cable') || equipment.includes('machine');

  if (hasBarbell) {
    return Math.max(20, Math.round(loadKg / 2.5) * 2.5);
  }

  if (hasDumbbell) {
    if (loadKg <= 10) {
      return Math.round(loadKg);
    }
    // If already an exact multiple of 2 kg (12, 14, 16...) or 2.5 kg (12.5, 15, 17.5...), preserve it
    if (loadKg % 2 === 0 || loadKg % 2.5 === 0) {
      return loadKg;
    }
    const rounded2 = Math.round(loadKg / 2) * 2;
    const rounded25 = Math.round(loadKg / 2.5) * 2.5;
    return Math.abs(loadKg - rounded2) <= Math.abs(loadKg - rounded25) ? rounded2 : rounded25;
  }

  if (hasCable) {
    return Math.round(loadKg / 2.5) * 2.5;
  }

  // Default fallback: round to nearest 0.5 kg
  return Math.round(loadKg * 2) / 2;
}

/**
 * Selects an appropriate progressive overload increment based on:
 * - Isolation vs Upper Compound vs Lower Compound
 * - Equipment available
 * - Current load
 *
 * Rules:
 * - Isolation: +1–2 kg
 * - Upper-body Compound: +2.5 kg
 * - Lower-body Compound: +5 kg
 * - Bodyweight: 0 kg (reps progression)
 */
export function determineLoadIncrement(context: ExerciseLoadContext): number {
  const { name, movementPattern, equipment = [], currentLoadKg } = context;

  if (isBodyweightExercise(name, equipment, currentLoadKg)) {
    return 0;
  }

  if (isIsolationMovement(name, movementPattern)) {
    if (equipment.includes('dumbbell')) {
      // Dumbbell isolation (lateral raise, bicep curl): +1 to +2 kg
      return currentLoadKg <= 10 ? 1 : 2;
    }
    // Cable / Machine isolation: +2.5 kg
    return 2.5;
  }

  if (isLowerBodyCompound(name, movementPattern)) {
    // Squat, Leg Press, RDL, Deadlift: +5 kg
    return 5;
  }

  // Upper-body compound (Bench Press, Incline Press, Overhead Press, Rows): +2.5 kg
  return 2.5;
}

/**
 * Calculates the next suggested load (either +increment for progress, or -increment for reduction).
 * Always rounds to equipment-supported values.
 */
export function calculateNextLoad(
  context: ExerciseLoadContext,
  isReduction = false
): number {
  const { currentLoadKg, equipment = [] } = context;

  if (isBodyweightExercise(context.name, equipment, currentLoadKg)) {
    return 0;
  }

  const increment = determineLoadIncrement(context);

  if (isReduction) {
    const reduced = Math.max(0, currentLoadKg - increment);
    return roundToEquipmentStep(reduced, equipment);
  }

  const increased = currentLoadKg + increment;
  return roundToEquipmentStep(increased, equipment);
}
