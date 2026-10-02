import { storage, STORAGE_KEYS } from '@/lib/storage';
import type { ChallengeDay, LoggedSet, WorkoutSession } from '@/types';
import { calculateSessionVolume } from './sessionCalculations';

/**
 * Loads all workout sessions stored in local persistence.
 */
export async function loadAllWorkoutSessions(): Promise<WorkoutSession[]> {
  try {
    const sessions = await storage.get<WorkoutSession[]>(STORAGE_KEYS.WORKOUT_SESSIONS);
    return sessions ?? [];
  } catch (err) {
    console.error('Failed to load workout sessions', err);
    return [];
  }
}

/**
 * Persists a workout session to the sessions collection and maintains active session key.
 */
export async function saveWorkoutSession(session: WorkoutSession): Promise<void> {
  try {
    const all = await loadAllWorkoutSessions();
    const existingIndex = all.findIndex((s) => s.id === session.id);

    let updated: WorkoutSession[];
    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = session;
    } else {
      updated = [...all, session];
    }

    await storage.set(STORAGE_KEYS.WORKOUT_SESSIONS, updated);

    if (session.status === 'in-progress') {
      await storage.set(STORAGE_KEYS.ACTIVE_WORKOUT_SESSION, session.id);
    } else if (session.status === 'completed' || session.status === 'abandoned') {
      const activeId = await storage.get<string>(STORAGE_KEYS.ACTIVE_WORKOUT_SESSION);
      if (activeId === session.id) {
        await storage.remove(STORAGE_KEYS.ACTIVE_WORKOUT_SESSION);
      }
    }
  } catch (err) {
    console.error('Failed to save workout session', err);
    throw err;
  }
}

/**
 * Finds the currently active in-progress workout session, optionally filtered by challengeDayNumber.
 */
export async function findActiveSession(
  dayNumber?: number
): Promise<WorkoutSession | null> {
  try {
    const all = await loadAllWorkoutSessions();
    const inProgress = all.find(
      (s) =>
        s.status === 'in-progress' &&
        (dayNumber === undefined || s.challengeDayNumber === dayNumber)
    );
    return inProgress ?? null;
  } catch (err) {
    console.error('Failed to find active workout session', err);
    return null;
  }
}

/**
 * Scans completed workout sessions in reverse chronological order to find previous
 * performance for a given exercise ID.
 * SOP Section 8 & 45: Returns completed sets of that exercise from the most recent session.
 */
export async function findPreviousPerformance(
  exerciseId: string
): Promise<LoggedSet[]> {
  try {
    const all = await loadAllWorkoutSessions();
    // Filter to completed sessions and sort descending by completion time / start time
    const completedSessions = all
      .filter((s) => s.status === 'completed')
      .sort((a, b) => new Date(b.completedAt ?? b.startedAt).getTime() - new Date(a.completedAt ?? a.startedAt).getTime());

    for (const session of completedSessions) {
      const loggedEx = session.exercises.find((e) => e.exerciseId === exerciseId);
      if (loggedEx && loggedEx.sets.some((s) => s.completed)) {
        return loggedEx.sets.filter((s) => s.completed);
      }
    }

    return [];
  } catch (err) {
    console.error('Failed to find previous performance', err);
    return [];
  }
}

/**
 * Finalizes and completes a workout session.
 * SOP Section 29: Marks WorkoutSession status as 'completed', and updates the corresponding
 * ChallengeDay status to 'completed'.
 */
export async function finalizeWorkoutSession(
  session: WorkoutSession,
  challengeDayId: string
): Promise<WorkoutSession> {
  const completedAt = new Date().toISOString();
  const startMs = new Date(session.startedAt).getTime();
  const durationSeconds = Math.max(60, Math.round((Date.now() - startMs) / 1000));
  const totalVolumeKg = calculateSessionVolume(session.exercises);

  const finalizedSession: WorkoutSession = {
    ...session,
    status: 'completed',
    completedAt,
    totalDurationSeconds: durationSeconds,
    totalVolumeKg,
    isCompleted: true,
  };

  // 1. Save finalized session
  await saveWorkoutSession(finalizedSession);

  // 2. Update ChallengeDay record
  try {
    const days = await storage.get<ChallengeDay[]>(STORAGE_KEYS.CHALLENGE_DAYS);
    if (days && days.length > 0) {
      const updatedDays = days.map((day) => {
        if (day.id === challengeDayId || day.dayNumber === session.challengeDayNumber) {
          return {
            ...day,
            status: 'completed' as const,
            isCompleted: true,
            completedAt,
            workoutSessionId: finalizedSession.id,
          };
        }
        return day;
      });
      await storage.set(STORAGE_KEYS.CHALLENGE_DAYS, updatedDays);
    }
  } catch (err) {
    console.error('Failed to update ChallengeDay on workout completion', err);
  }

  return finalizedSession;
}
