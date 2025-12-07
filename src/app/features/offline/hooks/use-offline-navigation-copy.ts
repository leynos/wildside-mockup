/** @file Hook exposing navigation copy for the offline screen. */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useOfflineNavigationCopy = () => {
  const { t } = useTranslation();

  return useMemo(
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
};
