import React from 'react';
import { ArrowRight, CheckCircle2, Flame, Calendar, Dumbbell, Target } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import type { Challenge, Goal } from '@/types';
import { formatWeight } from '@/lib/utils';

export interface StepCompletionProps {
  challenge: Challenge;
  goal: Goal;
  onEnter: () => void;
}

export const StepCompletion: React.FC<StepCompletionProps> = ({
  challenge,
  goal,
  onEnter,
}) => {
  return (
    <div className="flex flex-col items-center text-center py-6 sm:py-10 max-w-lg mx-auto">
      {/* Success Badge */}
      <div className="w-16 h-16 rounded-2xl bg-success/15 border border-success/30 flex items-center justify-center text-success mb-6 shadow-card">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <Badge variant="accent" size="sm" className="mb-3">
        PROTOCOL INITIALIZED
      </Badge>

      <h1 className="type-display text-text-primary tracking-tight">
        YOUR 75 DAYS
        <br />
        <span className="text-text-secondary">START NOW.</span>
      </h1>

      <p className="type-body text-text-secondary mt-3 max-w-sm">
        Discipline over motivation. Every rep, meal, step, and night of recovery counts towards your transformation.
      </p>

      {/* Protocol Core Card */}
      <Card variant="elevated" padding="md" className="w-full my-8 text-left border-border-subtle shadow-daylight bg-surface-base">
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-text-primary fill-text-primary" />
            <span className="font-black text-sm uppercase tracking-wider text-text-primary">
              TEMPO 75 PROTOCOL
            </span>
          </div>
          <Badge variant="success" size="md" className="font-mono font-bold">
            DAY 01 / 75
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
            <div className="flex items-center gap-1.5 text-text-secondary mb-1">
              <Dumbbell className="w-3.5 h-3.5" />
              <span className="type-label">Start Benchmark</span>
            </div>
            <span className="type-metric text-lg text-text-primary font-mono font-bold">
              {formatWeight(goal.startWeightKg)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
            <div className="flex items-center gap-1.5 text-text-secondary mb-1">
              <Target className="w-3.5 h-3.5 text-text-primary" />
              <span className="type-label">Target Weight</span>
            </div>
            <span className="type-metric text-lg text-text-primary font-mono font-bold">
              {formatWeight(goal.targetWeightKg)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-border">
            <div className="flex items-center gap-1.5 text-text-muted mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span className="type-label">Start Date</span>
            </div>
            <span className="type-metric text-sm text-text-primary">
              {challenge.startDate}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-border">
            <div className="flex items-center gap-1.5 text-text-muted mb-1">
              <Calendar className="w-3.5 h-3.5 text-success" />
              <span className="type-label">Target Completion</span>
            </div>
            <span className="type-metric text-sm text-success">
              {challenge.endDate ?? 'Day 75'}
            </span>
          </div>
        </div>
      </Card>

      {/* Primary CTA */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={onEnter}
        rightIcon={<ArrowRight className="w-5 h-5" />}
        className="h-13 text-base shadow-elevated"
      >
        Enter Tempo
      </Button>
    </div>
  );
};
