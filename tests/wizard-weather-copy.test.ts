import { describe, expect, it } from "bun:test";
import type { TFunction } from "i18next";

import { wizardWeatherSummary } from "../src/app/data/wizard";
import { pickLocalization } from "../src/app/domain/entities/localization";
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
    const stubT = ((
      key: string,
      optionsOrDefault?: string | TranslationOptions,
      maybeOptions?: TranslationOptions,
    ) => {
      const options: TranslationOptions | undefined =
        typeof optionsOrDefault === "string"
          ? { ...maybeOptions, defaultValue: optionsOrDefault }
          : optionsOrDefault;

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
    }) as unknown as TFunction;

    const locale = "en-GB";
    const weatherCopy = buildWizardWeatherCopy(stubT, locale, "metric");
    const windDescriptor = pickLocalization(wizardWeatherSummary.windLocalizations, locale).name;
    const skyDescriptor = pickLocalization(wizardWeatherSummary.skyLocalizations, locale).name;

    expect(weatherCopy.temperatureLabel).toBe(
      `${wizardWeatherSummary.temperatureCelsius.toFixed(1)}\u00B0C`,
    );
    const expectedSummary = `${wizardWeatherSummary.temperatureCelsius.toFixed(1)}\u00B0C, ${windDescriptor}, ${skyDescriptor}`;
    expect(weatherCopy.summary).toBe(expectedSummary);

    const summaryCall = calls.find((call) => call.key === "wizard-step-three-weather-summary");
    expect(summaryCall?.options?.temperature).toBe(weatherCopy.temperatureLabel);
    expect(summaryCall?.options?.wind).toBe(windDescriptor);
    expect(summaryCall?.options?.sky).toBe(skyDescriptor);

    const temperatureUnitCall = calls.find((call) => call.key === "unit-temperature-celsius");
    expect(temperatureUnitCall?.options?.defaultValue).toBe("°C");
  });
});
