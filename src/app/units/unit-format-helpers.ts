/**
 * @file Shared helpers for unit formatting output.
 *
 * Responsibilities:
 * - Join a formatted numeric value with a unit label whilst preserving
 *   locale-aware spacing rules (some locales include NBSP / narrow NBSP as part
 *   of the unit label).
 *
 * Usage:
 * - `joinUnit("2.4", "km") // => "2.4 km"`
 * - `joinUnit("2.4", "\u202Fkm") // => "2.4\u202Fkm"`
 */

export const joinUnit = (value: string, unitLabel: string): string => {
  if (!unitLabel) return value;

  const hasLeadingWhitespace = /^[\s\u00A0\u202F]/u.test(unitLabel);
  return `${value}${hasLeadingWhitespace ? "" : " "}${unitLabel}`;
};
