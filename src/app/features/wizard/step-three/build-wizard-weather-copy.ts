/** @file Builds translated wizard weather summary descriptors. */

import type { TFunction } from "i18next";

import { wizardWeatherSummary } from "../../../data/wizard";
import { pickLocalization } from "../../../domain/entities/localization";
import { formatTemperature } from "../../../units/unit-format";
import type { UnitSystem } from "../../../units/unit-system";

export type WizardWeatherCopy = {
  readonly title: string;
  readonly summary: string;
  readonly reminder: string;
  readonly temperatureLabel: string;
  readonly sentiment: string;
};

export const buildWizardWeatherCopy = (
  t: TFunction,
  locale: string,
  unitSystem: UnitSystem,
): WizardWeatherCopy => {
  const localized = pickLocalization(wizardWeatherSummary.localizations, locale);
  const title = localized.name;
  const reminder = localized.description ?? "";

  const sentiment = pickLocalization(wizardWeatherSummary.sentimentLocalizations, locale).name;
  const windDescriptor = pickLocalization(wizardWeatherSummary.windLocalizations, locale).name;
  const skyDescriptor = pickLocalization(wizardWeatherSummary.skyLocalizations, locale).name;

  const { value: temperatureValue, unitLabel: temperatureUnit } = formatTemperature(
    wizardWeatherSummary.temperatureCelsius,
    {
      t,
      locale,
      unitSystem,
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    },
  );

  const temperatureLabel = `${temperatureValue}${
    temperatureUnit.trimStart().startsWith("°") ? "" : " "
  }${temperatureUnit}`;

  const summary = t("wizard-step-three-weather-summary", {
    defaultValue: `${temperatureLabel}, ${windDescriptor}, ${skyDescriptor}`,
    temperature: temperatureLabel,
    wind: windDescriptor,
    sky: skyDescriptor,
  });

  return {
    title,
    summary,
    reminder,
    temperatureLabel,
    sentiment,
  };
};
