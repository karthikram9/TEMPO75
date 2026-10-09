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
      badgeClass: 'bg-[#1A382B] text-white border-transparent font-black',
      borderClass: 'border-[#DEE5DC]',
      bgClass: 'bg-[#EDF0EA]',
    },
    maintain: {
      label: '→ MAINTAIN',
      badgeClass: 'bg-white text-[#141815] border border-[#CCD5CA] font-bold',
      borderClass: 'border-[#E6EAE2]',
      bgClass: 'bg-[#F9FAF8]',
    },
    reduce: {
      label: '↓ REDUCE',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-200 font-bold',
      borderClass: 'border-amber-200',
      bgClass: 'bg-amber-50/40',
    },
    new: {
      label: '✦ BASELINE',
      badgeClass: 'bg-[#1A382B] text-white border-transparent font-bold',
      borderClass: 'border-[#DEE5DC]',
      bgClass: 'bg-[#EDF0EA]',
    },
  }[status];

  // Confidence tag styles
  const confidenceConfig = {
    high: 'text-[#1A382B] bg-[#EDF0EA] border-[#DEE5DC]',
    medium: 'text-sky-800 bg-sky-50 border-sky-200',
    low: 'text-[#6E7A72] bg-[#EDF0EA] border-[#DEE5DC]',
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
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#48544D] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A382B]" />
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
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-[#48544D] bg-white border border-[#DEE5DC]"
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
        <span className="font-mono text-sm sm:text-base font-black tracking-tight text-[#141815]">
          {targetLabel}
        </span>
      </div>

      {/* Explanation Cue */}
      <p className="text-xs text-[#48544D] leading-normal border-t border-[#DEE5DC] pt-1.5 mt-0.5">
        {explanation}
      </p>
    </div>
  );
};
