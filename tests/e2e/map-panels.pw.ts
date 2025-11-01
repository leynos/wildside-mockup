/** @file Playwright assertions for map overlay styling semantics. */

import { expect, test } from "@playwright/test";

const isOpaque = (value: string | null): boolean => {
  if (!value) return false;
  if (value === "transparent") return false;
  return !/^rgba?\(0,\s*0,\s*0,\s*0\)$/.test(value.trim());
};

test.describe("Map overlay panels", () => {
  test("quick walk stops and notes panels retain frosted background", async ({ page }) => {
    await page.goto("/map/quick");

    await page.getByRole("tab", { name: /stops/i }).click();
    const stopsPanel = page.getByTestId("quick-walk-stops-panel");
    await expect(stopsPanel).toBeVisible();
    const stopsBackground = await stopsPanel.evaluate(
      (node) => window.getComputedStyle(node as HTMLElement).backgroundColor,
    );
    expect(isOpaque(stopsBackground)).toBe(true);

    await page.getByRole("tab", { name: /notes/i }).click();
    const notesPanel = page.getByTestId("quick-walk-notes-panel");
    await expect(notesPanel).toBeVisible();
    const notesBackground = await notesPanel.evaluate(
      (node) => window.getComputedStyle(node as HTMLElement).backgroundColor,
    );
    expect(isOpaque(notesBackground)).toBe(true);
  });
});
