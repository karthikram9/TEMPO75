import React from 'react';
import type { MuscleGroup } from '@/types';

interface MuscleTagProps {
  muscle: MuscleGroup;
  className?: string;
}

const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  arms: 'Arms',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  quadriceps: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  abs: 'Abs',
  core: 'Core',
  traps: 'Traps',
};

export const MuscleTag: React.FC<MuscleTagProps> = ({ muscle, className = '' }) => {
  const label = MUSCLE_LABELS[muscle] ?? muscle;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-[#EDF0EA] border border-[#DEE5DC] text-[#48544D] ${className}`}
    >
      {label}
    </span>
  );
};
