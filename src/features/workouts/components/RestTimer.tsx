import React from 'react';
import type { RestTimerState } from '@/types';

interface RestTimerProps {
  timerState: RestTimerState;
  formattedRemaining: string;
  progressPercent: number;
  onPause: () => void;
  onResume: () => void;
  onAddTime: () => void;
  onSubtractTime: () => void;
  onSkip: () => void;
  className?: string;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  timerState,
  formattedRemaining,
  progressPercent,
  onPause,
  onResume,
  onAddTime,
  onSubtractTime,
  onSkip,
  className = '',
}) => {
  if (timerState.status === 'idle') {
    return null;
  }

  const isCompleted = timerState.status === 'completed';
  const isPaused = timerState.status === 'paused';

  return (
    <aside
      role="complementary"
      aria-label="Workout Rest Timer"
      className={`fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-40 bg-surface-primary/95 border ${
        isCompleted
          ? 'border-emerald-500 shadow-[0_8px_30px_rgba(16,185,129,0.2)]'
          : 'border-border-primary shadow-xl'
      } rounded-2xl p-4 backdrop-blur-md transition-all duration-200 ${className}`}
    >
      {/* Progress Bar Background */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-border-secondary rounded-t-2xl overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isCompleted ? 'bg-emerald-600' : 'bg-accent'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        {/* Left: Timer Display */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isCompleted
                  ? 'bg-emerald-600 animate-ping'
                  : isPaused
                  ? 'bg-amber-500'
                  : 'bg-accent ring-2 ring-accent/30 animate-pulse'
              }`}
              aria-hidden="true"
            />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-tertiary">
              {isCompleted ? 'REST COMPLETE' : isPaused ? 'REST PAUSED' : 'REST INTERVAL'}
            </span>
          </div>

          <span
            className={`text-2xl sm:text-3xl font-mono font-black tracking-tight ${
              isCompleted ? 'text-emerald-700' : 'text-text-primary'
            }`}
          >
            {formattedRemaining}
          </span>

          {timerState.exerciseName && (
            <span className="text-[11px] text-text-secondary truncate max-w-[160px] font-medium">
              {timerState.exerciseName}
            </span>
          )}
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5">
          {!isCompleted && (
            <>
              <button
                type="button"
                onClick={onSubtractTime}
                className="min-h-[40px] px-2.5 py-1.5 rounded-xl bg-surface-secondary hover:bg-surface-tertiary text-text-secondary font-mono text-xs font-semibold border border-border-primary active:scale-95 transition-colors"
                title="Subtract 15 seconds"
                aria-label="Subtract 15 seconds"
              >
                -15s
              </button>

              <button
                type="button"
                onClick={isPaused ? onResume : onPause}
                className={`min-h-[40px] px-3 py-1.5 rounded-xl font-mono text-xs font-bold active:scale-95 transition-colors border ${
                  isPaused
                    ? 'bg-accent text-text-primary border-transparent font-black shadow-sm'
                    : 'bg-surface-secondary hover:bg-surface-tertiary text-text-primary border-border-primary'
                }`}
                aria-label={isPaused ? 'Resume rest timer' : 'Pause rest timer'}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>

              <button
                type="button"
                onClick={onAddTime}
                className="min-h-[40px] px-2.5 py-1.5 rounded-xl bg-surface-secondary hover:bg-surface-tertiary text-text-secondary font-mono text-xs font-semibold border border-border-primary active:scale-95 transition-colors"
                title="Add 15 seconds"
                aria-label="Add 15 seconds"
              >
                +15s
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onSkip}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider active:scale-95 transition-colors border ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent font-black shadow-sm'
                : 'bg-surface-secondary hover:bg-surface-tertiary text-text-secondary border-border-primary'
            }`}
          >
            {isCompleted ? 'Ready' : 'Skip'}
          </button>
        </div>
      </div>
    </aside>
  );
};
