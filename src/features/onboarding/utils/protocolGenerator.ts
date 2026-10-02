import type {
  UserProfile,
  Goal,
  TrainingPreferences,
  NutritionTargets,
  ActivityPreferences,
  RecoveryPreferences,
  Challenge,
  ChallengeDay,
  OnboardingDraftData,
  OnboardingState,
} from '@/types';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { storage } from '@/lib/storage';
import { calculateTargetDate } from './goalCalculations';

export interface ProtocolCreationResult {
  profile: UserProfile;
  goal: Goal;
  challenge: Challenge;
  days: ChallengeDay[];
}

/**
 * Creates and persists the canonical 75-Day Transformation Protocol.
 * Generates 75 sequential ChallengeDay records (Day 1 is active, Days 2-75 upcoming).
 */
export async function create75DayProtocol(
  draft: OnboardingDraftData
): Promise<ProtocolCreationResult> {
  const timestamp = new Date().toISOString();
  const todayDateString = timestamp.split('T')[0] ?? '';
  const userId = `user_${Date.now()}`;
  const challengeId = `challenge_tempo75_${Date.now()}`;
  const goalId = `goal_${Date.now()}`;
  const targetEndDate = calculateTargetDate(todayDateString, 75);

  // 1. Canonical UserProfile
  const profile: UserProfile = {
    id: userId,
    name: draft.name.trim(),
    age: draft.age,
    sex: draft.sex,
    heightCm: draft.heightCm,
    weightKg: draft.weightKg,
    experienceLevel: draft.experienceLevel,
    preferences: {
      weightUnit: draft.weightUnit,
      lengthUnit: draft.lengthUnit,
      theme: 'dark',
      hapticFeedback: true,
      soundEnabled: true,
      restTimerAutoStart: true,
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  // 2. Canonical Goal
  const goal: Goal = {
    id: goalId,
    userId,
    type: 'physique_transformation',
    startWeightKg: draft.weightKg,
    targetWeightKg: draft.targetWeightKg,
    targetDays: 75,
    targetBodyFatPercent: draft.targetBodyFatPercent,
    priorityMuscles: draft.priorityMuscles,
    targetDate: targetEndDate,
    dailyStepGoal: draft.dailyStepTarget,
    dailyWaterGoalMl: 4000, // 4 Liters daily protocol
    dailyCalorieTarget: draft.dailyCalories,
    dailyProteinTargetGrams: draft.proteinGrams,
    dailyCarbTargetGrams: draft.carbGrams,
    dailyFatTargetGrams: draft.fatGrams,
    createdAt: timestamp,
  };

  // 3. Training Preferences
  const trainingPrefs: TrainingPreferences = {
    experienceLevel: draft.experienceLevel,
    daysPerWeek: draft.trainingDaysPerWeek,
    sessionDurationMinutes: draft.sessionDurationMinutes,
    availableEquipment: draft.equipment,
    preferredSplit: draft.preferredSplit,
    updatedAt: timestamp,
  };

  // 4. Nutrition Targets
  const nutritionTargets: NutritionTargets = {
    dailyCalories: draft.dailyCalories,
    proteinGrams: draft.proteinGrams,
    carbGrams: draft.carbGrams,
    fatGrams: draft.fatGrams,
    mealFrequency: draft.mealFrequency,
    trackingMode: draft.trackingMode,
    updatedAt: timestamp,
  };

  // 5. Activity Preferences
  const activityPrefs: ActivityPreferences = {
    dailyStepTarget: draft.dailyStepTarget,
    cardioPreference: draft.cardioPreference,
    cardioSessionsPerWeek: draft.cardioSessionsPerWeek,
    cardioDurationMinutes: draft.cardioDurationMinutes,
    updatedAt: timestamp,
  };

  // 6. Recovery Preferences
  const recoveryPrefs: RecoveryPreferences = {
    sleepTargetHours: draft.sleepTargetHours,
    stressBaseline: draft.stressBaseline,
    recoveryPriority: draft.recoveryPriority,
    restDayPreference: draft.restDayPreference,
    enableReadinessTracking: draft.enableReadinessTracking,
    updatedAt: timestamp,
  };

  // 7. Canonical Challenge
  const challenge: Challenge = {
    id: challengeId,
    userId,
    name: 'Tempo 75',
    type: 'physique-transformation',
    targetDays: 75,
    startDate: todayDateString,
    endDate: targetEndDate,
    currentDayNumber: 1,
    status: 'active',
    goalId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  // 8. Generate 75 ChallengeDay records
  const challengeDays: ChallengeDay[] = [];
  const baseDate = new Date(todayDateString);

  for (let i = 1; i <= 75; i++) {
    const dayDate = new Date(baseDate);
    dayDate.setDate(baseDate.getDate() + (i - 1));
    const dayDateStr = dayDate.toISOString().split('T')[0] ?? '';

    challengeDays.push({
      id: `${challengeId}_day_${String(i).padStart(2, '0')}`,
      challengeId,
      dayNumber: i,
      date: dayDateStr,
      status: i === 1 ? 'active' : 'upcoming',
      isCompleted: false,
    });
  }

  // 9. Update OnboardingState
  const onboardingState: OnboardingState = {
    currentStep: 9,
    completedSteps: [1, 2, 3, 4, 5, 6, 7, 8],
    isComplete: true,
    completedAt: timestamp,
    draft,
  };

  // Persist all data atomically via IStorageAdapter
  await Promise.all([
    storage.set(STORAGE_KEYS.USER_PROFILE, profile),
    storage.set(STORAGE_KEYS.USER_GOALS, goal),
    storage.set(STORAGE_KEYS.TRAINING_PREFERENCES, trainingPrefs),
    storage.set(STORAGE_KEYS.NUTRITION_TARGETS, nutritionTargets),
    storage.set(STORAGE_KEYS.ACTIVITY_PREFERENCES, activityPrefs),
    storage.set(STORAGE_KEYS.RECOVERY_PREFERENCES, recoveryPrefs),
    storage.set(STORAGE_KEYS.ACTIVE_CHALLENGE, challenge),
    storage.set(STORAGE_KEYS.CHALLENGE_DAYS, challengeDays),
    storage.set(STORAGE_KEYS.ONBOARDING_STATE, onboardingState),
  ]);

  return {
    profile,
    goal,
    challenge,
    days: challengeDays,
  };
}
