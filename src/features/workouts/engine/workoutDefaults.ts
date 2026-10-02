import type { MuscleGroup, TrainingSplitPreference } from '@/types';

export interface TemplateExercise {
  exerciseId: string;
  targetSets: number;
  prescribedRepRange: [number, number];
  restSeconds: number;
  notes?: string;
}

export interface WorkoutTemplate {
  name: string;
  focus: string;
  targetMuscleGroups: MuscleGroup[];
  exercises: TemplateExercise[];
}

/* ============================================================================
 * 6-DAY PUSH / PULL / LEGS (SOP Section 13 Canonical Baseline)
 * ============================================================================ */

export const PUSH_A_TEMPLATE: WorkoutTemplate = {
  name: 'Push A',
  focus: 'Chest • Front Delts • Triceps',
  targetMuscleGroups: ['chest', 'shoulders', 'triceps'],
  exercises: [
    { exerciseId: 'ex_incline_barbell_press', targetSets: 3, prescribedRepRange: [6, 10], restSeconds: 120 },
    { exerciseId: 'ex_flat_dumbbell_press', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 120 },
    { exerciseId: 'ex_smith_overhead_press', targetSets: 3, prescribedRepRange: [6, 10], restSeconds: 120 },
    { exerciseId: 'ex_dumbbell_lateral_raise', targetSets: 4, prescribedRepRange: [12, 20], restSeconds: 60 },
    { exerciseId: 'ex_cable_fly', targetSets: 2, prescribedRepRange: [12, 15], restSeconds: 60 },
    { exerciseId: 'ex_cable_rope_pushdown', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 60 },
    { exerciseId: 'ex_overhead_cable_extension', targetSets: 2, prescribedRepRange: [12, 15], restSeconds: 60 },
  ],
};

export const PULL_A_TEMPLATE: WorkoutTemplate = {
  name: 'Pull A',
  focus: 'Lats • Upper Back • Biceps',
  targetMuscleGroups: ['back', 'shoulders', 'biceps'],
  exercises: [
    { exerciseId: 'ex_pullup', targetSets: 3, prescribedRepRange: [5, 8], restSeconds: 120 },
    { exerciseId: 'ex_lat_pulldown', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 90 },
    { exerciseId: 'ex_barbell_row', targetSets: 3, prescribedRepRange: [6, 10], restSeconds: 120 },
    { exerciseId: 'ex_seated_cable_row', targetSets: 2, prescribedRepRange: [10, 12], restSeconds: 90 },
    { exerciseId: 'ex_rear_delt_fly', targetSets: 3, prescribedRepRange: [12, 20], restSeconds: 60 },
    { exerciseId: 'ex_ez_bar_curl', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 60 },
    { exerciseId: 'ex_incline_dumbbell_curl', targetSets: 2, prescribedRepRange: [10, 15], restSeconds: 60 },
  ],
};

export const LEGS_A_TEMPLATE: WorkoutTemplate = {
  name: 'Legs A',
  focus: 'Quads • Hamstrings • Calves • Core',
  targetMuscleGroups: ['quadriceps', 'hamstrings', 'calves', 'abs'],
  exercises: [
    { exerciseId: 'ex_smith_machine_squat', targetSets: 4, prescribedRepRange: [6, 10], restSeconds: 150 },
    { exerciseId: 'ex_leg_press', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 120 },
    { exerciseId: 'ex_bulgarian_split_squat', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 90 },
    { exerciseId: 'ex_leg_extension', targetSets: 3, prescribedRepRange: [12, 15], restSeconds: 60 },
    { exerciseId: 'ex_dumbbell_romanian_deadlift', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 120 },
    { exerciseId: 'ex_standing_calf_raise', targetSets: 4, prescribedRepRange: [10, 15], restSeconds: 60 },
    { exerciseId: 'ex_cable_crunch', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 60 },
    { exerciseId: 'ex_hanging_knee_raise', targetSets: 3, prescribedRepRange: [8, 15], restSeconds: 60 },
  ],
};

