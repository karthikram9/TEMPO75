import type { Equipment, EquipmentOption, Exercise, MovementPattern } from '@/types';
import { EXERCISES_DATABASE, getExerciseById } from '../data/exercises';
import { getExerciseAlternatives } from '../data/exerciseAlternatives';

/**
 * Checks whether an exercise's required equipment is supported by the user's available equipment.
 * Bodyweight is universally available. 'full_gym' satisfies all equipment requirements.
 */
export function isEquipmentCompatible(
  exerciseEquipment: readonly Equipment[],
  userEquipment: readonly EquipmentOption[]
): boolean {
  if (userEquipment.includes('full_gym')) {
    return true;
  }

  // Bodyweight movements require no external equipment
  if (exerciseEquipment.includes('bodyweight')) {
    return true;
  }

  return exerciseEquipment.some((eq) => {
    switch (eq) {
      case 'dumbbell':
        return userEquipment.includes('dumbbells') || userEquipment.includes('home_setup');
      case 'barbell':
        return userEquipment.includes('barbell');
      case 'cable':
        return userEquipment.includes('cable');
      case 'machine':
        return userEquipment.includes('machines');
      case 'smith_machine':
        return userEquipment.includes('machines');
      case 'kettlebell':
        return userEquipment.includes('dumbbells');
      case 'bands':
        return userEquipment.includes('home_setup');
      default:
        return false;
    }
  });
}

export interface SelectedExerciseResult {
  exercise: Exercise;
  isAlternative: boolean;
  originalExerciseId?: string;
}

/**
 * Deterministically selects a compatible exercise based on available equipment.
 * If the prescribed exercise is incompatible, inspects ranked alternatives.
 * If explicit alternatives are exhausted, searches the library by movement pattern.
 */
export function selectCompatibleExercise(
  exerciseId: string,
  userEquipment: readonly EquipmentOption[]
): SelectedExerciseResult {
  const primary = getExerciseById(exerciseId);

  // If primary exercise not found, attempt safe fallback
  if (!primary) {
    const fallback = EXERCISES_DATABASE[0]!;
    return { exercise: fallback, isAlternative: true, originalExerciseId: exerciseId };
  }

  // 1. Direct check: Is primary compatible?
  if (isEquipmentCompatible(primary.equipment, userEquipment)) {
    return { exercise: primary, isAlternative: false };
  }

  // 2. Ranked alternative check
  const altIds = getExerciseAlternatives(exerciseId);
  for (const altId of altIds) {
    const alt = getExerciseById(altId);
    if (alt && isEquipmentCompatible(alt.equipment, userEquipment)) {
      return {
        exercise: alt,
        isAlternative: true,
        originalExerciseId: exerciseId,
      };
    }
  }

  // 3. Movement pattern fallback search
  const patternMatch = findExerciseByMovementPattern(
    primary.movementPattern,
    userEquipment,
    exerciseId
  );
  if (patternMatch) {
    return {
      exercise: patternMatch,
      isAlternative: true,
      originalExerciseId: exerciseId,
    };
  }

  // 4. In the rare case of no match, return primary exercise rather than failing
  return { exercise: primary, isAlternative: false };
}

/**
 * Finds an exercise matching the specified movement pattern compatible with available equipment.
 */
function findExerciseByMovementPattern(
  pattern: MovementPattern,
  userEquipment: readonly EquipmentOption[],
  excludeId: string
): Exercise | undefined {
  return EXERCISES_DATABASE.find(
    (ex) =>
      ex.id !== excludeId &&
      ex.movementPattern === pattern &&
      isEquipmentCompatible(ex.equipment, userEquipment)
  );
}
