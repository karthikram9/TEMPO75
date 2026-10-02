import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { Button, Badge, Card } from '@/components/ui';

export interface StepWelcomeProps {
  onStart: () => void;
  onResume?: () => void;
  hasExistingDraft?: boolean;
}

export const StepWelcome: React.FC<StepWelcomeProps> = ({
  onStart,
  onResume,
  hasExistingDraft = false,
}) => {
  return (
    <div className="flex flex-col items-center text-center py-6 sm:py-10 max-w-xl mx-auto">
      <Badge variant="accent" size="sm" className="mb-6">
        75-DAY PHYSIQUE TRANSFORMATION
      </Badge>

      {/* Brand Monogram */}
      <div className="w-16 h-16 rounded-3xl bg-accent/25 border border-accent/40 flex items-center justify-center text-text-primary mb-6 shadow-daylight">
        <Flame className="w-8 h-8 fill-text-primary" />
      </div>

      <div className="space-y-2 mb-6">
        <h1 className="type-display text-text-primary tracking-tight">
          75 DAYS.
          <br />
          <span className="text-text-secondary">ONE PROTOCOL.</span>
        </h1>
        <p className="type-body text-text-secondary max-w-md mx-auto mt-4 leading-relaxed">
          Build a leaner, stronger, more balanced physique through structured training, nutrition,
          recovery, and consistency.
        </p>
      </div>

      {/* Protocol Pillars Summary Card */}
      <Card variant="default" padding="sm" className="w-full mb-8 text-left bg-surface/60">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center p-2">
          <div className="p-2.5 rounded-lg bg-surface-elevated border border-border">
            <span className="type-label block text-text-muted">TRAINING</span>
            <span className="text-xs font-bold text-text-primary mt-1 block">Hypertrophy</span>
          </div>
          <div className="p-2.5 rounded-lg bg-surface-elevated border border-border">
            <span className="type-label block text-text-muted">NUTRITION</span>
            <span className="text-xs font-bold text-text-primary mt-1 block">Calculated</span>
          </div>
          <div className="p-2.5 rounded-lg bg-surface-elevated border border-border">
            <span className="type-label block text-text-muted">CARDIO</span>
            <span className="text-xs font-bold text-text-primary mt-1 block">Daily Steps</span>
          </div>
          <div className="p-2.5 rounded-lg bg-surface-elevated border border-border">
            <span className="type-label block text-text-muted">RECOVERY</span>
            <span className="text-xs font-bold text-text-primary mt-1 block">Rest & Sleep</span>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onStart}
          rightIcon={<ArrowRight className="w-5 h-5" />}
          className="h-13 text-base shadow-card"
        >
          Build My Protocol
        </Button>

        {hasExistingDraft && onResume && (
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={onResume}
            className="text-text-secondary hover:text-text-primary"
          >
            Resume in-progress draft
          </Button>
        )}
      </div>
    </div>
  );
};
