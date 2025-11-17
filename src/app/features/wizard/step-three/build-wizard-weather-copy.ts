/** @file Builds translated wizard weather summary descriptors. */

import type { TFunction } from "i18next";

import { wizardWeatherSummary } from "../../../data/wizard";

export type WizardWeatherCopy = {
  readonly title: string;
  readonly summary: string;
  readonly reminder: string;
  readonly temperatureLabel: string;
  readonly sentiment: string;
};

const formatTemperatureLabel = (celsius: number): string => `${celsius}\u00B0C`;

export const buildWizardWeatherCopy = (t: TFunction): WizardWeatherCopy => {
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

  const temperatureLabel = formatTemperatureLabel(wizardWeatherSummary.temperatureCelsius);

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
