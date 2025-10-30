/** @file Playwright checks for Stage 4 completion and safety flows. */

import { expect, test } from "@playwright/test";

test.describe("Stage 4 routes", () => {
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
    await autoSwitch.click();
    await expect(autoSwitch).toHaveAttribute("data-state", "checked");
  });

  test("safety preferences accordion toggles", async ({ page }) => {
    await page.goto("/safety-accessibility");
    const toggle = page.getByRole("switch").first();
    const initialState = await toggle.getAttribute("data-state");
    await toggle.click();
    await expect(toggle).not.toHaveAttribute("data-state", initialState ?? "");
    await page.getByRole("button", { name: /save preferences/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