export const PUSH_B_TEMPLATE: WorkoutTemplate = {
  name: 'Push B',
  focus: 'Shoulders • Upper Chest • Triceps • Arms',
  targetMuscleGroups: ['shoulders', 'chest', 'biceps', 'triceps'],
  exercises: [
    { exerciseId: 'ex_smith_overhead_press', targetSets: 3, prescribedRepRange: [8, 10], restSeconds: 120 },
    { exerciseId: 'ex_dumbbell_lateral_raise', targetSets: 4, prescribedRepRange: [12, 20], restSeconds: 60 },
    { exerciseId: 'ex_cable_lateral_raise', targetSets: 3, prescribedRepRange: [12, 20], restSeconds: 60 },
    { exerciseId: 'ex_incline_dumbbell_press', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 120 },
    { exerciseId: 'ex_cable_fly', targetSets: 2, prescribedRepRange: [12, 15], restSeconds: 60 },
    { exerciseId: 'ex_ez_bar_curl', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 60 },
    { exerciseId: 'ex_hammer_curl', targetSets: 2, prescribedRepRange: [10, 15], restSeconds: 60 },
    { exerciseId: 'ex_cable_rope_pushdown', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 60 },
    { exerciseId: 'ex_overhead_cable_extension', targetSets: 2, prescribedRepRange: [10, 15], restSeconds: 60 },
  ],
};

export const PULL_B_TEMPLATE: WorkoutTemplate = {
  name: 'Pull B',
  focus: 'Back Thickness • Rear Delts • Biceps • Arms',
  targetMuscleGroups: ['back', 'shoulders', 'biceps', 'triceps'],
  exercises: [
    { exerciseId: 'ex_pullup', targetSets: 3, prescribedRepRange: [5, 8], restSeconds: 120 },
    { exerciseId: 'ex_lat_pulldown', targetSets: 3, prescribedRepRange: [10, 12], restSeconds: 90 },
    { exerciseId: 'ex_one_arm_dumbbell_row', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 90 },
    { exerciseId: 'ex_seated_cable_row', targetSets: 2, prescribedRepRange: [10, 15], restSeconds: 90 },
    { exerciseId: 'ex_rear_delt_fly', targetSets: 3, prescribedRepRange: [15, 20], restSeconds: 60 },
    { exerciseId: 'ex_ez_bar_curl', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 60 },
    { exerciseId: 'ex_cable_curl', targetSets: 2, prescribedRepRange: [12, 15], restSeconds: 60 },
    { exerciseId: 'ex_cable_rope_pushdown', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 60 },
    { exerciseId: 'ex_hammer_curl', targetSets: 2, prescribedRepRange: [10, 12], restSeconds: 60 },
  ],
};

export const LEGS_B_TEMPLATE: WorkoutTemplate = {
  name: 'Legs B',
  focus: 'Posterior Chain • Quads • Calves • Core',
  targetMuscleGroups: ['hamstrings', 'quadriceps', 'calves', 'abs'],
  exercises: [
    { exerciseId: 'ex_romanian_deadlift', targetSets: 4, prescribedRepRange: [6, 10], restSeconds: 150 },
    { exerciseId: 'ex_smith_machine_squat', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 120 },
    { exerciseId: 'ex_leg_press', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 120 },
    { exerciseId: 'ex_lying_dumbbell_leg_curl', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 90 },
    { exerciseId: 'ex_leg_extension', targetSets: 2, prescribedRepRange: [12, 15], restSeconds: 60 },
    { exerciseId: 'ex_bulgarian_split_squat', targetSets: 2, prescribedRepRange: [10, 12], restSeconds: 90 },
    { exerciseId: 'ex_standing_calf_raise', targetSets: 4, prescribedRepRange: [12, 20], restSeconds: 60 },
    { exerciseId: 'ex_cable_crunch', targetSets: 3, prescribedRepRange: [12, 15], restSeconds: 60 },
    { exerciseId: 'ex_hanging_knee_raise', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 60 },
  ],
};

/* ============================================================================
 * 4-DAY UPPER / LOWER TEMPLATES
 * ============================================================================ */

