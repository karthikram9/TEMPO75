import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { Button, NumberInput, Card } from '@/components/ui';
import type { NutritionTrackingMode } from '@/types';
import { isProteinLow } from '../utils/goalCalculations';

export interface NutritionStepData {
  dailyCalories: number;
  proteinGrams: number;
  carbGrams?: number;
  fatGrams?: number;
  mealFrequency: number;
  trackingMode: NutritionTrackingMode;
}

export interface StepNutritionProps {
  currentWeightKg: number;
  initialData: Partial<NutritionStepData>;
  onNext: (data: NutritionStepData) => void;
  onBack: () => void;
}

export const StepNutrition: React.FC<StepNutritionProps> = ({
  currentWeightKg,
  initialData,
  onNext,
  onBack,
}) => {
  // Baseline initial estimates based on current weight
  const defaultCalories = initialData.dailyCalories ?? Math.round(currentWeightKg * 28);
  const defaultProtein = initialData.proteinGrams ?? Math.round(currentWeightKg * 2.0);

  const [calories, setCalories] = useState<number>(defaultCalories);
  const [protein, setProtein] = useState<number>(defaultProtein);
  const [carbs, setCarbs] = useState<number | undefined>(initialData.carbGrams);
  const [fat, setFat] = useState<number | undefined>(initialData.fatGrams);
  const [mealFreq, setMealFreq] = useState<number>(initialData.mealFrequency ?? 3);
  const [trackingMode, setTrackingMode] = useState<NutritionTrackingMode>(
    initialData.trackingMode ?? 'target_only'
  );

  const proteinLow = isProteinLow(protein, currentWeightKg);
  const isValid = calories >= 1000 && calories <= 6000 && protein >= 40 && protein <= 400;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onNext({
      dailyCalories: calories,
      proteinGrams: protein,
      carbGrams: carbs,
      fatGrams: fat,
      mealFrequency: mealFreq,
      trackingMode,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-1">
        <h2 className="type-h1 text-text-primary">Nutrition Targets</h2>
        <p className="type-body text-text-secondary">
          Set your daily energy and macronutrient floors for the 75-day protocol.
        </p>
      </div>

      <Card variant="default" padding="md" className="space-y-5">
        {/* Calorie Target */}
        <NumberInput
          label="Daily Caloric Intake"
          value={calories}
          onChange={setCalories}
          min={1000}
          max={6000}
          step={50}
          unit="kcal"
          inputMode="numeric"
          helperText="Target daily intake to support recovery and your physique goal"
        />

        {/* Protein Target */}
        <div>
          <NumberInput
            label="Daily Protein Target"
            value={protein}
            onChange={setProtein}
            min={40}
            max={400}
            step={5}
            unit="g"
            inputMode="numeric"
            helperText={`Target protein floor (~${(protein / (currentWeightKg || 1)).toFixed(1)} g/kg)`}
          />

          {proteinLow && (
            <div className="mt-2.5 p-3 rounded-xl bg-surface-subtle border border-border-subtle flex items-start gap-2.5 text-xs text-text-secondary">
              <Info className="w-4 h-4 text-text-primary shrink-0 mt-0.5" />
              <p>
                Your protein target is relatively low for resistance training. Tempo will still track the
                target you set, but this may affect muscle-retention goals.
              </p>
            </div>
          )}
        </div>

        {/* Optional Carbohydrates & Fat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Carbohydrates (Optional)"
            value={carbs ?? 200}
            onChange={(val) => setCarbs(val)}
            min={20}
            max={800}
            step={10}
            unit="g"
            inputMode="numeric"
            helperText="Set if tracking specific carb distribution"
          />

          <NumberInput
            label="Dietary Fat (Optional)"
            value={fat ?? 60}
            onChange={(val) => setFat(val)}
            min={20}
            max={200}
            step={5}
            unit="g"
            inputMode="numeric"
            helperText="Set if tracking minimum fat intake"
          />
        </div>

        {/* Meal Frequency */}
        <div className="space-y-2">
          <span className="type-label">Meal Frequency</span>
          <div className="grid grid-cols-4 gap-2">
            {[2, 3, 4, 5].map((freq) => (
              <button
                key={freq}
                type="button"
                onClick={() => setMealFreq(freq)}
                className={`py-3 px-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border min-h-[44px] transition-all text-center touch-manipulation ${
                  mealFreq === freq
                    ? 'bg-accent border-accent/40 text-text-primary font-black shadow-sm'
                    : 'bg-surface-subtle border-border-subtle text-text-secondary hover:text-text-primary hover:bg-border-subtle/40'
                }`}
              >
                {freq >= 5 ? '5+ Meals' : `${freq} Meals`}
              </button>
            ))}
          </div>
        </div>

        {/* Nutrition Tracking Mode */}
        <div className="space-y-2">
          <span className="type-label">Tracking Mode</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTrackingMode('target_only')}
              className={`p-3 rounded-2xl border text-left min-h-[44px] transition-all touch-manipulation ${
                trackingMode === 'target_only'
                  ? 'bg-surface-base border-2 border-text-primary shadow-sm'
                  : 'bg-surface-subtle border-border-subtle hover:bg-border-subtle/40'
              }`}
            >
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Target Only (Recommended)
              </div>
              <div className="text-2xs text-text-tertiary mt-1">
                Log daily compliance: whether you hit calories &amp; protein targets.
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTrackingMode('full_logging')}
              className={`p-3 rounded-2xl border text-left min-h-[44px] transition-all touch-manipulation ${
                trackingMode === 'full_logging'
                  ? 'bg-surface-base border-2 border-text-primary shadow-sm'
                  : 'bg-surface-subtle border-border-subtle hover:bg-border-subtle/40'
              }`}
            >
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Full Macro Logging
              </div>
              <div className="text-2xs text-text-tertiary mt-1">
                Track exact grams of protein, carbs, fats, and total calories per meal.
              </div>
            </button>
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
          disabled={!isValid}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Continue to Activity
        </Button>
      </div>
    </form>
  );
};
