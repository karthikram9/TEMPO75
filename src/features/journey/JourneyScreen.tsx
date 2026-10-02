import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, CheckCircle2, Dumbbell, Moon, ArrowRight } from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { useMobileHeader } from '@/hooks';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import type { Challenge, ChallengeDay, TrainingPreferences, RecoveryPreferences } from '@/types';
import { getTemplateForDay } from '@/features/workouts/engine/splitGenerator';
import { cn } from '@/lib/utils';

export const JourneyScreen: React.FC = () => {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challengeDays, setChallengeDays] = useState<ChallengeDay[]>([]);
  const [training, setTraining] = useState<TrainingPreferences | null>(null);
  const [recovery, setRecovery] = useState<RecoveryPreferences | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const currentDayNumber = challenge?.currentDayNumber ?? 1;

  useMobileHeader({
    title: '75-DAY JOURNEY',
    subtitle: `DAY ${String(currentDayNumber).padStart(2, '0')} OF 75`,
    showBack: false,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadJourney() {
      try {
        const [savedChallenge, savedDays, savedTraining, savedRecovery] = await Promise.all([
          storage.get<Challenge>(STORAGE_KEYS.ACTIVE_CHALLENGE),
          storage.get<ChallengeDay[]>(STORAGE_KEYS.CHALLENGE_DAYS),
          storage.get<TrainingPreferences>(STORAGE_KEYS.TRAINING_PREFERENCES),
          storage.get<RecoveryPreferences>(STORAGE_KEYS.RECOVERY_PREFERENCES),
        ]);

        if (isMounted) {
          setChallenge(savedChallenge);
          setChallengeDays(savedDays ?? []);
          setTraining(savedTraining);
          setRecovery(savedRecovery);
          setSelectedDay(savedChallenge?.currentDayNumber ?? 1);
        }
      } catch (err) {
        console.error('Failed to load journey data', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadJourney();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const daysList = useMemo(() => {
    const list = [];
    for (let day = 1; day <= 75; day++) {
      const isRest =
        getTemplateForDay(
          day,
          effectiveTraining.daysPerWeek,
          effectiveTraining.preferredSplit,
          effectiveRecovery.restDayPreference
        ) === null;

      const template = isRest
        ? null
        : getTemplateForDay(
            day,
            effectiveTraining.daysPerWeek,
            effectiveTraining.preferredSplit,
            effectiveRecovery.restDayPreference
          );

      const dayRecord = challengeDays.find((d) => d.dayNumber === day);
      const isCompleted = Boolean(dayRecord?.isCompleted || dayRecord?.status === 'completed');
      const isToday = day === currentDayNumber;

      list.push({
        dayNumber: day,
        isRest,
        templateName: template?.name ?? (isRest ? 'Rest & Recovery' : 'Training Day'),
        focus: template?.focus ?? (isRest ? 'Active Recovery & Sleep' : 'Resistance Training'),
        isCompleted,
        isToday,
      });
    }
    return list;
  }, [challengeDays, currentDayNumber, effectiveTraining, effectiveRecovery]);

  const completedCount = useMemo(() => {
    return daysList.filter((d) => d.isCompleted).length;
  }, [daysList]);

  const activeDayDetail = useMemo(() => {
    if (!selectedDay) return null;
    return daysList.find((d) => d.dayNumber === selectedDay) ?? null;
  }, [selectedDay, daysList]);

  if (isLoading) {
    return (
      <PageContainer maxWidth="focused" className="py-6 space-y-6 max-w-5xl">
        <div className="h-28 rounded-3xl bg-surface-base border border-border-subtle animate-pulse p-6" />
        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
          {Array.from({ length: 75 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-surface-subtle animate-pulse" />
          ))}
        </div>
      </PageContainer>
    );
  }

  const progressPercent = Math.min(100, Math.round((completedCount / 75) * 100));

  return (
    <PageContainer maxWidth="focused" className="py-4 md:py-8 space-y-6 max-w-5xl">
      {/* 1. Journey Progress Overview Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-base border border-border-subtle shadow-daylight flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-text-primary text-2xs font-mono font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-accent-text" />
            <span>75-Day Transformation Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary uppercase tracking-tight">
            Day {String(currentDayNumber).padStart(2, '0')} of 75
          </h1>
          <p className="text-sm text-text-secondary">
            {completedCount} of 75 days logged ({progressPercent}% completed) •{' '}
            {75 - completedCount} days remaining
          </p>
        </div>

        {/* Progress Bar & Stat Capsule */}
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-xs font-mono font-bold text-text-muted">
            <span>PROGRESS</span>
            <span className="text-text-primary">{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-surface-subtle overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Selected Day Detail Drawer / Card */}
      {activeDayDetail && (
        <div className="p-5 sm:p-6 rounded-3xl bg-surface-base border-2 border-border shadow-daylight transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-surface-subtle border border-border-subtle text-text-secondary">
                DAY {String(activeDayDetail.dayNumber).padStart(2, '0')}
              </span>
              {activeDayDetail.isToday && (
                <span className="text-2xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-accent text-text-primary uppercase tracking-wider">
                  TODAY
                </span>
              )}
              {activeDayDetail.isCompleted && (
                <span className="text-2xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  COMPLETED
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              {activeDayDetail.isRest ? (
                <Moon className="w-4 h-4 text-sky-500" />
              ) : (
                <Dumbbell className="w-4 h-4 text-accent-text" />
              )}
              <span>{activeDayDetail.templateName}</span>
            </h3>
            <p className="text-xs text-text-secondary font-mono">
              Focus: {activeDayDetail.focus}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate(`/workout?day=${activeDayDetail.dayNumber}`)}
              className="flex-1 sm:flex-none min-h-[44px] px-5 rounded-full bg-surface-subtle hover:bg-surface-elevated border border-border text-xs font-mono font-bold text-text-primary transition-all flex items-center justify-center gap-2"
            >
              <span>View Overview</span>
            </button>
            {!activeDayDetail.isRest && (
              <button
                type="button"
                onClick={() =>
                  navigate(`/workout?day=${activeDayDetail.dayNumber}&start=true`)
                }
                className="flex-1 sm:flex-none min-h-[44px] px-5 rounded-full bg-accent hover:opacity-90 text-text-primary text-xs font-mono font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-subtle active:scale-95"
              >
                <span>{activeDayDetail.isCompleted ? 'Review Workout' : 'Start Workout'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. The 75-Day Microcycle Grid */}
      <div className="p-6 rounded-3xl bg-surface-base border border-border-subtle shadow-daylight space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
            All 75 Days Microcycle Timeline
          </div>
          <div className="flex items-center gap-4 text-2xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Done
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent border border-black/20" /> Today
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-200" /> Rest
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2 sm:gap-2.5 pt-2">
          {daysList.map((item) => {
            const isSelected = selectedDay === item.dayNumber;

            return (
              <button
                key={item.dayNumber}
                type="button"
                onClick={() => setSelectedDay(item.dayNumber)}
                className={cn(
                  'relative flex flex-col items-center justify-center p-2 rounded-2xl border text-center transition-all duration-150 min-h-[64px] group focus:outline-none focus:ring-2 focus:ring-accent',
                  isSelected
                    ? 'ring-2 ring-text-primary border-transparent shadow-daylight'
                    : 'hover:border-border hover:bg-surface-elevated',
                  item.isToday
                    ? 'bg-accent/15 border-accent text-text-primary font-black'
                    : item.isCompleted
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-bold'
                    : item.isRest
                    ? 'bg-sky-50/40 border-sky-100 text-sky-900'
                    : 'bg-surface-subtle/50 border-border-subtle text-text-secondary'
                )}
              >
                <span className="text-xs font-mono font-bold tracking-tight">
                  D{String(item.dayNumber).padStart(2, '0')}
                </span>

                <span className="text-[10px] truncate max-w-full px-1 text-text-muted font-sans mt-0.5">
                  {item.isRest ? 'Rest' : item.templateName.split(' ')[0]}
                </span>

                {item.isCompleted && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 absolute top-1.5 right-1.5" />
                )}
                {item.isToday && !item.isCompleted && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent absolute top-1.5 right-1.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};