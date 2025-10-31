/** @file Accessibility tree snapshot tests for key Wildside routes. */

import { expect, test } from "@playwright/test";

import { captureAccessibilityTree, slugifyPath } from "./utils/accessibility";

const snapshotTargets = [
  { path: "/explore", label: "Explore" },
  { path: "/map/quick", label: "Quick Map" },
  { path: "/wizard/step-1", label: "Wizard Step 1" },
];

test.describe("Accessibility tree snapshots", () => {
  for (const target of snapshotTargets) {
    test(`${target.label} matches stored accessibility tree`, async ({ page }) => {
      await page.goto(target.path);
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);

      const tree = await captureAccessibilityTree(page);
      const snapshotPayload = JSON.stringify(tree, null, 2);
      expect(snapshotPayload).toMatchSnapshot(`${slugifyPath(target.path)}-aria-tree.json`);
    });
  }
});
