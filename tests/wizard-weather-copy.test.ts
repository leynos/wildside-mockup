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

const createStubT = () => {
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

  return { stubT, calls };
};

describe("buildWizardWeatherCopy", () => {
  it("interpolates Celsius temperature and descriptors", () => {
    const { stubT, calls } = createStubT();

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

  it("converts to Fahrenheit for imperial unit system", () => {
    const { stubT, calls } = createStubT();

    const locale = "en-US";
    const weatherCopy = buildWizardWeatherCopy(stubT, locale, "imperial");

    // 22°C = 71.6°F
    const expectedFahrenheit = (wizardWeatherSummary.temperatureCelsius * 9) / 5 + 32;
    expect(weatherCopy.temperatureLabel).toBe(`${expectedFahrenheit.toFixed(1)}\u00B0F`);

    const temperatureUnitCall = calls.find((call) => call.key === "unit-temperature-fahrenheit");
    expect(temperatureUnitCall?.options?.defaultValue).toBe("°F");
  });

  it("uses locale-specific localizations for non-default locale", () => {
    const { stubT } = createStubT();

    const locale = "de";
    const weatherCopy = buildWizardWeatherCopy(stubT, locale, "metric");

    const expectedTitle = pickLocalization(wizardWeatherSummary.localizations, locale).name;
    const expectedReminder =
      pickLocalization(wizardWeatherSummary.localizations, locale).description ?? "";
    const expectedSentiment = pickLocalization(
      wizardWeatherSummary.sentimentLocalizations,
      locale,
    ).name;
    const expectedWind = pickLocalization(wizardWeatherSummary.windLocalizations, locale).name;
    const expectedSky = pickLocalization(wizardWeatherSummary.skyLocalizations, locale).name;

    expect(weatherCopy.title).toBe(expectedTitle);
    expect(weatherCopy.reminder).toBe(expectedReminder);
    expect(weatherCopy.sentiment).toBe(expectedSentiment);
    expect(weatherCopy.summary).toContain(expectedWind);
    expect(weatherCopy.summary).toContain(expectedSky);
  });

  it("includes all localized fields in the output", () => {
    const { stubT } = createStubT();

    const locale = "ja";
    const weatherCopy = buildWizardWeatherCopy(stubT, locale, "metric");

    expect(weatherCopy.title).toBe(
      pickLocalization(wizardWeatherSummary.localizations, locale).name,
    );
    expect(weatherCopy.reminder).toBe(
      pickLocalization(wizardWeatherSummary.localizations, locale).description ?? "",
    );
    expect(weatherCopy.sentiment).toBe(
      pickLocalization(wizardWeatherSummary.sentimentLocalizations, locale).name,
    );
    expect(weatherCopy.temperatureLabel).toBeTruthy();
    expect(weatherCopy.summary).toBeTruthy();
  });
});
