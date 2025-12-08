/** @file Hook exposing dialog copy for the offline download modal. */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export type OfflineDialogCopy = {
  readonly title: string;
  readonly description: string;
  readonly searchPlaceholder: string;
  readonly cancelLabel: string;
  readonly previewLabel: string;
} | null;

export const useOfflineDialogCopy = (dialogOpen: boolean): OfflineDialogCopy => {
  const { t } = useTranslation();

  return useMemo(() => {
    if (!dialogOpen) {
      return null;
    }

    return {
      title: t("offline-dialog-title", { defaultValue: "Download new area" }),
      description: t("offline-dialog-description", {
        defaultValue:
          "Sync maps for offline access. Search for a city or drop a pin to select a custom region.",
      }),
      searchPlaceholder: t("offline-dialog-search-placeholder", {
        defaultValue: "Search cities or regions",
      }),
      cancelLabel: t("offline-dialog-cancel", { defaultValue: "Cancel" }),
      previewLabel: t("offline-dialog-preview", {
        defaultValue: "Preview download",
      }),
    } as const;
  }, [dialogOpen, t]);
};
