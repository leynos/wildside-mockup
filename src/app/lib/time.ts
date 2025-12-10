/** @file Centralised time adapter for testability and consistency. */

/**
 * Return the current Unix timestamp in milliseconds.
 *
 * Centralising `Date.now()` calls enables deterministic testing and ensures
 * consistent time sources across the application.
 *
 * @example
 * const now = getNow();
 * formatRelativeTime(pastTimestamp, "en-GB", now);
 */
export const getNow = (): number => Date.now();
