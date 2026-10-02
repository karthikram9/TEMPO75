import React from 'react';
import { ProgressBar } from '@/components/ui';

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepName,
}) => {
  const formattedStep = String(currentStep).padStart(2, '0');
  const formattedTotal = String(totalSteps).padStart(2, '0');

  return (
    <div className="w-full mb-6 select-none">
      <div className="flex items-center justify-between text-2xs font-mono font-bold tracking-widest uppercase text-text-muted mb-2">
        <span className="text-text-secondary">
          STEP {formattedStep} / {formattedTotal}
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-accent/25 border border-accent/40 text-text-primary text-[10px] font-mono font-bold tracking-wider">
          {stepName}
        </span>
      </div>
      <ProgressBar
        value={currentStep}
        max={totalSteps}
        variant="accent"
        size="sm"
      />
    </div>
  );
};
