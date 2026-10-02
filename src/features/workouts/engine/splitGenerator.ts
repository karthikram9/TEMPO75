import type { RestDayPreference, TrainingSplitPreference } from '@/types';
import {
  FULL_BODY_A_TEMPLATE,
  FULL_BODY_B_TEMPLATE,
  FULL_BODY_C_TEMPLATE,
  LEGS_A_TEMPLATE,
  LEGS_B_TEMPLATE,
  LOWER_A_TEMPLATE,
  LOWER_B_TEMPLATE,
  PULL_A_TEMPLATE,
  PULL_B_TEMPLATE,
  PUSH_A_TEMPLATE,
  PUSH_B_TEMPLATE,
  UPPER_A_TEMPLATE,
  UPPER_B_TEMPLATE,
  WorkoutTemplate,
  resolveEffectiveSplit,
} from './workoutDefaults';

/**
 * Builds a deterministic 7-day microcycle schedule based on training days,
 * split preference, and rest day preference.
 *
 * Each slot (0 to 6) in the returned array represents an assignment for that day of the microcycle:
 * a WorkoutTemplate for a training day, or null for a recovery/rest day.
 */
export function buildWeeklyMicrocycle(
  daysPerWeek: number,
  preferredSplit: TrainingSplitPreference,
  restDayPreference: RestDayPreference = 'sunday'
): (WorkoutTemplate | null)[] {
  const effectiveSplit = resolveEffectiveSplit(preferredSplit, daysPerWeek);

  // 6 DAYS: PUSH / PULL / LEGS
  if (daysPerWeek >= 6 || effectiveSplit === 'ppl') {
    if (restDayPreference === 'saturday') {
      return [
        PUSH_A_TEMPLATE,
        PULL_A_TEMPLATE,
        LEGS_A_TEMPLATE,
        PUSH_B_TEMPLATE,
        PULL_B_TEMPLATE,
        null, // Saturday Rest
        LEGS_B_TEMPLATE,
      ];
    }
    // Default Sunday rest
    return [
      PUSH_A_TEMPLATE,
      PULL_A_TEMPLATE,
      LEGS_A_TEMPLATE,
      PUSH_B_TEMPLATE,
      PULL_B_TEMPLATE,
      LEGS_B_TEMPLATE,
      null, // Sunday Rest
    ];
  }

  // 5 DAYS: UPPER / LOWER / PUSH / PULL / LEGS
  if (daysPerWeek === 5 || effectiveSplit === 'five_day_hybrid') {
    // 5 training days + 2 rest days (e.g. Day 3 mid-week rest, Day 7 weekend rest)
    if (restDayPreference === 'saturday') {
      return [
        UPPER_A_TEMPLATE,
        LOWER_A_TEMPLATE,
        null, // Mid-week rest
        PUSH_A_TEMPLATE,
        PULL_A_TEMPLATE,
        null, // Saturday Rest
        LEGS_A_TEMPLATE,
      ];
    }
    return [
      UPPER_A_TEMPLATE,
      LOWER_A_TEMPLATE,
      null, // Mid-week rest
      PUSH_A_TEMPLATE,
      PULL_A_TEMPLATE,
      LEGS_A_TEMPLATE,
      null, // Sunday Rest
    ];
  }

  // 4 DAYS: UPPER / LOWER
  if (daysPerWeek === 4 || effectiveSplit === 'upper_lower') {
    // Mon: Upper A, Tue: Lower A, Wed: Rest, Thu: Upper B, Fri: Lower B, Sat: Rest, Sun: Rest
    return [
      UPPER_A_TEMPLATE,
      LOWER_A_TEMPLATE,
      null, // Mid-week rest
      UPPER_B_TEMPLATE,
      LOWER_B_TEMPLATE,
      null, // Weekend Rest
      null, // Weekend Rest
    ];
  }

  // 3 DAYS: FULL BODY (Full Body A, Full Body B, Full Body C)
  // Mon: A, Tue: Rest, Wed: B, Thu: Rest, Fri: C, Sat: Rest, Sun: Rest
  return [
    FULL_BODY_A_TEMPLATE,
    null,
    FULL_BODY_B_TEMPLATE,
    null,
    FULL_BODY_C_TEMPLATE,
    null,
    null,
  ];
}

/**
 * Deterministically resolves the WorkoutTemplate for a specific 75-day challenge day number.
 * Returns null if the day is a designated rest/recovery day.
 */
export function getTemplateForDay(
  dayNumber: number,
  daysPerWeek: number,
  preferredSplit: TrainingSplitPreference,
  restDayPreference: RestDayPreference = 'sunday'
): WorkoutTemplate | null {
  const microcycle = buildWeeklyMicrocycle(daysPerWeek, preferredSplit, restDayPreference);
  const cycleIndex = (dayNumber - 1) % 7;
  return microcycle[cycleIndex] ?? null;
}
