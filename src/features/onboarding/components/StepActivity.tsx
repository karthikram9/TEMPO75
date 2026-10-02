import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button, NumberInput, Card } from '@/components/ui';
import type { CardioPreference } from '@/types';

export interface ActivityStepData {
  dailyStepTarget: number;
  cardioPreference: CardioPreference;
  cardioSessionsPerWeek: number;
  cardioDurationMinutes: number;
}

export interface StepActivityProps {
  initialData: Partial<ActivityStepData>;
  onNext: (data: ActivityStepData) => void;
  onBack: () => void;
}

const STEP_PRESETS = [5000, 6000, 7000, 8000, 9000, 10000];
const CARDIO_MODALITIES: { id: CardioPreference; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'walking', label: 'Brisk Walking' },
  { id: 'jogging', label: 'Running / Jog' },
  { id: 'cycling', label: 'Cycling' },
  { id: 'stair_incline', label: 'Stair / Incline' },
  { id: 'mixed', label: 'Mixed Modality' },
];

export const StepActivity: React.FC<StepActivityProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [steps, setSteps] = useState<number>(initialData.dailyStepTarget ?? 8000);
  const [cardioPref, setCardioPref] = useState<CardioPreference>(
    initialData.cardioPreference ?? 'walking'
  );
  const [cardioFreq, setCardioFreq] = useState<number>(
    initialData.cardioSessionsPerWeek ?? 4
  );
  const [cardioDuration, setCardioDuration] = useState<number>(
    initialData.cardioDurationMinutes ?? 20
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      dailyStepTarget: steps,
      cardioPreference: cardioPref,
      cardioSessionsPerWeek: cardioFreq,
      cardioDurationMinutes: cardioDuration,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-1">
        <h2 className="type-h1 text-text-primary">Daily Activity & Cardio</h2>
        <p className="type-body text-text-secondary">
          Configure baseline non-exercise activity and dedicated cardio targets.
        </p>
      </div>

      <Card variant="default" padding="md" className="space-y-5">
        {/* Daily Step Target */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="type-label">Daily Step Target</span>
            <span className="px-2.5 py-0.5 rounded-full bg-accent/25 border border-accent/40 text-text-primary text-[10px] font-mono font-bold">
              {steps.toLocaleString()} STEPS
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {STEP_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setSteps(preset)}
                className={`py-2 px-1 rounded-xl text-xs font-mono font-bold border min-h-[44px] transition-all text-center touch-manipulation ${
                  steps === preset
                    ? 'bg-accent border-accent/40 text-text-primary font-black shadow-sm'
                    : 'bg-surface-subtle border-border-subtle text-text-secondary hover:text-text-primary hover:bg-border-subtle/40'
                }`}
              >
                {preset / 1000}k
              </button>
            ))}
          </div>

          <div className="pt-1">
            <NumberInput
              value={steps}
              onChange={setSteps}
              min={2000}
              max={30000}
              step={500}
              unit="steps"
              inputMode="numeric"
              helperText="Baseline daily movement floor for 75 consecutive days"
            />
          </div>
        </div>

        {/* Cardio Preference */}
        <div className="space-y-2">
          <span className="type-label">Preferred Cardio Type</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CARDIO_MODALITIES.map((mod) => (
              <button
                key={mod.id}
                type="button"
                onClick={() => setCardioPref(mod.id)}
                className={`p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border min-h-[44px] transition-all text-center touch-manipulation ${
                  cardioPref === mod.id
                    ? 'bg-accent border-accent/40 text-text-primary font-black shadow-sm'
                    : 'bg-surface-subtle border-border-subtle text-text-secondary hover:text-text-primary hover:bg-border-subtle/40'
                }`}
              >
                {mod.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cardio Sessions Per Week */}
        {cardioPref !== 'none' && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="type-label">Cardio Sessions Per Week</span>
                <span className="px-2.5 py-0.5 rounded-full bg-accent/25 border border-accent/40 text-text-primary text-[10px] font-mono font-bold">
                  {cardioFreq} SESSIONS
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCardioFreq(num)}
                    className={`py-2 px-1 rounded-xl text-xs font-mono font-bold border min-h-[44px] transition-all text-center touch-manipulation ${
                      cardioFreq === num
                        ? 'bg-accent border-accent/40 text-text-primary font-black shadow-sm'
                        : 'bg-surface-subtle border-border-subtle text-text-secondary hover:text-text-primary hover:bg-border-subtle/40'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Typical Cardio Duration */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="type-label">Session Duration</span>
                <span className="px-2.5 py-0.5 rounded-full bg-accent/25 border border-accent/40 text-text-primary text-[10px] font-mono font-bold">
                  {cardioDuration} MIN
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[10, 15, 20, 30, 45, 60].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setCardioDuration(dur)}
                    className={`py-2 px-1 rounded-xl text-xs font-mono font-bold border min-h-[44px] transition-all text-center touch-manipulation ${
                      cardioDuration === dur
                        ? 'bg-accent border-accent/40 text-text-primary font-black shadow-sm'
                        : 'bg-surface-subtle border-border-subtle text-text-secondary hover:text-text-primary hover:bg-border-subtle/40'
                    }`}
                  >
                    {dur}m
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
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
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Continue to Recovery
        </Button>
      </div>
    </form>
  );
};
