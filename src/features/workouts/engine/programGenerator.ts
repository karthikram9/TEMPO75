import type {
  Challenge,
  ChallengeDay,
  GeneratedProgram,
  Goal,
  RecoveryPreferences,
  TrainingPreferences,
  Workout,
} from '@/types';
import { generateWorkout } from './workoutGenerator';
import { calculateWeeklyVolume } from '../utils/workoutCalculations';

export interface GenerateProgramParams {
  challenge: Challenge;
  challengeDays: readonly ChallengeDay[];
  trainingPreferences: TrainingPreferences;
  recoveryPreferences?: RecoveryPreferences;
  goal?: Goal | null;
}

/**
 * Pure generator that computes the entire 75-day training program.
 * Generates only the required structured data without mutating input state.
 */
export function generateProgram({
  challenge,
  challengeDays,
  trainingPreferences,
  recoveryPreferences,
  goal,
}: GenerateProgramParams): GeneratedProgram {
  const workouts: Workout[] = [];
  const restDays: ChallengeDay[] = [];

  for (const day of challengeDays) {
    const workout = generateWorkout({
      challengeDayNumber: day.dayNumber,
      challengeId: challenge.id,
      challengeDayId: day.id,
      trainingPreferences,
      recoveryPreferences,
      goal,
      status: day.status,
    });

    if (workout) {
      workouts.push(workout);
    } else {
      restDays.push(day);
    }
  }

  // Calculate volume for the first 7-day microcycle
  const firstCycleWorkouts = workouts.filter((w) => w.dayNumber <= 7);
  const weeklyVolume = calculateWeeklyVolume(firstCycleWorkouts);

  return {
    workouts,
    restDays,
    weeklyVolume,
  };
}
