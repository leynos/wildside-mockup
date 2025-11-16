/** @file Playwright checks for Stage 4 completion and safety flows. */

import { expect, test } from "@playwright/test";

test.describe("Stage 4 routes", () => {
  const parseAlpha = (value: string): number => {
    const compact = value.replace(/\s+/g, "");
    const slashMatch = compact.match(/\/([0-9.]+)\)?$/);
    if (slashMatch?.[1]) {
      const parsed = Number.parseFloat(slashMatch[1]);
      if (!Number.isNaN(parsed)) return parsed;
    }
    const rgbaMatch = compact.match(/rgba?\(([^)]+)\)/i);
    if (rgbaMatch?.[1]) {
      const parts = rgbaMatch[1]
        .split(/[,\s/]+/)
        .map((segment) => segment.trim())
        .filter(Boolean);
      if (parts.length === 4) {
        const parsed = Number.parseFloat(parts[3] ?? "");
        if (!Number.isNaN(parsed)) return parsed;
      }
      return 1;
    }
    return Number.NaN;
  };

  const parseOklabLightness = (value: string): number => {
    const match = value.match(/oklab\(([^)]+)\)/i);
    if (!match?.[1]) return Number.NaN;
    const [lightness] = match[1]
      .split(/[\s,/]+/)
      .map((segment) => Number.parseFloat(segment))
      .filter((segment) => !Number.isNaN(segment));
    return lightness ?? Number.NaN;
  };

  const parseRelativeLightness = (value: string): number => {
    const oklab = parseOklabLightness(value);
    if (!Number.isNaN(oklab)) return oklab;
    const rgbMatch = value.match(/rgba?\(([^)]+)\)/i);
    if (!rgbMatch?.[1]) return Number.NaN;
    const channels = rgbMatch[1]
      .split(/[\s,/]+/)
      .map((segment) => Number.parseFloat(segment))
      .filter((segment, index) => index < 3 && !Number.isNaN(segment));
    if (channels.length !== 3) return Number.NaN;
    const normalize = (channel: number) => {
      const scaled = channel / 255;
      return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
    };
    const [rawR, rawG, rawB] = channels as [number, number, number];
    const r = normalize(rawR);
    const g = normalize(rawG);
    const b = normalize(rawB);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  test("walk complete triggers rating toast", async ({ page }) => {
    await page.goto("/walk-complete");
    await expect(page.getByRole("heading", { name: /walk complete/i })).toBeVisible();
    await page.getByRole("button", { name: /rate this walk/i }).click();
    const toast = page.getByText(/rating saved/i).first();
    await expect(toast).toBeVisible();
  });

  test("offline manager lists downloads", async ({ page }) => {
    await page.goto("/offline");
    await expect(page.getByRole("heading", { name: /offline maps/i })).toBeVisible();
    await expect(page.locator("article").first()).toBeVisible();
  });

  test("offline manager delete flow", async ({ page }) => {
    await page.goto("/offline");
    await page.getByRole("button", { name: /manage/i }).click();
    const doneToggle = page.getByRole("button", { name: /^done$/i });
    const downloadsRegion = page.getByRole("region", { name: /downloaded areas/i });
    const downloadCards = downloadsRegion.getByRole("article").filter({ hasNotText: /deleted/i });
    const undoCards = downloadsRegion.getByRole("article").filter({ hasText: /deleted/i });
    const deleteButtons = downloadsRegion.getByRole("button", { name: /^delete /i });

    const cardsBefore = await downloadCards.count();
    const firstCard = downloadCards.first();
    const deletedTitle = (await firstCard.locator("h3").textContent())?.trim() ?? "";
    await expect(deleteButtons).toHaveCount(cardsBefore);
    await deleteButtons.first().click();
    await expect(downloadCards).toHaveCount(cardsBefore - 1);
    const undoForDeleted = undoCards.filter({
      hasText: new RegExp(`${escapeRegExp(deletedTitle)}.+deleted`, "i"),
    });
    await expect(undoForDeleted).toBeVisible();
    await undoForDeleted.getByRole("button", { name: /^undo$/i }).click();
    await expect(undoCards).toHaveCount(0);
    await expect(downloadCards).toHaveCount(cardsBefore);

    // Delete again and confirm Done clears the undo state permanently
    await deleteButtons.first().click();
    await expect(undoCards).toHaveCount(1);
    await doneToggle.click();
    await expect(page.getByRole("button", { name: /manage/i })).toBeVisible();
    await expect(undoCards).toHaveCount(0);
    await expect(downloadCards).toHaveCount(cardsBefore - 1);
  });

  test("auto-management switches respond to toggling", async ({ page }) => {
    await page.goto("/offline");
    const autoSwitch = page.getByRole("switch", { name: /auto-update maps/i });
    await expect(autoSwitch).toHaveAttribute("data-state", "unchecked");
    const offBackground = await autoSwitch.evaluate(
      (element) => getComputedStyle(element as HTMLElement).backgroundColor,
    );
    const offAlpha = parseAlpha(offBackground);
    const offLightness = parseRelativeLightness(offBackground);
    expect(offAlpha).toBeGreaterThan(0);
    expect(offAlpha).toBeLessThan(0.5);

    await autoSwitch.click();
    await expect(autoSwitch).toHaveAttribute("data-state", "checked");

    const onBackground = await autoSwitch.evaluate(
      (element) => getComputedStyle(element as HTMLElement).backgroundColor,
    );
    const onAlpha = parseAlpha(onBackground);
    const onLightness = parseRelativeLightness(onBackground);
    expect(onBackground).not.toBe(offBackground);
    expect(onAlpha).toBeGreaterThan(offAlpha);
    if (!Number.isNaN(onLightness) && !Number.isNaN(offLightness)) {
      // Chrome serialises `background-color` in oklab space and clamps the slash component,
      // so assert on the relative lightness delta instead of an absolute alpha threshold.
      expect(onLightness).toBeGreaterThan(offLightness + 0.03);
    }
  });

  test("safety preferences accordion toggles", async ({ page }) => {
    await page.goto("/safety-accessibility");
    const mobilitySection = page.getByRole("button", { name: /mobility support/i });
    const triggerState = await mobilitySection.getAttribute("data-state");
    if (triggerState !== "open") {
      await mobilitySection.click();
      await expect(mobilitySection).toHaveAttribute("data-state", "open");
    }
    const toggle = page.getByRole("switch", { name: /step-free routes/i });
    const initialState = await toggle.getAttribute("data-state");
    await toggle.scrollIntoViewIfNeeded();
    await toggle.evaluate((element) => {
      (element as HTMLElement).click();
    });
    await expect(toggle).not.toHaveAttribute("data-state", initialState ?? "");
    await page.getByRole("button", { name: /save preferences/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
