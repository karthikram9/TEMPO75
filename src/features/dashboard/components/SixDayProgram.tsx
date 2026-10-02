import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Moon,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';
import type {
  ChallengeDay,
  Goal,
  RecoveryPreferences,
  TrainingPreferences,
  Workout,
  WorkoutSession,
} from '@/types';
import { getTemplateForDay } from '@/features/workouts/engine/splitGenerator';
import { generateWorkout } from '@/features/workouts/engine/workoutGenerator';
import { cn } from '@/lib/utils';

interface SixDayProgramProps {
  currentDayNumber: number;
  challengeDays: ChallengeDay[];
  training: TrainingPreferences | null;
  recovery: RecoveryPreferences | null;
  goal: Goal | null;
  workoutCache?: Record<string, Workout>;
  activeSession?: WorkoutSession | null;
}

export const SixDayProgram: React.FC<SixDayProgramProps> = ({
  currentDayNumber,
  challengeDays,
  training,
  recovery,
  goal,
  workoutCache = {},
  activeSession,
}) => {
  const navigate = useNavigate();

  // Effective training & recovery preferences
  const effectiveTraining = useMemo(() => {
    return (
      training ?? {
        experienceLevel: 'intermediate' as const,
        daysPerWeek: 6,
        sessionDurationMinutes: 60,
        availableEquipment: ['full_gym' as const],
        preferredSplit: 'ppl' as const,
        updatedAt: new Date().toISOString(),
      }
    );
  }, [training]);

  const effectiveRecovery = useMemo(() => {
    return (
      recovery ?? {
        sleepTargetHours: 8,
        stressBaseline: 'moderate' as const,
        recoveryPriority: 'balanced' as const,
        restDayPreference: 'sunday' as const,
        enableReadinessTracking: false,
        updatedAt: new Date().toISOString(),
      }
    );
  }, [recovery]);

  // Determine current 6-day cycle block (e.g. cycle 0 = Days 1..6, cycle 1 = Days 7..12)
  const initialCycleIndex = Math.floor((currentDayNumber - 1) / 6);
  const [cycleIndex, setCycleIndex] = useState<number>(initialCycleIndex);

  // Default expanded item: if current day is in this cycle, expand current day; else first day in cycle
  const [expandedDay, setExpandedDay] = useState<number | null>(() => {
    return currentDayNumber;
  });

  const startDay = Math.min(70, Math.max(1, cycleIndex * 6 + 1));
  const endDay = Math.min(75, startDay + 5);

  const cycleDays = useMemo(() => {
    const days: number[] = [];
    for (let d = startDay; d <= endDay; d++) {
      days.push(d);
    }
    return days;
  }, [startDay, endDay]);

  // Resolve workouts for all 6 days deterministically
  const sixDayData = useMemo(() => {
    return cycleDays.map((dayNum) => {
      const isRest =
        getTemplateForDay(
          dayNum,
          effectiveTraining.daysPerWeek,
          effectiveTraining.preferredSplit,
          effectiveRecovery.restDayPreference
        ) === null;

      const template = isRest
        ? null
        : getTemplateForDay(
            dayNum,
            effectiveTraining.daysPerWeek,
            effectiveTraining.preferredSplit,
            effectiveRecovery.restDayPreference
          );

      // Check cache or generate
      const cacheKey = String(dayNum);
      const cached = workoutCache[cacheKey] || workoutCache[`workout_day_${dayNum}`];
      const workout: Workout | null = isRest
        ? null
        : cached ??
          generateWorkout({
            challengeDayNumber: dayNum,
            trainingPreferences: effectiveTraining,
            recoveryPreferences: effectiveRecovery,
            goal: goal ?? null,
            status: dayNum < currentDayNumber ? 'completed' : dayNum === currentDayNumber ? 'active' : 'upcoming',
          });

      const dayRecord = challengeDays.find((d) => d.dayNumber === dayNum);
      const isCompleted = Boolean(dayRecord?.isCompleted || dayRecord?.status === 'completed');
      const isToday = dayNum === currentDayNumber;
      const hasActiveSession = Boolean(activeSession && activeSession.challengeDayNumber === dayNum);

      return {
        dayNumber: dayNum,
        isRest,
        template,
        workout,
        isCompleted,
        isToday,
        hasActiveSession,
      };
    });
  }, [
    cycleDays,
    effectiveTraining,
    effectiveRecovery,
    workoutCache,
    goal,
    currentDayNumber,
    challengeDays,
    activeSession,
  ]);

  const splitLabel = useMemo(() => {
    switch (effectiveTraining.preferredSplit) {
      case 'ppl':
        return 'Push • Pull • Legs Split';
      case 'upper_lower':
        return 'Upper • Lower Split';
      case 'full_body':
        return 'Full Body Conditioning';
      default:
        return 'Dynamic Microcycle';
    }
  }, [effectiveTraining.preferredSplit]);

  const maxCycles = Math.ceil(75 / 6);

  return (
    <section
      aria-label="6-Day Training Program"
      className="rounded-3xl border border-border-subtle bg-surface-base shadow-daylight p-5 sm:p-6 space-y-4"
    >
      {/* Header with Title and Cycle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-text-primary">
              {splitLabel}
            </span>
            <span className="text-2xs font-mono text-text-muted">
              {effectiveTraining.daysPerWeek} DAYS / WEEK
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-text-primary uppercase tracking-tight flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-accent-text" />
            <span>YOUR 6-DAY TRAINING</span>
          </h2>
        </div>

        {/* Cycle Navigator */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            disabled={cycleIndex === 0}
            onClick={() => {
              setCycleIndex((prev) => Math.max(0, prev - 1));
              setExpandedDay(null);
            }}
            className="p-1.5 rounded-full bg-surface-subtle hover:bg-surface-elevated border border-border-subtle text-text-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Previous microcycle"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-text-secondary px-2">
            Days {String(startDay).padStart(2, '0')}–{String(endDay).padStart(2, '0')}
          </span>
          <button
            type="button"
            disabled={cycleIndex >= maxCycles - 1}
            onClick={() => {
              setCycleIndex((prev) => Math.min(maxCycles - 1, prev + 1));
              setExpandedDay(null);
            }}
            className="p-1.5 rounded-full bg-surface-subtle hover:bg-surface-elevated border border-border-subtle text-text-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Next microcycle"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6-Day Accordion List */}
      <div className="space-y-2.5">
        {sixDayData.map((item) => {
          const isExpanded = expandedDay === item.dayNumber;
          const workoutName = item.workout?.name ?? item.template?.name ?? (item.isRest ? 'Rest & Recovery' : 'Training');
          const focusText = item.workout?.focus ?? item.template?.focus ?? (item.isRest ? 'Active Recovery & Tissue Repair' : 'Hypertrophy');
          const muscleGroups = item.workout?.targetMuscleGroups ?? item.template?.targetMuscleGroups ?? [];
          const exerciseCount = item.workout?.exercises.length ?? 0;
          const totalSets = item.workout?.exercises.reduce((acc, ex) => acc + ex.targetSets, 0) ?? 0;

          return (
            <div
              key={item.dayNumber}
              className={cn(
                'rounded-2xl border transition-all duration-200 overflow-hidden',
                item.isToday
                  ? 'border-accent/80 bg-accent/5 shadow-subtle'
                  : item.isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : item.isRest
                  ? 'border-sky-100 bg-sky-50/20'
                  : 'border-border-subtle bg-surface-base hover:bg-surface-subtle/50'
              )}
            >
              {/* Accordion Row Header Button */}
              <button
                type="button"
                onClick={() => setExpandedDay(isExpanded ? null : item.dayNumber)}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Day Number Pill */}
                  <div
                    className={cn(
                      'shrink-0 px-2.5 py-1 rounded-xl text-xs font-mono font-black flex items-center gap-1 border',
                      item.isToday
                        ? 'bg-accent text-text-primary border-black/20 shadow-pill'
                        : item.isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : item.isRest
                        ? 'bg-sky-100 text-sky-800 border-sky-200'
                        : 'bg-surface-subtle text-text-secondary border-border-subtle'
                    )}
                  >
                    <span>DAY {String(item.dayNumber).padStart(2, '0')}</span>
                  </div>

                  {/* Title & Focus */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-text-primary truncate">
                        {workoutName}
                      </span>
                      {item.isToday && (
                        <span className="shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-accent text-text-primary uppercase tracking-wider">
                          TODAY
                        </span>
                      )}
                      {item.isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-text-secondary truncate font-mono">
                      {focusText}
                    </div>
                  </div>
                </div>

                {/* Right Status / Expand Toggle */}
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {!item.isRest && exerciseCount > 0 && (
                    <span className="hidden sm:inline-block text-2xs font-mono text-text-muted">
                      {exerciseCount} movements • {totalSets} sets
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-text-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  )}
                </div>
              </button>

              {/* Accordion Expanded Detail View */}
              {isExpanded && (
                <div className="px-3.5 sm:px-4 pb-4 pt-1 border-t border-border-subtle/80 space-y-4">
                  {/* Target Muscle Badges */}
                  {muscleGroups.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-2">
                      <span className="text-2xs font-mono font-bold text-text-muted uppercase">
                        TARGETS:
                      </span>
                      {muscleGroups.map((group) => (
                        <span
                          key={group}
                          className="px-2 py-0.5 rounded-md bg-surface-subtle border border-border-subtle text-2xs font-mono text-text-secondary font-medium"
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Content: Rest Day or Exercises List */}
                  {item.isRest ? (
                    <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/80 flex items-start gap-3">
                      <Moon className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-sky-950 uppercase tracking-wide">
                          Scheduled Recovery Day
                        </div>
                        <p className="text-xs text-sky-900 leading-relaxed">
                          Your protocol programs recovery as an active driver of muscular adaptation. Prioritize {effectiveRecovery.sleepTargetHours} hours of sleep, light mobility, and hydration today.
                        </p>
                      </div>
                    </div>
                  ) : item.workout && item.workout.exercises.length > 0 ? (
                    <div className="space-y-2">
                      <div className="text-2xs font-mono font-bold uppercase tracking-wider text-text-muted">
                        Prescribed Exercise Sequence
                      </div>
                      <div className="space-y-1.5">
                        {item.workout.exercises.map((ex, idx) => (
                          <div
                            key={ex.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-surface-subtle/60 border border-border-subtle/60 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-surface-base border border-border-subtle text-2xs font-mono font-bold text-text-muted flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-text-primary truncate">
                                {ex.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 font-mono text-2xs text-text-secondary">
                              <span className="px-2 py-0.5 rounded bg-surface-base border border-border-subtle font-semibold">
                                {ex.targetSets} sets × {ex.prescribedRepRange[0]}–{ex.prescribedRepRange[1]} reps
                              </span>
                              <span className="hidden sm:inline px-2 py-0.5 rounded bg-surface-base border border-border-subtle text-text-muted">
                                {ex.restSeconds}s rest
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Inside CTA: START WORKOUT */}
                      <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => navigate(`/workout?day=${item.dayNumber}`)}
                          className="min-h-[42px] px-4 rounded-full bg-surface-subtle hover:bg-surface-elevated border border-border text-xs font-mono font-bold text-text-secondary hover:text-text-primary transition-all"
                        >
                          Overview
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/workout?day=${item.dayNumber}&start=true`)}
                          className="min-h-[42px] px-6 rounded-full bg-accent hover:opacity-90 text-text-primary font-mono text-xs font-black uppercase tracking-wider shadow-pill transition-all active:scale-95 flex items-center gap-2"
                        >
                          <span>
                            {item.hasActiveSession
                              ? 'RESUME WORKOUT'
                              : item.isCompleted
                              ? 'REVIEW WORKOUT'
                              : 'START WORKOUT'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

