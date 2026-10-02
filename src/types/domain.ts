/**
 * ============================================================================
 * TEMPO 75 — CORE DOMAIN TYPES & INTERFACES
 * Canonical Single Source of Truth
 * ============================================================================
 */

/* ============================================================================
 * 1. USER DOMAIN
 * ============================================================================ */

export type WeightUnit = 'kg' | 'lbs';
export type LengthUnit = 'cm' | 'in';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type UserSex = 'male' | 'female' | 'other';

export interface UserPreferences {
  weightUnit: WeightUnit;
  lengthUnit: LengthUnit;
  theme: 'dark'; // Dark mode first & only for Tempo 75
  hapticFeedback: boolean;
  soundEnabled: boolean;
  restTimerAutoStart: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  sex?: UserSex;
  email?: string;
  avatarUrl?: string;
  birthDate?: string; // ISO 8601 YYYY-MM-DD
  heightCm: number;
  weightKg?: number;
  experienceLevel: ExperienceLevel;
  preferences: UserPreferences;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

export type GoalType = 'physique_transformation' | 'hypertrophy' | 'recomposition' | 'fat_loss' | 'strength';

export interface Goal {
  id: string;
  userId: string;
  type: GoalType;
  startWeightKg: number;
  targetWeightKg: number;
  targetDays: number; // 75
  targetBodyFatPercent?: number;
  priorityMuscles?: MuscleGroup[];
  targetDate?: string;
  dailyStepGoal: number;
  dailyWaterGoalMl: number;
  dailyCalorieTarget: number;
  dailyProteinTargetGrams: number;
  dailyCarbTargetGrams?: number;
  dailyFatTargetGrams?: number;
  createdAt: string;
}

export interface AppSettings {
  version: string;
  storageVersion: number;
  activeChallengeId: string | null;
  debugMode: boolean;
  notificationsEnabled: boolean;
}

/* ============================================================================
 * 2. TRAINING, NUTRITION, ACTIVITY & RECOVERY PREFERENCES (MODULE 3)
 * ============================================================================ */

export type EquipmentOption =
  | 'full_gym'
  | 'dumbbells'
  | 'barbell'
  | 'cable'
  | 'machines'
  | 'pullup_bar'
  | 'home_setup';

export type TrainingSplitPreference = 'auto' | 'ppl' | 'upper_lower' | 'full_body';

export interface TrainingPreferences {
  experienceLevel: ExperienceLevel;
  daysPerWeek: number; // 3, 4, 5, 6
  sessionDurationMinutes: number; // 30, 45, 60, 75, 90
  availableEquipment: EquipmentOption[];
  preferredSplit: TrainingSplitPreference;
  updatedAt: string;
}

export type NutritionTrackingMode = 'target_only' | 'full_logging';

export interface NutritionTargets {
  dailyCalories: number;
  proteinGrams: number;
  carbGrams?: number;
  fatGrams?: number;
  mealFrequency: number; // 2, 3, 4, 5
  trackingMode: NutritionTrackingMode;
  updatedAt: string;
}

export type CardioPreference = 'none' | 'walking' | 'jogging' | 'cycling' | 'stair_incline' | 'mixed';

export interface ActivityPreferences {
  dailyStepTarget: number;
  cardioPreference: CardioPreference;
  cardioSessionsPerWeek: number; // 0 to 7
  cardioDurationMinutes: number; // 10, 15, 20, 30, 45, 60
  updatedAt: string;
}

export type StressBaseline = 'low' | 'moderate' | 'high';
export type RecoveryPriority = 'performance' | 'balanced' | 'aggressive';
export type RestDayPreference = 'sunday' | 'saturday' | 'flexible';

export interface RecoveryPreferences {
  sleepTargetHours: number; // 6, 7, 8, 9, 10
  stressBaseline: StressBaseline;
  recoveryPriority: RecoveryPriority;
  restDayPreference: RestDayPreference;
  enableReadinessTracking: boolean;
  updatedAt: string;
}

/* ============================================================================
 * 3. ONBOARDING STATE MODEL
 * ============================================================================ */

export interface OnboardingDraftData {
  name: string;
  age: number;
  sex: UserSex;
  heightCm: number;
  weightKg: number;
  lengthUnit: LengthUnit;
  weightUnit: WeightUnit;

