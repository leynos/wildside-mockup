/** @file Playwright assertions for map overlay styling semantics. */

import { expect, test } from "@playwright/test";

const alphaFromColor = (value: string | null): number | null => {
  if (!value) return null;
  const match = value.match(/rgba?\(([^)]+)\)/i);
  if (!match) return 1;
  const components = match[1];
  if (!components) return 1;
  const parts = components.split(/\s*,\s*/);
  if (parts.length < 4) return 1;
  const alpha = Number.parseFloat(parts[3] ?? "1");
  return Number.isNaN(alpha) ? 1 : alpha;
};

test.describe("Map overlay panels", () => {
  test("quick walk stops and notes panels retain frosted background", async ({ page }) => {
    await page.goto("/map/quick");

    await page.getByRole("tab", { name: /stops/i }).click();
    const stopsPanel = page.getByTestId("quick-walk-stops-panel");
    await expect(stopsPanel).toBeVisible();
    const stopsStyle = await stopsPanel.evaluate((node) => {
      const style = window.getComputedStyle(node as HTMLElement);
      return {
        backgroundColor: style.backgroundColor,
        backgroundImage: style.backgroundImage,
        backdropFilter: style.backdropFilter || style.getPropertyValue("-webkit-backdrop-filter"),
      };
    });
    const stopsAlpha = alphaFromColor(stopsStyle.backgroundColor);
    expect(stopsAlpha !== null && stopsAlpha > 0.3 && stopsAlpha < 0.9).toBe(true);
    expect(stopsStyle.backgroundImage?.toLowerCase()).toContain("linear-gradient");
    expect(stopsStyle.backdropFilter?.toLowerCase()).not.toBe("none");

    await page.getByRole("tab", { name: /notes/i }).click();
    const notesPanel = page.getByTestId("quick-walk-notes-panel");
    await expect(notesPanel).toBeVisible();
    const notesStyle = await notesPanel.evaluate((node) => {
      const style = window.getComputedStyle(node as HTMLElement);
      return {
        backgroundColor: style.backgroundColor,
        backgroundImage: style.backgroundImage,
        backdropFilter: style.backdropFilter || style.getPropertyValue("-webkit-backdrop-filter"),
      };
    });
    const notesAlpha = alphaFromColor(notesStyle.backgroundColor);
    expect(notesAlpha !== null && notesAlpha > 0.3 && notesAlpha < 0.9).toBe(true);
    expect(notesStyle.backgroundImage?.toLowerCase()).toContain("linear-gradient");
    expect(notesStyle.backdropFilter?.toLowerCase()).not.toBe("none");
  });
});
