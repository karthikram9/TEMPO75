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
        className={`flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#EDF0EA] border border-[#DEE5DC] shadow-sm ${className}`}
      >
        <span className="text-xs font-mono font-bold text-[#141815]">
          SET {set.setNumber ?? index + 1}
        </span>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="decimal"
              value={editWeight}
              onChange={(e) => setEditWeight(e.target.value)}
              className="w-16 h-9 text-center bg-white border border-[#CCD5CA] rounded-xl text-sm text-[#141815] font-mono font-bold focus:border-[#1A382B] focus:outline-none"
              style={{ color: '#141815', WebkitTextFillColor: '#141815' }}
              placeholder="kg"
              aria-label="Edit Weight"
            />
            <span className="text-xs text-[#6E7A72]">kg</span>
          </div>

          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="numeric"
              value={editReps}
              onChange={(e) => setEditReps(e.target.value)}
              className="w-14 h-9 text-center bg-white border border-[#CCD5CA] rounded-xl text-sm text-[#141815] font-mono font-bold focus:border-[#1A382B] focus:outline-none"
              style={{ color: '#141815', WebkitTextFillColor: '#141815' }}
              placeholder="reps"
              aria-label="Edit Reps"
            />
            <span className="text-xs text-[#6E7A72]">reps</span>
          </div>

          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="numeric"
              value={editRir}
              onChange={(e) => setEditRir(e.target.value)}
              className="w-12 h-9 text-center bg-white border border-[#CCD5CA] rounded-xl text-sm text-[#141815] font-mono font-bold focus:border-[#1A382B] focus:outline-none"
              style={{ color: '#141815', WebkitTextFillColor: '#141815' }}
              placeholder="RIR"
              aria-label="Edit RIR"
            />
            <span className="text-xs text-[#6E7A72]">RIR</span>
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
            className="px-3 h-9 rounded-full bg-white text-[#48544D] border border-[#DEE5DC] text-xs hover:bg-[#EDF0EA] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E6EAE2] shadow-xs transition-colors ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-bold text-[#6E7A72] min-w-[48px]">
          SET {set.setNumber ?? index + 1}
        </span>

        <span className="text-[#1A382B] text-sm font-bold flex items-center gap-1.5">
          <svg
            className="w-4 h-4 shrink-0 text-[#1A382B]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="font-mono text-[#141815] text-sm sm:text-base font-black">
            {weightLabel} × {set.reps}
          </span>
        </span>

        {set.rir !== undefined && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EDF0EA] border border-[#DEE5DC] text-[#1A382B] font-bold">
            RIR {set.rir}
          </span>
        )}
      </div>

      {onEditSet && (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-xs text-[#6E7A72] hover:text-[#141815] transition-colors min-h-[36px] px-3 py-1 rounded-full hover:bg-[#EDF0EA] font-mono font-bold"
          aria-label={`Edit set ${set.setNumber}`}
        >
          Edit
        </button>
      )}
    </div>
  );
};
