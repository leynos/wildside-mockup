/**
 * @file Tests for wizard step-three localisation, covering stop note interpolation, badge labels,
 * and route description copy.
 */

import { describe, expect, it } from "bun:test";
import { screen } from "@testing-library/react";

import { wizardGeneratedStops, wizardRouteSummary } from "../src/app/data/wizard";
import { pickLocalization } from "../src/app/domain/entities/localization";
import { WizardStepThreeView } from "../src/app/features/wizard/step-three/step-three-screen";
import { formatDistance } from "../src/app/units/unit-format";
import { createStubT } from "./i18n-stub";
import { renderWithProviders } from "./utils/render-with-providers";

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

  it("renders stop note with interpolated distance", () => {
    const { t, calls } = createStubT();
    const stop = wizardGeneratedStops.find((candidate) => candidate.id === "art");
    expect(stop).toBeDefined();
    if (!stop) throw new Error("Expected wizard stops fixture to include art stop");
    if (stop.noteDistanceMetres == null) {
      throw new Error("Expected art stop to include noteDistanceMetres");
    }

    renderWithProviders(
      <WizardStepThreeView t={t} language="en-GB" unitSystem="metric" navigateTo={() => {}} />,
    );

    const note = pickLocalization(stop.noteLocalizations, "en-GB").name;
    const formatted = formatDistance(stop.noteDistanceMetres, {
      t,
      locale: "en-GB",
      unitSystem: "metric",
    });
    const hasLeadingWhitespace = /^[\s\u00A0\u202F]/u.test(formatted.unitLabel);
    const distance = `${formatted.value}${hasLeadingWhitespace ? "" : " "}${formatted.unitLabel}`;
    const expected = `${note} • ${distance}`;

    screen.getByText(expected);

    const interpolationCall = calls.find(
      (call) => call.key === "wizard-step-three-stop-note-with-distance",
    );
    expect(interpolationCall).toBeDefined();
    if (!interpolationCall?.options) {
      throw new Error("Expected stop note translation call to include options");
    }

    const options = interpolationCall.options as { note?: unknown; distance?: unknown };
    expect(options.note).toBe(note);
    expect(options.distance).toBe(distance);
  });

  it("stop notes have localizations for multiple locales", () => {
    const testLocales = ["en-GB", "es", "de", "ja", "ar"] as const;

    wizardGeneratedStops.forEach((stop) => {
      testLocales.forEach((locale) => {
        const noteLocalized = pickLocalization(stop.noteLocalizations, locale);
        expect(typeof noteLocalized.name).toBe("string");
        expect(noteLocalized.name.length).toBeGreaterThan(0);
      });
    });

    const cafeStop = wizardGeneratedStops.find((stop) => stop.id === "café");
    expect(cafeStop).toBeDefined();
    if (!cafeStop) throw new Error("Expected wizard stops fixture to include café stop");
    const spanishCafeNote = pickLocalization(cafeStop.noteLocalizations, "es").name;
    expect(spanishCafeNote).toBe("Baristas amables, ideal para llevar");

    const artStop = wizardGeneratedStops.find((stop) => stop.id === "art");
    expect(artStop).toBeDefined();
    if (!artStop) throw new Error("Expected wizard stops fixture to include art stop");
    const germanArtNote = pickLocalization(artStop.noteLocalizations, "de").name;
    expect(germanArtNote).toBe("Fotospot");

    const gardenStop = wizardGeneratedStops.find((stop) => stop.id === "garden");
    expect(gardenStop).toBeDefined();
    if (!gardenStop) throw new Error("Expected wizard stops fixture to include garden stop");
    const frenchGardenNote = pickLocalization(gardenStop.noteLocalizations, "fr").name;
    expect(frenchGardenNote).toBe("Zone de repos");
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
      expect(typeof badgeLocalized.name).toBe("string");
      expect(badgeLocalized.name.length).toBeGreaterThan(0);
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
    if (typeof enGbRoute.description !== "string") {
      throw new Error("Expected en-GB route description to be a string");
    }
    expect(enGbRoute.description.toLowerCase()).toContain("street-art");
  });

  it("route description has localizations for multiple locales", () => {
    const testLocales = ["en-GB", "es", "de", "ja"] as const;

    testLocales.forEach((locale) => {
      const localized = pickLocalization(wizardRouteSummary.localizations, locale);
      if (typeof localized.description !== "string") {
        throw new Error(`Expected ${locale} route description to be a string`);
      }
      expect(localized.description.length).toBeGreaterThan(0);
    });
  });

  it("Spanish route description is properly translated", () => {
    const spanishRoute = pickLocalization(wizardRouteSummary.localizations, "es");
    if (typeof spanishRoute.description !== "string") {
      throw new Error("Expected Spanish route description to be a string");
    }
    // Spanish should have "arte urbano" for street art
    expect(spanishRoute.description.toLowerCase()).toContain("arte urbano");
  });
});
