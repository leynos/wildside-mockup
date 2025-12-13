/**
 * @file Walk completion stat formatting helpers.
 *
 * Responsibilities:
 * - Format WalkComplete stat values (distance, duration, counts, energy) using
 *   the active locale and unit system.
 * - Preserve locale-aware spacing between numbers and units.
 *
 * Usage:
 * - `const { formatStatValue } = useWalkCompleteFormatting();`
 * - `formatStatValue({ kind: "distance", metres: 1200 });`
 */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { WalkCompletionStat } from "../../../data/stage-four";
import {
  formatDistance,
  formatDuration,
  formatEnergy,
  formatStops,
} from "../../../units/unit-format";
import { joinUnit } from "../../../units/unit-format-helpers";
import { useUnitPreferences } from "../../../units/unit-preferences-provider";

export type WalkCompleteFormatting = {
  readonly formatStatValue: (value: WalkCompletionStat["value"]) => string;
};

export function useWalkCompleteFormatting(): WalkCompleteFormatting {
  const { t, i18n } = useTranslation();
  const { unitSystem } = useUnitPreferences();

  const numberFormatter = useMemo(() => new Intl.NumberFormat(i18n.language), [i18n.language]);

  const unitOptions = useMemo(
    () => ({ t, locale: i18n.language, unitSystem }),
    [i18n.language, t, unitSystem],
  );

  const formatStatValue = useCallback(
    (value: WalkCompletionStat["value"]): string => {
      switch (value.kind) {
        case "distance": {
          const { value: formatted, unitLabel } = formatDistance(value.metres, unitOptions);
          return joinUnit(formatted, unitLabel);
        }
        case "duration": {
          const { value: formatted, unitLabel } = formatDuration(value.seconds, {
            ...unitOptions,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
          return joinUnit(formatted, unitLabel);
        }
        case "count": {
          if (value.unitToken === "count-stop") {
            const { value: formatted, unitLabel } = formatStops(value.value, {
              ...unitOptions,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
            return joinUnit(formatted, unitLabel);
          }
          return numberFormatter.format(value.value);
        }
        case "energy": {
          const { value: formatted, unitLabel } = formatEnergy(value.kilocalories, {
            ...unitOptions,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
          return joinUnit(formatted, unitLabel);
        }
        default: {
          const _exhaustive: never = value;
          return _exhaustive;
        }
      }
    },
    [numberFormatter, unitOptions],
  );

  return { formatStatValue };
}
