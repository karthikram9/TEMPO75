/**
 * Domain-specific formatting utilities for TEMPO 75.
 * Designed for athletic precision and tabular numeric displays.
 */

/**
 * Format weight value to 1 decimal place with unit.
 * Example: formatWeight(76.4) -> "76.4 kg"
 */
export function formatWeight(val: number, unit: 'kg' | 'lbs' = 'kg'): string {
  return `${val.toFixed(1)} ${unit}`;
}

/**
 * Format integer values with locale comma separators.
 * Example: formatNumber(9000) -> "9,000"
 */
export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(val));
}

/**
 * Format macronutrient grams.
 * Example: formatGrams(50) -> "50 g"
 */
export function formatGrams(val: number): string {
  return `${Math.round(val)} g`;
}

/**
 * Format percentage values.
 * Example: formatPercent(75) -> "75%"
 */
export function formatPercent(val: number): string {
  return `${Math.round(val)}%`;
}

/**
 * Format challenge day with leading zero for days < 10.
 * Example: formatDay(7) -> "Day 07"
 */
export function formatDay(dayNumber: number): string {
  const formatted = String(dayNumber).padStart(2, '0');
  return `Day ${formatted}`;
}

/**
 * Format duration in seconds to mm:ss or hh:mm:ss.
 * Example: formatDuration(3665) -> "1:01:05", formatDuration(125) -> "02:05"
 */
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
