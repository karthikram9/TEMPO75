import { useState, useEffect, useRef, useCallback } from 'react';
import type { RestTimerState } from '@/types';

export function useRestTimer() {
  const [timerState, setTimerState] = useState<RestTimerState>({
    startedAt: 0,
    endAt: 0,
    totalSeconds: 0,
    remainingSeconds: 0,
    status: 'idle',
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

        return {
          ...prev,
          remainingSeconds: 0,
          status: 'completed',
        };
      }

      return {
        ...prev,
        remainingSeconds: remaining,
      };
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

  // Handle visibility change (tab backgrounding / screen unlock)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateTimer]);

  // Start new rest countdown
  const startTimer = useCallback((seconds: number, exerciseName?: string) => {
    const validSeconds = Math.max(5, seconds);
    const now = Date.now();
    const endAt = now + validSeconds * 1000;

    setTimerState({
      startedAt: now,
      endAt,
      totalSeconds: validSeconds,
      remainingSeconds: validSeconds,
      status: 'running',
      exerciseName,
    });
  }, []);

  // Pause
  const pauseTimer = useCallback(() => {
    setTimerState((prev) => {
      if (prev.status !== 'running') return prev;
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((prev.endAt - now) / 1000));
      return {
        ...prev,
        status: 'paused',
        pausedAt: now,
        remainingSeconds: remaining,
      };
    });
  }, []);

  // Resume
  const resumeTimer = useCallback(() => {
    setTimerState((prev) => {
      if (prev.status !== 'paused') return prev;
      const now = Date.now();
      const endAt = now + prev.remainingSeconds * 1000;
      return {
        ...prev,
        status: 'running',
        startedAt: now,
        endAt,
      };
    });
  }, []);

  // Add 15 seconds
  const addTime = useCallback((secondsToAdd = 15) => {
    setTimerState((prev) => {
      if (prev.status === 'idle') return prev;
      const newTotal = prev.totalSeconds + secondsToAdd;
      const newRemaining = prev.remainingSeconds + secondsToAdd;
      const newEndAt = prev.endAt + secondsToAdd * 1000;

      return {
        ...prev,
        totalSeconds: newTotal,
        remainingSeconds: newRemaining,
        endAt: newEndAt,
        status: prev.status === 'completed' ? 'running' : prev.status,
      };
    });
  }, []);

  // Subtract 15 seconds
  const subtractTime = useCallback((secondsToSubtract = 15) => {
    setTimerState((prev) => {
      if (prev.status === 'idle') return prev;
      const newRemaining = Math.max(0, prev.remainingSeconds - secondsToSubtract);
      const newEndAt = Date.now() + newRemaining * 1000;

      if (newRemaining <= 0) {
        return {
          ...prev,
          remainingSeconds: 0,
          status: 'completed',
        };
      }

      return {
        ...prev,
        remainingSeconds: newRemaining,
        endAt: newEndAt,
      };
    });
  }, []);

  // Skip
  const skipTimer = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      remainingSeconds: 0,
      status: 'completed',
    }));
  }, []);

  // Close / Reset
  const resetTimer = useCallback(() => {
    setTimerState({
      startedAt: 0,
      endAt: 0,
      totalSeconds: 0,
      remainingSeconds: 0,
      status: 'idle',
    });
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
