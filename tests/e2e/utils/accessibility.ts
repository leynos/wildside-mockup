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

function normaliseNode(node: any): AccessibilityNodeSummary | null {
  if (!node || typeof node !== "object") return null;

  const summary: AccessibilityNodeSummary = {
    role: node.role,
    name: node.name,
    value: simplifyValue(node.value),
    checked: node.checked,
    selected: node.selected,
    pressed: node.pressed,
    expanded: node.expanded,
    focused: node.focused,
    level: node.level,
  };

  if (Array.isArray(node.children) && node.children.length > 0) {
    summary.children = node.children
      .map((child: unknown) => normaliseNode(child))
      .filter((child): child is AccessibilityNodeSummary => Boolean(child));
  }

  return summary;
}

export async function captureAccessibilityTree(page: Page): Promise<AccessibilityNodeSummary | null> {
  const rawTree = await page.accessibility.snapshot({ interestingOnly: false });
  return normaliseNode(rawTree);
}

export function slugifyPath(path: string): string {
  return path.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "root";
}
