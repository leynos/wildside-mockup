/** @file Playwright + axe-core accessibility smoke tests for key routes. */

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { waitForPrimaryContent } from "./utils/accessibility";

const accessibilityTargets = [
  { path: "/explore", label: "Explore catalogue" },
  { path: "/map/quick", label: "Quick map generator" },
  { path: "/wizard/step-1", label: "Walk wizard step one" },
];

test.describe("Route accessibility", () => {
  for (const target of accessibilityTargets) {
    test(`${target.label} passes axe-core analysis`, async ({ page }) => {
      await page.goto(target.path);
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);
      await waitForPrimaryContent(page);

      const results = await new AxeBuilder({ page })
        .disableRules(["color-contrast", "scrollable-region-focusable"])
        .exclude(".maplibregl-canvas")
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }
});
