import React from 'react';
import { ArrowLeft, Edit2, Flame } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import type { OnboardingDraftData } from '@/types';
import {
  calculateWeightDifference,
  calculateTargetWeeklyLoss,
  calculateTargetDate,
} from '../utils/goalCalculations';

export interface StepReviewProps {
  draft: OnboardingDraftData;
  onEditStep: (step: number) => void;
  onConfirm: () => Promise<void>;
  onBack: () => void;
  isCreating: boolean;
}

export const StepReview: React.FC<StepReviewProps> = ({
  draft,
  onEditStep,
  onConfirm,
  onBack,
  isCreating,
}) => {
  const weightDiff = calculateWeightDifference(draft.weightKg, draft.targetWeightKg);
  const weeklyLoss = calculateTargetWeeklyLoss(draft.weightKg, draft.targetWeightKg, 75);
  const targetDate = calculateTargetDate(new Date().toISOString(), 75);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-1">
        <Badge variant="accent" size="sm">FINAL CALIBRATION</Badge>
        <h2 className="type-h1 text-text-primary">Review Your 75-Day Protocol</h2>
        <p className="type-body text-text-secondary">
          Confirm your starting parameters. Each block can be adjusted at any time during your journey.
        </p>
      </div>

      <div className="space-y-4">
        {/* Profile Section */}
        <Card variant="default" padding="sm">
          <CardHeader className="mb-2">
            <CardTitle>Athlete Profile</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(2)}
              leftIcon={<Edit2 className="w-3.5 h-3.5 text-text-secondary" />}
              className="text-xs font-bold text-text-primary hover:text-black"
            >
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-text-muted block font-medium">Name</span>
                <span className="font-bold text-text-primary mt-0.5 block">{draft.name}</span>
              </div>
              <div>
                <span className="text-text-muted block font-medium">Age / Sex</span>
                <span className="font-bold text-text-primary mt-0.5 block">
                  {draft.age}y • {draft.sex}
                </span>
              </div>
              <div>
                <span className="text-text-muted block font-medium">Height</span>
                <span className="font-bold text-text-primary mt-0.5 block">{draft.heightCm} cm</span>
              </div>
              <div>
                <span className="text-text-muted block font-medium">Starting Weight</span>
                <span className="font-bold text-text-primary font-mono mt-0.5 block">
                  {draft.weightKg} kg
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goal Section */}
        <Card variant="default" padding="sm">
          <CardHeader className="mb-2">
            <CardTitle>Transformation Goal</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(3)}
              leftIcon={<Edit2 className="w-3.5 h-3.5 text-text-secondary" />}
              className="text-xs font-bold text-text-primary hover:text-black"
            >
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-text-muted block font-medium">Target Weight</span>
                <span className="font-bold text-text-primary font-mono mt-0.5 block">
                  {draft.targetWeightKg} kg
                </span>
              </div>
              <div>
                <span className="text-text-muted block font-medium">Net Delta</span>
                <span className="font-bold text-text-primary font-mono mt-0.5 block">
                  {weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg
                </span>
              </div>
              <div>
                <span className="text-text-muted block font-medium">Duration</span>
                <span className="font-bold text-text-primary mt-0.5 block">75 Days</span>
              </div>
              <div>
                <span className="text-text-muted block font-medium">Target Date</span>
                <span className="font-bold text-text-primary font-mono mt-0.5 block">
                  {targetDate}
                </span>
              </div>
            </div>
            {weeklyLoss > 0 && (
              <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs">
                <span className="text-text-muted">Calculated Weekly Rate</span>
                <span className="font-mono font-bold text-text-primary">{weeklyLoss} kg / week</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Training Section */}
        <Card variant="default" padding="sm">
          <CardHeader className="mb-2">
            <CardTitle>Training Structure</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(4)}
              leftIcon={<Edit2 className="w-3.5 h-3.5 text-text-secondary" />}
              className="text-xs font-bold text-text-primary hover:text-black"
            >
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-text-muted block font-medium">Frequency</span>
                <span className="font-bold text-text-primary mt-0.5 block">
                  {draft.trainingDaysPerWeek} Days/week
                </span>
              </div>
              <div>
                <span className="text-text-muted block font-medium">Duration</span>
                <span className="font-bold text-text-primary mt-0.5 block">
                  {draft.sessionDurationMinutes} min
                </span>
              </div>
              <div>
                <span className="text-text-muted block font-medium">Experience</span>
                <span className="font-bold text-text-primary capitalize mt-0.5 block">
                  {draft.experienceLevel}
                </span>
              </div>
              <div>
                <span className="text-text-muted block font-medium">Split</span>
                <span className="font-bold text-text-primary uppercase mt-0.5 block">
                  {draft.preferredSplit}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Section */}
        <Card variant="default" padding="sm">
          <CardHeader className="mb-2">
            <CardTitle>Nutrition Targets</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(5)}
              leftIcon={<Edit2 className="w-3.5 h-3.5 text-text-secondary" />}
              className="text-xs font-bold text-text-primary hover:text-black"
            >
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-text-muted block font-medium">Daily Calories</span>
                <span className="font-bold text-text-primary font-mono mt-0.5 block">
                  {draft.dailyCalories} kcal
                </span>
              </div>
              <div>
                <span className="text-text-muted block font-medium">Daily Protein</span>
                <span className="font-bold text-success font-mono mt-0.5 block">
                  {draft.proteinGrams} g
                </span>
              </div>
              <div>
                <span className="text-text-muted block font-medium">Carbs / Fat</span>
                <span className="font-bold text-text-primary font-mono mt-0.5 block">
                  {draft.carbGrams ?? '-'}g / {draft.fatGrams ?? '-'}g
                </span>
              </div>
              <div>
                <span className="text-text-muted block font-medium">Tracking</span>
                <span className="font-bold text-text-primary uppercase mt-0.5 block">
                  {draft.trackingMode === 'target_only' ? 'Targets' : 'Full Logs'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity & Recovery Section */}
        <Card variant="default" padding="sm">
          <CardHeader className="mb-2">
            <CardTitle>Activity & Recovery</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(6)}
              leftIcon={<Edit2 className="w-3.5 h-3.5 text-text-secondary" />}
              className="text-xs font-bold text-text-primary hover:text-black"
            >
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-text-muted block font-medium">Daily Steps</span>
                <span className="font-bold text-text-primary font-mono mt-0.5 block">
                  {draft.dailyStepTarget.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-text-muted block font-medium">Cardio</span>
                <span className="font-bold text-text-primary mt-0.5 block">
                  {draft.cardioSessionsPerWeek}x / {draft.cardioDurationMinutes}m
                </span>
              </div>
              <div>
                <span className="text-text-muted block font-medium">Sleep Floor</span>
                <span className="font-bold text-text-primary font-mono mt-0.5 block">
                  {draft.sleepTargetHours} Hours
                </span>
              </div>
              <div>
                <span className="text-text-muted block font-medium">Rest Day</span>
                <span className="font-bold text-text-primary capitalize mt-0.5 block">
                  {draft.restDayPreference}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation & Commitment */}
      <div className="pt-2 flex flex-col gap-3">
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isCreating}
          onClick={onConfirm}
          leftIcon={<Flame className="w-5 h-5 fill-white" />}
          className="h-13 text-base shadow-elevated"
        >
          Start My 75 Days
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="md"
          fullWidth
          disabled={isCreating}
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="text-text-secondary"
        >
          Back to Recovery
        </Button>
      </div>
    </div>
  );
};
