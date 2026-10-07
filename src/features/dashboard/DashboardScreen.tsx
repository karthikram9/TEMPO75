import React, { useState, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useDashboardData } from './hooks/useDashboardData';
import { HomeHeader } from './components/HomeHeader';
import { TransformationOverviewCard } from './components/TransformationOverviewCard';
import { WeeklyTrainingCard } from './components/WeeklyTrainingCard';
import { TodayWorkoutCard } from './components/TodayWorkoutCard';
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
    isTodayCompleted,
    isTodayRestDay,
    profile,
    goal,
    training,
    todayWorkout,
    activeSession,
    todayCompletedSession,
    workoutSessions,
    weightSnapshot,
    logWeight,
    refetch,
  } = useDashboardData();

  // 1. Current Weight & Target Weight (Never hardcoded, read from reactive state)
  const currentWeightKg =
    weightSnapshot.currentWeightKg && weightSnapshot.currentWeightKg > 0
      ? weightSnapshot.currentWeightKg
      : profile?.weightKg && profile.weightKg > 0
      ? profile.weightKg
      : null;

  const targetWeightKg =
    goal?.targetWeightKg && goal.targetWeightKg > 0
      ? goal.targetWeightKg
      : weightSnapshot.targetWeightKg && weightSnapshot.targetWeightKg > 0
      ? weightSnapshot.targetWeightKg
      : null;

  // 2. Scheduled exercise count
  const exerciseCount = todayWorkout?.exercises.length ?? 0;

  // 3. Days remaining in the 75-day protocol
  const daysRemaining = Math.max(0, 75 - currentDayNumber + 1);

  // 4. Workout completion percentage
  const workoutCompletionPercent = useMemo(() => {
    if (isTodayCompleted || todayCompletedSession) {
      return 100;
    }
    if (activeSession && activeSession.exercises.length > 0) {
      const totalSets = activeSession.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
      const completedSets = activeSession.exercises.reduce(
        (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
        0
      );
      return totalSets > 0 ? Math.min(100, Math.round((completedSets / totalSets) * 100)) : 0;
    }
    return 0;
  }, [isTodayCompleted, todayCompletedSession, activeSession]);

  // Loading skeleton state matching the new sage/cream layout
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F4F5F0] text-[#141815] pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between py-2">
            <div className="h-9 w-40 bg-[#E2E6DF] rounded-xl animate-pulse" />
            <div className="hidden lg:block h-8 w-64 bg-[#E2E6DF] rounded-xl animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-28 bg-[#E2E6DF] rounded-full animate-pulse" />
              <div className="h-10 w-10 bg-[#E2E6DF] rounded-full animate-pulse" />
            </div>
          </div>

          {/* Cards Row Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 h-[300px] bg-[#151816] rounded-3xl animate-pulse" />
            <div className="lg:col-span-5 h-[300px] bg-white rounded-3xl border border-[#E6EAE2] animate-pulse" />
          </div>

          {/* Bottom Card Skeleton */}
          <div className="h-[340px] bg-white rounded-3xl border border-[#E6EAE2] animate-pulse" />
        </div>
      </div>
    );
  }

  // Guard: If protocol is not active or challenge not found, redirect to onboarding
  if (!challenge || challenge.status !== 'active') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="w-full min-h-screen bg-[#F4F5F0] text-[#141815] pb-16 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Error notification if any */}
        {error && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => void refetch()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* 1. Home Top Header */}
        <HomeHeader onOpenLogWeight={() => setIsLogWeightOpen(true)} />

        {/* 2. Top Row: Transformation Overview (Left) & Weekly Training (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 mt-4 sm:mt-6 items-stretch">
          {/* Transformation Overview Card (Desktop: 7 cols) */}
          <TransformationOverviewCard
            className="lg:col-span-7"
            currentWeightKg={currentWeightKg}
            targetWeightKg={targetWeightKg}
            currentDayNumber={currentDayNumber}
            exerciseCount={exerciseCount}
            workoutCompletionPercent={workoutCompletionPercent}
            daysRemaining={daysRemaining}
          />

          {/* Weekly Training Consistency Card (Desktop: 5 cols) */}
          <WeeklyTrainingCard
            className="lg:col-span-5"
            sessions={workoutSessions}
            challengeDays={challengeDays}
            daysPerWeekTarget={training?.daysPerWeek ?? 6}
          />
        </div>

        {/* 3. Bottom Row: Today's Workout Card (Full Width) */}
        <div className="mt-5 sm:mt-6">
          <TodayWorkoutCard
            workout={todayWorkout}
            activeSession={activeSession}
            isTodayCompleted={isTodayCompleted}
            isTodayRestDay={isTodayRestDay}
            onStartWorkout={() => navigate(isTodayCompleted ? '/workout' : '/workout?start=true')}
            onResumeWorkout={() => navigate('/workout')}
          />
        </div>
      </div>

      {/* Accessible Fast Weight Logger Modal */}
      <LogWeightModal
        isOpen={isLogWeightOpen}
        onClose={() => setIsLogWeightOpen(false)}
        currentDayNumber={currentDayNumber}
        initialWeightKg={currentWeightKg ?? 75.0}
        onSaveWeight={logWeight}
      />
    </div>
  );
};
