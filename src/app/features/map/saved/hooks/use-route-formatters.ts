/** @file Hook providing memoised formatters and lookups for route display. */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { buildDifficultyLookup } from "../../../../data/registries/difficulties";

export type RouteFormatters = {
  readonly numberFormatter: Intl.NumberFormat;
  readonly ratingFormatter: Intl.NumberFormat;
  readonly difficultyLookup: ReturnType<typeof buildDifficultyLookup>;
};

export const useRouteFormatters = (): RouteFormatters => {
  const { t, i18n } = useTranslation();

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

  return useMemo(
    () => ({ numberFormatter, ratingFormatter, difficultyLookup }),
    [numberFormatter, ratingFormatter, difficultyLookup],
  );
};
