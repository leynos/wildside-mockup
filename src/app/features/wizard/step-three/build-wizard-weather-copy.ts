/** @file Builds translated wizard weather summary descriptors. */

import type { TFunction } from "i18next";

import { wizardWeatherSummary } from "../../../data/wizard";
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
  const title = t(wizardWeatherSummary.titleKey, {
    defaultValue: wizardWeatherSummary.defaultTitle,
  });

  const reminder = t(wizardWeatherSummary.reminderKey, {
    defaultValue: wizardWeatherSummary.defaultReminder,
  });

  const sentiment = t(wizardWeatherSummary.sentimentKey, {
    defaultValue: wizardWeatherSummary.defaultSentiment,
  });

  const windDescriptor = t(wizardWeatherSummary.windDescriptorKey, {
    defaultValue: wizardWeatherSummary.defaultWindDescriptor,
  });

  const skyDescriptor = t(wizardWeatherSummary.skyDescriptorKey, {
    defaultValue: wizardWeatherSummary.defaultSkyDescriptor,
  });

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

  const summary = t(wizardWeatherSummary.summaryKey, {
    defaultValue: wizardWeatherSummary.defaultSummary,
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
