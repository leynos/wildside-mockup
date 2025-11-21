import { describe, expect, it } from "bun:test";
import type { TFunction } from "i18next";

import { wizardWeatherSummary } from "../src/app/data/wizard";
import { buildWizardWeatherCopy } from "../src/app/features/wizard/step-three/build-wizard-weather-copy";

type TranslationOptions = {
  defaultValue?: string;
  temperature?: string;
  wind?: string;
  sky?: string;
};

type TranslationCall = {
  key: string;
  options?: TranslationOptions;
};

describe("buildWizardWeatherCopy", () => {
  it("interpolates Celsius temperature and descriptors", () => {
    const calls: TranslationCall[] = [];
    const stubT = ((key: string, options?: TranslationOptions) => {
      if (options) {
        calls.push({ key, options });
      } else {
        calls.push({ key });
      }

      const base = String(options?.defaultValue ?? key);
      const temperature = options?.temperature ?? "";
      const wind = options?.wind ?? "";
      const sky = options?.sky ?? "";

      return base
        .replaceAll("{{temperature}}", temperature)
        .replaceAll("{{wind}}", wind)
        .replaceAll("{{sky}}", sky);
    }) as TFunction;

    const weatherCopy = buildWizardWeatherCopy(stubT);

    expect(weatherCopy.temperatureLabel).toBe(
      `${wizardWeatherSummary.temperatureCelsius.toFixed(1)}\u00B0C`,
    );
    const expectedSummary = `${wizardWeatherSummary.temperatureCelsius.toFixed(1)}\u00B0C, ${wizardWeatherSummary.defaultWindDescriptor}, ${wizardWeatherSummary.defaultSkyDescriptor}`;
    expect(weatherCopy.summary).toBe(expectedSummary);

    const summaryCall = calls.find((call) => call.key === wizardWeatherSummary.summaryKey);
    expect(summaryCall?.options?.temperature).toBe(weatherCopy.temperatureLabel);
    expect(summaryCall?.options?.wind).toBe(wizardWeatherSummary.defaultWindDescriptor);
    expect(summaryCall?.options?.sky).toBe(wizardWeatherSummary.defaultSkyDescriptor);
  });
});
