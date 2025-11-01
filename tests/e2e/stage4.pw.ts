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
    const cardsBefore = await page.getByTestId("offline-download-card").count();
    const firstCard = page.getByTestId("offline-download-card").first();
    const deletedTitle = (await firstCard.locator("h3").textContent()) ?? "";
    await expect(page.getByTestId("offline-delete-button")).toHaveCount(cardsBefore);
    await page.getByTestId("offline-delete-button").first().click();
    await expect(page.getByTestId("offline-download-card")).toHaveCount(cardsBefore - 1);
    await expect(
      page.getByTestId("offline-undo-card").filter({ hasText: deletedTitle.trim() }),
    ).toBeVisible();
    await page.getByTestId("offline-undo-button").click();
    await expect(page.getByTestId("offline-undo-card")).toHaveCount(0);
    await expect(page.getByTestId("offline-download-card")).toHaveCount(cardsBefore);

    // Delete again and confirm Done clears the undo state permanently
    await page.getByTestId("offline-delete-button").first().click();
    await expect(page.getByTestId("offline-undo-card")).toHaveCount(1);
    await doneToggle.click();
    await expect(page.getByRole("button", { name: /manage/i })).toBeVisible();
    await expect(page.getByTestId("offline-undo-card")).toHaveCount(0);
    await expect(page.getByTestId("offline-download-card")).toHaveCount(cardsBefore - 1);
  });

  test("auto-management switches respond to toggling", async ({ page }) => {
    await page.goto("/offline");
    const autoSwitch = page.getByTestId("auto-management-switch-auto-update");
    await expect(autoSwitch).toHaveAttribute("data-state", "unchecked");
    const offBackground = await autoSwitch.evaluate(
      (element) => getComputedStyle(element as HTMLElement).backgroundColor,
    );
    const offAlpha = parseAlpha(offBackground);
    expect(offAlpha).toBeGreaterThan(0);
    expect(offAlpha).toBeLessThan(0.5);

    await autoSwitch.click();
    await expect(autoSwitch).toHaveAttribute("data-state", "checked");

    const onBackground = await autoSwitch.evaluate(
      (element) => getComputedStyle(element as HTMLElement).backgroundColor,
    );
    const onAlpha = parseAlpha(onBackground);
    expect(onBackground).not.toBe(offBackground);
    expect(onAlpha).toBeGreaterThan(offAlpha);
    expect(onAlpha).toBeGreaterThan(0.5);
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
