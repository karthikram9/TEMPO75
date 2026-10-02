import React from 'react';
import type { WorkoutExercise } from '@/types';
import { ExerciseCard } from './ExerciseCard';

interface ExerciseListProps {
  exercises: readonly WorkoutExercise[];
  className?: string;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, className = '' }) => {
  if (exercises.length === 0) {
    return (
      <div className="p-8 text-center bg-surface-primary rounded-2xl border border-border-primary text-text-secondary text-sm">
        No exercises scheduled for this workout session.
      </div>
    );
  }

  return (
    <section aria-label="Prescribed Workout Exercises" className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-text-tertiary">
          Movement Sequence ({exercises.length})
        </h2>
        <span className="text-xs text-text-tertiary font-mono">
          Order of Execution
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};
