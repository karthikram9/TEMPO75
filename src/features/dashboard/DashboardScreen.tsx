import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { useMobileHeader } from '@/hooks';
import { useDashboardData } from './hooks/useDashboardData';
import { JourneyHeader } from './components/JourneyHeader';
import { TodayAction } from './components/TodayAction';
import { SixDayProgram } from './components/SixDayProgram';
import { DailyStatus } from './components/DailyStatus';
import { PerformanceSnapshot } from './components/PerformanceSnapshot';
import { TransformationSnapshot } from './components/TransformationSnapshot';
import { WeeklySnapshot } from './components/WeeklySnapshot';
import { QuickActions } from './components/QuickActions';
import { LogWeightModal } from './components/LogWeightModal';

export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isLogWeightOpen, setIsLogWeightOpen] = useState<boolean>(false);

  const {
    isLoading,
    error,
    challenge,
    currentDayNumber,
    challengeDays,
    completedDaysCount,
    isTodayCompleted,
    isTodayRestDay,
    profile,
    goal,
    training,
    nutrition,
    activity,
    recovery,
    todayWorkout,
    workoutCache,
    activeSession,
    todayCompletedSession,
    topProgression,
    weightSnapshot,
    weeklyStats,
    logWeight,
    refetch,
  } = useDashboardData();

  useMobileHeader({
    title: `DAY ${String(currentDayNumber).padStart(2, '0')} OF 75`,
    subtitle: 'COMMAND CENTER',
    showBack: false,
  });

  // Loading skeleton state
  if (isLoading) {
    return (
      <PageContainer maxWidth="focused" className="py-6 space-y-6 max-w-6xl">
        {/* Header skeleton */}
        <div className="rounded-2xl border border-border-subtle bg-surface-base p-5 md:p-6 shadow-daylight space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 bg-surface-subtle rounded-lg animate-pulse" />
            <div className="h-6 w-24 bg-surface-subtle rounded-full animate-pulse" />
          </div>
          <div className="h-10 w-64 bg-surface-subtle rounded-lg animate-pulse" />
          <div className="h-2 w-full bg-surface-subtle rounded-full animate-pulse" />
        </div>

        {/* Hero skeleton */}
        <div className="rounded-3xl border border-border-subtle bg-surface-base p-6 md:p-8 shadow-daylight space-y-5">
          <div className="flex items-center justify-between">
            <div className="h-5 w-28 bg-surface-subtle rounded-full animate-pulse" />
            <div className="h-5 w-20 bg-surface-subtle rounded-full animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-8 w-48 bg-surface-subtle rounded-lg animate-pulse" />
            <div className="h-4 w-36 bg-surface-subtle rounded-lg animate-pulse" />
          </div>
          <div className="h-14 w-full bg-surface-subtle rounded-2xl animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-surface-base border border-border-subtle shadow-daylight p-4 animate-pulse" />
          ))}
        </div>
      </PageContainer>
    );
  }

  // Guard: If protocol is not active or challenge not found, redirect to onboarding
  if (!challenge || challenge.status !== 'active') {
    return <Navigate to="/onboarding" replace />;
  }

  // Primary lift name for progression target
  const primaryExerciseName = todayWorkout?.exercises[0]?.name;

  return (
    <PageContainer maxWidth="focused" className="py-4 md:py-8 space-y-6 max-w-6xl">
      {/* Error banner if present */}
      {error && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 1. Journey Header Banner */}
      <JourneyHeader
        challenge={challenge}
        profile={profile}
        goal={goal}
      />

      {/* 2. Top Action Row: Today's Training Hero + Quick Action Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          {/* 2. TODAY'S TRAINING */}
          <TodayAction
            workout={todayWorkout}
            activeSession={activeSession}
            completedSession={todayCompletedSession}
            isTodayCompleted={isTodayCompleted}
            isTodayRestDay={isTodayRestDay}
            recovery={recovery}
            activity={activity}
          />
        </div>
        <div className="lg:col-span-4">
          <QuickActions
            hasActiveSession={Boolean(activeSession)}
            onStartWorkout={() => navigate('/workout')}
            onOpenLogWeight={() => setIsLogWeightOpen(true)}
            onViewJourney={() => navigate('/journey')}
            onViewProfile={() => navigate('/profile')}
          />
        </div>
      </div>

      {/* 3. YOUR 6-DAY TRAINING (Expandable 6-day program with direct workout start) */}
      <SixDayProgram
        currentDayNumber={currentDayNumber}
        challengeDays={challengeDays}
        training={training}
        recovery={recovery}
        goal={goal}
        workoutCache={workoutCache}
        activeSession={activeSession}
      />

      {/* Analytics & Discipline Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Stream: Primary Overload & Weekly Adherence */}
        <div className="lg:col-span-7 space-y-6">
          {/* 4. PRIMARY OVERLOAD TARGET */}
          <PerformanceSnapshot
            progression={topProgression}
            exerciseName={primaryExerciseName}
            onViewWorkouts={() => navigate('/workout')}
          />

          {/* 7. WEEKLY VOLUME / ADHERENCE */}
          <WeeklySnapshot
            weeklyStats={weeklyStats}
            daysPerWeekTarget={training?.daysPerWeek ?? 5}
          />
        </div>

        {/* Right Stream: Daily Discipline & Transformation Snapshot */}
        <div className="lg:col-span-5 space-y-6">
          {/* 5. DAILY DISCIPLINE / STATUS */}
          <DailyStatus
            isTodayCompleted={isTodayCompleted}
            hasActiveSession={Boolean(activeSession)}
            isTodayRestDay={isTodayRestDay}
            nutrition={nutrition}
            activity={activity}
            recovery={recovery}
          />

          {/* 6. TRANSFORMATION SNAPSHOT */}
          <TransformationSnapshot
            weightSnapshot={weightSnapshot}
            currentDayNumber={currentDayNumber}
            completedDaysCount={completedDaysCount}
            onOpenLogWeight={() => setIsLogWeightOpen(true)}
          />
        </div>
      </div>

      {/* 3. Accessible Fast Morning Weigh-In Modal */}
      <LogWeightModal
        isOpen={isLogWeightOpen}
        onClose={() => setIsLogWeightOpen(false)}
        currentDayNumber={currentDayNumber}
        initialWeightKg={weightSnapshot.currentWeightKg}
        onSaveWeight={logWeight}
      />
    </PageContainer>
  );
};
