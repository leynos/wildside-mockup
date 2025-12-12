import { describe, expect, it } from "bun:test";
import { screen } from "@testing-library/react";

import { wizardGeneratedStops, wizardRouteSummary } from "../src/app/data/wizard";
import { pickLocalization } from "../src/app/domain/entities/localization";
import { WizardStepThreeView } from "../src/app/features/wizard/step-three/step-three-screen";
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

    renderWithProviders(
      <WizardStepThreeView t={t} language="en-GB" unitSystem="metric" navigateTo={() => {}} />,
    );

    const interpolationCall = calls.find(
      (call) => call.key === "wizard-step-three-stop-note-with-distance",
    );
    expect(interpolationCall).toBeDefined();
    if (!interpolationCall?.options) {
      throw new Error("Expected stop note translation call to include options");
    }

    const options = interpolationCall.options as { note?: unknown; distance?: unknown };
    const note = options.note;
    const distance = options.distance;
    if (typeof note !== "string") {
      throw new Error("Expected stop note translation call option 'note' to be a string");
    }
    if (typeof distance !== "string") {
      throw new Error("Expected stop note translation call option 'distance' to be a string");
    }

    expect(screen.getByText(`${note} • ${distance}`)).toBeTruthy();
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
