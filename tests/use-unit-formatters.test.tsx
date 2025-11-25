import { beforeEach, describe, expect, it } from "bun:test";
import { renderHook } from "@testing-library/react";
import type { FC, ReactNode } from "react";

import { UnitPreferencesProvider } from "../src/app/units/unit-preferences-provider";
import { useUnitFormatters } from "../src/app/units/use-unit-formatters";
import { setupI18nTestHarness } from "./support/i18n-test-runtime";

const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <UnitPreferencesProvider>{children}</UnitPreferencesProvider>
);

describe("useUnitFormatters", () => {
  beforeEach(async () => {
    await setupI18nTestHarness();
    localStorage.clear();
  });

  it("formats energy using metric defaults", async () => {
    const { result } = renderHook(() => useUnitFormatters(), { wrapper });

    const energy = result.current.formatEnergyValue(200);
    expect(energy.value).toBe("837");
    expect(energy.unitLabel).toBe("kJ");
  });

  it("formats energy using imperial when preferred", async () => {
    const i18n = (await import("../src/i18n")).default;
    await i18n.changeLanguage("en-US");
    localStorage.setItem("wildside.unitSystem", "imperial");
    const { result, rerender } = renderHook(() => useUnitFormatters(), { wrapper });

    rerender();

    const energy = result.current.formatEnergyValue(200);
    expect(energy.value).toBe("200");
    expect(energy.unitLabel).toBe("kcal");
  });
});
