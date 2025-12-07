/** @file Hook exposing suggestions copy for the offline screen. */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useOfflineSuggestionsCopy = (suggestionsLength: number) => {
  const { t } = useTranslation();

  return useMemo(() => {
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
};
