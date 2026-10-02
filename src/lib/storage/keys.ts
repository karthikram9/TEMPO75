/**
 * Canonical storage keys for TEMPO 75 local persistence.
 * Prevents key collision and string duplication across modules.
 */
export const STORAGE_KEYS = {
  APP_SETTINGS: 'tempo:settings:v1',
  ONBOARDING_STATE: 'tempo:onboarding:state',
  USER_PROFILE: 'tempo:profile:v1',
  USER_GOALS: 'tempo:goals:v1',
  TRAINING_PREFERENCES: 'tempo:training:preferences',
  NUTRITION_TARGETS: 'tempo:nutrition:targets',
  ACTIVITY_PREFERENCES: 'tempo:activity:preferences',
  RECOVERY_PREFERENCES: 'tempo:recovery:preferences',
  ACTIVE_CHALLENGE: 'tempo:challenge:active',
  CHALLENGE_DAYS: 'tempo:challenge:days',
  WORKOUT_PROGRAM: 'tempo:workouts:v1',
  WORKOUT_SESSIONS: 'tempo:workout-sessions:v1',
  ACTIVE_WORKOUT_SESSION: 'tempo:active-workout-session:v1',
  CARDIO_SESSIONS: 'tempo:cardio:history',
  BODY_WEIGHT: 'tempo:body:weight',
  BODY_MEASUREMENTS: 'tempo:body:measurements',
  RECOVERY_LOGS: 'tempo:recovery:logs',
  NUTRITION_LOGS: 'tempo:nutrition:logs',
  AUTH_USER: 'tempo:auth:user:v1',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
