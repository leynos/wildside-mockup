/** @file Playwright regression tests for map tab bar positioning. */

import type { Locator } from "@playwright/test";
import { expect, test } from "@playwright/test";

interface TablistMetrics {
  bottom: number;
  top: number;
  viewportHeight: number;
}

async function readTablistMetrics(locator: Locator): Promise<TablistMetrics> {
  return locator.evaluate<TablistMetrics>((element) => {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      bottom: rect.bottom,
      viewportHeight: window.innerHeight ?? document.documentElement.clientHeight ?? 0,
    };
  });
}

async function expectTablistStable(tablist: Locator, baseline: TablistMetrics, tolerance = 4) {
  await expect(tablist).toBeVisible();
  const { bottom, viewportHeight } = await readTablistMetrics(tablist);
  const baselineOffset = baseline.viewportHeight - baseline.bottom;
  const currentOffset = viewportHeight - bottom;
  expect(Math.abs(currentOffset - baselineOffset)).toBeLessThanOrEqual(tolerance);
}

test.describe("Map tab bar alignment", () => {
  test("quick map retains its tab bar across tabs", async ({ page }) => {
    await page.goto("/map/quick");
    const tablist = page.getByRole("tablist").first();
    await expect(tablist).toBeVisible();

    const baseline = await readTablistMetrics(tablist);

    await page.getByRole("tab", { name: "Stops" }).click();
    await expectTablistStable(tablist, baseline);

    await page.getByRole("tab", { name: "Notes" }).click();
    await expectTablistStable(tablist, baseline);
  });

  test("saved map retains its tab bar across tabs", async ({ page }) => {
    await page.goto("/saved");
    const tablist = page.getByRole("tablist").first();
    await expect(tablist).toBeVisible();

    const baseline = await readTablistMetrics(tablist);

    await page.getByRole("tab", { name: "Stops" }).click();
    await expectTablistStable(tablist, baseline);

    await page.getByRole("tab", { name: "Notes" }).click();
    await expectTablistStable(tablist, baseline);
  });
});
