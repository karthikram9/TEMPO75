/**
 * Feature Boundary: Workout Engine & Fast Gym Logger
 * TEMPO 75 — Modules 4 & 5
 */
export { WorkoutScreen } from './WorkoutScreen';

// UI Components
export { WorkoutHeader } from './components/WorkoutHeader';
export { WorkoutSummary } from './components/WorkoutSummary';
export { ExerciseCard } from './components/ExerciseCard';
export { ExerciseList } from './components/ExerciseList';
export { MuscleTag } from './components/MuscleTag';
export { RestBadge } from './components/RestBadge';
export { WorkoutEmptyState } from './components/WorkoutEmptyState';
export { WorkoutDaySelector } from './components/WorkoutDaySelector';

// Module 5 & 6 Logger & Progression Components
export { WorkoutLogger } from './components/WorkoutLogger';
export { ExerciseLogger } from './components/ExerciseLogger';
export { SetRow } from './components/SetRow';
export { SetInput } from './components/SetInput';
export { PreviousPerformance } from './components/PreviousPerformance';
export { ProgressionTarget } from './components/ProgressionTarget';
export { RestTimer } from './components/RestTimer';
export { WorkoutProgress } from './components/WorkoutProgress';
export { WorkoutCompletion } from './components/WorkoutCompletion';
export { ResumeWorkoutDialog } from './components/ResumeWorkoutDialog';

// Hooks
export { useWorkoutSession } from './hooks/useWorkoutSession';
export { useRestTimer } from './hooks/useRestTimer';

// Engine & Utilities
export { generateWorkout } from './engine/workoutGenerator';
export { generateProgram } from './engine/programGenerator';
export { selectCompatibleExercise } from './engine/exerciseSelector';
export { getTemplateForDay, buildWeeklyMicrocycle } from './engine/splitGenerator';
export {
  calculateEstimatedMinutes,
  formatEstimatedDuration,
  getDurationNotice,
  calculateWeeklyVolume,
} from './utils/workoutCalculations';
export {
  calculateSessionVolume,
  calculateCompletedSetCount,
  calculateTotalPrescribedSets,
  calculateCompletedExerciseCount,
  formatSessionDuration,
  validateSetInput,
} from './utils/sessionCalculations';
export {
  loadAllWorkoutSessions,
  saveWorkoutSession,
  findActiveSession,
  findPreviousPerformance,
  finalizeWorkoutSession,
} from './utils/sessionPersistence';

// Module 6 Progressive Overload & Performance Utilities
export {
  determineLoadIncrement,
  calculateNextLoad,
  roundToEquipmentStep,
  isIsolationMovement,
  isLowerBodyCompound,
  isBodyweightExercise,
} from './utils/loadIncrements';
export {
  calculateEstimated1RM,
  isEligibleForEstimated1RM,
  formatEstimated1RM,
} from './utils/oneRepMax';
export {
  buildExerciseHistoryIndex,
  extractExerciseHistory,
  determinePerformanceTrend,
  detectPersonalRecords,
  calculateWeeklyPerformanceOverview,
  type ExerciseHistorySession,
} from './utils/performanceHistory';
export { generateProgressionRecommendation } from './utils/progressionEngine';

// Data
export { EXERCISES_DATABASE, EXERCISES_MAP, getExerciseById } from './data/exercises';
export { EXERCISE_ALTERNATIVES, getExerciseAlternatives } from './data/exerciseAlternatives';

export const WORKOUTS_MODULE_ID = 'features/workouts';
