/** @file Accessibility tree snapshot tests for key Wildside routes. */

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
        await page.evaluate(() => {
          document
            .querySelectorAll(
              ".maplibregl-ctrl-bottom-left, .maplibregl-ctrl-bottom-right, .maplibregl-ctrl-top-right",
            )
            .forEach((node) => node.remove());
        });
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
