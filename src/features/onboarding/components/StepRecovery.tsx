import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button, Card, Switch } from '@/components/ui';
import type {
  StressBaseline,
  RecoveryPriority,
  RestDayPreference,
} from '@/types';

export interface RecoveryStepData {
  sleepTargetHours: number;
  stressBaseline: StressBaseline;
  recoveryPriority: RecoveryPriority;
  restDayPreference: RestDayPreference;
  enableReadinessTracking: boolean;
}

export interface StepRecoveryProps {
  initialData: Partial<RecoveryStepData>;
  onNext: (data: RecoveryStepData) => void;
  onBack: () => void;
}

export const StepRecovery: React.FC<StepRecoveryProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [sleepHours, setSleepHours] = useState<number>(
    initialData.sleepTargetHours ?? 8
  );
  const [stress, setStress] = useState<StressBaseline>(
    initialData.stressBaseline ?? 'moderate'
  );
  const [priority, setPriority] = useState<RecoveryPriority>(
    initialData.recoveryPriority ?? 'balanced'
  );
  const [restDay, setRestDay] = useState<RestDayPreference>(
    initialData.restDayPreference ?? 'sunday'
  );
  const [readiness, setReadiness] = useState<boolean>(
    initialData.enableReadinessTracking ?? true
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      sleepTargetHours: sleepHours,
      stressBaseline: stress,
      recoveryPriority: priority,
      restDayPreference: restDay,
      enableReadinessTracking: readiness,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-1">
        <h2 className="type-h1 text-text-primary">Recovery & Readiness</h2>
        <p className="type-body text-text-secondary">
          Configure sleep minimums, rest day pacing, and systemic stress baselines.
        </p>
      </div>

      <Card variant="default" padding="md" className="space-y-5">
        {/* Sleep Target */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="type-label">Nightly Sleep Floor</span>
            <span className="px-2.5 py-0.5 rounded-full bg-accent/25 border border-accent/40 text-text-primary text-[10px] font-mono font-bold">
              {sleepHours} HOURS
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[6, 7, 8, 9, 10].map((hrs) => (
              <button
                key={hrs}
                type="button"
                onClick={() => setSleepHours(hrs)}
                className={`py-3 px-2 rounded-xl text-sm font-mono font-bold border min-h-[44px] transition-all text-center touch-manipulation ${
                  sleepHours === hrs
                    ? 'bg-accent border-accent/40 text-text-primary font-black shadow-sm'
                    : 'bg-surface-subtle border-border-subtle text-text-secondary hover:text-text-primary hover:bg-border-subtle/40'
                }`}
              >
                {hrs}h
              </button>
            ))}
          </div>
        </div>

        {/* Stress Baseline */}
        <div className="space-y-2">
          <span className="type-label">Life / Work Stress Baseline</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'low', label: 'Low' },
              { id: 'moderate', label: 'Moderate' },
              { id: 'high', label: 'High' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setStress(lvl.id as StressBaseline)}
                className={`p-3 rounded-xl text-xs font-bold uppercase tracking-wider border min-h-[44px] transition-all text-center touch-manipulation ${
                  stress === lvl.id
                    ? 'bg-accent border-accent/40 text-text-primary font-black shadow-sm'
                    : 'bg-surface-subtle border-border-subtle text-text-secondary hover:text-text-primary hover:bg-border-subtle/40'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recovery Priority */}
        <div className="space-y-2">
          <span className="type-label">Recovery & Progression Balance</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'performance', label: 'Performance Priority', desc: 'Focus on strength & gym output' },
              { id: 'balanced', label: 'Balanced Protocol', desc: 'Optimal fat loss & muscle retention' },
              { id: 'aggressive', label: 'Aggressive Transformation', desc: 'High volume & strict conditioning' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPriority(p.id as RecoveryPriority)}
                className={`p-3 rounded-2xl border text-left min-h-[44px] transition-all touch-manipulation ${
                  priority === p.id
                    ? 'bg-surface-base border-2 border-text-primary shadow-sm'
                    : 'bg-surface-subtle border-border-subtle hover:bg-border-subtle/40'
                }`}
              >
                <div className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  {p.label}
                </div>
                <div className="text-2xs text-text-tertiary mt-1 leading-snug">
                  {p.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Rest Day Preference */}
        <div className="space-y-2">
          <span className="type-label">Rest Day Allocation</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'sunday', label: 'Sunday' },
              { id: 'saturday', label: 'Saturday' },
              { id: 'flexible', label: 'Flexible / Auto' },
            ].map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => setRestDay(day.id as RestDayPreference)}
                className={`p-3 rounded-xl text-xs font-bold uppercase tracking-wider border min-h-[44px] transition-all text-center touch-manipulation ${
                  restDay === day.id
                    ? 'bg-accent border-accent/40 text-text-primary font-black shadow-sm'
                    : 'bg-surface-subtle border-border-subtle text-text-secondary hover:text-text-primary hover:bg-border-subtle/40'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Readiness Tracking Switch */}
        <div className="pt-2 border-t border-border">
          <Switch
            checked={readiness}
            onChange={setReadiness}
            label="Enable Daily Readiness Calibration"
            description="Adjusts recommended session intensity based on logged sleep and recovery"
          />
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
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Review Protocol
        </Button>
      </div>
    </form>
  );
};
