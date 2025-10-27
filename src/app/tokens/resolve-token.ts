/** @file Runtime helper for resolving design token references inside the app. */

import tokens from "../../../tokens/src/tokens.json";
import { resolveToken as baseResolveToken } from "../../../tokens/src/utils/resolve-token.js";

/**
 * Resolve a token reference like `{icon.navigation.map}` to its concrete value.
 *
 * @param tokenRef - Token reference string.
 * @returns The resolved token value.
 */
export function resolveToken(tokenRef: string): string {
  return baseResolveToken(tokenRef, tokens);
}
