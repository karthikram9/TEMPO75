import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import type {
  ExperienceLevel,
  EquipmentOption,
  TrainingSplitPreference,
} from '@/types';

export interface TrainingStepData {
  experienceLevel: ExperienceLevel;
  trainingDaysPerWeek: number;
  sessionDurationMinutes: number;
  equipment: EquipmentOption[];
  preferredSplit: TrainingSplitPreference;
}

export interface StepTrainingProps {
  initialData: Partial<TrainingStepData>;
  onNext: (data: TrainingStepData) => void;
  onBack: () => void;
}

const EQUIPMENT_OPTIONS: { id: EquipmentOption; label: string }[] = [
  { id: 'full_gym', label: 'Full Gym' },
  { id: 'barbell', label: 'Barbell' },
  { id: 'dumbbells', label: 'Dumbbells' },
  { id: 'cable', label: 'Cable Stations' },
  { id: 'machines', label: 'Resistance Machines' },
  { id: 'pullup_bar', label: 'Pull-up Bar' },
  { id: 'home_setup', label: 'Home Setup' },
];

export const StepTraining: React.FC<StepTrainingProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    initialData.experienceLevel ?? 'intermediate'
  );
  const [daysPerWeek, setDaysPerWeek] = useState<number>(
    initialData.trainingDaysPerWeek ?? 6
  );
  const [duration, setDuration] = useState<number>(
    initialData.sessionDurationMinutes ?? 60
  );
  const [equipment, setEquipment] = useState<EquipmentOption[]>(
    initialData.equipment && initialData.equipment.length > 0
      ? initialData.equipment
      : ['full_gym', 'barbell', 'dumbbells', 'cable']
  );
  const [preferredSplit, setPreferredSplit] = useState<TrainingSplitPreference>(
    initialData.preferredSplit ?? 'auto'
  );

  const toggleEquipment = (id: EquipmentOption) => {
    if (equipment.includes(id)) {
      if (equipment.length > 1) {
        setEquipment(equipment.filter((e) => e !== id));
      }
    } else {
      setEquipment([...equipment, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      experienceLevel,
      trainingDaysPerWeek: daysPerWeek,
      sessionDurationMinutes: duration,
      equipment,
      preferredSplit,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-1">
        <h2 className="type-h1 text-text-primary">Training Preferences</h2>
        <p className="type-body text-text-secondary">
          Configure your lifting split, available gear, and target session frequency.
        </p>
      </div>

      <Card variant="default" padding="md" className="space-y-5">
        {/* Experience Level */}
        <div className="space-y-2">
          <span className="type-label">Lifting Experience</span>
          <div className="grid grid-cols-3 gap-2">
            {(['beginner', 'intermediate', 'advanced'] as ExperienceLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setExperienceLevel(lvl)}
                className={`py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider border min-h-[44px] transition-all text-center touch-manipulation ${
                  experienceLevel === lvl
                    ? 'bg-accent border-accent/40 text-text-primary font-black shadow-sm'
                    : 'bg-surface-subtle border-border-subtle text-text-secondary hover:text-text-primary hover:bg-border-subtle/40'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Days Per Week */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="type-label">Training Days Per Week</span>
            <span className="px-2.5 py-0.5 rounded-full bg-accent/25 border border-accent/40 text-text-primary text-[10px] font-mono font-bold">
              {daysPerWeek} DAYS
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[3, 4, 5, 6].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setDaysPerWeek(days)}
                className={`py-3 px-2 rounded-xl text-sm font-mono font-bold border min-h-[44px] transition-all text-center touch-manipulation ${
                  daysPerWeek === days
                    ? 'bg-accent border-accent/40 text-text-primary font-black shadow-sm'
                    : 'bg-surface-subtle border-border-subtle text-text-secondary hover:text-text-primary hover:bg-border-subtle/40'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>

        {/* Session Duration */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="type-label">Target Session Duration</span>
            <span className="px-2.5 py-0.5 rounded-full bg-accent/25 border border-accent/40 text-text-primary text-[10px] font-mono font-bold">
              {duration} MIN
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {[30, 45, 60, 75, 90].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDuration(mins)}
                className={`py-2.5 px-1.5 rounded-xl text-xs font-mono font-bold border min-h-[44px] transition-all text-center touch-manipulation ${
                  duration === mins
                    ? 'bg-accent border-accent/40 text-text-primary font-black shadow-sm'
                    : 'bg-surface-subtle border-border-subtle text-text-secondary hover:text-text-primary hover:bg-border-subtle/40'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Equipment Multi-Select */}
        <div className="space-y-2">
          <span className="type-label">Available Equipment (Multi-select)</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {EQUIPMENT_OPTIONS.map((opt) => {
              const isSelected = equipment.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleEquipment(opt.id)}
                  className={`p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border min-h-[44px] transition-all text-center touch-manipulation ${
                    isSelected
                      ? 'bg-accent border-accent/40 text-text-primary font-black shadow-sm'
                      : 'bg-surface-subtle border-border-subtle text-text-secondary hover:text-text-primary hover:bg-border-subtle/40'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Split */}
        <div className="space-y-2">
          <span className="type-label">Preferred Split Structure</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'auto', label: 'Auto (Recommended)' },
              { id: 'ppl', label: 'Push / Pull / Legs' },
              { id: 'upper_lower', label: 'Upper / Lower' },
              { id: 'full_body', label: 'Full Body' },
            ].map((split) => (
              <button
                key={split.id}
                type="button"
                onClick={() => setPreferredSplit(split.id as TrainingSplitPreference)}
                className={`p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border min-h-[44px] transition-all text-center touch-manipulation ${
                  preferredSplit === split.id
                    ? 'bg-accent border-accent/40 text-text-primary font-black shadow-sm'
                    : 'bg-surface-subtle border-border-subtle text-text-secondary hover:text-text-primary hover:bg-border-subtle/40'
                }`}
              >
                {split.label}
              </button>
            ))}
          </div>
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
          Continue to Nutrition
        </Button>
      </div>
    </form>
  );
};
