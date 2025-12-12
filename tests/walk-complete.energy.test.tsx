/** @file Tests for WalkComplete screen energy stats, localised labels, moments, and ARIA accessibility. */

import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "bun:test";
import * as router from "@tanstack/react-router";
import { cleanup, fireEvent, screen, within } from "@testing-library/react";

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

type StorageSnapshot = ReadonlyArray<readonly [string, string]>;

const snapshotLocalStorage = (): StorageSnapshot =>
  Object.keys(localStorage).map((key) => {
    const value = localStorage.getItem(key);
    return [key, value ?? ""] as const;
  });

const restoreLocalStorage = (snapshot: StorageSnapshot) => {
  localStorage.clear();
  for (const [key, value] of snapshot) {
    localStorage.setItem(key, value);
  }
};

const getStatCardByLabel = (label: string): HTMLElement => {
  const labelNode = screen.getByText(label);
  const card = labelNode.closest("article");
  if (!card) {
    throw new Error(`Expected "${label}" to be inside an article card`);
  }
  return card;
};

describe.serial("WalkComplete screen", () => {
  const navigateSpy = vi.fn();
  let i18n: typeof import("../src/i18n")["default"];
  let localStorageSnapshot: StorageSnapshot;

  beforeAll(async () => {
    vi.spyOn(router, "useNavigate").mockReturnValue(navigateSpy);
    await setupI18nTestHarness();
    i18n = (await import("../src/i18n")).default;
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  afterEach(async () => {
    cleanup();
    restoreLocalStorage(localStorageSnapshot);
    navigateSpy.mockClear();
    await i18n.changeLanguage("en-GB");
  });

  const renderWalkComplete = async (locale: string, unitSystem?: "metric" | "imperial") => {
    localStorageSnapshot = snapshotLocalStorage();
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

  const openShareDialog = async (): Promise<HTMLElement> => {
    const shareActionLabel = i18n.t("walk-complete-actions-share", { defaultValue: "Share" });
    const shareDialogTitle = i18n.t("walk-complete-share-dialog-title", {
      defaultValue: "Share your adventure",
    });

    fireEvent.click(screen.getByRole("button", { name: shareActionLabel }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText(shareDialogTitle)).toBeTruthy();
    return dialog;
  };

  const testShareChannelAriaLabels = async (locale: string): Promise<void> => {
    await renderWalkComplete(locale, "metric");

    walkCompletionShareOptions.forEach((option) => {
      const localizedName = pickLocalization(option.localizations, locale).name;
      expect(screen.getByRole("button", { name: localizedName })).toBeTruthy();
    });

    const dialog = await openShareDialog();
    walkCompletionShareOptions.forEach((option) => {
      const localizedName = pickLocalization(option.localizations, locale).name;
      expect(within(dialog).getByText(localizedName)).toBeTruthy();
    });
  };

  const testMomentAltText = async (locale: string): Promise<void> => {
    await renderWalkComplete(locale, "metric");

    walkCompletionMoments.forEach((moment) => {
      const name = pickLocalization(moment.localizations, locale).name;
      const momentCard = screen.getByText(name).closest("article");
      if (!momentCard) {
        throw new Error(`Expected moment "${name}" to be inside an article`);
      }
      expect(within(momentCard).getByRole("img", { name })).toBeTruthy();
    });
  };

  describe("WalkComplete energy stat", () => {
    it("shows kilojoules for metric locales", async () => {
      await renderWalkComplete("en-GB", "metric");

      const energyStat = walkCompletionSecondaryStats.find((stat) => stat.id === "energy");
      expect(energyStat).toBeDefined();
      if (!energyStat) throw new Error("Missing secondary stat: energy");

      const energyLabel = pickLocalization(energyStat.localizations, "en-GB").name;
      const energyCard = getStatCardByLabel(energyLabel);
      expect(within(energyCard).getByText(energyLabel)).toBeTruthy();
      expect(energyCard.textContent).toMatch(/kJ/);
    });

    it("shows kilocalories for imperial preference", async () => {
      await renderWalkComplete("en-US", "imperial");

      const energyStat = walkCompletionSecondaryStats.find((stat) => stat.id === "energy");
      expect(energyStat).toBeDefined();
      if (!energyStat) throw new Error("Missing secondary stat: energy");

      const energyLabel = pickLocalization(energyStat.localizations, "en-US").name;
      const energyCard = getStatCardByLabel(energyLabel);
      expect(within(energyCard).getByText(energyLabel)).toBeTruthy();
      expect(energyCard.textContent).toMatch(/kcal/i);
    });
  });

  describe("WalkComplete stat labels in non-default locales", () => {
    it("renders primary stat labels in Spanish", async () => {
      await renderWalkComplete("es", "metric");

      const distanceStat = walkCompletionPrimaryStats.find((stat) => stat.id === "distance");
      const durationStat = walkCompletionPrimaryStats.find((stat) => stat.id === "duration");
      expect(distanceStat).toBeDefined();
      expect(durationStat).toBeDefined();
      if (!distanceStat) throw new Error("Missing primary stat: distance");
      if (!durationStat) throw new Error("Missing primary stat: duration");

      const distanceLabel = pickLocalization(distanceStat.localizations, "es").name;
      const durationLabel = pickLocalization(durationStat.localizations, "es").name;

      expect(screen.getByText(distanceLabel)).toBeTruthy();
      expect(screen.getByText(durationLabel)).toBeTruthy();
    });

    it("renders secondary stat labels in German", async () => {
      await renderWalkComplete("de", "metric");

      const energyStat = walkCompletionSecondaryStats.find((stat) => stat.id === "energy");
      expect(energyStat).toBeDefined();
      if (!energyStat) throw new Error("Missing secondary stat: energy");

      const energyLabel = pickLocalization(energyStat.localizations, "de").name;

      expect(screen.getByText(energyLabel)).toBeTruthy();
    });

    it("renders stat labels in Japanese", async () => {
      await renderWalkComplete("ja", "metric");

      const distanceStat = walkCompletionPrimaryStats.find((stat) => stat.id === "distance");
      expect(distanceStat).toBeDefined();
      if (!distanceStat) throw new Error("Missing primary stat: distance");

      const distanceLabel = pickLocalization(distanceStat.localizations, "ja").name;
      expect(screen.getByText(distanceLabel)).toBeTruthy();
    });
  });

  describe("WalkComplete moments section", () => {
    it("renders moment images with alt text from localized names", async () => {
      await testMomentAltText("en-GB");
    });

    it("renders moment descriptions", async () => {
      await renderWalkComplete("en-GB", "metric");

      walkCompletionMoments.forEach((moment) => {
        const localized = pickLocalization(moment.localizations, "en-GB");
        if (typeof localized.description !== "string") {
          throw new Error(`Expected moment "${localized.name}" to include a description`);
        }
        expect(screen.getByText(localized.description)).toBeTruthy();
      });
    });

    it("renders moment images with localized alt text in Spanish", async () => {
      await testMomentAltText("es");
    });

    it("renders moment images with localized alt text in Japanese", async () => {
      await testMomentAltText("ja");
    });
  });

  describe("WalkComplete ARIA labels", () => {
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
    it("share channel buttons have localized aria-labels in Spanish", async () => {
      await testShareChannelAriaLabels("es");
    });

    it("share channel buttons have localized aria-labels in Arabic", async () => {
      await testShareChannelAriaLabels("ar");
    });

    it("share channel buttons have localized aria-labels in Korean", async () => {
      await testShareChannelAriaLabels("ko");
    });
  });
});
