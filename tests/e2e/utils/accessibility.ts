import type { Page } from "@playwright/test";

interface AccessibilityNodeSummary {
  role?: string;
  name?: string;
  value?: string | number | boolean;
  checked?: string | boolean;
  selected?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  focused?: boolean;
  level?: number;
  children?: AccessibilityNodeSummary[];
}

function simplifyValue(value: unknown): string | number | boolean | undefined {
  if (value == null) {
    return undefined;
  }
  if (typeof value === "object") {
    if ("text" in value && typeof (value as { text?: string }).text === "string") {
      return (value as { text?: string }).text;
    }
    if ("string" in value && typeof (value as { string?: string }).string === "string") {
      return (value as { string?: string }).string;
    }
    if ("number" in value && typeof (value as { number?: number }).number === "number") {
      return (value as { number?: number }).number;
    }
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  return undefined;
}

interface RawAccessibilityNode {
  role?: string;
  name?: string;
  value?: unknown;
  checked?: string | boolean;
  selected?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  focused?: boolean;
  level?: number;
  children?: RawAccessibilityNode[];
}

function normaliseNode(
  node: RawAccessibilityNode | null | undefined,
): AccessibilityNodeSummary | null {
  if (!node) return null;

  const summary: AccessibilityNodeSummary = {};

  if (typeof node.role === "string") summary.role = node.role;
  if (typeof node.name === "string") summary.name = node.name;

  const simplifiedValue = simplifyValue(node.value);
  if (simplifiedValue !== undefined) summary.value = simplifiedValue;

  if (node.checked !== undefined) summary.checked = node.checked;
  if (node.selected !== undefined) summary.selected = node.selected;
  if (node.pressed !== undefined) summary.pressed = node.pressed;
  if (node.expanded !== undefined) summary.expanded = node.expanded;
  if (node.focused !== undefined) summary.focused = node.focused;
  if (typeof node.level === "number") summary.level = node.level;

  if (Array.isArray(node.children) && node.children.length > 0) {
    const normalisedChildren = node.children
      .map((child: RawAccessibilityNode | null | undefined) => normaliseNode(child))
      .filter((child): child is AccessibilityNodeSummary => child !== null);
    if (normalisedChildren.length > 0) summary.children = normalisedChildren;
  }

  return summary;
}

export async function captureAccessibilityTree(
  page: Page,
): Promise<AccessibilityNodeSummary | null> {
  const rawTree = (await page.accessibility.snapshot({
    interestingOnly: false,
  })) as RawAccessibilityNode | null;
  return normaliseNode(rawTree);
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
