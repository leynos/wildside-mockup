/** @file Hook exposing downloads copy and constants for the offline screen. */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const undoDescriptionDefault = "Tap undo to restore this map.";

export const useOfflineDownloadsCopy = () => {
  const { t } = useTranslation();

  const copy = useMemo(
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

  return { copy, undoDescriptionDefault } as const;
};
