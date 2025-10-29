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

async function expectTablistReachable(tablist: Locator) {
  await tablist.scrollIntoViewIfNeeded();
  await expect(tablist).toBeVisible();
  const metrics = await readViewportMetrics(tablist);
  expect(metrics.top).toBeGreaterThanOrEqual(0);
  expect(metrics.bottom).toBeLessThanOrEqual(metrics.viewportHeight);
}

test.describe("Map tab bar alignment", () => {
  test("quick map honours fragment on initial load", async ({ page }) => {
    await page.goto("/map/quick#stops");
    const canvas = page.locator(".maplibregl-canvas");
    await expect(canvas).toBeVisible();
    await expect(page.getByRole("tab", { name: "Stops" })).toHaveAttribute("data-state", "active");
    await expect(page.getByTestId("quick-walk-stops-panel")).toBeVisible();

    await page.goto("/map/quick#notes");
    await expect(page.getByRole("tab", { name: "Notes" })).toHaveAttribute("data-state", "active");
    await expect(page.getByTestId("quick-walk-notes-panel")).toBeVisible();
  });

  test("quick map retains its tab bar across tabs", async ({ page }) => {
    await page.goto("/map/quick");
    const tablist = page.getByRole("tablist").first();
    await expect(tablist).toBeVisible();

    const canvas = page.locator(".maplibregl-canvas");
    await expect(canvas).toBeVisible();

    await page.getByRole("tab", { name: "Stops" }).click();
    await expectTablistReachable(tablist);
    await expect(canvas).toBeVisible();
    await expect(page).toHaveURL(/#stops$/);
    const stopsPanel = page.getByTestId("quick-walk-stops-panel");
    await expect(stopsPanel).toBeVisible();

    await page.getByRole("tab", { name: "Notes" }).click();
    await expectTablistReachable(tablist);
    await expect(canvas).toBeVisible();
    await expect(page.locator("text=Planning notes")).toBeVisible();
    await expect(page).toHaveURL(/#notes$/);

    await page.getByRole("tab", { name: "Explore" }).click();
    await expect(canvas).toBeVisible();
    await expect(page).not.toHaveURL(/#(stops|notes)$/);

    await page.getByRole("tab", { name: "Stops" }).click();
    await expect(page).toHaveURL(/#stops$/);
    await page.getByRole("tab", { name: "Notes" }).click();
    await expect(page).toHaveURL(/#notes$/);

    await page.goBack();
    await expect(page).toHaveURL(/#stops$/);
    await expect(canvas).toBeVisible();
    await expect(stopsPanel).toBeVisible();
  });

  test("saved map retains its tab bar across tabs", async ({ page }) => {
    await page.goto("/saved");
    const tablist = page.getByRole("tablist").first();
    await expect(tablist).toBeVisible();

    await page.getByRole("tab", { name: "Stops" }).click();
    await expectTablistReachable(tablist);

    await page.getByRole("tab", { name: "Notes" }).click();
    await expectTablistReachable(tablist);
  });

  test("bottom navigation aligns between map and explore routes", async ({ page }) => {
    await page.goto("/map/quick");
    const mapNav = page.getByRole("navigation").first();
    await mapNav.scrollIntoViewIfNeeded();
    await expect(mapNav).toBeVisible();
    const mapNavMetrics = await readViewportMetrics(mapNav);
    expect(mapNavMetrics.bottom).toBeLessThanOrEqual(mapNavMetrics.viewportHeight);

    await page.goto("/explore");
    const exploreNav = page.getByRole("navigation").first();
    await exploreNav.scrollIntoViewIfNeeded();
    await expect(exploreNav).toBeVisible();
  });
});