  targetWeightKg: number;
  targetBodyFatPercent?: number;
  priorityMuscles: MuscleGroup[];

  experienceLevel: ExperienceLevel;
  trainingDaysPerWeek: number;
  sessionDurationMinutes: number;
  equipment: EquipmentOption[];
  preferredSplit: TrainingSplitPreference;

  dailyCalories: number;
  proteinGrams: number;
  carbGrams?: number;
  fatGrams?: number;
  mealFrequency: number;
  trackingMode: NutritionTrackingMode;

  dailyStepTarget: number;
  cardioPreference: CardioPreference;
  cardioSessionsPerWeek: number;
  cardioDurationMinutes: number;

  sleepTargetHours: number;
  stressBaseline: StressBaseline;
  recoveryPriority: RecoveryPriority;
  restDayPreference: RestDayPreference;
  enableReadinessTracking: boolean;
}

export interface OnboardingState {
  currentStep: number; // 1 to 9
  completedSteps: number[];
  isComplete: boolean;
  startedAt?: string;
  completedAt?: string;
  draft: Partial<OnboardingDraftData>;
}

/* ============================================================================
 * 4. PROGRAM & CHALLENGE DOMAIN
 * ============================================================================ */

export type ChallengeStatus = 'not_started' | 'active' | 'completed' | 'failed' | 'paused';
export type ChallengeDayStatus = 'active' | 'upcoming' | 'completed' | 'missed';

export interface ChallengeDayRuleRequirement {
  id: string;
  name: string;
  description: string;
  isMandatory: boolean;
}

export interface ChallengeDay {
  id: string;
  challengeId: string;
  dayNumber: number; // 1 to 75
  date: string; // YYYY-MM-DD
  status: ChallengeDayStatus;
  isCompleted: boolean;
  completedAt?: string;
  workoutSessionId?: string;
  cardioSessionId?: string;
  nutritionLogId?: string;
  recoveryLogId?: string;
  weightEntryId?: string;
  progressPhotoId?: string;
  notes?: string;
}

export interface Challenge {
  id: string;
  userId: string;
  name: string; // "Tempo 75"
  type: string; // "physique-transformation"
  targetDays: number; // 75
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  currentDayNumber: number; // 1 to 75
  status: ChallengeStatus;
  goalId?: string;
  createdAt: string;
  updatedAt: string;
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'abs'
  | 'core'
  | 'traps';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'smith_machine'
  | 'pullup_bar'
  | 'kettlebell'
  | 'bands';

export type MovementPattern =
  | 'horizontal-push'
  | 'vertical-push'
  | 'horizontal-pull'
  | 'vertical-pull'
  | 'knee-dominant'
  | 'hip-hinge'
  | 'knee-flexion'
  | 'lateral-raise'
  | 'elbow-flexion'
  | 'elbow-extension'
  | 'calf'
  | 'core-flexion'
  | 'core-stability';

export interface Exercise {
  id: string;
  name: string;
  category: string;
  primaryMuscles: MuscleGroup[];
  primaryMuscle?: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment[];
  movementPattern: MovementPattern;
  difficulty: ExperienceLevel;
  instructions: string[];
  defaultSets: number;
  defaultRepRange: [number, number];
  defaultRestSeconds: number;
  contraindications?: string[];
  instructionalNotes?: string[];
  isCustom?: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string; // Canonical reference to Exercise
  name: string;
  order: number;
  targetSets: number;
  prescribedRepRange: [number, number]; // e.g. [8, 12]
  restSeconds: number;
  targetMuscles: MuscleGroup[];
  movementPattern?: MovementPattern;
  equipment?: Equipment[];
  instructions?: string[];
  notes?: string;
  isAlternative?: boolean;
  originalExerciseId?: string;
}

export interface Workout {
  id: string;
  challengeId?: string;
  challengeDayId?: string;
  dayNumber: number; // 1 to 75
  name: string; // e.g. "Push A"
  focus: string; // e.g. "Chest • Shoulders • Triceps"
  dayOfWeek?: number; // 0-6
  exercises: WorkoutExercise[];
  estimatedDurationMinutes: number;
  targetMuscleGroups: MuscleGroup[];
  status: 'active' | 'upcoming' | 'completed' | 'missed' | 'rest';
}

export interface GeneratedProgram {
  workouts: Workout[];
  restDays: ChallengeDay[];
  weeklyVolume: Partial<Record<MuscleGroup, number>>;
}

/* ============================================================================
 * 5. ACTIVITY & WORKOUT LOGGING DOMAIN
 * ============================================================================ */

export type SetType = 'warmup' | 'normal' | 'drop' | 'failure' | 'myoreps';

export type WorkoutSessionStatus = 'not-started' | 'in-progress' | 'completed' | 'abandoned';
export type LoggedExerciseStatus = 'pending' | 'in-progress' | 'completed';

export interface LoggedSet {
  id: string;
  setNumber: number;
  weightKg?: number;
  reps?: number;
  targetReps?: [number, number];
  rir?: number;
  rpe?: number;
  completed: boolean;
  completedAt?: string;
  type?: SetType;
}

export interface LoggedExercise {
  workoutExerciseId: string;
  exerciseId: string;
  sets: LoggedSet[];
  status: LoggedExerciseStatus;
  notes?: string;
}

// Backward compatibility alias
export type WorkoutSet = LoggedSet;
export type LoggedWorkoutExercise = LoggedExercise;

export interface WorkoutSession {
  id: string;
  workoutId: string;
  challengeId: string;
  challengeDayId: string;
  challengeDayNumber: number;
  userId?: string;
  title: string;
  startedAt: string; // ISO 8601
  completedAt?: string;
  status: WorkoutSessionStatus;
  exercises: LoggedExercise[];
  totalDurationSeconds?: number;
  totalVolumeKg?: number;
  // Legacy aliases for compatibility
  startTime?: string;
  endTime?: string;
  durationSeconds?: number;
  isCompleted?: boolean;
}

export interface RestTimerState {
  startedAt: number;
  endAt: number;
  totalSeconds: number;
  remainingSeconds: number;
  status: 'running' | 'paused' | 'completed' | 'idle';
  pausedAt?: number;
  exerciseName?: string;
}

export interface WorkoutSessionSummary {
  durationLabel: string;
  exerciseCount: number;
  totalSets: number;
  totalVolumeKg: number;
}

/* ============================================================================
 * 5b. PROGRESSIVE OVERLOAD & PERFORMANCE DOMAIN (MODULE 6)
 * ============================================================================ */

export type ProgressionStatus = 'new' | 'progress' | 'maintain' | 'reduce';
export type ProgressionConfidence = 'low' | 'medium' | 'high';
export type PerformanceTrend = 'improving' | 'stable' | 'declining' | 'insufficient-data';

export interface ProgressionRecommendation {
  exerciseId: string;
  status: ProgressionStatus;
  currentLoadKg?: number;
  suggestedLoadKg?: number;
  currentReps?: number[];
  suggestedRepRange: [number, number];
  confidence: ProgressionConfidence;
  explanation: string;
  targetLabel: string;
  estimated1RMKg?: number;
}

export interface ExercisePerformanceSummary {
  exerciseId: string;
  recentSessionCount: number;
  latestLoadKg?: number;
  latestReps?: number[];
  latestVolumeKg: number;
  bestRecentLoadKg?: number;
  bestRecentEstimated1RMKg?: number;
  performanceTrend: PerformanceTrend;
  confidence: ProgressionConfidence;
  lastPerformedDate?: string;
}

export type PersonalRecordType =
  | 'max_weight'
  | 'max_reps_at_weight'
  | 'max_estimated_1rm'
  | 'max_exercise_volume';

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName?: string;
  type: PersonalRecordType;
  value: number;
  weightKg?: number;
  reps?: number;
  achievedAt: string;
  workoutSessionId: string;
}

export interface WeeklyPerformanceOverview {
  weekNumber?: number;
  exercisesProgressed: number;
  exercisesMaintained: number;
  exercisesDeclined: number;
  prsAchieved: number;
  totalWorkoutsCompleted: number;
  totalVolumeKg: number;
}

export type CardioType = 'walking' | 'running' | 'cycling' | 'rowing' | 'stairmaster' | 'hiit' | 'other';

export interface CardioSession {
  id: string;
  userId: string;
  challengeDayNumber?: number;
  type: CardioType;
  durationMinutes: number;
  distanceKm?: number;
  averageHeartRateBpm?: number;
  caloriesBurnedEstimate?: number;
  steps?: number;
  isOutdoor: boolean;
  loggedAt: string;
  notes?: string;
}

/* ============================================================================
 * 6. BODY & MEASUREMENTS DOMAIN
 * ============================================================================ */

export interface WeightEntry {
  id: string;
  userId: string;
  challengeDayNumber?: number;
  weightKg: number;
  bodyFatPercentage?: number;
  takenAt: string; // ISO 8601
  isMorningFast: boolean;
  notes?: string;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  challengeDayNumber?: number;
  date: string; // YYYY-MM-DD
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  leftArmCm?: number;
  rightArmCm?: number;
  leftThighCm?: number;
  rightThighCm?: number;
  calvesCm?: number;
  neckCm?: number;
  notes?: string;
}

export type PhotoAngle = 'front' | 'back' | 'side_left' | 'side_right';

export interface ProgressPhoto {
  id: string;
  userId: string;
  challengeDayNumber: number; // 1 to 75
  angle: PhotoAngle;
  storagePath: string; // Local storage or blob URL key
  capturedAt: string;
  notes?: string;
}

/* ============================================================================
 * 7. RECOVERY DOMAIN
 * ============================================================================ */

export interface Readiness {
  score: number; // 1-100 composite score
  factors: {
    sleepScore: number; // 1-100
    sorenessImpact: number; // 1-100
    energyLevel: number; // 1-10
    stressLevel: number; // 1-10
  };
  recommendation: 'optimal_training' | 'moderate_load' | 'active_recovery' | 'rest';
}

export interface RecoveryLog {
  id: string;
  userId: string;
  challengeDayNumber?: number;
  date: string; // YYYY-MM-DD
  sleepHours: number;
  sleepQualityRating: number; // 1-10
  restingHeartRateBpm?: number;
  energyRating: number; // 1-10
  stressRating: number; // 1-10
  sorenessByMuscle: Partial<Record<MuscleGroup, number>>; // 1-5 scale per muscle
  readiness?: Readiness;
  loggedAt: string;
  notes?: string;
}

/* ============================================================================
 * 8. NUTRITION DOMAIN
 * ============================================================================ */

export interface NutritionLog {
  id: string;
  userId: string;
  challengeDayNumber?: number;
  date: string; // YYYY-MM-DD
  totalCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  waterMl: number;
  adheredToDietPlan: boolean;
  consumedAlcohol: boolean; // In 75-day discipline challenges, zero alcohol is tracked
  notes?: string;
  loggedAt: string;
}

/* ============================================================================
 * 9. ANALYTICS & INSIGHTS DOMAIN (DERIVED)
 * ============================================================================ */

export interface MuscleVolume {
  muscleGroup: MuscleGroup;
  directSets: number;
  indirectSets: number;
  totalVolumeKg: number;
}

export interface WeeklySummary {
  weekNumber: number; // 1 to 11
  startDate: string;
  endDate: string;
  workoutsCompleted: number;
  totalTrainingTimeMinutes: number;
  totalVolumeKg: number;
  averageDailySteps: number;
  averageSleepHours: number;
  weightDeltaKg: number;
  complianceRatePercent: number;
  muscleVolume: MuscleVolume[];
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
  isSecret?: boolean;
}
