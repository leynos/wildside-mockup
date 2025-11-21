/** @file Placeholder configuration for offline storage metrics.
 *
 * These values seed the UI whilst real storage telemetry is not yet wired. When
 * backend metrics land, replace these placeholders or feed the formatter helper
 * below with live numbers.
 */

export interface OfflineStoragePlaceholders {
  readonly usedLabel: string;
  readonly totalLabel: string;
  readonly autoDeleteDays: number;
}

export const OFFLINE_STORAGE_PLACEHOLDERS: OfflineStoragePlaceholders = {
  usedLabel: "2.8 GB",
  totalLabel: "8 GB",
  autoDeleteDays: 30,
};

const BYTES_IN_GIGABYTE = 1024 ** 3;

export const formatStorageLabel = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 GB";
  }
  if (bytes < BYTES_IN_GIGABYTE) {
    return `${Math.round(bytes / 1024 ** 2)} MB`;
  }
  const gigabytes = bytes / BYTES_IN_GIGABYTE;
  return `${gigabytes.toFixed(gigabytes >= 10 ? 0 : 1)} GB`;
};
