import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button, NumberInput, Card, Badge } from '@/components/ui';
import type { MuscleGroup, WeightUnit } from '@/types';
import {
  calculateWeightDifference,
  calculateTargetWeeklyLoss,
  calculateTargetDailyLoss,
  isAggressiveLossRate,
  kgToLbs,
  lbsToKg,
} from '../utils/goalCalculations';

export interface GoalStepData {
  targetWeightKg: number;
  targetBodyFatPercent?: number;
  priorityMuscles: MuscleGroup[];
}

export interface StepGoalProps {
  startWeightKg: number;
  weightUnit: WeightUnit;
  initialData: Partial<GoalStepData>;
  onNext: (data: GoalStepData) => void;
  onBack: () => void;
}

const MUSCLE_OPTIONS: { id: MuscleGroup; label: string }[] = [
  { id: 'chest', label: 'Chest' },
  { id: 'back', label: 'Back' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'arms', label: 'Arms' },
  { id: 'quadriceps', label: 'Quads' },
  { id: 'hamstrings', label: 'Hamstrings' },
  { id: 'glutes', label: 'Glutes' },
  { id: 'calves', label: 'Calves' },
  { id: 'core', label: 'Core / Abs' },
];

export const StepGoal: React.FC<StepGoalProps> = ({
  startWeightKg,
  weightUnit,
  initialData,
  onNext,
  onBack,
}) => {
  const [targetWeightKg, setTargetWeightKg] = useState<number>(
    initialData.targetWeightKg ?? Math.max(40, Number((startWeightKg - 5).toFixed(1)))
  );
  const [targetBodyFat, setTargetBodyFat] = useState<number | undefined>(
    initialData.targetBodyFatPercent
  );
  const [priorityMuscles, setPriorityMuscles] = useState<MuscleGroup[]>(
    initialData.priorityMuscles ?? ['chest', 'back', 'shoulders']
  );

  // Live calculations
  const weightDiff = calculateWeightDifference(startWeightKg, targetWeightKg);
  const weeklyLoss = calculateTargetWeeklyLoss(startWeightKg, targetWeightKg, 75);
  const dailyLoss = calculateTargetDailyLoss(startWeightKg, targetWeightKg, 75);
  const isAggressive = isAggressiveLossRate(startWeightKg, targetWeightKg, 75);

  const displayTargetWeight =
    weightUnit === 'kg' ? targetWeightKg : kgToLbs(targetWeightKg);

  const handleTargetWeightChange = (newVal: number) => {
    if (weightUnit === 'kg') {
      setTargetWeightKg(newVal);
    } else {
      setTargetWeightKg(lbsToKg(newVal));
    }
  };

  const toggleMuscle = (muscle: MuscleGroup) => {
    if (priorityMuscles.includes(muscle)) {
      setPriorityMuscles(priorityMuscles.filter((m) => m !== muscle));
    } else if (priorityMuscles.length < 3) {
      setPriorityMuscles([...priorityMuscles, muscle]);
    }
  };

  const isTargetValid = targetWeightKg >= 35 && targetWeightKg <= 250;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTargetValid) return;

    onNext({
      targetWeightKg,
      targetBodyFatPercent: targetBodyFat,
      priorityMuscles,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="sm">PRIMARY GOAL</Badge>
          <span className="text-2xs font-mono text-text-muted uppercase">75-DAY TIMEFRAME</span>
        </div>
        <h2 className="type-h1 text-text-primary">Physique Transformation</h2>
        <p className="type-body text-text-secondary">
          Define your target physique benchmark for the end of the 75-day protocol.
        </p>
      </div>

      <Card variant="default" padding="md" className="space-y-5">
        {/* Weight Targets Readout */}
        <div className="p-3.5 rounded-lg bg-surface-elevated border border-border flex items-center justify-between text-center">
          <div>
            <span className="type-label block text-text-muted">Start Weight</span>
            <span className="type-metric text-lg text-text-primary">
              {startWeightKg} kg
            </span>
          </div>
          <div className="text-text-muted font-bold text-sm">→</div>
          <div>
            <span className="type-label block text-text-muted">Target Weight</span>
            <span className="type-metric text-lg text-text-primary font-extrabold font-mono">
              {targetWeightKg} kg
            </span>
          </div>
          <div>
            <span className="type-label block text-text-muted">Net Delta</span>
            <span
              className={`type-metric text-lg font-mono font-bold ${
                weightDiff < 0 ? 'text-emerald-700' : weightDiff > 0 ? 'text-amber-800' : 'text-text-secondary'
              }`}
            >
              {weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg
            </span>
          </div>
        </div>

        {/* Target Weight Input */}
        <NumberInput
          label="Target Body Weight"
          value={displayTargetWeight}
          onChange={handleTargetWeightChange}
          min={35}
          max={250}
          step={0.5}
          unit={weightUnit}
          inputMode="decimal"
          helperText="Your physique goal target after 75 consecutive days"
        />

        {/* Calculated Rates Readout */}
        {weightDiff < 0 && (
          <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle grid grid-cols-2 gap-3 text-center">
            <div>
              <span className="type-label block text-text-secondary">Projected Weekly Loss</span>
              <span className="type-metric text-base text-text-primary font-bold font-mono">
                {weeklyLoss} kg / week
              </span>
            </div>
            <div>
              <span className="type-label block text-text-secondary">Projected Daily Loss</span>
              <span className="type-metric text-base text-text-primary font-bold font-mono">
                {dailyLoss} kg / day
              </span>
            </div>
          </div>
        )}

        {/* Calm Aggressive Rate Warning */}
        {isAggressive && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              That target requires a relatively aggressive rate of loss. Tempo will prioritize sustainable
              progress and training performance rather than forcing the scale.
            </p>
          </div>
        )}

        {/* Optional Target Body Fat */}
        <div>
          <NumberInput
            label="Target Body Fat % (Optional)"
            value={targetBodyFat ?? 12}
            onChange={(val) => setTargetBodyFat(val)}
            min={5}
            max={40}
            step={0.5}
            unit="%"
            inputMode="decimal"
            helperText="Leave default if unknown or focusing primarily on scale weight and mirror progress"
          />
        </div>

        {/* Priority Muscle Groups (Up to 3) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="type-label">Priority Hypertrophy Muscle Groups</span>
            <span className="px-2.5 py-0.5 rounded-full bg-accent/25 border border-accent/40 text-text-primary text-[10px] font-mono font-bold">
              {priorityMuscles.length} / 3 SELECTED
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            Select up to 3 emphasis areas for progressive volume calibration.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {MUSCLE_OPTIONS.map((opt) => {
              const isSelected = priorityMuscles.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleMuscle(opt.id)}
                  className={`p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all min-h-[44px] flex items-center justify-center text-center touch-manipulation ${
                    isSelected
                      ? 'bg-accent border-accent/40 text-text-primary font-black shadow-sm'
                      : 'bg-surface-subtle border-border-subtle text-text-secondary hover:text-text-primary hover:bg-border-subtle/40'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-5 h-5" />}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!isTargetValid}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Continue to Training
        </Button>
      </div>
    </form>
  );
};
