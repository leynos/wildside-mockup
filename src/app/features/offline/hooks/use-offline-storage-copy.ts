/** @file Hook exposing storage copy for the offline screen. */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export type OfflineStorageCopy = {
  readonly heading: string;
  readonly subtitle: string;
  readonly usedLabel: string;
  readonly usedDescription: string;
  readonly mapsLabel: string;
  readonly availableLabel: string;
};

export const useOfflineStorageCopy = (
  storageUsedFormatted: string,
  storageTotalFormatted: string,
  storageAutoDeleteDays: number,
) => {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      heading: t("offline-storage-heading", {
        defaultValue: "Storage overview",
      }),
      subtitle: t("offline-storage-subtitle", {
        days: storageAutoDeleteDays,
        defaultValue: `Auto-delete unused maps after ${storageAutoDeleteDays} days`,
      }),
      usedLabel: t("offline-storage-used-label", { defaultValue: "Used" }),
      usedDescription: t("offline-storage-used-description", {
        used: storageUsedFormatted,
        total: storageTotalFormatted,
        defaultValue: `${storageUsedFormatted} of ${storageTotalFormatted}`,
      }),
      mapsLabel: t("offline-storage-legend-maps", { defaultValue: "Maps" }),
      availableLabel: t("offline-storage-legend-available", {
        defaultValue: "Available space",
      }),
    }),
    [storageAutoDeleteDays, storageTotalFormatted, storageUsedFormatted, t],
  );
};
