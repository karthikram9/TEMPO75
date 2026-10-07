import React, { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ChallengeDay, WorkoutSession } from '@/types';

interface WeeklyTrainingCardProps {
  sessions: WorkoutSession[];
  challengeDays: ChallengeDay[];
  daysPerWeekTarget?: number;
  className?: string;
}

interface DayBarData {
  dayLabel: string;
  isCompleted: boolean;
  isToday: boolean;
  dateKey: string;
}

export const WeeklyTrainingCard: React.FC<WeeklyTrainingCardProps> = ({
  sessions,
  challengeDays,
  daysPerWeekTarget = 6,
  className = '',
}) => {
  // Resolve the 7 days of the current week (Monday through Sunday)
  const weekDays = useMemo<DayBarData[]>(() => {
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
    // Calculate Monday of current week
    const distanceToMonday = (currentDayOfWeek + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const days: DayBarData[] = [];

    // Map of completed dates from sessions
    const completedDateSet = new Set<string>();
    for (const session of sessions) {
      if (session.status === 'completed') {
        const timeVal = session.completedAt || session.startedAt;
        if (timeVal) {
          const dateStr = new Date(timeVal).toISOString().split('T')[0];
          if (dateStr) completedDateSet.add(dateStr);
        }
      }
    }

    // Also include completed challenge days
    for (const cDay of challengeDays) {
      if (cDay.status === 'completed' && cDay.date) {
        const dStr = cDay.date.split('T')[0];
        if (dStr) completedDateSet.add(dStr);
      }
    }

    const todayStr = now.toISOString().split('T')[0] ?? '';

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      const dateKey = dayDate.toISOString().split('T')[0] ?? `day-${i}`;
      const isCompleted = completedDateSet.has(dateKey);
      const isToday = dateKey === todayStr;

      days.push({
        dayLabel: labels[i] ?? '',
        isCompleted,
        isToday,
        dateKey,
      });
    }

    return days;
  }, [sessions, challengeDays]);

  // Calculate weekly completed count
  const completedWeeklyCount = useMemo(() => {
    return weekDays.filter((d) => d.isCompleted).length;
  }, [weekDays]);

  const targetCount = Math.max(1, daysPerWeekTarget);

  const consistencyPercent = useMemo(() => {
    return Math.min(100, Math.round((completedWeeklyCount / targetCount) * 100));
  }, [completedWeeklyCount, targetCount]);

  // Calculate current streak
  const currentStreak = useMemo(() => {
    let streak = 0;
    // Walk backwards through challengeDays
    const sortedDays = [...challengeDays].sort((a, b) => b.dayNumber - a.dayNumber);
    for (const d of sortedDays) {
      if (d.status === 'completed') {
        streak++;
      } else if (d.status === 'missed') {
        break;
      }
    }
    // If sessions exist but challengeDays is empty, count recent daily sessions
    if (streak === 0 && sessions.length > 0) {
      streak = completedWeeklyCount;
    }
    return streak;
  }, [challengeDays, sessions, completedWeeklyCount]);

  return (
    <section
      aria-labelledby="weekly-training-title"
      className={`rounded-3xl bg-white border border-[#E6EAE2] p-6 sm:p-7 shadow-sm flex flex-col justify-between min-h-[290px] ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2
            id="weekly-training-title"
            className="text-sm sm:text-base font-extrabold uppercase text-[#141815] tracking-wide"
          >
            WEEKLY TRAINING
          </h2>
          <span className="block text-xs text-[#6E7A72] mt-0.5 font-medium">
            Workout consistency
          </span>
        </div>

        {/* This Week dropdown pill */}
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F0F2ED] border border-[#E2E6DE] text-[#48544D] text-xs font-semibold select-none">
          <span>This Week</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#6E7A72]" />
        </span>
      </div>

      {/* Center 7-Day Consistency Bar Chart */}
      <div className="my-5 flex items-end justify-between gap-2 px-2 sm:px-4">
        {weekDays.map((day) => (
          <div key={day.dateKey} className="flex flex-col items-center flex-1">
            <div className="h-24 sm:h-28 flex items-end justify-center w-full">
              <div
                className={`w-3.5 sm:w-4.5 rounded-full transition-all duration-300 ${
                  day.isCompleted
                    ? 'bg-[#1A382B] h-16 sm:h-20 shadow-sm'
                    : 'bg-[#E4E7E1] h-8 sm:h-10'
                }`}
                aria-label={`${day.dayLabel}: ${day.isCompleted ? 'Completed' : 'Not completed'}`}
              />
            </div>
            <span
              className={`text-xs font-semibold mt-2.5 ${
                day.isToday ? 'text-[#1A382B] font-bold' : 'text-[#6E7A72]'
              }`}
            >
              {day.dayLabel}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Metrics Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-[#F0F2ED] text-center sm:text-left">
        {/* Metric 1 */}
        <div>
          <span className="block text-lg sm:text-xl font-black text-[#141815] leading-none">
            {completedWeeklyCount} / {targetCount}
          </span>
          <span className="block text-2xs sm:text-xs text-[#6E7A72] truncate mt-1">
            Workouts Completed
          </span>
        </div>

        {/* Metric 2 */}
        <div>
          <span className="block text-lg sm:text-xl font-black text-[#141815] leading-none">
            {consistencyPercent}%
          </span>
          <span className="block text-2xs sm:text-xs text-[#6E7A72] truncate mt-1">
            Consistency
          </span>
        </div>

        {/* Metric 3 */}
        <div>
          <span className="block text-lg sm:text-xl font-black text-[#141815] leading-none">
            {currentStreak}
          </span>
          <span className="block text-2xs sm:text-xs text-[#6E7A72] truncate mt-1">
            Current Streak
          </span>
        </div>
      </div>
    </section>
  );
};