export const UPPER_A_TEMPLATE: WorkoutTemplate = {
  name: 'Upper A',
  focus: 'Chest • Back • Shoulders • Arms',
  targetMuscleGroups: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
  exercises: [
    { exerciseId: 'ex_incline_barbell_press', targetSets: 4, prescribedRepRange: [6, 10], restSeconds: 120 },
    { exerciseId: 'ex_barbell_row', targetSets: 4, prescribedRepRange: [6, 10], restSeconds: 120 },
    { exerciseId: 'ex_dumbbell_overhead_press', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 90 },
    { exerciseId: 'ex_lat_pulldown', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 90 },
    { exerciseId: 'ex_dumbbell_lateral_raise', targetSets: 3, prescribedRepRange: [12, 20], restSeconds: 60 },
    { exerciseId: 'ex_cable_rope_pushdown', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 60 },
    { exerciseId: 'ex_ez_bar_curl', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 60 },
  ],
};

export const LOWER_A_TEMPLATE: WorkoutTemplate = {
  name: 'Lower A',
  focus: 'Quads • Hamstrings • Calves • Core',
  targetMuscleGroups: ['quadriceps', 'hamstrings', 'calves', 'abs'],
  exercises: [
    { exerciseId: 'ex_smith_machine_squat', targetSets: 4, prescribedRepRange: [6, 10], restSeconds: 150 },
    { exerciseId: 'ex_romanian_deadlift', targetSets: 4, prescribedRepRange: [6, 10], restSeconds: 150 },
    { exerciseId: 'ex_leg_press', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 120 },
    { exerciseId: 'ex_lying_dumbbell_leg_curl', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 90 },
    { exerciseId: 'ex_standing_calf_raise', targetSets: 4, prescribedRepRange: [10, 15], restSeconds: 60 },
    { exerciseId: 'ex_cable_crunch', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 60 },
  ],
};

export const UPPER_B_TEMPLATE: WorkoutTemplate = {
  name: 'Upper B',
  focus: 'Upper Back • Chest • Shoulders • Arms',
  targetMuscleGroups: ['back', 'chest', 'shoulders', 'biceps', 'triceps'],
  exercises: [
    { exerciseId: 'ex_pullup', targetSets: 3, prescribedRepRange: [5, 8], restSeconds: 120 },
    { exerciseId: 'ex_flat_dumbbell_press', targetSets: 4, prescribedRepRange: [8, 12], restSeconds: 120 },
    { exerciseId: 'ex_seated_cable_row', targetSets: 3, prescribedRepRange: [10, 12], restSeconds: 90 },
    { exerciseId: 'ex_cable_lateral_raise', targetSets: 4, prescribedRepRange: [12, 20], restSeconds: 60 },
    { exerciseId: 'ex_rear_delt_fly', targetSets: 3, prescribedRepRange: [12, 20], restSeconds: 60 },
    { exerciseId: 'ex_overhead_cable_extension', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 60 },
    { exerciseId: 'ex_hammer_curl', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 60 },
  ],
};

export const LOWER_B_TEMPLATE: WorkoutTemplate = {
  name: 'Lower B',
  focus: 'Hamstrings • Quads • Single-Leg • Calves • Core',
  targetMuscleGroups: ['hamstrings', 'quadriceps', 'calves', 'abs'],
  exercises: [
    { exerciseId: 'ex_dumbbell_romanian_deadlift', targetSets: 4, prescribedRepRange: [8, 12], restSeconds: 120 },
    { exerciseId: 'ex_bulgarian_split_squat', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 90 },
    { exerciseId: 'ex_leg_extension', targetSets: 3, prescribedRepRange: [12, 15], restSeconds: 60 },
    { exerciseId: 'ex_lying_dumbbell_leg_curl', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 90 },
    { exerciseId: 'ex_standing_calf_raise', targetSets: 4, prescribedRepRange: [12, 20], restSeconds: 60 },
    { exerciseId: 'ex_hanging_knee_raise', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 60 },
  ],
};

/* ============================================================================
 * 3-DAY FULL BODY TEMPLATES
 * ============================================================================ */

