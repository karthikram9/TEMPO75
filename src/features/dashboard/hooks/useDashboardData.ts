import { useState, useEffect, useMemo, useCallback } from 'react';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import type {
  ActivityPreferences,
  Challenge,
  ChallengeDay,
  Goal,
  NutritionTargets,
  ProgressionRecommendation,
  RecoveryPreferences,
  TrainingPreferences,
  UserProfile,
  WeightEntry,
  Workout,
  WorkoutSession,
} from '@/types';
import { generateWorkout } from '@/features/workouts/engine/workoutGenerator';
import { getTemplateForDay } from '@/features/workouts/engine/splitGenerator';
import {
  buildExerciseHistoryIndex,
  type ExerciseHistorySession,
} from '@/features/workouts/utils/performanceHistory';
import { generateProgressionRecommendation } from '@/features/workouts/utils/progressionEngine';
import { findActiveSession } from '@/features/workouts/utils/sessionPersistence';

export interface WeeklyStats {
  completedCount: number;
  targetCount: number;
  totalVolumeKg: number;
  totalDurationMinutes: number;
  adherencePercent: number;
}

export interface WeightSnapshot {
  startWeightKg: number;
  currentWeightKg: number;
  targetWeightKg: number;
  deltaKg: number;
  lastLoggedDate?: string;
  entriesCount: number;
}

export function calculateWeeklyStats(
  sessions: WorkoutSession[],
  targetDaysPerWeek: number = 5,
  referenceTimeMs: number = Date.now()
): WeeklyStats {
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const targetCount = targetDaysPerWeek > 0 ? targetDaysPerWeek : 5;

  const completedInWeek = sessions.filter((s) => {
    if (s.status !== 'completed') return false;
    const completedTime = new Date(s.completedAt ?? s.startedAt).getTime();
    return referenceTimeMs - completedTime <= sevenDaysMs && completedTime <= referenceTimeMs;
  });

  let totalVolumeKg = 0;
  let totalSeconds = 0;

  for (const session of completedInWeek) {
    totalVolumeKg += session.totalVolumeKg ?? 0;
    totalSeconds += session.totalDurationSeconds ?? 0;
  }

  const completedCount = completedInWeek.length;
  const adherencePercent =
    targetCount > 0 ? Math.min(100, Math.round((completedCount / targetCount) * 100)) : 0;

  return {
    completedCount,
    targetCount,
    totalVolumeKg: Math.round(totalVolumeKg),
    totalDurationMinutes: Math.round(totalSeconds / 60),
    adherencePercent,
  };
}

