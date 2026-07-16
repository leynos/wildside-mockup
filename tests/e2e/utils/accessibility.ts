/** @file Accessibility helpers shared by the Playwright end-to-end tests. */

import type { Page } from "@playwright/test";

/**
 * Capture Playwright's raw textual ARIA snapshot for the current page.
 *
 * @example
 * const snapshot = await captureAccessibilityTree(page);
 * expect(snapshot).toContain("- main:");
 */
export function captureAccessibilityTree(page: Page): Promise<string> {
  return page.ariaSnapshot();
}

/**
 * Ensures the shell has rendered its main landmark and primary heading before
 * running accessibility assertions. Without this, Axe and tree snapshots can
 * race ahead of React hydration and report false negatives.
 */
export async function waitForPrimaryContent(page: Page): Promise<void> {
  await page.getByRole("main").first().waitFor();
  await page.getByRole("heading", { level: 1 }).first().waitFor();
}

export function slugifyPath(path: string): string {
  return (
    path
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase() || "root"
  );
}

export interface StyleTarget {
  selector: string;
  properties: string[];
}

export interface StyleSample {
  selector: string;
  styles?: Record<string, string>;
  missing: boolean;
}

export async function captureComputedStyles(
  page: Page,
  targets: StyleTarget[],
): Promise<StyleSample[]> {
  if (targets.length === 0) return [];

  return page.evaluate((styleTargets) => {
    return styleTargets.map(({ selector, properties }) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) {
        return {
          selector,
          missing: true,
        };
      }
      const computed = window.getComputedStyle(element);
      const styles: Record<string, string> = {};
      for (const property of properties) {
        styles[property] = computed.getPropertyValue(property);
      }
      return {
        selector,
        styles,
        missing: false,
      };
    });
  }, targets);
}
