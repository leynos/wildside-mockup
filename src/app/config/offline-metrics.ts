/** @file Shared configuration for offline storage metrics.
 *
 * This module centralises the default values used to describe offline storage
 * usage in the UI and tests. The values are deliberately simple strings so
 * that a future change can swap them for formatted numbers without touching
 * call-sites.
 *
 * @example
 * ```ts
 * import { OFFLINE_STORAGE_DEFAULTS } from "../config/offline-metrics";
 *
 * const used = OFFLINE_STORAGE_DEFAULTS.usedLabel;
 * const total = OFFLINE_STORAGE_DEFAULTS.totalLabel;
 * const days = OFFLINE_STORAGE_DEFAULTS.autoDeleteDays;
 * ```
 */

export interface OfflineStorageDefaults {
  readonly usedLabel: string;
  readonly totalLabel: string;
  readonly autoDeleteDays: number;
}

export const OFFLINE_STORAGE_DEFAULTS: OfflineStorageDefaults = {
  usedLabel: "2.8 GB",
  totalLabel: "8 GB",
  autoDeleteDays: 30,
};
