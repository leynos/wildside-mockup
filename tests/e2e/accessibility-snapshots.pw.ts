/** @file Accessibility tree snapshot tests for key Wildside routes. */

import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import type { StyleTarget } from "./utils/accessibility";
import {
  captureAccessibilityTree,
  captureComputedStyles,
  slugifyPath,
} from "./utils/accessibility";

interface SnapshotTarget {
  path: string;
  label: string;
  waitForSelector?: string;
  styleTargets?: StyleTarget[];
}

const snapshotTargets: SnapshotTarget[] = [
  { path: "/explore", label: "Explore" },
  { path: "/map/quick", label: "Quick Map" },
  { path: "/wizard/step-1", label: "Wizard Step 1" },
  {
    path: "/customize",
    label: "Customize",
    waitForSelector: "[data-segment-id='crowd'] [data-radix-collection-item]",
    styleTargets: [
      {
        selector: "[data-segment-id='crowd'] [data-radix-collection-item][data-state='on']",
        properties: [
          "background-color",
          "border-top-color",
          "border-radius",
          "box-shadow",
          "padding-top",
          "padding-left",
          "color",
        ],
      },
      {
        selector: "[data-segment-id='crowd'] [data-radix-collection-item][data-state='off']",
        properties: [
          "background-color",
          "border-top-color",
          "border-radius",
          "box-shadow",
          "padding-top",
          "padding-left",
          "color",
        ],
      },
    ],
  },
];

async function removeMapLibreControls(page: Page): Promise<void> {
  const controlLabels = [/zoom in/i, /zoom out/i, /reset bearing/i, /pitch/i];
  for (const label of controlLabels) {
    const controlButtons = page.getByRole("button", { name: label });
    const count = await controlButtons.count();
    for (let index = 0; index < count; index += 1) {
      await controlButtons.nth(index).evaluate((button) => {
        button.closest(".maplibregl-ctrl")?.remove();
      });
    }
  }

  const attributionLinks = page.getByRole("link", { name: /maplibre/i });
  const linkCount = await attributionLinks.count();
  for (let index = 0; index < linkCount; index += 1) {
    await attributionLinks.nth(index).evaluate((link) => {
      link.closest(".maplibregl-ctrl")?.remove();
    });
  }

  await page.locator(".maplibregl-ctrl-attrib").evaluateAll((controls) => {
    controls.forEach((control) => {
      control.remove();
    });
  });
}

test.describe("Accessibility tree snapshots", () => {
  for (const target of snapshotTargets) {
    test(`${target.label} matches stored accessibility tree`, async ({ page }) => {
      await page.goto(target.path);
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);
      if (target.waitForSelector) {
        await page.waitForSelector(target.waitForSelector);
      }
      if (target.path === "/map/quick") {
        await removeMapLibreControls(page);
      }

      const tree = await captureAccessibilityTree(page);
      const styleSamples = target.styleTargets
        ? await captureComputedStyles(page, target.styleTargets)
        : [];
      const snapshotPayload = `${JSON.stringify(
        { accessibilityTree: tree, computedStyles: styleSamples },
        null,
        2,
      )}\n`;
      expect(snapshotPayload).toMatchSnapshot(`${slugifyPath(target.path)}-aria-tree.json`);
    });
  }
});
