import React, { useState } from 'react';
import type { LoggedSet } from '@/types';

interface SetRowProps {
  set: LoggedSet;
  index: number;
  onEditSet?: (setId: string, updates: { weightKg?: number; reps?: number; rir?: number }) => void;
  className?: string;
}

export const SetRow: React.FC<SetRowProps> = ({
  set,
  index,
  onEditSet,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editWeight, setEditWeight] = useState<string>(
    set.weightKg !== undefined ? String(set.weightKg) : '0'
  );
  const [editReps, setEditReps] = useState<string>(
    set.reps !== undefined ? String(set.reps) : '0'
  );
  const [editRir, setEditRir] = useState<string>(
    set.rir !== undefined ? String(set.rir) : ''
  );

  const handleSave = () => {
    const weight = parseFloat(editWeight);
    const reps = parseInt(editReps, 10);
    const rir = editRir !== '' ? parseInt(editRir, 10) : undefined;

    if (!isNaN(reps) && reps > 0 && onEditSet) {
      onEditSet(set.id, {
        weightKg: !isNaN(weight) ? weight : 0,
        reps,
        rir,
      });
    }
    setIsEditing(false);
  };

  const weightLabel = set.weightKg && set.weightKg > 0 ? `${set.weightKg} kg` : 'BW';

  if (isEditing) {
    return (
      <div
        className={`flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-surface-subtle border border-border-subtle shadow-sm ${className}`}
      >
        <span className="text-xs font-mono font-bold text-text-primary">
          SET {set.setNumber ?? index + 1}
        </span>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="decimal"
              value={editWeight}
              onChange={(e) => setEditWeight(e.target.value)}
              className="w-16 h-9 text-center bg-white border border-border-subtle rounded-xl text-sm text-text-primary font-mono focus:border-text-primary focus:outline-none"
              placeholder="kg"
              aria-label="Edit Weight"
            />
            <span className="text-xs text-text-tertiary">kg</span>
          </div>

          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="numeric"
              value={editReps}
              onChange={(e) => setEditReps(e.target.value)}
              className="w-14 h-9 text-center bg-white border border-border-subtle rounded-xl text-sm text-text-primary font-mono focus:border-text-primary focus:outline-none"
              placeholder="reps"
              aria-label="Edit Reps"
            />
            <span className="text-xs text-text-tertiary">reps</span>
          </div>

          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="numeric"
              value={editRir}
              onChange={(e) => setEditRir(e.target.value)}
              className="w-12 h-9 text-center bg-white border border-border-subtle rounded-xl text-sm text-text-primary font-mono focus:border-text-primary focus:outline-none"
              placeholder="RIR"
              aria-label="Edit RIR"
            />
            <span className="text-xs text-text-tertiary">RIR</span>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 h-9 rounded-full bg-[#1A382B] text-white font-bold text-xs hover:bg-[#234A39] shadow-sm transition-all"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-3 h-9 rounded-full bg-surface-base text-text-secondary border border-border-subtle text-xs hover:bg-surface-subtle transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between p-3.5 rounded-2xl bg-surface-base border border-border-subtle shadow-sm transition-colors ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-bold text-text-tertiary min-w-[48px]">
          SET {set.setNumber ?? index + 1}
        </span>

        <span className="text-emerald-700 text-sm font-bold flex items-center gap-1.5">
          <svg
            className="w-4 h-4 shrink-0 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="font-mono text-text-primary text-sm font-bold">
            {weightLabel} × {set.reps}
          </span>
        </span>

        {set.rir !== undefined && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-subtle border border-border-subtle text-text-secondary font-semibold">
            RIR {set.rir}
          </span>
        )}
      </div>

      {onEditSet && (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-xs text-text-tertiary hover:text-text-primary transition-colors min-h-[36px] px-3 py-1 rounded-full hover:bg-surface-subtle font-mono font-bold"
          aria-label={`Edit set ${set.setNumber}`}
        >
          Edit
        </button>
      )}
    </div>
  );
};
