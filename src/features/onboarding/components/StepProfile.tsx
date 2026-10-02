import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button, Input, NumberInput, Select, Card } from '@/components/ui';
import type { LengthUnit, WeightUnit, UserSex } from '@/types';
import {
  lbsToKg,
  kgToLbs,
  ftInToCm,
  cmToFtIn,
} from '../utils/goalCalculations';

export interface ProfileStepData {
  name: string;
  age: number;
  sex: UserSex;
  heightCm: number;
  weightKg: number;
  lengthUnit: LengthUnit;
  weightUnit: WeightUnit;
}

export interface StepProfileProps {
  initialData: Partial<ProfileStepData>;
  onNext: (data: ProfileStepData) => void;
  onBack: () => void;
}

export const StepProfile: React.FC<StepProfileProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [name, setName] = useState<string>(initialData.name ?? '');
  const [age, setAge] = useState<number>(initialData.age ?? 26);
  const [sex, setSex] = useState<UserSex>(initialData.sex ?? 'male');

  // Units
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>(initialData.lengthUnit ?? 'cm');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(initialData.weightUnit ?? 'kg');

  // Normalized values
  const [heightCm, setHeightCm] = useState<number>(initialData.heightCm ?? 178);
  const [weightKg, setWeightKg] = useState<number>(initialData.weightKg ?? 80.0);

  // Imperial display helpers
  const initialImperialHeight = cmToFtIn(heightCm);
  const [feet, setFeet] = useState<number>(initialImperialHeight.feet);
  const [inches, setInches] = useState<number>(initialImperialHeight.inches);

  // Display weight
  const displayWeight = weightUnit === 'kg' ? weightKg : kgToLbs(weightKg);

  const handleWeightChange = (newVal: number) => {
    if (weightUnit === 'kg') {
      setWeightKg(newVal);
    } else {
      setWeightKg(lbsToKg(newVal));
    }
  };

  const handleUnitToggleWeight = (newUnit: WeightUnit) => {
    setWeightUnit(newUnit);
  };

  const handleUnitToggleLength = (newUnit: LengthUnit) => {
    if (newUnit === 'in' && lengthUnit === 'cm') {
      const converted = cmToFtIn(heightCm);
      setFeet(converted.feet);
      setInches(converted.inches);
    } else if (newUnit === 'cm' && lengthUnit === 'in') {
      setHeightCm(ftInToCm(feet, inches));
    }
    setLengthUnit(newUnit);
  };

  const handleFeetChange = (newFt: number) => {
    setFeet(newFt);
    setHeightCm(ftInToCm(newFt, inches));
  };

  const handleInchesChange = (newIn: number) => {
    setInches(newIn);
    setHeightCm(ftInToCm(feet, newIn));
  };

  // Validation
  const isNameValid = name.trim().length >= 2;
  const isAgeValid = age >= 14 && age <= 95;
  const isHeightValid = heightCm >= 100 && heightCm <= 240;
  const isWeightValid = weightKg >= 35 && weightKg <= 250;
  const canProceed = isNameValid && isAgeValid && isHeightValid && isWeightValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed) return;

    onNext({
      name: name.trim(),
      age,
      sex,
      heightCm,
      weightKg,
      lengthUnit,
      weightUnit,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-1">
        <h2 className="type-h1 text-text-primary">Personal Profile</h2>
        <p className="type-body text-text-secondary">
          Baseline physical parameters for your 75-day transformation protocol.
        </p>
      </div>

      <Card variant="default" padding="md" className="space-y-5">
        {/* Name */}
        <Input
          label="Full Name or Athlete Handle"
          placeholder="e.g. Alex Vance"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          helperText="Used to personalize your protocol records"
        />

        {/* Age and Sex */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Age"
            value={age}
            onChange={setAge}
            min={14}
            max={99}
            step={1}
            unit="yrs"
            inputMode="numeric"
          />

          <Select
            label="Biological Sex"
            value={sex}
            onChange={(e) => setSex(e.target.value as UserSex)}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other / Prefer not to say' },
            ]}
          />
        </div>

        {/* Height with unit toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="type-label">Height</span>
            <div className="flex rounded-full border border-border-subtle bg-surface-subtle p-0.5">
              <button
                type="button"
                onClick={() => handleUnitToggleLength('cm')}
                className={`px-3 py-1 text-2xs font-bold rounded-full transition-all ${
                  lengthUnit === 'cm' ? 'bg-accent text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                CM
              </button>
              <button
                type="button"
                onClick={() => handleUnitToggleLength('in')}
                className={`px-3 py-1 text-2xs font-bold rounded-full transition-all ${
                  lengthUnit === 'in' ? 'bg-accent text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                FT / IN
              </button>
            </div>
          </div>

          {lengthUnit === 'cm' ? (
            <NumberInput
              value={heightCm}
              onChange={setHeightCm}
              min={100}
              max={240}
              step={1}
              unit="cm"
              inputMode="numeric"
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <NumberInput
                label="Feet"
                value={feet}
                onChange={handleFeetChange}
                min={3}
                max={7}
                step={1}
                unit="ft"
                inputMode="numeric"
              />
              <NumberInput
                label="Inches"
                value={inches}
                onChange={handleInchesChange}
                min={0}
                max={11}
                step={1}
                unit="in"
                inputMode="numeric"
              />
            </div>
          )}
        </div>

        {/* Starting Weight with unit toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="type-label">Current Body Weight</span>
            <div className="flex rounded-full border border-border-subtle bg-surface-subtle p-0.5">
              <button
                type="button"
                onClick={() => handleUnitToggleWeight('kg')}
                className={`px-3 py-1 text-2xs font-bold rounded-full transition-all ${
                  weightUnit === 'kg' ? 'bg-accent text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                KG
              </button>
              <button
                type="button"
                onClick={() => handleUnitToggleWeight('lbs')}
                className={`px-3 py-1 text-2xs font-bold rounded-full transition-all ${
                  weightUnit === 'lbs' ? 'bg-accent text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                LBS
              </button>
            </div>
          </div>

          <NumberInput
            value={displayWeight}
            onChange={handleWeightChange}
            min={35}
            max={300}
            step={0.5}
            unit={weightUnit}
            inputMode="decimal"
            helperText="Starting weight benchmark for Day 01"
          />
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
          disabled={!canProceed}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Continue to Goal
        </Button>
      </div>
    </form>
  );
};
