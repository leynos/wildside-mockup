/** @file Provides stable value formatting for walk completion stats. */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { WalkCompletionStat } from "../../../data/stage-four";
import {
  formatDistance,
  formatDuration,
  formatEnergy,
  formatStops,
} from "../../../units/unit-format";
import { useUnitPreferences } from "../../../units/unit-preferences-provider";

export type WalkCompleteFormatting = {
  readonly formatStatValue: (value: WalkCompletionStat["value"]) => string;
};

export function useWalkCompleteFormatting(): WalkCompleteFormatting {
  const { t, i18n } = useTranslation();
  const { unitSystem } = useUnitPreferences();

  const unitOptions = useMemo(
    () => ({ t, locale: i18n.language, unitSystem }),
    [i18n.language, t, unitSystem],
  );

  const formatStatValue = useCallback(
    (value: WalkCompletionStat["value"]): string => {
      switch (value.kind) {
        case "distance": {
          const { value: formatted, unitLabel } = formatDistance(value.metres, unitOptions);
          return `${formatted} ${unitLabel}`;
        }
        case "duration": {
          const { value: formatted, unitLabel } = formatDuration(value.seconds, {
            ...unitOptions,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
          return `${formatted} ${unitLabel}`;
        }
        case "count": {
          if (value.unitToken === "count-stop") {
            const { value: formatted, unitLabel } = formatStops(value.value, {
              ...unitOptions,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
            return `${formatted} ${unitLabel}`;
          }
          return new Intl.NumberFormat(unitOptions.locale).format(value.value);
        }
        case "energy": {
          const { value: formatted, unitLabel } = formatEnergy(value.kilocalories, {
            ...unitOptions,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
          return `${formatted} ${unitLabel}`;
        }
        default:
          return "";
      }
    },
    [unitOptions],
  );

  return { formatStatValue };
}
