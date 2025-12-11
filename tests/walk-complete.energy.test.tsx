import { afterAll, beforeEach, describe, expect, it, vi } from "bun:test";
import * as router from "@tanstack/react-router";
import { screen } from "@testing-library/react";

import {
  walkCompletionMoments,
  walkCompletionPrimaryStats,
  walkCompletionSecondaryStats,
} from "../src/app/data/stage-four";
import { pickLocalization } from "../src/app/domain/entities/localization";
import { WalkCompleteScreen } from "../src/app/features/walk-complete/walk-complete-screen";
import { UnitPreferencesProvider } from "../src/app/units/unit-preferences-provider";
import { setupI18nTestHarness } from "./support/i18n-test-runtime";
import { renderWithProviders } from "./utils/render-with-providers";

const navigateSpy = vi.fn();
vi.spyOn(router, "useNavigate").mockReturnValue(navigateSpy);

const renderWalkComplete = async (locale: string, unitSystem?: "metric" | "imperial") => {
  await setupI18nTestHarness();
  const i18n = (await import("../src/i18n")).default;
  await i18n.changeLanguage(locale);

  if (unitSystem) {
    localStorage.setItem("wildside.unitSystem", unitSystem);
  } else {
    localStorage.removeItem("wildside.unitSystem");
  }

  return renderWithProviders(
    <UnitPreferencesProvider>
      <WalkCompleteScreen />
    </UnitPreferencesProvider>,
  );
};

describe("WalkComplete energy stat", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("shows kilojoules for metric locales", async () => {
    await renderWalkComplete("en-GB", "metric");

    const energyCard = screen.getByText(/Energy/i).closest("article");
    expect(energyCard?.textContent).toMatch(/kJ/);
  });

  it("shows kilocalories for imperial preference", async () => {
    await renderWalkComplete("en-US", "imperial");

    const energyCard = screen.getByText(/Energy/i).closest("article");
    expect(energyCard?.textContent).toMatch(/kcal/i);
  });
});

describe("WalkComplete stat labels in non-default locales", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("renders primary stat labels in Spanish", async () => {
    await renderWalkComplete("es", "metric");

    const distanceStat = walkCompletionPrimaryStats[0];
    const durationStat = walkCompletionPrimaryStats[1];
    expect(distanceStat).toBeDefined();
    expect(durationStat).toBeDefined();
    if (!distanceStat || !durationStat) return;

    const distanceLabel = pickLocalization(distanceStat.localizations, "es").name;
    const durationLabel = pickLocalization(durationStat.localizations, "es").name;

    expect(screen.getByText(distanceLabel)).toBeTruthy();
    expect(screen.getByText(durationLabel)).toBeTruthy();
  });

  it("renders secondary stat labels in German", async () => {
    await renderWalkComplete("de", "metric");

    const energyStat = walkCompletionSecondaryStats.find((s) => s.id === "energy");
    expect(energyStat).toBeDefined();
    if (!energyStat) return;

    const energyLabel = pickLocalization(energyStat.localizations, "de").name;

    expect(screen.getByText(energyLabel)).toBeTruthy();
  });

  it("renders stat labels in Japanese", async () => {
    await renderWalkComplete("ja", "metric");

    const distanceStat = walkCompletionPrimaryStats[0];
    expect(distanceStat).toBeDefined();
    if (!distanceStat) return;

    const distanceLabel = pickLocalization(distanceStat.localizations, "ja").name;
    expect(screen.getByText(distanceLabel)).toBeTruthy();
  });
});

describe("WalkComplete moments section", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("renders moment images with alt text from localized names", async () => {
    await renderWalkComplete("en-GB", "metric");

    // Get all images on the page
    const images = screen.getAllByRole("img");

    // Verify moment images have alt text matching moment names
    const momentNames = walkCompletionMoments.map(
      (m) => pickLocalization(m.localizations, "en-GB").name,
    );

    // Check that each moment name appears as an alt text somewhere
    momentNames.forEach((name) => {
      const matchingImage = images.find((img) => img.getAttribute("alt") === name);
      expect(matchingImage).toBeTruthy();
    });
  });

  it("renders moment descriptions", async () => {
    await renderWalkComplete("en-GB", "metric");

    // Verify moment descriptions are rendered
    walkCompletionMoments.forEach((moment) => {
      const localized = pickLocalization(moment.localizations, "en-GB");
      if (localized.description) {
        expect(screen.getByText(localized.description)).toBeTruthy();
      }
    });
  });
});

describe("WalkComplete ARIA labels", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("share button has accessible label", async () => {
    await renderWalkComplete("en-GB", "metric");

    const shareButton = screen.getByRole("button", { name: /share/i });
    expect(shareButton).toBeTruthy();
  });

  it("rate button has accessible label", async () => {
    await renderWalkComplete("en-GB", "metric");

    const rateButton = screen.getByRole("button", { name: /rate/i });
    expect(rateButton).toBeTruthy();
  });

  it("save button has accessible label", async () => {
    await renderWalkComplete("en-GB", "metric");

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeTruthy();
  });
});
