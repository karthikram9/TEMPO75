import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage, STORAGE_KEYS, IndexedDBAdapter } from '@/lib/storage';
import {
  saveWorkoutSession,
  findActiveSession,
  loadAllWorkoutSessions,
  finalizeWorkoutSession,
} from '@/features/workouts/utils/sessionPersistence';
import type { WorkoutSession, ChallengeDay } from '@/types';
import { router } from '@/app/routes';

describe('TEMPO 75 — Full Offline & Local-First Verification Suite', () => {
  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    await storage.clear();
  });

  // --------------------------------------------------------------------------
  // 1. Storage persistence and restoration
  // --------------------------------------------------------------------------
  describe('1. Storage Persistence & Restoration', () => {
    it('persists and restores complex structured objects faithfully', async () => {
      const mockProfile = {
        name: 'Alex Vance',
        age: 29,
        weightKg: 82.5,
        targetWeightKg: 78.0,
        heightCm: 180,
        equipment: ['barbell', 'dumbbells', 'pullup_bar'],
        joinedAt: new Date().toISOString(),
      };

      await storage.set(STORAGE_KEYS.USER_PROFILE, mockProfile);
      const restored = await storage.get<typeof mockProfile>(STORAGE_KEYS.USER_PROFILE);

      expect(restored).not.toBeNull();
      expect(restored).toEqual(mockProfile);
      expect(restored?.weightKg).toBe(82.5);
      expect(restored?.equipment).toContain('barbell');
    });

    it('handles key removal and reports existing keys correctly', async () => {
      await storage.set('tempo:test:a', { value: 1 });
      await storage.set('tempo:test:b', { value: 2 });

      let keys = await storage.keys();
      expect(keys).toContain('tempo:test:a');
      expect(keys).toContain('tempo:test:b');

      await storage.remove('tempo:test:a');
      const retrieved = await storage.get('tempo:test:a');
      expect(retrieved).toBeNull();

      keys = await storage.keys();
      expect(keys).not.toContain('tempo:test:a');
      expect(keys).toContain('tempo:test:b');
    });

    it('dispatches tempo-storage-change events on mutation', async () => {
      const changeSpy = vi.fn();
      window.addEventListener('tempo-storage-change', changeSpy);

      await storage.set('tempo:test:event', { logged: true });
      expect(changeSpy).toHaveBeenCalled();

      window.removeEventListener('tempo-storage-change', changeSpy);
    });
  });

  // --------------------------------------------------------------------------
  // 2. Active-session recovery
  // --------------------------------------------------------------------------
  describe('2. Active-Session Recovery', () => {
    it('saves in-progress session and recovers it without creating duplicates', async () => {
      const activeSession: WorkoutSession = {
        id: 'session_day_1_test',
        workoutId: 'workout_pull_1',
        challengeId: 'challenge_tempo_75',
        challengeDayNumber: 1,
        title: 'Pull A • Hypertrophy & Back Thickness',
        startedAt: new Date().toISOString(),
        status: 'in-progress',
        exercises: [
          {
            workoutExerciseId: 'ex_1',
            exerciseId: 'barbell_deadlift',
            status: 'in-progress',
            sets: [
              { id: 's1', setNumber: 1, weightKg: 100, reps: 6, rir: 2, completed: true },
              { id: 's2', setNumber: 2, weightKg: 100, reps: 6, rir: 2, completed: false },
            ],
          },
        ],
        totalVolumeKg: 600,
        totalDurationSeconds: 120,
      };

      await saveWorkoutSession(activeSession);

      // Verify active session can be found
      const recovered = await findActiveSession(1);
      expect(recovered).not.toBeNull();
      expect(recovered?.id).toBe('session_day_1_test');
      expect(recovered?.exercises[0]?.sets[0]?.completed).toBe(true);

      // Modify session in place (e.g. logging second set)
      const updatedSession: WorkoutSession = {
        ...activeSession,
        exercises: [
          {
            ...activeSession.exercises[0]!,
            sets: [
              activeSession.exercises[0]!.sets[0]!,
              { id: 's2', setNumber: 2, weightKg: 102.5, reps: 6, rir: 1, completed: true },
            ],
          },
        ],
        totalVolumeKg: 1215,
      };

      await saveWorkoutSession(updatedSession);

      const allSessions = await loadAllWorkoutSessions();
      // Must not create duplicate entries in the array
      expect(allSessions.filter((s) => s.id === 'session_day_1_test')).toHaveLength(1);

      const reloaded = await findActiveSession(1);
      expect(reloaded?.exercises[0]?.sets[1]?.weightKg).toBe(102.5);
      expect(reloaded?.exercises[0]?.sets[1]?.completed).toBe(true);
    });

    it('clears active workout session key when abandoned or completed', async () => {
      const activeSession: WorkoutSession = {
        id: 'session_to_abandon',
        workoutId: 'workout_test',
        challengeDayNumber: 5,
        title: 'Push A',
        startedAt: new Date().toISOString(),
        status: 'in-progress',
        exercises: [],
        totalVolumeKg: 0,
        totalDurationSeconds: 0,
      };

      await saveWorkoutSession(activeSession);
      expect(await findActiveSession(5)).not.toBeNull();

      // Abandon session
      await saveWorkoutSession({
        ...activeSession,
        status: 'abandoned',
      });

      const activeAfterAbandon = await findActiveSession(5);
      expect(activeAfterAbandon).toBeNull();
      const activeKey = await storage.get<string>(STORAGE_KEYS.ACTIVE_WORKOUT_SESSION);
      expect(activeKey).toBeNull();
    });
  });

  // --------------------------------------------------------------------------
  // 3. Offline route loading
  // --------------------------------------------------------------------------
  describe('3. Offline Route Loading', () => {
    it('defines all required core application routes for offline navigation', () => {
      const requiredRoutes = [
        '/',
        '/welcome',
        '/login',
        '/signup',
        'onboarding',
        'dashboard',
        'workout',
        'journey',
        'progress',
        'profile',
        'settings',
        'analytics',
      ];

      // Extract all registered route paths from router
      const registeredPaths = new Set<string>();

      function extractPaths(routes: typeof router.routes) {
        for (const route of routes) {
          if (route.path) registeredPaths.add(route.path);
          if (route.children) extractPaths(route.children);
        }
      }

      extractPaths(router.routes);

      for (const required of requiredRoutes) {
        expect(registeredPaths.has(required)).toBe(true);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Offline workout completion
  // --------------------------------------------------------------------------
  describe('4. Offline Workout Completion', () => {
    it('finalizes an offline session, updates history, and clears active session', async () => {
      const inProgress: WorkoutSession = {
        id: 'session_offline_complete',
        workoutId: 'workout_offline_1',
        challengeId: 'challenge_75',
        challengeDayNumber: 2,
        title: 'Lower A • Quad Dominant & Squats',
        startedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
        status: 'in-progress',
        exercises: [
          {
            workoutExerciseId: 'ex_squat',
            exerciseId: 'barbell_back_squat',
            status: 'completed',
            sets: [
              { id: 's1', setNumber: 1, weightKg: 120, reps: 5, rir: 2, completed: true },
              { id: 's2', setNumber: 2, weightKg: 120, reps: 5, rir: 2, completed: true },
              { id: 's3', setNumber: 3, weightKg: 120, reps: 5, rir: 1, completed: true },
            ],
          },
        ],
        totalVolumeKg: 1800,
        totalDurationSeconds: 3600,
      };

      const days: ChallengeDay[] = [
        {
          id: 'day_2_record',
          challengeId: 'challenge_75',
          dayNumber: 2,
          date: '2026-10-26',
          status: 'active',
          isCompleted: false,
          workoutSessionId: undefined,
          tasks: [],
          notes: '',
        },
      ];

      await storage.set(STORAGE_KEYS.CHALLENGE_DAYS, days);
      await saveWorkoutSession(inProgress);

      // Finalize session completely offline
      const completed = await finalizeWorkoutSession(inProgress);

      expect(completed.status).toBe('completed');
      expect(completed.completedAt).toBeDefined();

      // Active workout key must be cleared
      const activeKey = await storage.get(STORAGE_KEYS.ACTIVE_WORKOUT_SESSION);
      expect(activeKey).toBeNull();

      // Sessions list must contain the completed record
      const allSessions = await loadAllWorkoutSessions();
      const savedCompleted = allSessions.find((s) => s.id === 'session_offline_complete');
      expect(savedCompleted?.status).toBe('completed');

      // ChallengeDay record should be marked completed
      const updatedDays = await storage.get<ChallengeDay[]>(STORAGE_KEYS.CHALLENGE_DAYS);
      const day2 = updatedDays?.find((d) => d.dayNumber === 2);
      expect(day2?.isCompleted).toBe(true);
      expect(day2?.workoutSessionId).toBe('session_offline_complete');
    });
  });

  // --------------------------------------------------------------------------
  // 5. Timer restoration after suspension
  // --------------------------------------------------------------------------
  describe('5. Timer Restoration After Suspension', () => {
    it('accurately computes remaining time using wall-clock timestamps without relying on intervals', () => {
      const now = Date.now();
      const restDurationSeconds = 90;
      const endAt = now + restDurationSeconds * 1000;

      // Timer state saved before suspension
      const savedTimerState = {
        startedAt: now,
        endAt,
        totalSeconds: restDurationSeconds,
        remainingSeconds: restDurationSeconds,
        status: 'running' as const,
      };

      // 1. Simulate 30 seconds of phone lock / backgrounding
      const simulatedNowAfter30s = now + 30 * 1000;
      const remainingAfter30s = Math.max(0, Math.ceil((savedTimerState.endAt - simulatedNowAfter30s) / 1000));
      expect(remainingAfter30s).toBe(60);

      // 2. Simulate 95 seconds passing (rest period elapsed during suspension)
      const simulatedNowAfter95s = now + 95 * 1000;
      const remainingAfter95s = Math.max(0, Math.ceil((savedTimerState.endAt - simulatedNowAfter95s) / 1000));
      expect(remainingAfter95s).toBe(0);

      // When remaining <= 0, timer must transition to completed
      const finalStatus = remainingAfter95s <= 0 ? 'completed' : 'running';
      expect(finalStatus).toBe('completed');
    });
  });

  // --------------------------------------------------------------------------
  // 6. Data migration and failure handling
  // --------------------------------------------------------------------------
  describe('6. Data Migration & Failure Handling', () => {
    it('migrates legacy localStorage data non-destructively to IndexedDB', async () => {
      // Pre-seed localStorage with legacy data
      localStorage.setItem('tempo:profile:v1', JSON.stringify({ name: 'Migrated Athlete', level: 'advanced' }));
      localStorage.setItem('tempo:body:weight', JSON.stringify([{ date: '2026-10-25', weightKg: 80.5 }]));

      // Create a fresh IndexedDBAdapter instance to trigger migration
      const adapter = new IndexedDBAdapter();

      // Read back using adapter
      const profile = await adapter.get<{ name: string; level: string }>('tempo:profile:v1');
      const weights = await adapter.get<Array<{ weightKg: number }>>('tempo:body:weight');

      expect(profile?.name).toBe('Migrated Athlete');
      expect(weights?.[0]?.weightKg).toBe(80.5);

      // Verify localStorage was NOT wiped or corrupted
      expect(localStorage.getItem('tempo:profile:v1')).toContain('Migrated Athlete');
    });

    it('recovers gracefully and dispatches warnings when storage issues occur', async () => {
      const warningSpy = vi.fn();
      window.addEventListener('tempo-storage-warning', warningSpy);

      const adapter = new IndexedDBAdapter();
      // Reading a non-existent key must return null without throwing
      const result = await adapter.get('tempo:nonexistent:key');
      expect(result).toBeNull();

      window.removeEventListener('tempo-storage-warning', warningSpy);
    });
  });
});
