/** @file Collates localised copy for the offline management screen. */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export type OfflineLocalisations = {
  readonly navigationCopy: {
    readonly bottomNavAriaLabel: string;
    readonly headerTitle: string;
    readonly headerSubtitle: string;
    readonly backLabel: string;
    readonly addAreaLabel: string;
  };
  readonly storageCopy: {
    readonly heading: string;
    readonly subtitle: string;
    readonly usedLabel: string;
    readonly usedDescription: string;
    readonly mapsLabel: string;
    readonly availableLabel: string;
  };
  readonly downloadsCopy: {
    readonly downloadsHeading: string;
    readonly downloadsDescription: string;
    readonly manageLabel: string;
    readonly doneLabel: string;
    readonly statusCompleteLabel: string;
    readonly statusUpdatingLabel: string;
    readonly statusDownloadingLabel: string;
    readonly undoDescription: string;
    readonly undoButtonLabel: string;
    readonly autoHeading: string;
  };
  readonly suggestionsCopy: {
    readonly heading: string;
    readonly dismissLabel: string;
  } | null;
  readonly dialogCopy: {
    readonly title: string;
    readonly description: string;
    readonly searchPlaceholder: string;
    readonly cancelLabel: string;
    readonly previewLabel: string;
  } | null;
  readonly undoDescriptionDefault: string;
};

type OfflineLocalisationOptions = {
  readonly storageUsedFormatted: string;
  readonly storageTotalFormatted: string;
  readonly storageAutoDeleteDays: number;
  readonly suggestionsLength: number;
  readonly dialogOpen: boolean;
};

export const useOfflineLocalisations = ({
  storageUsedFormatted,
  storageTotalFormatted,
  storageAutoDeleteDays,
  suggestionsLength,
  dialogOpen,
}: OfflineLocalisationOptions): OfflineLocalisations => {
  const { t } = useTranslation();
  const undoDescriptionDefault = "Tap undo to restore this map.";

  const navigationCopy = useMemo(
    () => ({
      bottomNavAriaLabel: t("nav-primary-aria-label", {
        defaultValue: "Primary navigation",
      }),
      headerTitle: t("offline-header-title", { defaultValue: "Offline Maps" }),
      headerSubtitle: t("offline-header-subtitle", {
        defaultValue: "Manage downloads and smart updates",
      }),
      backLabel: t("offline-header-back-label", {
        defaultValue: "Back to map",
      }),
      addAreaLabel: t("offline-header-add-area-label", {
        defaultValue: "Add offline area",
      }),
    }),
    [t],
  );

  const storageCopy = useMemo(
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

  const downloadsCopy = useMemo(
    () => ({
      downloadsHeading: t("offline-downloads-heading", {
        defaultValue: "Downloaded areas",
      }),
      downloadsDescription: t("offline-downloads-description", {
        defaultValue: "Manage maps for offline navigation",
      }),
      manageLabel: t("offline-downloads-manage", { defaultValue: "Manage" }),
      doneLabel: t("offline-downloads-done", { defaultValue: "Done" }),
      statusCompleteLabel: t("offline-downloads-status-complete", {
        defaultValue: "Complete",
      }),
      statusUpdatingLabel: t("offline-downloads-status-updating", {
        defaultValue: "Update available",
      }),
      statusDownloadingLabel: t("offline-downloads-status-downloading", {
        defaultValue: "Downloading",
      }),
      undoDescription: t("offline-downloads-undo-description", {
        defaultValue: undoDescriptionDefault,
      }),
      undoButtonLabel: t("offline-downloads-undo-button", {
        defaultValue: "Undo",
      }),
      autoHeading: t("offline-auto-heading", {
        defaultValue: "Auto-Management",
      }),
    }),
    [t],
  );

  const suggestionsCopy = useMemo(() => {
    if (suggestionsLength === 0) {
      return null;
    }
    return {
      heading: t("offline-suggestions-heading", {
        defaultValue: "Smart travel hints",
      }),
      dismissLabel: t("offline-suggestion-dismiss", {
        defaultValue: "Dismiss",
      }),
    } as const;
  }, [suggestionsLength, t]);

  const dialogCopy = useMemo(() => {
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

  return {
    navigationCopy,
    storageCopy,
    downloadsCopy,
    suggestionsCopy,
    dialogCopy,
    undoDescriptionDefault,
  };
};
