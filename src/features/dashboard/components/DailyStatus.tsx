import React from 'react';
import { Dumbbell, Footprints, Utensils, Moon, Flame, CheckCircle2, Clock } from 'lucide-react';
import type {
  ActivityPreferences,
  NutritionTargets,
  RecoveryPreferences,
} from '@/types';

interface DailyStatusProps {
  isTodayCompleted: boolean;
  hasActiveSession: boolean;
  isTodayRestDay: boolean;
  nutrition: NutritionTargets | null;
  activity: ActivityPreferences | null;
  recovery: RecoveryPreferences | null;
}

export const DailyStatus: React.FC<DailyStatusProps> = ({
  isTodayCompleted,
  hasActiveSession,
  isTodayRestDay,
  nutrition,
  activity,
  recovery,
}) => {
  // Determine training status
  const trainingStatus = React.useMemo(() => {
    if (isTodayCompleted) {
      return {
        label: 'Completed',
        subtext: 'Session logged',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50 border-emerald-200',
        icon: CheckCircle2,
      };
    }
    if (hasActiveSession) {
      return {
        label: 'In Progress',
        subtext: 'Active session',
        color: 'text-amber-800',
        bg: 'bg-amber-50 border-amber-200',
        icon: Clock,
      };
    }
    if (isTodayRestDay) {
      return {
        label: 'Rest Day',
        subtext: 'Active recovery',
        color: 'text-blue-700',
        bg: 'bg-blue-50 border-blue-200',
        icon: Moon,
      };
    }
    return {
      label: 'Scheduled',
      subtext: "Today's workout",
      color: 'text-text-primary',
      bg: 'bg-accent/25 border-accent/50',
      icon: Dumbbell,
    };
  }, [isTodayCompleted, hasActiveSession, isTodayRestDay]);

  const TrainingIcon = trainingStatus.icon;

  return (
    <div
      role="region"
      aria-label="Daily Status Floor"
      className="bg-surface-base border border-border-subtle rounded-2xl p-5 md:p-6 shadow-daylight space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
          Daily Discipline Floor
        </h2>
        <span className="text-[11px] font-mono text-text-tertiary">
          TARGETS &amp; READINESS
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* 1. Training Status */}
        <div className="rounded-xl border border-border-subtle/80 bg-surface-subtle/50 p-3.5 flex flex-col justify-between transition-colors hover:border-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              Training
            </span>
            <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${trainingStatus.bg}`}>
              <TrainingIcon className={`w-3.5 h-3.5 ${trainingStatus.color}`} />
            </div>
          </div>
          <div>
            <div className={`text-base font-bold tracking-tight ${trainingStatus.color}`}>
              {trainingStatus.label}
            </div>
            <div className="text-[11px] text-text-tertiary truncate mt-0.5">
              {trainingStatus.subtext}
            </div>
          </div>
        </div>

        {/* 2. Steps Floor */}
        <div className="rounded-xl border border-border-subtle/80 bg-surface-subtle/50 p-3.5 flex flex-col justify-between transition-colors hover:border-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              Step Floor
            </span>
            <div className="w-6 h-6 rounded-md bg-white border border-border-subtle flex items-center justify-center text-text-secondary">
              <Footprints className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            {activity?.dailyStepTarget ? (
              <>
                <div className="text-base font-bold font-mono tabular-nums text-text-primary">
                  — / {activity.dailyStepTarget.toLocaleString()}
                </div>
                <div className="text-[11px] text-text-tertiary truncate mt-0.5">
                  Not logged yet
                </div>
              </>
            ) : (
              <>
                <div className="text-base font-bold font-mono text-text-tertiary">
                  — / Not set
                </div>
                <div className="text-[11px] text-text-tertiary truncate mt-0.5">
                  Target unconfigured
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3. Nutrition Floor */}
        <div className="rounded-xl border border-border-subtle/80 bg-surface-subtle/50 p-3.5 flex flex-col justify-between transition-colors hover:border-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              Nutrition
            </span>
            <div className="w-6 h-6 rounded-md bg-accent/20 border border-accent/40 flex items-center justify-center text-text-primary">
              <Utensils className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            {nutrition?.dailyCalories ? (
              <>
                <div className="text-base font-bold font-mono tabular-nums text-text-primary">
                  {nutrition.dailyCalories.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-text-secondary">kcal</span>
                </div>
                <div className="text-[11px] font-mono text-text-tertiary truncate mt-0.5">
                  {nutrition.proteinGrams ? `${nutrition.proteinGrams}g protein` : 'Target floor'}
                </div>
              </>
            ) : (
              <>
                <div className="text-base font-bold font-mono text-text-tertiary">
                  — / Not set
                </div>
                <div className="text-[11px] text-text-tertiary truncate mt-0.5">
                  Calories unconfigured
                </div>
              </>
            )}
          </div>
        </div>

        {/* 4. Sleep Target */}
        <div className="rounded-xl border border-border-subtle/80 bg-surface-subtle/50 p-3.5 flex flex-col justify-between transition-colors hover:border-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              Sleep Floor
            </span>
            <div className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Moon className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            {recovery?.sleepTargetHours ? (
              <>
                <div className="text-base font-bold font-mono tabular-nums text-text-primary">
                  {recovery.sleepTargetHours}.0{' '}
                  <span className="text-xs font-normal text-text-secondary">hrs</span>
                </div>
                <div className="text-[11px] text-text-tertiary truncate mt-0.5 capitalize">
                  {recovery.recoveryPriority ?? 'Recovery'} floor
                </div>
              </>
            ) : (
              <>
                <div className="text-base font-bold font-mono text-text-tertiary">
                  — / Not set
                </div>
                <div className="text-[11px] text-text-tertiary truncate mt-0.5">
                  Sleep unconfigured
                </div>
              </>
            )}
          </div>
        </div>

        {/* 5. Cardio Target */}
        <div className="col-span-2 sm:col-span-1 rounded-xl border border-border-subtle/80 bg-surface-subtle/50 p-3.5 flex flex-col justify-between transition-colors hover:border-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              Cardio Target
            </span>
            <div className="w-6 h-6 rounded-md bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            {activity?.cardioSessionsPerWeek !== undefined && activity.cardioSessionsPerWeek > 0 ? (
              <>
                <div className="text-base font-bold font-mono tabular-nums text-text-primary">
                  {activity.cardioSessionsPerWeek}x{' '}
                  <span className="text-xs font-normal text-text-secondary">/ week</span>
                </div>
                <div className="text-[11px] text-text-tertiary truncate mt-0.5 capitalize">
                  {activity.cardioDurationMinutes}m {activity.cardioPreference !== 'none' ? activity.cardioPreference : 'cardio'}
                </div>
              </>
            ) : activity?.cardioSessionsPerWeek === 0 ? (
              <>
                <div className="text-base font-bold text-text-primary">
                  Rest / None
                </div>
                <div className="text-[11px] text-text-tertiary truncate mt-0.5">
                  No cardio prescribed
                </div>
              </>
            ) : (
              <>
                <div className="text-base font-bold font-mono text-text-tertiary">
                  — / Not set
                </div>
                <div className="text-[11px] text-text-tertiary truncate mt-0.5">
                  Cardio unconfigured
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
