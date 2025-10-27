/** @file Playwright regression tests for map tab bar positioning. */

import type { Locator } from "@playwright/test";
import { expect, test } from "@playwright/test";

interface ViewportMetrics {
  bottom: number;
  top: number;
  viewportHeight: number;
}

async function readViewportMetrics(locator: Locator): Promise<ViewportMetrics> {
  return locator.evaluate<ViewportMetrics>((element) => {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      bottom: rect.bottom,
      viewportHeight: window.innerHeight ?? document.documentElement.clientHeight ?? 0,
    };
  });
}

function computeBottomOffset(metrics: ViewportMetrics): number {
  return metrics.viewportHeight - metrics.bottom;
}

async function expectTablistStable(tablist: Locator, baseline: ViewportMetrics, tolerance = 4) {
  await expect(tablist).toBeVisible();
  const metrics = await readViewportMetrics(tablist);
  const baselineOffset = computeBottomOffset(baseline);
  const currentOffset = computeBottomOffset(metrics);
  expect(Math.abs(currentOffset - baselineOffset)).toBeLessThanOrEqual(tolerance);
}

test.describe("Map tab bar alignment", () => {
  test("quick map retains its tab bar across tabs", async ({ page }) => {
    await page.goto("/map/quick");
    const tablist = page.getByRole("tablist").first();
    await expect(tablist).toBeVisible();

    const canvas = page.locator(".maplibregl-canvas");
    await expect(canvas).toBeVisible();

    const baseline = await readViewportMetrics(tablist);

    await page.getByRole("tab", { name: "Stops" }).click();
    await expectTablistStable(tablist, baseline);
    await expect(canvas).toBeVisible();
    await expect(page.locator("text=Blue Bottle Coffee")).toBeVisible();
    await expect(page).toHaveURL(/#stops$/);

    await page.getByRole("tab", { name: "Notes" }).click();
    await expectTablistStable(tablist, baseline);
    await expect(canvas).toBeVisible();
    await expect(page.locator("text=Planning notes")).toBeVisible();
    await expect(page).toHaveURL(/#notes$/);

    await page.getByRole("tab", { name: "Map" }).click();
    await expect(canvas).toBeVisible();
    await expect(page).not.toHaveURL(/#(stops|notes)$/);
  });

  test("saved map retains its tab bar across tabs", async ({ page }) => {
    await page.goto("/saved");
    const tablist = page.getByRole("tablist").first();
    await expect(tablist).toBeVisible();

    const baseline = await readViewportMetrics(tablist);

    await page.getByRole("tab", { name: "Stops" }).click();
    await expectTablistStable(tablist, baseline);

    await page.getByRole("tab", { name: "Notes" }).click();
    await expectTablistStable(tablist, baseline);
  });

  test("bottom navigation aligns between map and explore routes", async ({ page }) => {
    await page.goto("/map/quick");
    const mapNav = page.getByRole("navigation").first();
    const tablist = page.getByRole("tablist").first();
    const mapNavMetrics = await readViewportMetrics(mapNav);
    const tablistMetrics = await readViewportMetrics(tablist);

    expect(tablistMetrics.bottom).toBeLessThanOrEqual(mapNavMetrics.top);
    const mapNavOffset = computeBottomOffset(mapNavMetrics);
    expect(mapNavOffset).toBeLessThanOrEqual(2);

    await page.goto("/explore");
    const exploreNav = page.getByRole("navigation").first();
    const exploreNavMetrics = await readViewportMetrics(exploreNav);
    const exploreOffset = computeBottomOffset(exploreNavMetrics);

    expect(Math.abs(exploreOffset - mapNavOffset)).toBeLessThanOrEqual(4);
  });
});