export function useDashboardData() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Storage entities
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challengeDays, setChallengeDays] = useState<ChallengeDay[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [training, setTraining] = useState<TrainingPreferences | null>(null);
  const [nutrition, setNutrition] = useState<NutritionTargets | null>(null);
  const [activity, setActivity] = useState<ActivityPreferences | null>(null);
  const [recovery, setRecovery] = useState<RecoveryPreferences | null>(null);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [workoutCache, setWorkoutCache] = useState<Record<string, Workout>>({});
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    completedCount: 0,
    targetCount: 5,
    totalVolumeKg: 0,
    totalDurationMinutes: 0,
    adherencePercent: 0,
  });

  // In-memory exercise history index for O(1) progression queries
  const [historyIndex, setHistoryIndex] = useState<Map<string, ExerciseHistorySession[]>>(new Map());

  const [refreshIndex, setRefreshIndex] = useState<number>(0);

  // Load all dashboard sources in parallel
  useEffect(() => {
    let isMounted = true;

    async function fetchDashboard() {
      try {
        const [
          savedChallenge,
          savedDays,
          savedProfile,
          savedGoal,
          savedTraining,
          savedNutrition,
          savedActivity,
          savedRecovery,
          savedSessions,
          savedActiveSession,
          savedWeight,
          savedWorkouts,
        ] = await Promise.all([
          storage.get<Challenge>(STORAGE_KEYS.ACTIVE_CHALLENGE),
          storage.get<ChallengeDay[]>(STORAGE_KEYS.CHALLENGE_DAYS),
          storage.get<UserProfile>(STORAGE_KEYS.USER_PROFILE),
          storage.get<Goal>(STORAGE_KEYS.USER_GOALS),
          storage.get<TrainingPreferences>(STORAGE_KEYS.TRAINING_PREFERENCES),
          storage.get<NutritionTargets>(STORAGE_KEYS.NUTRITION_TARGETS),
          storage.get<ActivityPreferences>(STORAGE_KEYS.ACTIVITY_PREFERENCES),
          storage.get<RecoveryPreferences>(STORAGE_KEYS.RECOVERY_PREFERENCES),
          storage.get<WorkoutSession[]>(STORAGE_KEYS.WORKOUT_SESSIONS),
          findActiveSession(),
          storage.get<WeightEntry[]>(STORAGE_KEYS.BODY_WEIGHT),
          storage.get<Record<string, Workout>>(STORAGE_KEYS.WORKOUT_PROGRAM),
        ]);

        if (!isMounted) return;

        setChallenge(savedChallenge);
        setChallengeDays(savedDays ?? []);
        setProfile(savedProfile);
        setGoal(savedGoal);
        setTraining(savedTraining);
        setNutrition(savedNutrition);
        setActivity(savedActivity);
        setRecovery(savedRecovery);
        setWorkoutSessions(savedSessions ?? []);
        setActiveSession(savedActiveSession);
        setWeightEntries(savedWeight ?? []);
        setWorkoutCache(savedWorkouts ?? {});

        // Calculate weekly stats
        const stats = calculateWeeklyStats(
          savedSessions ?? [],
          savedTraining?.daysPerWeek ?? 5,
          Date.now()
        );
        setWeeklyStats(stats);

        // Build history index once for O(1) progression targets
        if (savedSessions && savedSessions.length > 0) {
          setHistoryIndex(buildExerciseHistoryIndex(savedSessions));
        }
      } catch (err) {
        console.error('[useDashboardData] Failed to load dashboard data:', err);
        if (isMounted) {
          setError('Failed to load dashboard data. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, [refreshIndex]);

  // Reactive listener to storage events for instantaneous updates across modules
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = () => {
      setRefreshIndex((prev) => prev + 1);
    };

    window.addEventListener('tempo-storage-change', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('tempo-storage-change', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRefreshIndex((prev) => prev + 1);
  }, []);

  // Current challenge day number (1 to 75)
  const currentDayNumber = challenge?.currentDayNumber ?? 1;

  // Find today's ChallengeDay entry
  const todayChallengeDay: ChallengeDay | null = useMemo(() => {
    return challengeDays.find((d) => d.dayNumber === currentDayNumber) ?? null;
  }, [challengeDays, currentDayNumber]);

  // Is today completed in ChallengeDay record?
  const isTodayCompleted = useMemo(() => {
    return Boolean(todayChallengeDay?.isCompleted || todayChallengeDay?.status === 'completed');
  }, [todayChallengeDay]);

  // Total completed days across entire 75-day challenge
  const completedDaysCount = useMemo(() => {
    return challengeDays.filter((d) => d.isCompleted || d.status === 'completed').length;
  }, [challengeDays]);

  // Fallback defaults for preferences (if unset)
  const effectiveTraining: TrainingPreferences = useMemo(() => {
    return (
      training ?? {
        experienceLevel: 'intermediate',
        daysPerWeek: 5,
        sessionDurationMinutes: 60,
        availableEquipment: ['full_gym'],
        preferredSplit: 'ppl',
        updatedAt: new Date().toISOString(),
      }
    );
  }, [training]);

  const effectiveRecovery: RecoveryPreferences = useMemo(() => {
    return (
      recovery ?? {
        sleepTargetHours: 8,
        stressBaseline: 'moderate',
        recoveryPriority: 'balanced',
        restDayPreference: 'sunday',
        enableReadinessTracking: false,
        updatedAt: new Date().toISOString(),
      }
    );
  }, [recovery]);

  // Determine if today is a scheduled rest day
  const isTodayRestDay = useMemo(() => {
    const template = getTemplateForDay(
      currentDayNumber,
      effectiveTraining.daysPerWeek,
      effectiveTraining.preferredSplit,
      effectiveRecovery.restDayPreference
    );
    return template === null;
  }, [currentDayNumber, effectiveTraining, effectiveRecovery]);

  // Resolve today's workout (prefer persisted cache, fallback to deterministic generator)
  const todayWorkout: Workout | null = useMemo(() => {
    if (isTodayRestDay) return null;

    // 1. Check persisted workout cache
    const cacheKey = `workout_day_${currentDayNumber}`;
    if (workoutCache[cacheKey]) {
      return workoutCache[cacheKey]!;
    }

    // 2. Deterministically generate if not in cache
    return generateWorkout({
      challengeDayNumber: currentDayNumber,
      trainingPreferences: effectiveTraining,
      recoveryPreferences: effectiveRecovery,
      goal: goal ?? null,
      status: isTodayCompleted ? 'completed' : 'active',
    });
  }, [isTodayRestDay, currentDayNumber, workoutCache, effectiveTraining, effectiveRecovery, goal, isTodayCompleted]);

  // Completed session for today (if finished)
  const todayCompletedSession: WorkoutSession | null = useMemo(() => {
    return (
      workoutSessions.find(
        (s) => s.status === 'completed' && s.challengeDayNumber === currentDayNumber
      ) ?? null
    );
  }, [workoutSessions, currentDayNumber]);

  // Top progression recommendation:
  // Deterministically selects the primary compound anchor of today's workout (todayWorkout.exercises[0]).
  // If today is a rest day, checks the most recent completed workout's primary compound lift.
  const topProgression: ProgressionRecommendation | null = useMemo(() => {
    // 1. If today has a workout, use the primary compound anchor (order 1 / index 0)
    if (todayWorkout && todayWorkout.exercises.length > 0) {
      const primaryExercise = todayWorkout.exercises[0];
      if (primaryExercise) {
        const history = historyIndex.get(primaryExercise.exerciseId) ?? [];
        return generateProgressionRecommendation({
          exercise: primaryExercise,
          history,
        });
      }
    }

    // 2. If today is rest day, find primary exercise of the most recent completed session
    if (workoutSessions.length > 0) {
      const completed = workoutSessions
        .filter((s) => s.status === 'completed')
        .sort((a, b) => new Date(b.completedAt ?? b.startedAt).getTime() - new Date(a.completedAt ?? a.startedAt).getTime());

      const lastSession = completed[0];
      if (lastSession && lastSession.exercises.length > 0) {
        const firstLogged = lastSession.exercises[0];
        if (firstLogged) {
          const history = historyIndex.get(firstLogged.exerciseId) ?? [];
          // Build minimal WorkoutExercise representation for recommendation engine
          const dummyExercise = {
            id: firstLogged.workoutExerciseId,
            exerciseId: firstLogged.exerciseId,
            name: 'Primary Exercise',
            order: 1,
            targetSets: 3,
            prescribedRepRange: [8, 12] as [number, number],
            restSeconds: 90,
            targetMuscles: [],
          };
          return generateProgressionRecommendation({
            exercise: dummyExercise,
            history,
          });
        }
      }
    }

    return null;
  }, [todayWorkout, historyIndex, workoutSessions]);

  // Weight progression snapshot
  const weightSnapshot: WeightSnapshot = useMemo(() => {
    const startWeight = goal?.startWeightKg ?? 80;
    const targetWeight = goal?.targetWeightKg ?? 70;

    if (!weightEntries || weightEntries.length === 0) {
      return {
        startWeightKg: startWeight,
        currentWeightKg: startWeight,
        targetWeightKg: targetWeight,
        deltaKg: 0,
        entriesCount: 0,
      };
    }

    // Sort descending by date
    const sorted = [...weightEntries].sort(
      (a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()
    );

    const latest = sorted[0];
    const currentWeight = latest?.weightKg ?? startWeight;
    const delta = Math.round((currentWeight - startWeight) * 10) / 10;

    return {
      startWeightKg: startWeight,
      currentWeightKg: currentWeight,
      targetWeightKg: targetWeight,
      deltaKg: delta,
      lastLoggedDate: latest?.takenAt,
      entriesCount: sorted.length,
    };
  }, [goal, weightEntries]);



  // Log weight action with validation and double-tap prevention
  const logWeight = useCallback(
    async (weightKg: number, isMorningFast = true, notes?: string): Promise<boolean> => {
      // Validation: Reasonable human weight in kg (30 to 300 kg)
      if (typeof weightKg !== 'number' || isNaN(weightKg) || weightKg < 30 || weightKg > 300) {
        console.error('[useDashboardData] Invalid weight value:', weightKg);
        return false;
      }

      try {
        const newEntry: WeightEntry = {
          id: `weight_${Date.now()}`,
          userId: profile?.id ?? 'athlete-1',
          challengeDayNumber: currentDayNumber,
          weightKg: Math.round(weightKg * 10) / 10,
          takenAt: new Date().toISOString(),
          isMorningFast,
          notes,
        };

        const existing = await storage.get<WeightEntry[]>(STORAGE_KEYS.BODY_WEIGHT);
        const updated = [...(existing ?? []), newEntry];

        await storage.set(STORAGE_KEYS.BODY_WEIGHT, updated);
        setWeightEntries(updated);
        return true;
      } catch (err) {
        console.error('[useDashboardData] Failed to log weight:', err);
        return false;
      }
    },
    [profile, currentDayNumber]
  );

  return {
    isLoading,
    error,
    challenge,
    currentDayNumber,
    challengeDays,
    completedDaysCount,
    todayChallengeDay,
    isTodayCompleted,
    isTodayRestDay,
    profile,
    goal,
    training,
    nutrition,
    activity,
    recovery,
    todayWorkout,
    workoutCache,
    activeSession,
    todayCompletedSession,
    topProgression,
    weightSnapshot,
    weeklyStats,
    workoutSessions,
    logWeight,
    refetch,
  };
}
