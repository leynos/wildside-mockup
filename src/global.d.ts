declare module "../../../tokens/src/utils/resolve-token.js" {
  export function resolveToken(
    tokenRef: string,
    tokens: Record<string, unknown>,
  ): string;
}

declare module "jest-axe" {
  import type { AxeResults, RunOptions } from "axe-core";

  export interface AxeMatcherResult {
    pass: boolean;
    message(): string;
  }

  export function axe(
    html?: Element | Document | string,
    options?: RunOptions,
  ): Promise<AxeResults>;

  export function configureAxe(options?: {
    globalOptions?: Parameters<typeof import("axe-core")["configure"]>[0];
  } & RunOptions): typeof axe;

  export const toHaveNoViolations: {
    toHaveNoViolations(results: AxeResults): AxeMatcherResult;
  };
}

declare module "i18next-fluent-backend" {
  import type { BackendModule } from "i18next";

  const FluentBackend: BackendModule;
  export default FluentBackend;
}

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toHaveNoViolations(): T;
    toBeInTheDocument(): T;
  }
}

declare module "vitest" {
  interface Assertion<T = any> {
    toHaveNoViolations(): T;
    toBeInTheDocument(): T;
  }

  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): unknown;
    toBeInTheDocument(): unknown;
  }

  export * from "bun:test";
}

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean;

  interface GlobalThis {
    IS_REACT_ACT_ENVIRONMENT: boolean;
  }
}
