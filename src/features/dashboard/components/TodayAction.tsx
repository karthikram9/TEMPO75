import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Moon, Play } from 'lucide-react';
import type { ActivityPreferences, RecoveryPreferences, Workout, WorkoutSession } from '@/types';
import { MuscleTag } from '@/features/workouts/components/MuscleTag';

interface TodayActionProps {
  workout: Workout | null;
  activeSession: WorkoutSession | null;
  completedSession: WorkoutSession | null;
  isTodayCompleted: boolean;
  isTodayRestDay: boolean;
  recovery?: RecoveryPreferences | null;
  activity?: ActivityPreferences | null;
  className?: string;
}

export const TodayAction: React.FC<TodayActionProps> = ({
  workout,
  activeSession,
  completedSession,
  isTodayCompleted,
  isTodayRestDay,
  recovery,
  activity,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    navigate('/workout');
  };

  // 1. Case: Rest Day
  if (isTodayRestDay) {
    const sleepHours = recovery?.sleepTargetHours ?? 8;
    const stepTarget = activity?.dailyStepTarget ? `${activity.dailyStepTarget.toLocaleString()} steps` : 'light walking';

    return (
      <section
        aria-labelledby="today-action-title"
        className={`relative overflow-hidden rounded-3xl bg-sky-50/60 border border-sky-200/70 p-6 sm:p-8 shadow-subtle ${className}`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-900 text-xs font-mono font-bold uppercase tracking-wider">
              <Moon className="w-3.5 h-3.5" />
              REST & RECOVERY DAY
            </span>
            <span className="text-xs font-mono text-text-muted">ACTIVE PROTOCOL</span>
          </div>

          <div>
            <h2 id="today-action-title" className="text-2xl sm:text-3xl font-black text-text-primary uppercase tracking-tight">
              Rebuild & Restore
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mt-2 max-w-xl">
              No resistance training scheduled today. Prioritize your {sleepHours}h sleep target, {stepTarget} floor, and optimal hydration to prepare for your next training session.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleAction}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-full bg-white hover:bg-neutral-50 active:scale-[0.98] border border-border text-text-primary font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-subtle transition-all cursor-pointer"
            >
              <span>Preview Next Workout</span>
              <ArrowRight className="w-4 h-4 text-text-muted" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 2. Case: Workout Completed Today
  if (isTodayCompleted || completedSession) {
    const totalVolume = completedSession?.totalVolumeKg ? `${completedSession.totalVolumeKg.toLocaleString()} kg` : 'Recorded';
    const duration = completedSession?.totalDurationSeconds
      ? `~${Math.round(completedSession.totalDurationSeconds / 60)} MIN`
      : 'Completed';
    const exerciseCount = completedSession?.exercises?.length ?? workout?.exercises?.length ?? 0;

    return (
      <section
        aria-labelledby="today-action-title"
        className={`relative overflow-hidden rounded-3xl bg-emerald-50/50 border border-emerald-200/80 p-6 sm:p-8 shadow-subtle ${className}`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-mono font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              WORKOUT COMPLETED
            </span>
            <span className="text-xs font-mono text-text-muted">TODAY'S TARGET MET</span>
          </div>

          <div>
            <h2 id="today-action-title" className="text-2xl sm:text-3xl font-black text-text-primary uppercase tracking-tight">
              {workout?.name ?? 'Training Session'} Finished
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Outstanding consistency. Your training volume and sets have been logged and synced into your 75-day transformation protocol.
            </p>
          </div>

          {/* Open Typographic Telemetry Metrics (No nested cards) */}
          <div className="flex items-center gap-6 sm:gap-10 pt-3 pb-2 border-t border-b border-emerald-200/60 font-mono">
            <div>
              <span className="block text-[11px] uppercase font-bold tracking-wider text-emerald-800">Duration</span>
              <span className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">{duration}</span>
            </div>
            <div className="w-px h-8 bg-emerald-200/60" aria-hidden="true" />
            <div>
              <span className="block text-[11px] uppercase font-bold tracking-wider text-emerald-800">Exercises</span>
              <span className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">{exerciseCount}</span>
            </div>
            <div className="w-px h-8 bg-emerald-200/60" aria-hidden="true" />
            <div>
              <span className="block text-[11px] uppercase font-bold tracking-wider text-emerald-800">Volume</span>
              <span className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">{totalVolume}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleAction}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-full bg-white hover:bg-neutral-50 active:scale-[0.98] border border-border text-text-primary font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-subtle transition-all cursor-pointer"
            >
              <span>View Session Summary</span>
              <ArrowRight className="w-4 h-4 text-text-muted" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 3. Case: Active In-Progress Session
  if (activeSession) {
    const completedSetsCount = activeSession.exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
      0
    );
    const totalSetsCount = activeSession.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

    return (
      <section
        aria-labelledby="today-action-title"
        className={`relative overflow-hidden rounded-3xl bg-white border-2 border-accent p-6 sm:p-8 shadow-daylight ${className}`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-text-primary font-mono text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-text-primary animate-pulse" aria-hidden="true" />
              IN PROGRESS
            </span>
            <span className="text-xs font-mono text-text-muted font-bold">
              {completedSetsCount} / {totalSetsCount} Sets Completed
            </span>
          </div>

          <div>
            <h2 id="today-action-title" className="text-2xl sm:text-3xl font-black text-text-primary uppercase tracking-tight">
              {activeSession.title}
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              You have an active workout in progress. Tap below to resume immediately where you left off.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleAction}
              className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-full bg-accent hover:bg-accent-hover active:bg-accent-active text-text-primary font-mono text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-pill transition-all active:scale-[0.98] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Workout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 4. Case: Standard Scheduled Workout (Not Started)
  const totalSets = workout?.exercises?.reduce((acc, ex) => acc + ex.targetSets, 0) ?? 18;
  const exerciseCount = workout?.exercises?.length ?? 6;
  const durationMinutes = workout?.estimatedDurationMinutes ?? 60;

  return (
    <section
      aria-labelledby="today-action-title"
      className={`relative overflow-hidden rounded-3xl bg-white border border-border p-6 sm:p-8 shadow-daylight hover:border-neutral-300 transition-all ${className}`}
    >
      <div className="flex flex-col gap-5">
        {/* Top Tag & Focus */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-primary bg-surface-subtle px-3 py-1 rounded-full border border-border">
              TODAY'S TRAINING
            </span>
            <span className="text-xs font-mono text-text-muted">
              {workout?.focus ?? 'Strength • Hypertrophy'}
            </span>
          </div>

          <span className="text-[11px] font-mono text-text-muted font-bold">
            EST. ~{durationMinutes} MIN
          </span>
        </div>

        {/* Workout Name Title */}
        <div>
          <h2 id="today-action-title" className="text-2xl sm:text-3xl font-black text-text-primary uppercase tracking-tight">
            {workout?.name ?? 'Scheduled Training'}
          </h2>

          {/* Muscle Tags */}
          {workout?.targetMuscleGroups && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2.5">
              {workout.targetMuscleGroups.map((muscle) => (
                <MuscleTag key={muscle} muscle={muscle} />
              ))}
            </div>
          )}
        </div>

        {/* Open Typographic Telemetry Metrics (No nested cards) */}
        <div className="flex items-center gap-6 sm:gap-10 pt-3 pb-3 border-t border-b border-border/70 font-mono">
          <div>
            <span className="block text-[11px] uppercase font-bold tracking-wider text-text-muted">Exercises</span>
            <span className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">{exerciseCount}</span>
          </div>
          <div className="w-px h-8 bg-border" aria-hidden="true" />
          <div>
            <span className="block text-[11px] uppercase font-bold tracking-wider text-text-muted">Target Sets</span>
            <span className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">{totalSets}</span>
          </div>
          <div className="w-px h-8 bg-border" aria-hidden="true" />
          <div>
            <span className="block text-[11px] uppercase font-bold tracking-wider text-text-muted">Duration</span>
            <span className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">~{durationMinutes}m</span>
          </div>
        </div>

        {/* Primary Decisive Action CTA */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleAction}
            className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-full bg-accent hover:bg-accent-hover active:bg-accent-active text-text-primary font-mono text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-pill transition-all active:scale-[0.98] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Workout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
