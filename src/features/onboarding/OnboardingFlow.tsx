import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import type {
  OnboardingDraftData,
  OnboardingState,
  Challenge,
  Goal,
} from '@/types';
import { PageContainer } from '@/components/layout';
import { useMobileHeader } from '@/hooks';
import { StepIndicator } from './components/StepIndicator';
import { StepWelcome } from './components/StepWelcome';
import { StepProfile, type ProfileStepData } from './components/StepProfile';
import { StepGoal, type GoalStepData } from './components/StepGoal';
import { StepTraining, type TrainingStepData } from './components/StepTraining';
import { StepNutrition, type NutritionStepData } from './components/StepNutrition';
import { StepActivity, type ActivityStepData } from './components/StepActivity';
import { StepRecovery, type RecoveryStepData } from './components/StepRecovery';
import { StepReview } from './components/StepReview';
import { StepCompletion } from './components/StepCompletion';
import { create75DayProtocol } from './utils/protocolGenerator';

const STEP_NAMES = [
  'Welcome',
  'Profile',
  'Goal',
  'Training',
  'Nutrition',
  'Activity',
  'Recovery',
  'Review',
  'Completion',
];

const DEFAULT_DRAFT: OnboardingDraftData = {
  name: '',
  age: 26,
  sex: 'male',
  heightCm: 178,
  weightKg: 80.0,
  lengthUnit: 'cm',
  weightUnit: 'kg',
  targetWeightKg: 74.0,
  targetBodyFatPercent: 12,
  priorityMuscles: ['chest', 'back', 'shoulders'],
  experienceLevel: 'intermediate',
  trainingDaysPerWeek: 6,
  sessionDurationMinutes: 60,
  equipment: ['full_gym', 'barbell', 'dumbbells', 'cable'],
  preferredSplit: 'auto',
  dailyCalories: 2200,
  proteinGrams: 160,
  mealFrequency: 3,
  trackingMode: 'target_only',
  dailyStepTarget: 8000,
  cardioPreference: 'walking',
  cardioSessionsPerWeek: 4,
  cardioDurationMinutes: 20,
  sleepTargetHours: 8,
  stressBaseline: 'moderate',
  recoveryPriority: 'balanced',
  restDayPreference: 'sunday',
  enableReadinessTracking: true,
};

