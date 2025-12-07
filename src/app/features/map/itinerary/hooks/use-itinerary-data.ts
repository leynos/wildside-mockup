/** @file Hook to prepare formatted and localised data for an itinerary route. */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { WalkRouteSummary } from "../../../../data/map";
import { pickLocalization } from "../../../../domain/entities/localization";
import { formatDistance, formatDuration, formatStops } from "../../../../units/unit-format";
import { useUnitPreferences } from "../../../../units/unit-preferences-provider";

export type ItineraryLabels = {
  readonly distance: string;
  readonly duration: string;
  readonly stops: string;
};

export type ItineraryData = {
  readonly language: string;
  readonly routeCopy: ReturnType<typeof pickLocalization>;
  readonly distance: ReturnType<typeof formatDistance>;
  readonly duration: ReturnType<typeof formatDuration>;
  readonly stops: ReturnType<typeof formatStops>;
  readonly labels: ItineraryLabels;
};

export const useItineraryData = (route: WalkRouteSummary): ItineraryData => {
  const { t, i18n } = useTranslation();
  const { unitSystem } = useUnitPreferences();

  const unitOptions = useMemo(
    () => ({ t, locale: i18n.language, unitSystem }),
    [i18n.language, t, unitSystem],
  );

  const distance = formatDistance(route.distanceMetres, unitOptions);
  const duration = formatDuration(route.durationSeconds, {
    ...unitOptions,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const stops = formatStops(route.stopsCount, {
    ...unitOptions,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const routeCopy = pickLocalization(route.localizations, i18n.language);
  const labels: ItineraryLabels = {
    distance: t("map-itinerary-distance-label", { defaultValue: "Distance" }),
    duration: t("map-itinerary-duration-label", { defaultValue: "Walking" }),
    stops: t("map-itinerary-stops-label", { defaultValue: "Stops" }),
  };

  return {
    language: i18n.language,
    routeCopy,
    distance,
    duration,
    stops,
    labels,
  };
};
