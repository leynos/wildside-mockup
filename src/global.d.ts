declare module "../../../tokens/src/utils/resolve-token.js" {
  export function resolveToken(
    tokenRef: string,
    tokens: Record<string, unknown>,
  ): string;
}
