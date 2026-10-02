/**
 * Canonical Fallback & Alternative Mappings for Exercises
 * Maps each exercise ID to ranked fallback alternatives that share the same
 * movement pattern and primary muscle group, allowing deterministic substitution
 * when the user's available equipment does not support the primary prescribed movement.
 */
export const EXERCISE_ALTERNATIVES: Readonly<Record<string, readonly string[]>> = {
  // Chest
  ex_barbell_bench_press: ['ex_flat_dumbbell_press', 'ex_pushup'],
  ex_incline_barbell_press: ['ex_incline_dumbbell_press', 'ex_flat_dumbbell_press', 'ex_pushup'],
  ex_flat_dumbbell_press: ['ex_incline_dumbbell_press', 'ex_pushup'],
  ex_incline_dumbbell_press: ['ex_flat_dumbbell_press', 'ex_pushup'],
  ex_cable_fly: ['ex_dumbbell_fly', 'ex_pec_deck', 'ex_pushup'],
  ex_pec_deck: ['ex_cable_fly', 'ex_dumbbell_fly', 'ex_pushup'],
  ex_dumbbell_fly: ['ex_cable_fly', 'ex_pec_deck', 'ex_pushup'],
  ex_pushup: ['ex_flat_dumbbell_press'],

  // Back
  ex_pullup: ['ex_lat_pulldown', 'ex_one_arm_dumbbell_row'],
  ex_lat_pulldown: ['ex_pullup', 'ex_one_arm_dumbbell_row', 'ex_seated_cable_row', 'ex_dumbbell_row'],
  ex_barbell_row: ['ex_one_arm_dumbbell_row', 'ex_seated_cable_row', 'ex_dumbbell_row'],
  ex_one_arm_dumbbell_row: ['ex_dumbbell_row', 'ex_seated_cable_row', 'ex_barbell_row'],
  ex_seated_cable_row: ['ex_one_arm_dumbbell_row', 'ex_dumbbell_row', 'ex_barbell_row'],
  ex_dumbbell_row: ['ex_one_arm_dumbbell_row', 'ex_seated_cable_row', 'ex_barbell_row'],

  // Shoulders
  ex_overhead_press: ['ex_dumbbell_overhead_press', 'ex_smith_overhead_press'],
  ex_smith_overhead_press: ['ex_overhead_press', 'ex_dumbbell_overhead_press'],
  ex_dumbbell_overhead_press: ['ex_smith_overhead_press', 'ex_overhead_press'],
  ex_dumbbell_lateral_raise: ['ex_cable_lateral_raise'],
  ex_cable_lateral_raise: ['ex_dumbbell_lateral_raise'],
  ex_rear_delt_fly: ['ex_one_arm_dumbbell_row', 'ex_seated_cable_row'],

  // Biceps
  ex_ez_bar_curl: ['ex_dumbbell_curl', 'ex_incline_dumbbell_curl', 'ex_cable_curl', 'ex_hammer_curl'],
  ex_dumbbell_curl: ['ex_ez_bar_curl', 'ex_incline_dumbbell_curl', 'ex_cable_curl', 'ex_hammer_curl'],
  ex_incline_dumbbell_curl: ['ex_dumbbell_curl', 'ex_ez_bar_curl', 'ex_cable_curl'],
  ex_cable_curl: ['ex_dumbbell_curl', 'ex_ez_bar_curl', 'ex_hammer_curl'],
  ex_hammer_curl: ['ex_dumbbell_curl', 'ex_ez_bar_curl'],

  // Triceps
  ex_cable_rope_pushdown: ['ex_overhead_cable_extension', 'ex_dumbbell_overhead_extension', 'ex_bench_dips', 'ex_ez_bar_skull_crusher'],
  ex_overhead_cable_extension: ['ex_cable_rope_pushdown', 'ex_dumbbell_overhead_extension', 'ex_ez_bar_skull_crusher', 'ex_bench_dips'],
  ex_ez_bar_skull_crusher: ['ex_dumbbell_overhead_extension', 'ex_cable_rope_pushdown', 'ex_bench_dips'],
  ex_dumbbell_overhead_extension: ['ex_cable_rope_pushdown', 'ex_bench_dips', 'ex_ez_bar_skull_crusher'],
  ex_bench_dips: ['ex_dumbbell_overhead_extension', 'ex_cable_rope_pushdown'],

  // Quads
  ex_barbell_back_squat: ['ex_smith_machine_squat', 'ex_leg_press', 'ex_bulgarian_split_squat', 'ex_goblet_squat'],
  ex_smith_machine_squat: ['ex_leg_press', 'ex_bulgarian_split_squat', 'ex_goblet_squat', 'ex_barbell_back_squat'],
  ex_leg_press: ['ex_smith_machine_squat', 'ex_bulgarian_split_squat', 'ex_goblet_squat'],
  ex_bulgarian_split_squat: ['ex_goblet_squat', 'ex_leg_press', 'ex_smith_machine_squat'],
  ex_leg_extension: ['ex_bulgarian_split_squat', 'ex_goblet_squat', 'ex_leg_press'],
  ex_goblet_squat: ['ex_bulgarian_split_squat', 'ex_leg_press', 'ex_smith_machine_squat'],

  // Hamstrings & Glutes
  ex_barbell_deadlift: ['ex_romanian_deadlift', 'ex_dumbbell_romanian_deadlift'],
  ex_romanian_deadlift: ['ex_dumbbell_romanian_deadlift', 'ex_lying_dumbbell_leg_curl'],
  ex_dumbbell_romanian_deadlift: ['ex_romanian_deadlift', 'ex_lying_dumbbell_leg_curl'],
  ex_lying_dumbbell_leg_curl: ['ex_leg_curl_machine', 'ex_dumbbell_romanian_deadlift'],
  ex_leg_curl_machine: ['ex_lying_dumbbell_leg_curl', 'ex_dumbbell_romanian_deadlift'],

  // Calves
  ex_standing_calf_raise: ['ex_seated_dumbbell_calf_raise'],
  ex_seated_dumbbell_calf_raise: ['ex_standing_calf_raise'],

  // Core
  ex_cable_crunch: ['ex_hanging_knee_raise', 'ex_plank'],
  ex_hanging_knee_raise: ['ex_cable_crunch', 'ex_plank'],
  ex_plank: ['ex_hanging_knee_raise', 'ex_cable_crunch'],
};

/**
 * Returns alternative exercise IDs for a given exercise ID.
 */
export function getExerciseAlternatives(exerciseId: string): readonly string[] {
  return EXERCISE_ALTERNATIVES[exerciseId] ?? [];
}
