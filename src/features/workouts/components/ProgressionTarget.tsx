import React from 'react';
import type { ProgressionRecommendation } from '@/types';
import { formatEstimated1RM } from '../utils/oneRepMax';

interface ProgressionTargetProps {
  recommendation: ProgressionRecommendation;
  className?: string;
}

export const ProgressionTarget: React.FC<ProgressionTargetProps> = ({
  recommendation,
  className = '',
}) => {
  const { status, targetLabel, confidence, explanation, estimated1RMKg } = recommendation;

  // Status visual variants
  const statusConfig = {
    progress: {
      label: '↑ PROGRESS',
      badgeClass: 'bg-accent text-text-primary border-transparent font-black',
      borderClass: 'border-border-primary',
      bgClass: 'bg-surface-secondary',
    },
    maintain: {
      label: '→ MAINTAIN',
      badgeClass: 'bg-surface-tertiary text-text-primary border-border-secondary font-bold',
      borderClass: 'border-border-primary',
      bgClass: 'bg-surface-secondary',
    },
    reduce: {
      label: '↓ REDUCE',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200 font-bold',
      borderClass: 'border-border-primary',
      bgClass: 'bg-surface-secondary',
    },
    new: {
      label: '✦ BASELINE',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold',
      borderClass: 'border-border-primary',
      bgClass: 'bg-surface-secondary',
    },
  }[status];

  // Confidence tag styles
  const confidenceConfig = {
    high: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    medium: 'text-sky-700 bg-sky-50 border-sky-200',
    low: 'text-text-tertiary bg-surface-tertiary border-border-secondary',
  }[confidence];

  const formatted1RM = formatEstimated1RM(estimated1RMKg);

  return (
    <div
      className={`flex flex-col gap-2 p-3 sm:p-3.5 rounded-2xl border ${statusConfig.borderClass} ${statusConfig.bgClass} transition-all duration-200 ${className}`}
      aria-label="Next Target Progression Recommendation"
    >
      {/* Top Header Row: NEXT TARGET label + Status Badge + Confidence */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-text-secondary shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-accent ring-2 ring-accent/30" />
            NEXT TARGET
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wide uppercase border ${statusConfig.badgeClass}`}
          >
            {statusConfig.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {formatted1RM && (
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-text-secondary bg-surface-primary border border-border-secondary"
              title="Estimated 1-Rep Max based on recent compound performance"
            >
              {formatted1RM}
            </span>
          )}

          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase tracking-wider border ${confidenceConfig}`}
          >
            {confidence} CONFIDENCE
          </span>
        </div>
      </div>

      {/* Target Metric Readout */}
      <div className="flex items-baseline gap-2 pt-0.5">
        <span className="font-mono text-sm sm:text-base font-extrabold tracking-tight text-text-primary">
          {targetLabel}
        </span>
      </div>

      {/* Explanation Cue */}
      <p className="text-xs text-text-secondary leading-normal border-t border-border-secondary pt-1.5 mt-0.5">
        {explanation}
      </p>
    </div>
  );
};
