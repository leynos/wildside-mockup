/** @file Builds translated wizard route stats for step three. */

import type { TFunction } from "i18next";
import { wizardRouteSummary } from "../../../data/wizard";
import { formatDistance, formatDuration, formatStops } from "../../../units/unit-format";
import type { UnitSystem } from "../../../units/unit-system";

export type WizardRouteStatCopy = {
  readonly id: string;
  readonly value: string;
  readonly unitLabel: string;
};

export const buildWizardRouteStats = (
  t: TFunction,
  locale: string,
  unitSystem: UnitSystem,
): WizardRouteStatCopy[] =>
  wizardRouteSummary.stats.map((stat) => {
    switch (stat.quantity.kind) {
      case "distance": {
        const { value, unitLabel } = formatDistance(stat.quantity.metres, {
          t,
          locale,
          unitSystem,
        });
        return { id: stat.id, value, unitLabel };
      }
      case "duration": {
        const { value, unitLabel } = formatDuration(stat.quantity.seconds, {
          t,
          locale,
          unitSystem,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        return { id: stat.id, value, unitLabel };
      }
      case "count": {
        const { value, unitLabel } = formatStops(stat.quantity.value, {
          t,
          locale,
          unitSystem,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        return { id: stat.id, value, unitLabel };
      }
      default: {
        return { id: stat.id, value: "", unitLabel: "" };
      }
    }
  });
