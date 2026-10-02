import type {
  LoggedSet,
  MovementPattern,
  PersonalRecord,
  PerformanceTrend,
  WeeklyPerformanceOverview,
  WorkoutSession,
  ProgressionRecommendation,
} from '@/types';
import { calculateEstimated1RM, isEligibleForEstimated1RM } from './oneRepMax';

export interface ExerciseHistorySession {
  sessionId: string;
  sessionDate: string;
  sets: LoggedSet[];
  avgLoadKg: number;
  avgReps: number;
  totalVolumeKg: number;
  normalizedWorkload: number; // Volume divided by completed set count (average workload intensity per set)
  topSetLoadKg: number;
  topSetReps: number;
}

/**
 * Builds an efficient in-memory index mapping exerciseId to its chronological completed history.
 * Built once when workout sessions are loaded, avoiding repeated scans across 75 days of sessions.
 */
export function buildExerciseHistoryIndex(
  allSessions: readonly WorkoutSession[]
): Map<string, ExerciseHistorySession[]> {
  const index = new Map<string, ExerciseHistorySession[]>();

  // Filter completed sessions and sort descending by completion time (most recent first)
  const completedSessions = allSessions
    .filter((s) => s.status === 'completed')
    .sort((a, b) => {
      const timeA = new Date(a.completedAt ?? a.startedAt).getTime();
      const timeB = new Date(b.completedAt ?? b.startedAt).getTime();
      return timeB - timeA;
    });

  for (const session of completedSessions) {
    const sessionDate = session.completedAt ?? session.startedAt;

    for (const loggedEx of session.exercises) {
      // Completed, valid sets with positive reps
      const validSets = loggedEx.sets.filter(
        (s) => s.completed && typeof s.reps === 'number' && s.reps > 0
      );

      if (validSets.length === 0) continue;

      let totalVolume = 0;
      let totalLoad = 0;
      let totalReps = 0;
      let topLoad = 0;
      let topReps = 0;

      for (const s of validSets) {
        const load = s.weightKg ?? 0;
        const reps = s.reps ?? 0;
        const vol = load * reps;

        totalVolume += vol;
        totalLoad += load;
        totalReps += reps;

        if (load > topLoad || (load === topLoad && reps > topReps)) {
          topLoad = load;
          topReps = reps;
        }
      }

      const count = validSets.length;
      const historyEntry: ExerciseHistorySession = {
        sessionId: session.id,
        sessionDate,
        sets: validSets,
        avgLoadKg: Math.round((totalLoad / count) * 10) / 10,
        avgReps: Math.round((totalReps / count) * 10) / 10,
        totalVolumeKg: totalVolume,
        normalizedWorkload: Math.round(totalVolume / count),
        topSetLoadKg: topLoad,
        topSetReps: topReps,
      };

      const existing = index.get(loggedEx.exerciseId);
      if (existing) {
        existing.push(historyEntry);
      } else {
        index.set(loggedEx.exerciseId, [historyEntry]);
      }
    }
  }

  return index;
}

/**
 * Extracts exercise history using either a pre-built index (preferred for O(1) performance)
 * or by indexing sessions on the fly.
 */
export function extractExerciseHistory(
  exerciseId: string,
  source: Map<string, ExerciseHistorySession[]> | readonly WorkoutSession[]
): ExerciseHistorySession[] {
  if (source instanceof Map) {
    return source.get(exerciseId) ?? [];
  }
  const index = buildExerciseHistoryIndex(source);
  return index.get(exerciseId) ?? [];
}

/**
 * Determines performance trend using normalized set workload intensity.
 *
 * Rules:
 * - < 2 comparable sessions: 'insufficient-data'
 * - Workload intensity increased >= +3%: 'improving'
 * - Workload intensity decreased >= -5% across two consecutive sessions: 'declining'
 * - Otherwise: 'stable'
 */
export function determinePerformanceTrend(
  history: readonly ExerciseHistorySession[]
): PerformanceTrend {
  if (!history || history.length < 2) {
    return 'insufficient-data';
  }

  const latest = history[0];
  const previous = history[1];

  if (!latest || !previous) {
    return 'insufficient-data';
  }

  // Avoid division by zero
  if (previous.normalizedWorkload <= 0) {
    return latest.normalizedWorkload > 0 ? 'improving' : 'stable';
  }

  const deltaPercent = (latest.normalizedWorkload - previous.normalizedWorkload) / previous.normalizedWorkload;

  if (deltaPercent >= 0.03) {
    return 'improving';
  }

  // Check for two consecutive declining sessions
  if (history.length >= 3) {
    const older = history[2];
    if (older && older.normalizedWorkload > 0) {
      const prevDelta = (previous.normalizedWorkload - older.normalizedWorkload) / older.normalizedWorkload;
      if (deltaPercent <= -0.05 && prevDelta <= -0.05) {
        return 'declining';
      }
    }
  }

  return 'stable';
}

/**
 * Detects Personal Records (PRs) from completed valid sets only.
 * Incomplete, empty, or abandoned sets are excluded.
 *
 * Tracks:
 * - max_weight: Highest load lifted for this exercise
 * - max_reps_at_weight: Highest reps achieved at the specific peak load
 * - max_estimated_1rm: Highest valid estimated 1RM (compounds only, reps <= 12)
 * - max_exercise_volume: Highest single-session volume for this exercise
 */