export const FULL_BODY_A_TEMPLATE: WorkoutTemplate = {
  name: 'Full Body A',
  focus: 'Compound Squat • Horizontal Push / Pull',
  targetMuscleGroups: ['quadriceps', 'chest', 'back', 'shoulders', 'arms'],
  exercises: [
    { exerciseId: 'ex_smith_machine_squat', targetSets: 3, prescribedRepRange: [6, 10], restSeconds: 150 },
    { exerciseId: 'ex_incline_barbell_press', targetSets: 3, prescribedRepRange: [6, 10], restSeconds: 120 },
    { exerciseId: 'ex_barbell_row', targetSets: 3, prescribedRepRange: [6, 10], restSeconds: 120 },
    { exerciseId: 'ex_dumbbell_lateral_raise', targetSets: 3, prescribedRepRange: [12, 20], restSeconds: 60 },
    { exerciseId: 'ex_cable_rope_pushdown', targetSets: 2, prescribedRepRange: [10, 15], restSeconds: 60 },
    { exerciseId: 'ex_ez_bar_curl', targetSets: 2, prescribedRepRange: [8, 12], restSeconds: 60 },
    { exerciseId: 'ex_plank', targetSets: 3, prescribedRepRange: [30, 60], restSeconds: 60 },
  ],
};

export const FULL_BODY_B_TEMPLATE: WorkoutTemplate = {
  name: 'Full Body B',
  focus: 'Hinge • Vertical Pull • Overhead Push',
  targetMuscleGroups: ['hamstrings', 'back', 'shoulders', 'quadriceps', 'arms'],
  exercises: [
    { exerciseId: 'ex_romanian_deadlift', targetSets: 3, prescribedRepRange: [6, 10], restSeconds: 150 },
    { exerciseId: 'ex_pullup', targetSets: 3, prescribedRepRange: [5, 8], restSeconds: 120 },
    { exerciseId: 'ex_smith_overhead_press', targetSets: 3, prescribedRepRange: [8, 10], restSeconds: 120 },
    { exerciseId: 'ex_leg_press', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 120 },
    { exerciseId: 'ex_cable_fly', targetSets: 2, prescribedRepRange: [12, 15], restSeconds: 60 },
    { exerciseId: 'ex_hammer_curl', targetSets: 2, prescribedRepRange: [10, 15], restSeconds: 60 },
    { exerciseId: 'ex_hanging_knee_raise', targetSets: 3, prescribedRepRange: [8, 15], restSeconds: 60 },
  ],
};

export const FULL_BODY_C_TEMPLATE: WorkoutTemplate = {
  name: 'Full Body C',
  focus: 'Unilateral Legs • Upper Hypertrophy • Posterior Chain',
  targetMuscleGroups: ['quadriceps', 'chest', 'back', 'hamstrings', 'calves', 'core'],
  exercises: [
    { exerciseId: 'ex_bulgarian_split_squat', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 90 },
    { exerciseId: 'ex_flat_dumbbell_press', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 120 },
    { exerciseId: 'ex_lat_pulldown', targetSets: 3, prescribedRepRange: [8, 12], restSeconds: 90 },
    { exerciseId: 'ex_lying_dumbbell_leg_curl', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 90 },
    { exerciseId: 'ex_rear_delt_fly', targetSets: 3, prescribedRepRange: [12, 20], restSeconds: 60 },
    { exerciseId: 'ex_standing_calf_raise', targetSets: 3, prescribedRepRange: [12, 20], restSeconds: 60 },
    { exerciseId: 'ex_cable_crunch', targetSets: 3, prescribedRepRange: [10, 15], restSeconds: 60 },
  ],
};

/**
 * Resolves the active training split based on user preference and weekly frequency.
 * SOP Section 10:
 * 3 days -> Full Body
 * 4 days -> Upper / Lower
 * 5 days -> Upper / Lower + Specialization (Upper A, Lower A, Push, Pull, Legs)
 * 6 days -> Push / Pull / Legs
 * Auto -> Maps automatically by daysPerWeek
 */
export function resolveEffectiveSplit(
  preferredSplit: TrainingSplitPreference,
  daysPerWeek: number
): 'ppl' | 'upper_lower' | 'full_body' | 'five_day_hybrid' {
  if (preferredSplit === 'auto') {
    if (daysPerWeek <= 3) return 'full_body';
    if (daysPerWeek === 4) return 'upper_lower';
    if (daysPerWeek === 5) return 'five_day_hybrid';
    return 'ppl';
  }

  if (preferredSplit === 'ppl') return 'ppl';
  if (preferredSplit === 'upper_lower') return 'upper_lower';
  if (preferredSplit === 'full_body') return 'full_body';

  return 'ppl';
}
