/**
 * Pure goal calculation and unit conversion engine for TEMPO 75.
 * Strictly decoupled from UI and components.
 */

export const DAYS_IN_PROTOCOL = 75;

/**
 * Convert pounds to kilograms (rounded to 1 decimal place).
 */
export function lbsToKg(lbs: number): number {
  return Number((lbs * 0.45359237).toFixed(1));
}

/**
 * Convert kilograms to pounds (rounded to 1 decimal place).
 */
export function kgToLbs(kg: number): number {
  return Number((kg * 2.20462262).toFixed(1));
}

/**
 * Convert feet and inches to centimeters (rounded to 1 decimal place).
 */
export function ftInToCm(feet: number, inches: number): number {
  const totalInches = feet * 12 + inches;
  return Number((totalInches * 2.54).toFixed(1));
}

/**
 * Convert centimeters to feet and rounded inches.
 */
export function cmToFtIn(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

/**
 * Calculate weight difference in kilograms.
 * Negative indicates weight loss, positive indicates surplus/gain.
 */
export function calculateWeightDifference(startKg: number, targetKg: number): number {
  return Number((targetKg - startKg).toFixed(1));
}

/**
 * Calculate required weekly loss rate in kg for a fat-loss/recomposition goal.
 * Returns positive rate of loss per week.
 */
export function calculateTargetWeeklyLoss(
  startKg: number,
  targetKg: number,
  days: number = DAYS_IN_PROTOCOL
): number {
  if (targetKg >= startKg || days <= 0) return 0;
  const totalLossKg = startKg - targetKg;
  const weeks = days / 7;
  return Number((totalLossKg / weeks).toFixed(2));
}

/**
 * Calculate required daily loss rate in kg.
 */
export function calculateTargetDailyLoss(
  startKg: number,
  targetKg: number,
  days: number = DAYS_IN_PROTOCOL
): number {
  if (targetKg >= startKg || days <= 0) return 0;
  const totalLossKg = startKg - targetKg;
  return Number((totalLossKg / days).toFixed(3));
}

/**
 * Calculate progress percentage towards goal, clamped between 0 and 100.
 */
export function calculateProgressPercent(
  startKg: number,
  currentKg: number,
  targetKg: number
): number {
  if (startKg === targetKg) return 100;

  const totalDelta = targetKg - startKg;
  const currentDelta = currentKg - startKg;

  const rawPercent = (currentDelta / totalDelta) * 100;
  return Math.min(100, Math.max(0, Math.round(rawPercent)));
}

/**
 * Determines whether a target rate of fat loss is aggressive.
 * Defined as > 1.0 kg/week or > 1.0% of starting bodyweight per week.
 */
export function isAggressiveLossRate(
  startKg: number,
  targetKg: number,
  days: number = DAYS_IN_PROTOCOL
): boolean {
  if (startKg <= 0 || targetKg >= startKg) return false;
  const weeklyRateKg = calculateTargetWeeklyLoss(startKg, targetKg, days);
  const percentPerWeek = (weeklyRateKg / startKg) * 100;
  return weeklyRateKg > 1.0 || percentPerWeek > 1.0;
}

/**
 * Calculate target completion date in YYYY-MM-DD.
 */
export function calculateTargetDate(startDate: string, days: number = DAYS_IN_PROTOCOL): string {
  const date = new Date(startDate);
  date.setDate(date.getDate() + (days - 1));
  return date.toISOString().split('T')[0] ?? '';
}

/**
 * Evaluates whether a protein target is lower than resistance training guidelines (1.4 g/kg).
 */
export function isProteinLow(proteinGrams: number, weightKg: number): boolean {
  if (weightKg <= 0) return false;
  const ratio = proteinGrams / weightKg;
  return ratio < 1.4;
}
