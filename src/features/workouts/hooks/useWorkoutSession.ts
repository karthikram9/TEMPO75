import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  LoggedExercise,
  LoggedSet,
  ProgressionRecommendation,
  Workout,
  WorkoutExercise,
  WorkoutSession,
  WorkoutSessionSummary,
} from '@/types';
import {
  calculateCompletedExerciseCount,
  calculateCompletedSetCount,
  calculateSessionVolume,
  calculateTotalPrescribedSets,
  formatSessionDuration,
} from '../utils/sessionCalculations';
import {
  buildExerciseHistoryIndex,
  type ExerciseHistorySession,
} from '../utils/performanceHistory';
import { generateProgressionRecommendation } from '../utils/progressionEngine';
import {
  finalizeWorkoutSession,
  findActiveSession,
  findPreviousPerformance,
  loadAllWorkoutSessions,
  saveWorkoutSession,
} from '../utils/sessionPersistence';

export interface UseWorkoutSessionParams {
  workout: Workout | null;
  challengeId?: string;
  challengeDayId?: string;
  challengeDayNumber: number;
  onAutoStartRest?: (seconds: number, exerciseName: string) => void;
}

export function useWorkoutSession({
  workout,
  challengeId = '',
  challengeDayId = '',
  challengeDayNumber,
  onAutoStartRest,
}: UseWorkoutSessionParams) {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [previousPerformanceMap, setPreviousPerformanceMap] = useState<Record<string, LoggedSet[]>>({});
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [completedSummary, setCompletedSummary] = useState<WorkoutSessionSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyIndex, setHistoryIndex] = useState<Map<string, ExerciseHistorySession[]>>(new Map());

  // Load all sessions once on mount to build the exercise history index
  useEffect(() => {
    let isMounted = true;
    async function initHistory() {
      try {
        const allSessions = await loadAllWorkoutSessions();
        if (isMounted) {
          const index = buildExerciseHistoryIndex(allSessions);
          setHistoryIndex(index);
        }
      } catch (err) {
        console.error('Failed to load session history for progression', err);
      }
    }
    void initHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize a new session
  const startSession = useCallback(async () => {
    if (!workout) return;

    // Check if an in-progress session already exists
    const existing = await findActiveSession(challengeDayNumber);
    if (existing) {
      setSession(existing);
      return;
    }

    const sessionId = `session_${workout.id}_${Date.now()}`;
    const mappedExercises: LoggedExercise[] = workout.exercises.map((ex) => {
      const sets: LoggedSet[] = Array.from({ length: ex.targetSets }, (_, i) => ({
        id: `set_${ex.id}_${i + 1}`,
        setNumber: i + 1,
        targetReps: ex.prescribedRepRange,
        completed: false,
      }));

      return {
        workoutExerciseId: ex.id,
        exerciseId: ex.exerciseId,
        sets,
        status: 'pending',
      };
    });

    const newSession: WorkoutSession = {
      id: sessionId,
      workoutId: workout.id,
      challengeId,
      challengeDayId,
      challengeDayNumber,
      title: workout.name,
      startedAt: new Date().toISOString(),
      status: 'in-progress',
      exercises: mappedExercises,
      totalVolumeKg: 0,
      totalDurationSeconds: 0,
    };

    try {
      await saveWorkoutSession(newSession);
      setSession(newSession);
      setActiveExerciseIndex(0);
      setError(null);
    } catch (err) {
      console.error('Failed to start workout session', err);
      setError('Unable to start workout session. Please try again.');
    }
  }, [workout, challengeId, challengeDayId, challengeDayNumber]);

  // Check for an existing in-progress session for this challenge day or auto-initialize
  useEffect(() => {
    let isMounted = true;

    async function checkExisting() {
      try {
        const active = await findActiveSession(challengeDayNumber);
        if (!isMounted) return;

        if (active) {
          setSession(active);
          // Find first exercise that has incomplete sets
          const firstIncompleteIdx = active.exercises.findIndex((e) =>
            e.sets.some((s) => !s.completed)
          );
          if (firstIncompleteIdx >= 0) {
            setActiveExerciseIndex(firstIncompleteIdx);
          }
        } else if (workout) {
          // Immediately auto-start a new session so logger renders on first render without reload!
          await startSession();
        }
      } catch (err) {
        console.error('Error checking active session', err);
      }
    }

    void checkExisting();

    return () => {
      isMounted = false;
    };
  }, [challengeDayNumber, workout, startSession]);

  // Load previous performance for the current active exercise
  const currentWorkoutExercise: WorkoutExercise | null = useMemo(() => {
    if (!workout || !workout.exercises[activeExerciseIndex]) return null;
    return workout.exercises[activeExerciseIndex];
  }, [workout, activeExerciseIndex]);

  useEffect(() => {
    let isMounted = true;
    if (!currentWorkoutExercise) return;

    const exerciseId = currentWorkoutExercise.exerciseId;
    if (previousPerformanceMap[exerciseId]) return;

    async function loadPrev() {
      const prevSets = await findPreviousPerformance(exerciseId);
      if (isMounted) {
        setPreviousPerformanceMap((map) => ({ ...map, [exerciseId]: prevSets }));
      }
    }

    void loadPrev();

    return () => {
      isMounted = false;
    };
  }, [currentWorkoutExercise, previousPerformanceMap]);

  // Complete a set (with double-tap protection and immediate autosave)
  const completeCurrentSet = useCallback(
    async (params: { weightKg: number; reps: number; rir?: number }) => {
      if (isSaving || !session || !workout) return;

      setIsSaving(true);
      setError(null);

      try {
        const exercises = [...session.exercises];
        const currentLoggedEx = exercises[activeExerciseIndex];
        if (!currentLoggedEx) {
          setIsSaving(false);
          return;
        }

        // Find the first incomplete set in this exercise
        const setIndex = currentLoggedEx.sets.findIndex((s) => !s.completed);
        if (setIndex === -1) {
          setIsSaving(false);
          return;
        }

        const targetSet = currentLoggedEx.sets[setIndex]!;
        const updatedSet: LoggedSet = {
          ...targetSet,
          weightKg: params.weightKg,
          reps: params.reps,
          rir: params.rir,
          completed: true,
          completedAt: new Date().toISOString(),
        };

        const updatedSets = [...currentLoggedEx.sets];
        updatedSets[setIndex] = updatedSet;

        const allSetsCompleted = updatedSets.every((s) => s.completed);
        const updatedExercise: LoggedExercise = {
          ...currentLoggedEx,
          sets: updatedSets,
          status: allSetsCompleted ? 'completed' : 'in-progress',
        };

        exercises[activeExerciseIndex] = updatedExercise;

        const totalVolumeKg = calculateSessionVolume(exercises);
        const updatedSession: WorkoutSession = {
          ...session,
          exercises,
          totalVolumeKg,
        };

        // 1. Immediately persist to storage
        await saveWorkoutSession(updatedSession);
        setSession(updatedSession);

        // 2. Trigger auto rest timer
        const currentPrescription = workout.exercises[activeExerciseIndex];
        if (currentPrescription && onAutoStartRest) {
          onAutoStartRest(currentPrescription.restSeconds, currentPrescription.name);
        }

        // 3. If all sets of this exercise are completed, check if next exercise should be selected
        if (allSetsCompleted && activeExerciseIndex < workout.exercises.length - 1) {
          // Slight delay or let user navigate, stay on current to view completion
        }
      } catch (err) {
        console.error('Failed to complete set', err);
        setError('Unable to save this set. Try again.');
      } finally {
        setTimeout(() => {
          setIsSaving(false);
        }, 300); // 300ms double-tap throttle
      }
    },
    [isSaving, session, workout, activeExerciseIndex, onAutoStartRest]
  );

  // Edit an existing completed set
  const editCompletedSet = useCallback(
    async (
      exerciseIdx: number,
      setId: string,
      updates: { weightKg?: number; reps?: number; rir?: number }
    ) => {
      if (!session) return;

      try {
        const exercises = [...session.exercises];
        const loggedEx = exercises[exerciseIdx];
        if (!loggedEx) return;

        const sets = loggedEx.sets.map((s) => {
          if (s.id === setId) {
            return {
              ...s,
              ...updates,
            };
          }
          return s;
        });

        exercises[exerciseIdx] = {
          ...loggedEx,
          sets,
        };

        const totalVolumeKg = calculateSessionVolume(exercises);
        const updatedSession: WorkoutSession = {
          ...session,
          exercises,
          totalVolumeKg,
        };

        await saveWorkoutSession(updatedSession);
        setSession(updatedSession);
      } catch (err) {
        console.error('Failed to edit set', err);
        setError('Unable to update set. Try again.');
      }
    },
    [session]
  );

  // Navigation between exercises
  const goToNextExercise = useCallback(() => {
    if (!workout) return;
    setActiveExerciseIndex((prev) => Math.min(workout.exercises.length - 1, prev + 1));
  }, [workout]);

  const goToPreviousExercise = useCallback(() => {
    setActiveExerciseIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToExercise = useCallback(
    (index: number) => {
      if (!workout) return;
      if (index >= 0 && index < workout.exercises.length) {
        setActiveExerciseIndex(index);
      }
    },
    [workout]
  );

  // Finalize and complete workout
  const completeWorkout = useCallback(async () => {
    if (!session || !workout) return;

    try {
      const finalized = await finalizeWorkoutSession(session, challengeDayId);
      setSession(finalized);

      const summary: WorkoutSessionSummary = {
        durationLabel: formatSessionDuration(finalized.startedAt, finalized.completedAt),
        exerciseCount: calculateCompletedExerciseCount(finalized.exercises),
        totalSets: calculateCompletedSetCount(finalized.exercises),
        totalVolumeKg: finalized.totalVolumeKg ?? 0,
      };

      setCompletedSummary(summary);
      setShowCompletionModal(true);

      // Refresh history index so subsequent recommendations include this completed session
      const all = await loadAllWorkoutSessions();
      setHistoryIndex(buildExerciseHistoryIndex(all));
    } catch (err) {
      console.error('Failed to finalize workout', err);
      setError('Unable to complete workout. Try again.');
    }
  }, [session, workout, challengeDayId]);

  // Restart / Abandon in-progress session
  const restartSession = useCallback(async () => {
    if (!session) return;
    try {
      const abandoned: WorkoutSession = {
        ...session,
        status: 'abandoned',
      };
      await saveWorkoutSession(abandoned);
      setSession(null);
      await startSession();
    } catch (err) {
      console.error('Failed to restart session', err);
    }
  }, [session, startSession]);

  // Derived progress statistics
  const completedSetsCount = session ? calculateCompletedSetCount(session.exercises) : 0;
  const totalPrescribedSets = session
    ? calculateTotalPrescribedSets(session.exercises)
    : workout
    ? workout.exercises.reduce((acc, ex) => acc + ex.targetSets, 0)
    : 0;
  const completedExercisesCount = session ? calculateCompletedExerciseCount(session.exercises) : 0;
  const totalExercisesCount = workout ? workout.exercises.length : 0;

  const currentLoggedExercise: LoggedExercise | null = useMemo(() => {
    if (!session || !session.exercises[activeExerciseIndex]) return null;
    return session.exercises[activeExerciseIndex];
  }, [session, activeExerciseIndex]);

  const isAllRequiredSetsCompleted =
    totalPrescribedSets > 0 && completedSetsCount >= totalPrescribedSets;

  // Advisory progression recommendation derived from indexed history
  const progressionRecommendation: ProgressionRecommendation | null = useMemo(() => {
    if (!currentWorkoutExercise) return null;
    const history = historyIndex.get(currentWorkoutExercise.exerciseId) ?? [];
    return generateProgressionRecommendation({
      exercise: currentWorkoutExercise,
      history,
    });
  }, [currentWorkoutExercise, historyIndex]);

  return {
    session,
    isInProgress: session?.status === 'in-progress',
    isCompleted: session?.status === 'completed',
    activeExerciseIndex,
    currentWorkoutExercise,
    currentLoggedExercise,
    previousPerformance: currentWorkoutExercise
      ? previousPerformanceMap[currentWorkoutExercise.exerciseId] ?? []
      : [],
    progressionRecommendation,
    completedSetsCount,
    totalPrescribedSets,
    completedExercisesCount,
    totalExercisesCount,
    isAllRequiredSetsCompleted,
    isSaving,
    error,
    showCompletionModal,
    completedSummary,
    startSession,
    completeCurrentSet,
    editCompletedSet,
    goToNextExercise,
    goToPreviousExercise,
    goToExercise,
    completeWorkout,
    restartSession,
    closeCompletionModal: () => setShowCompletionModal(false),
  };
}