export function detectPersonalRecords(
  exerciseId: string,
  allSessions: readonly WorkoutSession[],
  exerciseName?: string,
  movementPattern?: MovementPattern
): PersonalRecord[] {
  const prs: PersonalRecord[] = [];

  let bestWeight = 0;
  let bestWeightSession: WorkoutSession | null = null;
  let bestWeightSet: LoggedSet | null = null;

  // Track max reps grouped by weight
  const repsByWeight = new Map<number, { reps: number; session: WorkoutSession; set: LoggedSet }>();

  let best1RM = 0;
  let best1RMSession: WorkoutSession | null = null;
  let best1RMSet: LoggedSet | null = null;

  let bestVolume = 0;
  let bestVolumeSession: WorkoutSession | null = null;

  // Process completed sessions
  const completed = allSessions.filter((s) => s.status === 'completed');

  for (const session of completed) {
    const exercise = session.exercises.find((e) => e.exerciseId === exerciseId);
    if (!exercise) continue;

    let sessionExVolume = 0;

    for (const set of exercise.sets) {
      if (!set.completed || typeof set.reps !== 'number' || set.reps <= 0) {
        continue;
      }

      const weight = set.weightKg ?? 0;
      const reps = set.reps;
      const vol = weight * reps;
      sessionExVolume += vol;

      // 1. Max Weight
      if (weight > bestWeight) {
        bestWeight = weight;
        bestWeightSession = session;
        bestWeightSet = set;
      }

      // 2. Max reps at weight
      const existingWeightRecord = repsByWeight.get(weight);
      if (!existingWeightRecord || reps > existingWeightRecord.reps) {
        repsByWeight.set(weight, { reps, session, set });
      }

      // 3. Max estimated 1RM (only eligible compound sets <= 12 reps)
      const name = exerciseName ?? 'Exercise';
      if (isEligibleForEstimated1RM({ name, movementPattern, weightKg: weight, reps })) {
        const e1rm = calculateEstimated1RM(weight, reps);
        if (e1rm && e1rm > best1RM) {
          best1RM = e1rm;
          best1RMSession = session;
          best1RMSet = set;
        }
      }
    }

    // 4. Max single-session volume for this exercise
    if (sessionExVolume > bestVolume) {
      bestVolume = sessionExVolume;
      bestVolumeSession = session;
    }
  }

  // Assemble PR records
  if (bestWeight > 0 && bestWeightSession && bestWeightSet) {
    prs.push({
      id: `pr-weight-${exerciseId}`,
      exerciseId,
      exerciseName,
      type: 'max_weight',
      value: bestWeight,
      weightKg: bestWeight,
      reps: bestWeightSet.reps,
      achievedAt: bestWeightSession.completedAt ?? bestWeightSession.startedAt,
      workoutSessionId: bestWeightSession.id,
    });
  }

  // Reps at peak weight
  if (bestWeight > 0) {
    const peakWeightRecord = repsByWeight.get(bestWeight);
    if (peakWeightRecord) {
      prs.push({
        id: `pr-reps-${exerciseId}-${bestWeight}`,
        exerciseId,
        exerciseName,
        type: 'max_reps_at_weight',
        value: peakWeightRecord.reps,
        weightKg: bestWeight,
        reps: peakWeightRecord.reps,
        achievedAt: peakWeightRecord.session.completedAt ?? peakWeightRecord.session.startedAt,
        workoutSessionId: peakWeightRecord.session.id,
      });
    }
  }

  // Estimated 1RM
  if (best1RM > 0 && best1RMSession && best1RMSet) {
    prs.push({
      id: `pr-1rm-${exerciseId}`,
      exerciseId,
      exerciseName,
      type: 'max_estimated_1rm',
      value: best1RM,
      weightKg: best1RMSet.weightKg,
      reps: best1RMSet.reps,
      achievedAt: best1RMSession.completedAt ?? best1RMSession.startedAt,
      workoutSessionId: best1RMSession.id,
    });
  }

  // Max session volume
  if (bestVolume > 0 && bestVolumeSession) {
    prs.push({
      id: `pr-vol-${exerciseId}`,
      exerciseId,
      exerciseName,
      type: 'max_exercise_volume',
      value: bestVolume,
      achievedAt: bestVolumeSession.completedAt ?? bestVolumeSession.startedAt,
      workoutSessionId: bestVolumeSession.id,
    });
  }

  return prs;
}

/**
 * Calculates a lightweight weekly performance overview purely derived on-demand from completed sessions.
 * Never creates duplicate persistent performance records.
 */
export function calculateWeeklyPerformanceOverview(
  allSessions: readonly WorkoutSession[],
  recommendations?: readonly ProgressionRecommendation[]
): WeeklyPerformanceOverview {
  const completed = allSessions.filter((s) => s.status === 'completed');
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  const recentSessions = completed.filter((s) => {
    const t = new Date(s.completedAt ?? s.startedAt).getTime();
    return now - t <= sevenDaysMs;
  });

  let totalVolumeKg = 0;
  for (const s of recentSessions) {
    totalVolumeKg += s.totalVolumeKg ?? 0;
  }

  let progressed = 0;
  let maintained = 0;
  let declined = 0;

  if (recommendations && recommendations.length > 0) {
    for (const r of recommendations) {
      if (r.status === 'progress') progressed++;
      else if (r.status === 'maintain') maintained++;
      else if (r.status === 'reduce') declined++;
    }
  }

  return {
    exercisesProgressed: progressed,
    exercisesMaintained: maintained,
    exercisesDeclined: declined,
    prsAchieved: 0,
    totalWorkoutsCompleted: recentSessions.length,
    totalVolumeKg: Math.round(totalVolumeKg),
  };
}
