import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import type {
  ActivityPreferences,
  Challenge,
  ChallengeDay,
  Goal,
  RecoveryPreferences,
  TrainingPreferences,
  Workout,
  WorkoutSession,
} from '@/types';
import { PageContainer } from '@/components/layout';
import { useMobileHeader } from '@/hooks';
import { Skeleton } from '@/components/ui';
import { WorkoutHeader } from './components/WorkoutHeader';
import { WorkoutSummary } from './components/WorkoutSummary';
import { ExerciseList } from './components/ExerciseList';
import { WorkoutEmptyState } from './components/WorkoutEmptyState';
import { WorkoutDaySelector } from './components/WorkoutDaySelector';
import { WorkoutLogger } from './components/WorkoutLogger';
import { ResumeWorkoutDialog } from './components/ResumeWorkoutDialog';
import { generateWorkout } from './engine/workoutGenerator';
import { getTemplateForDay } from './engine/splitGenerator';
import { findActiveSession, saveWorkoutSession } from './utils/sessionPersistence';

export const WorkoutScreen: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challengeDays, setChallengeDays] = useState<ChallengeDay[]>([]);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [training, setTraining] = useState<TrainingPreferences | null>(null);
  const [activity, setActivity] = useState<ActivityPreferences | null>(null);
  const [recovery, setRecovery] = useState<RecoveryPreferences | null>(null);
  const [workoutCache, setWorkoutCache] = useState<Record<string, Workout>>({});

  // Active in-progress session (if detected)
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [showResumeDialog, setShowResumeDialog] = useState<boolean>(false);

  // Local selection overrides when interacting within the screen
  const [localDayNumber, setLocalDayNumber] = useState<number | null>(null);
  const [localLoggingMode, setLocalLoggingMode] = useState<boolean>(false);

  // Protocol day number from challenge
  const activeDayNumber = challenge?.currentDayNumber ?? 1;

  // Selected day number: URL query param has highest priority, then local override, then challenge day
  const selectedDayNumber = useMemo(() => {
    const paramDay = searchParams.get('day');
    if (paramDay) {
      const parsed = parseInt(paramDay, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 75) return parsed;
    }
    return localDayNumber ?? activeDayNumber;
  }, [searchParams, localDayNumber, activeDayNumber]);

  // Mode: Overview (prescription view) vs Active Logger
  const isLoggingMode = searchParams.get('start') === 'true' || localLoggingMode;

  const setIsLoggingMode = useCallback(
    (mode: boolean) => {
      setLocalLoggingMode(mode);
      if (!mode && searchParams.get('start') === 'true') {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete('start');
          return next;
        });
      }
    },
    [searchParams, setSearchParams]
  );

  const setSelectedDay = useCallback(
    (day: number) => {
      setLocalDayNumber(day);
      setLocalLoggingMode(false);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('day', String(day));
        next.delete('start');
        return next;
      });
    },
    [setSearchParams]
  );

  // Load protocol, challenge days, and preferences on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [
          savedChallenge,
          savedDays,
          savedGoal,
          savedTraining,
          savedActivity,
          savedRecovery,
          savedWorkouts,
          savedActiveSession,
        ] = await Promise.all([
          storage.get<Challenge>(STORAGE_KEYS.ACTIVE_CHALLENGE),
          storage.get<ChallengeDay[]>(STORAGE_KEYS.CHALLENGE_DAYS),
          storage.get<Goal>(STORAGE_KEYS.USER_GOALS),
          storage.get<TrainingPreferences>(STORAGE_KEYS.TRAINING_PREFERENCES),
          storage.get<ActivityPreferences>(STORAGE_KEYS.ACTIVITY_PREFERENCES),
          storage.get<RecoveryPreferences>(STORAGE_KEYS.RECOVERY_PREFERENCES),
          storage.get<Record<string, Workout>>(STORAGE_KEYS.WORKOUT_PROGRAM),
          findActiveSession(),
        ]);

        if (!isMounted) return;

        setChallenge(savedChallenge);
        setChallengeDays(savedDays ?? []);
        setGoal(savedGoal);
        setTraining(savedTraining);
        setActivity(savedActivity);
        setRecovery(savedRecovery);
        setWorkoutCache(savedWorkouts ?? {});

        if (savedActiveSession) {
          setActiveSession(savedActiveSession);
          // If the active session is for current day, prompt resume dialog
          setShowResumeDialog(true);
        }
      } catch (err) {
        console.error('Failed to load workout protocol data', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Effective training preferences with sensible defaults
  const effectiveTraining: TrainingPreferences = useMemo(() => {
    return (
      training ?? {
        experienceLevel: 'intermediate',
        daysPerWeek: 6,
        sessionDurationMinutes: 60,
        availableEquipment: ['full_gym'],
        preferredSplit: 'ppl',
        updatedAt: new Date().toISOString(),
      }
    );
  }, [training]);

  // Effective recovery preferences
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

  // Check if a specific day is a rest day
  const checkIsRestDay = useCallback(
    (day: number): boolean => {
      return (
        getTemplateForDay(
          day,
          effectiveTraining.daysPerWeek,
          effectiveTraining.preferredSplit,
          effectiveRecovery.restDayPreference
        ) === null
      );
    },
    [effectiveTraining, effectiveRecovery]
  );

  // Check if selected day is marked completed in ChallengeDays
  const isSelectedDayCompleted = useMemo(() => {
    const match = challengeDays.find((d) => d.dayNumber === selectedDayNumber);
    return match?.isCompleted ?? match?.status === 'completed';
  }, [challengeDays, selectedDayNumber]);

  // Determine status for the currently selected day
  const currentDayStatus: 'active' | 'upcoming' | 'completed' | 'rest' = useMemo(() => {
    if (checkIsRestDay(selectedDayNumber)) {
      return 'rest';
    }
    if (isSelectedDayCompleted) {
      return 'completed';
    }
    if (selectedDayNumber === activeDayNumber) {
      return 'active';
    }
    if (selectedDayNumber < activeDayNumber) {
      return 'completed';
    }
    return 'upcoming';
  }, [selectedDayNumber, activeDayNumber, checkIsRestDay, isSelectedDayCompleted]);

  // Resolve current workout: from cache or deterministic generator
  const currentWorkout: Workout | null = useMemo(() => {
    if (checkIsRestDay(selectedDayNumber)) {
      return null;
    }

    const cacheKey = String(selectedDayNumber);
    if (workoutCache[cacheKey]) {
      return workoutCache[cacheKey];
    }

    // Generate deterministically
    return generateWorkout({
      challengeDayNumber: selectedDayNumber,
      challengeId: challenge?.id,
      trainingPreferences: effectiveTraining,
      recoveryPreferences: effectiveRecovery,
      goal,
      status: currentDayStatus,
    });
  }, [
    selectedDayNumber,
    checkIsRestDay,
    workoutCache,
    challenge?.id,
    effectiveTraining,
    effectiveRecovery,
    goal,
    currentDayStatus,
  ]);

  // Persist generated workout if not already in cache
  useEffect(() => {
    if (!currentWorkout) return;
    const cacheKey = String(selectedDayNumber);
    if (!workoutCache[cacheKey]) {
      void storage.set(STORAGE_KEYS.WORKOUT_PROGRAM, {
        ...workoutCache,
        [cacheKey]: currentWorkout,
      });
    }
  }, [currentWorkout, selectedDayNumber, workoutCache]);

  // Current ChallengeDay record
  const currentChallengeDay = useMemo(() => {
    return challengeDays.find((d) => d.dayNumber === selectedDayNumber);
  }, [challengeDays, selectedDayNumber]);

  // Dynamic Mobile Header
  const headerTitle = useMemo(() => {
    const dayStr = `DAY ${String(selectedDayNumber).padStart(2, '0')}`;
    if (checkIsRestDay(selectedDayNumber)) {
      return `${dayStr} • RECOVERY`;
    }
    if (isLoggingMode) {
      return `${dayStr} • LOGGING`;
    }
    return `${dayStr} • ${currentWorkout?.name ?? 'TRAINING'}`;
  }, [selectedDayNumber, checkIsRestDay, isLoggingMode, currentWorkout]);

  useMobileHeader({
    title: headerTitle,
    subtitle: isLoggingMode ? 'ACTIVE GYM LOGGER' : 'TEMPO 75 PROTOCOL',
    showBack: isLoggingMode,
    onBack: isLoggingMode ? () => setIsLoggingMode(false) : undefined,
  });

  // Handle starting over / discarding an active session
  const handleRestartSession = async () => {
    if (activeSession) {
      const abandoned: WorkoutSession = {
        ...activeSession,
        status: 'abandoned',
      };
      await saveWorkoutSession(abandoned);
    }
    setActiveSession(null);
    setShowResumeDialog(false);
    setIsLoggingMode(true);
  };

  // Guard: if no active challenge or challenge not active, redirect to /onboarding
  if (!isLoading && (!challenge || challenge.status !== 'active')) {
    return <Navigate to="/onboarding" replace />;
  }

  if (isLoading) {
    return (
      <PageContainer className="space-y-6 pt-4">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-44 w-full rounded-2xl" />
      </PageContainer>
    );
  }

  const totalSets = currentWorkout?.exercises.reduce((sum, ex) => sum + ex.targetSets, 0) ?? 0;

  return (
    <PageContainer className="flex flex-col gap-5 sm:gap-6 pt-2 sm:pt-4 max-w-4xl mx-auto">
      {/* Resume In-Progress Session Dialog Modal */}
      {showResumeDialog && activeSession && (
        <ResumeWorkoutDialog
          session={activeSession}
          onResume={() => {
            setShowResumeDialog(false);
            if (activeSession.challengeDayNumber) {
              setSelectedDay(activeSession.challengeDayNumber);
            }
            setIsLoggingMode(true);
          }}
          onRestart={handleRestartSession}
          onDismiss={() => setShowResumeDialog(false)}
        />
      )}

      {/* 1. Day Navigation Strip (Only shown when not actively logging a set) */}
      {!isLoggingMode && (
        <WorkoutDaySelector
          activeDayNumber={activeDayNumber}
          selectedDayNumber={selectedDayNumber}
          totalDays={75}
          onSelectDay={setSelectedDay}
          isRestDay={checkIsRestDay}
        />
      )}

      {/* 2. Content for Rest Day vs Active Logger vs Workout Prescription */}
      {checkIsRestDay(selectedDayNumber) ? (
        <WorkoutEmptyState
          dayNumber={selectedDayNumber}
          totalDays={75}
          recoveryPreferences={recovery}
          activityPreferences={activity}
        />
      ) : isLoggingMode && currentWorkout ? (
        /* ACTIVE WORKOUT LOGGER MODE */
        <WorkoutLogger
          workout={currentWorkout}
          challengeId={challenge?.id}
          challengeDayId={currentChallengeDay?.id}
          challengeDayNumber={selectedDayNumber}
          onExit={() => setIsLoggingMode(false)}
          onWorkoutCompleted={(finalized) => {
            setIsLoggingMode(false);
            setActiveSession(null);
            // Update local challengeDays state so UI refreshes immediately
            setChallengeDays((prev) =>
              prev.map((d) =>
                d.dayNumber === selectedDayNumber
                  ? { ...d, status: 'completed', isCompleted: true, workoutSessionId: finalized.id }
                  : d
              )
            );
          }}
        />
      ) : currentWorkout ? (
        /* PRESCRIPTION OVERVIEW MODE */
        <>
          {/* Workout Header */}
          <WorkoutHeader
            dayNumber={selectedDayNumber}
            totalDays={75}
            workoutName={currentWorkout.name}
            focus={currentWorkout.focus}
            targetMuscleGroups={currentWorkout.targetMuscleGroups}
            status={currentDayStatus}
          />

          {/* Workout Overview / Summary */}
          <WorkoutSummary
            exerciseCount={currentWorkout.exercises.length}
            totalSets={totalSets}
            estimatedDurationMinutes={currentWorkout.estimatedDurationMinutes}
            preferredDurationMinutes={effectiveTraining.sessionDurationMinutes}
          />

          {/* Primary Action Button: START WORKOUT / RESUME WORKOUT */}
          {!isSelectedDayCompleted && (
            <div className="sticky top-16 z-30 py-2 bg-[#F4F5F0]">
              <button
                type="button"
                onClick={() => setIsLoggingMode(true)}
                className="w-full min-h-[54px] sm:min-h-[58px] rounded-full bg-[#1A382B] hover:bg-[#234A39] active:bg-[#142C22] text-white font-black text-base uppercase tracking-wider font-mono shadow-sm flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#1A382B] cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>{activeSession && activeSession.challengeDayNumber === selectedDayNumber ? 'RESUME WORKOUT' : 'START WORKOUT'}</span>
              </button>
            </div>
          )}

          {isSelectedDayCompleted && (
            <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-between shadow-daylight">
              <div className="flex items-center gap-2 text-emerald-800 font-mono text-xs sm:text-sm font-bold uppercase">
                <svg className="w-5 h-5 shrink-0 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Workout Logged &amp; Completed</span>
              </div>
              <button
                type="button"
                onClick={() => setIsLoggingMode(true)}
                className="text-xs font-mono font-bold text-text-primary hover:text-black px-4 py-2 rounded-full bg-white border border-border-subtle shadow-sm transition-all"
              >
                Review Session &rarr;
              </button>
            </div>
          )}

          {/* Exercise Sequence List */}
          <ExerciseList exercises={currentWorkout.exercises} />
        </>
      ) : null}
    </PageContainer>
  );
};
