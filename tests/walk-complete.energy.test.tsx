import { afterAll, beforeEach, describe, expect, it, vi } from "bun:test";
import * as router from "@tanstack/react-router";
import { screen } from "@testing-library/react";

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
