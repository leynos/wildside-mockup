/** @file Builds translated wizard route stats for step three. */

import type { TFunction } from "i18next";

import { wizardRouteSummary } from "../../../data/wizard";

export type WizardRouteStatCopy = {
  readonly id: string;
  readonly value: string;
  readonly unitLabel: string;
};

export const buildWizardRouteStats = (t: TFunction): WizardRouteStatCopy[] =>
  wizardRouteSummary.stats.map((stat) => ({
    id: stat.id,
    value: stat.value,
    unitLabel: t(stat.unitKey, { defaultValue: stat.defaultUnit }),
  }));
