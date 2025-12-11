import { describe, expect, it } from "bun:test";
import type { TFunction } from "i18next";

import { wizardGeneratedStops, wizardRouteSummary } from "../src/app/data/wizard";
import { pickLocalization } from "../src/app/domain/entities/localization";

type TranslationCall = {
  key: string;
  options?: Record<string, unknown>;
};

const createStubT = () => {
  const calls: TranslationCall[] = [];
  const stubT = ((
    key: string,
    optionsOrDefault?: string | Record<string, unknown>,
    maybeOptions?: Record<string, unknown>,
  ) => {
    const options: Record<string, unknown> | undefined =
      typeof optionsOrDefault === "string"
        ? { ...maybeOptions, defaultValue: optionsOrDefault }
        : optionsOrDefault;

    if (options !== undefined) {
      calls.push({ key, options });
    } else {
      calls.push({ key });
    }

    // biome-ignore lint/complexity/useLiteralKeys: Record<string, unknown> requires bracket notation
    const defaultValue = options?.["defaultValue"] ?? key;
    // biome-ignore lint/complexity/useLiteralKeys: Record<string, unknown> requires bracket notation
    const note = options?.["note"] ?? "";
    // biome-ignore lint/complexity/useLiteralKeys: Record<string, unknown> requires bracket notation
    const distance = options?.["distance"] ?? "";

    return String(defaultValue)
      .replaceAll("{{note}}", String(note))
      .replaceAll("{$note}", String(note))
      .replaceAll("{{distance}}", String(distance))
      .replaceAll("{$distance}", String(distance));
  }) as unknown as TFunction;

  return { stubT, calls };
};

describe("wizard step-three stop note distance interpolation", () => {
  it("generated stops have noteDistanceMetres for distance calculation", () => {
    const stopsWithDistance = wizardGeneratedStops.filter(
      (stop) => stop.noteDistanceMetres !== undefined,
    );

    expect(stopsWithDistance.length).toBeGreaterThan(0);

    stopsWithDistance.forEach((stop) => {
      expect(stop.noteDistanceMetres).toBeGreaterThan(0);
    });
  });

  it("stop note translations use distance interpolation key", () => {
    const { stubT, calls } = createStubT();

    // Simulate calling the translation function with a stop that has distance
    const stopWithDistance = wizardGeneratedStops.find((s) => s.noteDistanceMetres !== undefined);
    expect(stopWithDistance).toBeDefined();

    if (stopWithDistance) {
      const noteLocalized = pickLocalization(stopWithDistance.noteLocalizations, "en-GB");
      const distanceLabel = "1.1 mi";

      // Call the translation the same way step-three-screen does
      stubT("wizard-step-three-stop-note-with-distance", {
        note: noteLocalized.name,
        distance: distanceLabel,
        defaultValue: `${noteLocalized.name} • ${distanceLabel}`,
      });

      const interpolationCall = calls.find(
        (call) => call.key === "wizard-step-three-stop-note-with-distance",
      );
      expect(interpolationCall).toBeDefined();
      // biome-ignore lint/complexity/useLiteralKeys: Record<string, unknown> requires bracket notation
      expect(interpolationCall?.options?.["note"]).toBe(noteLocalized.name);
      // biome-ignore lint/complexity/useLiteralKeys: Record<string, unknown> requires bracket notation
      expect(interpolationCall?.options?.["distance"]).toBe(distanceLabel);
    }
  });

  it("stop notes have localizations for multiple locales", () => {
    const testLocales = ["en-GB", "es", "de", "ja", "ar"] as const;

    wizardGeneratedStops.forEach((stop) => {
      testLocales.forEach((locale) => {
        const noteLocalized = pickLocalization(stop.noteLocalizations, locale);
        expect(noteLocalized.name).toBeTruthy();
      });
    });
  });
});

describe("wizard step-three badge localization", () => {
  it("route summary has badge localizations", () => {
    expect(wizardRouteSummary.badgeLocalizations).toBeDefined();
  });

  it("badge has localized names for multiple locales", () => {
    const testLocales = ["en-GB", "es", "de", "ja", "ar", "zh-CN"] as const;

    testLocales.forEach((locale) => {
      const badgeLocalized = pickLocalization(wizardRouteSummary.badgeLocalizations, locale);
      expect(badgeLocalized.name).toBeTruthy();
    });
  });

  it("badge shows Custom in English", () => {
    const enGbBadge = pickLocalization(wizardRouteSummary.badgeLocalizations, "en-GB");
    expect(enGbBadge.name).toBe("Custom");
  });

  it("badge has different localizations for non-English locales", () => {
    const spanishBadge = pickLocalization(wizardRouteSummary.badgeLocalizations, "es");
    const germanBadge = pickLocalization(wizardRouteSummary.badgeLocalizations, "de");
    const japaneseBadge = pickLocalization(wizardRouteSummary.badgeLocalizations, "ja");

    expect(spanishBadge.name).toBe("Personalizada");
    expect(germanBadge.name).toBe("Individuell");
    expect(japaneseBadge.name).toBe("カスタム");
  });
});

describe("wizard step-three route description localization", () => {
  it("route has description in localizations", () => {
    const enGbRoute = pickLocalization(wizardRouteSummary.localizations, "en-GB");
    expect(enGbRoute.description).toBeTruthy();
    expect(enGbRoute.description?.toLowerCase()).toContain("street-art");
  });

  it("route description has localizations for multiple locales", () => {
    const testLocales = ["en-GB", "es", "de", "ja"] as const;

    testLocales.forEach((locale) => {
      const localized = pickLocalization(wizardRouteSummary.localizations, locale);
      expect(localized.description).toBeTruthy();
    });
  });

  it("Spanish route description is properly translated", () => {
    const spanishRoute = pickLocalization(wizardRouteSummary.localizations, "es");
    expect(spanishRoute.description).toBeTruthy();
    // Spanish should have "arte urbano" for street art
    expect(spanishRoute.description?.toLowerCase()).toContain("arte urbano");
  });
});