export const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [draft, setDraft] = useState<OnboardingDraftData>(DEFAULT_DRAFT);
  const [hasExistingDraft, setHasExistingDraft] = useState<boolean>(false);
  const [isCreatingProtocol, setIsCreatingProtocol] = useState<boolean>(false);

  // Completed challenge data for completion screen
  const [completedChallenge, setCompletedChallenge] = useState<Challenge | null>(null);
  const [completedGoal, setCompletedGoal] = useState<Goal | null>(null);

  // Load persisted onboarding state on mount
  useEffect(() => {
    let isMounted = true;

    async function loadState() {
      try {
        const [savedState, savedChallenge, savedGoal] = await Promise.all([
          storage.get<OnboardingState>(STORAGE_KEYS.ONBOARDING_STATE),
          storage.get<Challenge>(STORAGE_KEYS.ACTIVE_CHALLENGE),
          storage.get<Goal>(STORAGE_KEYS.USER_GOALS),
        ]);

        if (!isMounted) return;

        if (savedState) {
          if (savedState.draft) {
            setDraft((prev) => ({ ...prev, ...savedState.draft }));
            setHasExistingDraft(true);
          }

          if (savedState.isComplete && savedChallenge && savedGoal) {
            setCompletedChallenge(savedChallenge);
            setCompletedGoal(savedGoal);
            setCurrentStep(9); // Completed screen
          } else if (savedState.currentStep && savedState.currentStep > 1 && savedState.currentStep <= 8) {
            setCurrentStep(savedState.currentStep);
          }
        }
      } catch (err) {
        console.error('[OnboardingFlow] Failed to load onboarding state:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadState();
    return () => {
      isMounted = false;
    };
  }, []);

  // Persist state updates
  const saveProgress = useCallback(
    async (step: number, updatedDraft: Partial<OnboardingDraftData>) => {
      try {
        const mergedDraft = { ...draft, ...updatedDraft };
        const state: OnboardingState = {
          currentStep: step,
          completedSteps: Array.from({ length: step - 1 }, (_, i) => i + 1),
          isComplete: false,
          draft: mergedDraft,
          startedAt: new Date().toISOString(),
        };
        await storage.set(STORAGE_KEYS.ONBOARDING_STATE, state);
      } catch (err) {
        console.error('[OnboardingFlow] Error persisting state:', err);
      }
    },
    [draft]
  );

  // Navigation handlers
  const handleNextStep = useCallback(
    (updatedDraft: Partial<OnboardingDraftData>) => {
      setDraft((prev) => {
        const nextDraft = { ...prev, ...updatedDraft };
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        saveProgress(nextStep, nextDraft);
        return nextDraft;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentStep, saveProgress]
  );

  const handleBackStep = useCallback(() => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      saveProgress(prevStep, draft);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, draft, saveProgress]);

  const handleEditStep = useCallback(
    (targetStep: number) => {
      setCurrentStep(targetStep);
      saveProgress(targetStep, draft);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [draft, saveProgress]
  );

  // Protocol creation handler
  const handleConfirmProtocol = useCallback(async () => {
    setIsCreatingProtocol(true);
    try {
      const result = await create75DayProtocol(draft);
      setCompletedChallenge(result.challenge);
      setCompletedGoal(result.goal);
      setCurrentStep(9);
    } catch (err) {
      console.error('[OnboardingFlow] Failed to create protocol:', err);
      alert('An error occurred initializing your protocol. Please check your inputs and try again.');
    } finally {
      setIsCreatingProtocol(false);
    }
  }, [draft]);

  // Dynamic mobile header configuration
  const headerConfig = useMemo(() => {
    if (currentStep === 1) {
      return {
        title: 'TEMPO 75',
        subtitle: 'PROTOCOL SETUP',
        showBack: false,
      };
    }
    if (currentStep === 9) {
      return {
        title: 'TEMPO 75',
        subtitle: 'PROTOCOL INITIALIZED',
        showBack: false,
      };
    }
    return {
      title: STEP_NAMES[currentStep - 1] ?? 'Onboarding',
      subtitle: `STEP 0${currentStep} OF 08`,
      showBack: true,
      onBack: handleBackStep,
    };
  }, [currentStep, handleBackStep]);

  useMobileHeader(headerConfig);

  if (isLoading) {
    return (
      <PageContainer maxWidth="focused">
        <div className="flex flex-col items-center justify-center py-20 text-center text-text-muted">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mb-3" />
          <span className="text-xs uppercase font-mono tracking-wider">Loading Protocol...</span>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="focused" className="py-4 sm:py-8">
      {/* Restrained Step Indicator for Steps 2-8 */}
      {currentStep >= 2 && currentStep <= 8 && (
        <StepIndicator
          currentStep={currentStep - 1}
          totalSteps={7}
          stepName={STEP_NAMES[currentStep - 1] ?? ''}
        />
      )}

      {/* Multi-Step Viewport */}
      {currentStep === 1 && (
        <StepWelcome
          onStart={() => {
            setCurrentStep(2);
            saveProgress(2, draft);
          }}
          onResume={() => {
            setCurrentStep(2);
          }}
          hasExistingDraft={hasExistingDraft}
        />
      )}

      {currentStep === 2 && (
        <StepProfile
          initialData={draft}
          onNext={(data: ProfileStepData) => handleNextStep(data)}
          onBack={handleBackStep}
        />
      )}

      {currentStep === 3 && (
        <StepGoal
          startWeightKg={draft.weightKg}
          weightUnit={draft.weightUnit}
          initialData={draft}
          onNext={(data: GoalStepData) => handleNextStep(data)}
          onBack={handleBackStep}
        />
      )}

      {currentStep === 4 && (
        <StepTraining
          initialData={draft}
          onNext={(data: TrainingStepData) => handleNextStep(data)}
          onBack={handleBackStep}
        />
      )}

      {currentStep === 5 && (
        <StepNutrition
          currentWeightKg={draft.weightKg}
          initialData={draft}
          onNext={(data: NutritionStepData) => handleNextStep(data)}
          onBack={handleBackStep}
        />
      )}

      {currentStep === 6 && (
        <StepActivity
          initialData={draft}
          onNext={(data: ActivityStepData) => handleNextStep(data)}
          onBack={handleBackStep}
        />
      )}

      {currentStep === 7 && (
        <StepRecovery
          initialData={draft}
          onNext={(data: RecoveryStepData) => handleNextStep(data)}
          onBack={handleBackStep}
        />
      )}

      {currentStep === 8 && (
        <StepReview
          draft={draft}
          onEditStep={handleEditStep}
          onConfirm={handleConfirmProtocol}
          onBack={handleBackStep}
          isCreating={isCreatingProtocol}
        />
      )}

      {currentStep === 9 && completedChallenge && completedGoal && (
        <StepCompletion
          challenge={completedChallenge}
          goal={completedGoal}
          onEnter={() => navigate('/dashboard')}
        />
      )}
    </PageContainer>
  );
};
