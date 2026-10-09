import React from 'react';
import type { RestTimerState } from '@/types';

interface RestTimerProps {
  timerState: RestTimerState;
  formattedRemaining: string;
  progressPercent: number;
  onPause?: () => void;
  onResume?: () => void;
  onAddTime?: () => void;
  onSubtractTime?: () => void;
  onSkip: () => void;
  onReady?: () => void;
  className?: string;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  timerState,
  formattedRemaining,
  onPause,
  onResume,
  onSkip,
  onReady,
  className = '',
}) => {
  if (timerState.status === 'idle') {
    return null;
  }

  const isCompleted = timerState.status === 'completed';
  const isPaused = timerState.status === 'paused';

  // SVG dimensions: viewBox 0 0 88 88, center cx=44 cy=44, radius r=38
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.761

  // Ring progressively decreases as timer counts down
  // At start: fractionRemaining = 1 -> offset = 0 (full ring)
  // At end: fractionRemaining = 0 -> offset = circumference (depleted ring)
  const fractionRemaining =
    timerState.totalSeconds > 0
      ? Math.max(0, Math.min(1, timerState.remainingSeconds / timerState.totalSeconds))
      : 0;

  const strokeDashoffset = isCompleted ? 0 : circumference * (1 - fractionRemaining);

  const handleAction = () => {
    if (isCompleted) {
      if (onReady) {
        onReady();
      } else {
        onSkip();
      }
    } else if (isPaused) {
      onResume?.();
    } else {
      onPause?.();
    }
  };

  const handleReadyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReady) {
      onReady();
    } else {
      onSkip();
    }
  };

  const handleSkipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSkip();
  };

  return (
    <div
      role="complementary"
      aria-label="Workout Rest Timer"
      className={`fixed right-4 sm:right-6 z-40 select-none ${className}`}
      style={{ bottom: 'max(1.25rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))' }}
    >
      <div className="relative group flex items-center justify-center">
        {/* Skip '✕' Dismiss Button during active countdown */}
        {!isCompleted && (
          <button
            type="button"
            onClick={handleSkipClick}
            className="absolute -top-1 -right-1 z-50 w-6 h-6 rounded-full bg-[#181D1A] hover:bg-[#232B25] text-[#8E9A92] hover:text-white border border-[#2D3A31] flex items-center justify-center text-[11px] font-bold shadow-md cursor-pointer transition-transform active:scale-90"
            title="Skip Rest"
            aria-label="Skip Rest"
          >
            ✕
          </button>
        )}

        {/* Circular Floating Timer Surface */}
        <button
          type="button"
          onClick={isCompleted ? handleReadyClick : handleAction}
          aria-label={
            isCompleted
              ? 'Rest complete. Click READY to log next set'
              : isPaused
              ? 'Rest paused. Click to resume'
              : 'Rest interval running. Click to pause'
          }
          className={`relative w-[88px] h-[88px] sm:w-[92px] sm:h-[92px] rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#58A672]/50 ${
            isCompleted
              ? 'bg-[#1A382B] border-2 border-[#3D6B52] shadow-[0_10px_30px_rgba(26,56,43,0.5)] animate-pulse'
              : 'bg-[#151816] border-2 border-[#27322A] shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
          }`}
        >
          {/* SVG Circular Progress Ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1"
            viewBox="0 0 88 88"
          >
            {/* Background Track */}
            <circle
              cx="44"
              cy="44"
              r={radius}
              fill="none"
              stroke={isCompleted ? '#234A38' : '#222B24'}
              strokeWidth="4"
            />
            {/* Decreasing Countdown Progress Ring */}
            <circle
              cx="44"
              cy="44"
              r={radius}
              fill="none"
              stroke={isCompleted ? '#58A672' : isPaused ? '#D97706' : '#4E9665'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-[stroke-dashoffset] duration-300 ease-linear"
            />
          </svg>

          {/* Central Time and Status Typography */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-1">
            {isCompleted ? (
              <>
                <span className="text-[10px] font-mono font-bold tracking-tight text-[#A2B8A0] leading-none mb-1 tabular-nums">
                  00:00
                </span>
                <span className="text-xs sm:text-sm font-mono font-black text-white uppercase tracking-wider leading-none">
                  READY
                </span>
              </>
            ) : (
              <>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#8E9A92] leading-none mb-1">
                  {isPaused ? 'PAUSED' : 'REST'}
                </span>
                <span className="text-base sm:text-lg font-mono font-black text-white leading-none tabular-nums tracking-tight">
                  {formattedRemaining}
                </span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
