/** @file Hook to prepare formatted and localised data for a saved route. */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { WalkRouteSummary } from "../../../data/map";
import { buildDifficultyLookup } from "../../../data/registries/difficulties";
import { pickLocalization } from "../../../domain/entities/localization";
import { formatRelativeTime } from "../../../lib/relative-time";
import { formatDistance, formatDuration, formatStops } from "../../../units/unit-format";
import { useUnitPreferences } from "../../../units/unit-preferences-provider";

export type SavedRouteData = {
  readonly routeCopy: ReturnType<typeof pickLocalization>;
  readonly difficultyLabel: string;
  readonly updatedLabel: string;
  readonly distance: ReturnType<typeof formatDistance>;
  readonly duration: ReturnType<typeof formatDuration>;
  readonly stops: ReturnType<typeof formatStops>;
  readonly numberFormatter: Intl.NumberFormat;
  readonly ratingFormatter: Intl.NumberFormat;
  readonly difficultyLookup: ReturnType<typeof buildDifficultyLookup>;
};

export const useSavedRouteData = (route: WalkRouteSummary): SavedRouteData => {
  const { t, i18n } = useTranslation();
  const { unitSystem } = useUnitPreferences();

  const numberFormatter = useMemo(() => new Intl.NumberFormat(i18n.language), [i18n.language]);
  const ratingFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    [i18n.language],
  );
  const difficultyLookup = useMemo(() => buildDifficultyLookup(t), [t]);

  const unitOptions = useMemo(
    () => ({ t, locale: i18n.language, unitSystem }),
    [i18n.language, t, unitSystem],
  );

  const routeCopy = pickLocalization(route.localizations, i18n.language);
  const difficultyLabel = difficultyLookup.get(route.difficultyId)?.label ?? route.difficultyId;
  const updatedLabel = formatRelativeTime(route.lastUpdatedAt, i18n.language);

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

  return {
    routeCopy,
    difficultyLabel,
    updatedLabel,
    distance,
    duration,
    stops,
    numberFormatter,
    ratingFormatter,
    difficultyLookup,
  };
};
