import { afterAll, beforeEach, describe, expect, it, vi } from "bun:test";
import * as router from "@tanstack/react-router";
import { screen } from "@testing-library/react";

import {
  walkCompletionMoments,
  walkCompletionPrimaryStats,
  walkCompletionSecondaryStats,
  walkCompletionShareOptions,
} from "../src/app/data/stage-four";
import { pickLocalization } from "../src/app/domain/entities/localization";
import { WalkCompleteScreen } from "../src/app/features/walk-complete/walk-complete-screen";
import { UnitPreferencesProvider } from "../src/app/units/unit-preferences-provider";
import { setupI18nTestHarness } from "./support/i18n-test-runtime";
import { renderWithProviders } from "./utils/render-with-providers";

const navigateSpy = vi.fn();
vi.spyOn(router, "useNavigate").mockReturnValue(navigateSpy);

afterAll(() => {
  vi.restoreAllMocks();
});

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

  it("renders primary stat labels in Spanish", async () => {
    await renderWalkComplete("es", "metric");

    const distanceStat = walkCompletionPrimaryStats.find((s) => s.id === "distance");
    const durationStat = walkCompletionPrimaryStats.find((s) => s.id === "duration");
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

    const distanceStat = walkCompletionPrimaryStats.find((s) => s.id === "distance");
    expect(distanceStat).toBeDefined();
    if (!distanceStat) throw new Error("Missing primary stat: distance");

    const distanceLabel = pickLocalization(distanceStat.localizations, "ja").name;
    expect(screen.getByText(distanceLabel)).toBeTruthy();
  });
});

describe("WalkComplete moments section", () => {
  beforeEach(() => {
    localStorage.clear();
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

  it("renders moment images with localized alt text in Spanish", async () => {
    await renderWalkComplete("es", "metric");

    const images = screen.getAllByRole("img");
    const momentNames = walkCompletionMoments.map(
      (m) => pickLocalization(m.localizations, "es").name,
    );

    momentNames.forEach((name) => {
      const matchingImage = images.find((img) => img.getAttribute("alt") === name);
      expect(matchingImage).toBeTruthy();
    });
  });

  it("renders moment images with localized alt text in Japanese", async () => {
    await renderWalkComplete("ja", "metric");

    const images = screen.getAllByRole("img");
    const momentNames = walkCompletionMoments.map(
      (m) => pickLocalization(m.localizations, "ja").name,
    );

    momentNames.forEach((name) => {
      const matchingImage = images.find((img) => img.getAttribute("alt") === name);
      expect(matchingImage).toBeTruthy();
    });
  });
});

describe("WalkComplete ARIA labels", () => {
  beforeEach(() => {
    localStorage.clear();
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

describe("WalkComplete share controls ARIA labels in multiple locales", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("share channel buttons have localized aria-labels in Spanish", async () => {
    await renderWalkComplete("es", "metric");

    // Open the share modal to access share channel buttons
    const shareButton = screen.getByRole("button", { name: /compartir/i });
    expect(shareButton).toBeTruthy();

    // Verify share options have aria-labels from localizations
    walkCompletionShareOptions.forEach((option) => {
      const localizedName = pickLocalization(option.localizations, "es").name;
      const button = screen.queryByRole("button", { name: localizedName });
      expect(button).toBeTruthy();
    });
  });

  it("share channel buttons have localized aria-labels in Arabic", async () => {
    await renderWalkComplete("ar", "metric");

    // Verify share options have Arabic aria-labels
    walkCompletionShareOptions.forEach((option) => {
      const localizedName = pickLocalization(option.localizations, "ar").name;
      const button = screen.queryByRole("button", { name: localizedName });
      expect(button).toBeTruthy();
    });
  });

  it("share channel buttons have localized aria-labels in Korean", async () => {
    await renderWalkComplete("ko", "metric");

    // Verify share options have Korean aria-labels
    walkCompletionShareOptions.forEach((option) => {
      const localizedName = pickLocalization(option.localizations, "ko").name;
      const button = screen.queryByRole("button", { name: localizedName });
      expect(button).toBeTruthy();
    });
  });
});
