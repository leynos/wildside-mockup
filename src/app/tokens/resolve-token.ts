/** @file Runtime helper for resolving design token references inside the app. */

import tokens from "../../../tokens/src/tokens.json";

const TOKEN_PATTERN = /^\{(.+)}$/;

/**
 * Resolve a token reference like `{icon.navigation.map}` to its concrete value.
 * Falls back to returning the input when the brace syntax is not used.
 *
 * @param tokenRef - Token reference string.
 * @returns The resolved token value.
 */
export function resolveToken(tokenRef: string): string {
  const match = TOKEN_PATTERN.exec(tokenRef.trim());
  if (!match) {
    return tokenRef;
  }

  const path = match[1]?.split(".") ?? [];
  let current: unknown = tokens;
  for (const segment of path) {
    if (typeof current !== "object" || current === null || !(segment in current)) {
      throw new Error(`Unable to resolve token "${tokenRef}"`);
    }
    current = (current as Record<string, unknown>)[segment];
  }

  if (typeof current === "string") {
    return current;
  }

  if (typeof current === "object" && current !== null) {
    const value = (current as { value?: unknown }).value;
    if (typeof value === "string") {
      return value;
    }
  }

  throw new Error(`Token "${tokenRef}" did not resolve to a string value.`);
}
