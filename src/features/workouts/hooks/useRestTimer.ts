import { useState, useEffect, useRef, useCallback } from 'react';
import type { RestTimerState } from '@/types';

const REST_TIMER_STORAGE_KEY = 'tempo:rest-timer:v1';

function getStoredTimerState(): RestTimerState | null {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return null;
    const raw = window.sessionStorage.getItem(REST_TIMER_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as RestTimerState;

    if (stored.status === 'running') {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((stored.endAt - now) / 1000));
      if (remaining <= 0) {
        return {
          ...stored,
          remainingSeconds: 0,
          status: 'completed',
        };
      }
      return {
        ...stored,
        remainingSeconds: remaining,
      };
    }

    return stored;
  } catch {
    return null;
  }
}

function persistTimerState(state: RestTimerState) {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return;
    if (state.status === 'idle') {
      window.sessionStorage.removeItem(REST_TIMER_STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(REST_TIMER_STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    // Ignore storage quota
  }
}

export function useRestTimer() {
  const [timerState, setTimerState] = useState<RestTimerState>(() => {
    const saved = getStoredTimerState();
    return (
      saved ?? {
        startedAt: 0,
        endAt: 0,
        totalSeconds: 0,
        remainingSeconds: 0,
        status: 'idle',
      }
    );
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize state changes to session persistence
  useEffect(() => {
    persistTimerState(timerState);
  }, [timerState]);

  // Recalculates remaining seconds from wall-clock timestamps
  const updateTimer = useCallback(() => {
    setTimerState((prev) => {
      if (prev.status !== 'running') return prev;

      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((prev.endAt - now) / 1000));

      if (remaining <= 0) {
        // Vibrate softly on completion if browser supports it
        try {
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
          }
        } catch {
          // Ignore vibration restrictions
        }

        const completedState: RestTimerState = {
          ...prev,
          remainingSeconds: 0,
          status: 'completed',
        };
        persistTimerState(completedState);
        return completedState;
      }

      const updatedState: RestTimerState = {
        ...prev,
        remainingSeconds: remaining,
      };
      persistTimerState(updatedState);
      return updatedState;
    });
  }, []);

  // Continuous tick when running
  useEffect(() => {
    if (timerState.status === 'running') {
      timerRef.current = setInterval(updateTimer, 500);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerState.status, updateTimer]);

  // Handle visibility change (tab backgrounding / screen unlock / iOS suspension)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [updateTimer]);

  // Start new rest countdown
  const startTimer = useCallback((seconds: number, exerciseName?: string) => {
    const validSeconds = Math.max(5, seconds);
    const now = Date.now();
    const endAt = now + validSeconds * 1000;

    const nextState: RestTimerState = {
      startedAt: now,
      endAt,
      totalSeconds: validSeconds,
      remainingSeconds: validSeconds,
      status: 'running',
      exerciseName,
    };
    persistTimerState(nextState);
    setTimerState(nextState);
  }, []);

  // Pause
  const pauseTimer = useCallback(() => {
    setTimerState((prev) => {
      if (prev.status !== 'running') return prev;
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((prev.endAt - now) / 1000));
      const nextState: RestTimerState = {
        ...prev,
        status: 'paused',
        pausedAt: now,
        remainingSeconds: remaining,
      };
      persistTimerState(nextState);
      return nextState;
    });
  }, []);

  // Resume
  const resumeTimer = useCallback(() => {
    setTimerState((prev) => {
      if (prev.status !== 'paused') return prev;
      const now = Date.now();
      const endAt = now + prev.remainingSeconds * 1000;
      const nextState: RestTimerState = {
        ...prev,
        status: 'running',
        startedAt: now,
        endAt,
      };
      persistTimerState(nextState);
      return nextState;
    });
  }, []);

  // Add 15 seconds
  const addTime = useCallback((secondsToAdd = 15) => {
    setTimerState((prev) => {
      if (prev.status === 'idle') return prev;
      const newTotal = prev.totalSeconds + secondsToAdd;
      const newRemaining = prev.remainingSeconds + secondsToAdd;
      const newEndAt = prev.endAt + secondsToAdd * 1000;

      const nextState: RestTimerState = {
        ...prev,
        totalSeconds: newTotal,
        remainingSeconds: newRemaining,
        endAt: newEndAt,
        status: prev.status === 'completed' ? 'running' : prev.status,
      };
      persistTimerState(nextState);
      return nextState;
    });
  }, []);

  // Subtract 15 seconds
  const subtractTime = useCallback((secondsToSubtract = 15) => {
    setTimerState((prev) => {
      if (prev.status === 'idle') return prev;
      const newRemaining = Math.max(0, prev.remainingSeconds - secondsToSubtract);
      const newEndAt = Date.now() + newRemaining * 1000;

      if (newRemaining <= 0) {
        const completedState: RestTimerState = {
          ...prev,
          remainingSeconds: 0,
          status: 'completed',
        };
        persistTimerState(completedState);
        return completedState;
      }

      const nextState: RestTimerState = {
        ...prev,
        remainingSeconds: newRemaining,
        endAt: newEndAt,
      };
      persistTimerState(nextState);
      return nextState;
    });
  }, []);

  // Skip
  const skipTimer = useCallback(() => {
    setTimerState((prev) => {
      const nextState: RestTimerState = {
        ...prev,
        remainingSeconds: 0,
        status: 'completed',
      };
      persistTimerState(nextState);
      return nextState;
    });
  }, []);

  // Close / Reset
  const resetTimer = useCallback(() => {
    const idleState: RestTimerState = {
      startedAt: 0,
      endAt: 0,
      totalSeconds: 0,
      remainingSeconds: 0,
      status: 'idle',
    };
    persistTimerState(idleState);
    setTimerState(idleState);
  }, []);

  // Format MM:SS
  const formatTime = useCallback((totalSecs: number): string => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  const progressPercent =
    timerState.totalSeconds > 0
      ? Math.min(
          100,
          Math.max(
            0,
            ((timerState.totalSeconds - timerState.remainingSeconds) / timerState.totalSeconds) * 100
          )
        )
      : 0;

  return {
    timerState,
    formattedRemaining: formatTime(timerState.remainingSeconds),
    progressPercent,
    isRunning: timerState.status === 'running',
    isPaused: timerState.status === 'paused',
    isCompleted: timerState.status === 'completed',
    isActive: timerState.status === 'running' || timerState.status === 'paused',
    startTimer,
    pauseTimer,
    resumeTimer,
    addTime,
    subtractTime,
    skipTimer,
    resetTimer,
  };
}
