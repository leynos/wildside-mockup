import "@testing-library/jest-dom/vitest";
import { configure } from "@testing-library/dom";
import { toHaveNoViolations } from "jest-axe";

// Ensure Testing Library surfaces hidden elements so aria-* expectations work.
configure({
  defaultHidden: true,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vi {
    interface JestAssertion<T = unknown> {
      toHaveNoViolations(): T;
    }
  }
}

declare global {
  interface CustomMatchers<R = unknown> {
    toHaveNoViolations(): R;
  }
}

expect.extend(toHaveNoViolations);

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => {
    const matches = false;
    const listeners = new Set<(event: MediaQueryListEvent) => void>();

    return {
      media: query,
      get matches() {
        return matches;
      },
      onchange: null,
      addEventListener: (_event, listener) => {
        if (typeof listener === "function") listeners.add(listener);
      },
      removeEventListener: (_event, listener) => {
        if (typeof listener === "function") listeners.delete(listener);
      },
      addListener: (listener) => {
        if (listener) listeners.add(listener);
      },
      removeListener: (listener) => {
        if (listener) listeners.delete(listener);
      },
      dispatchEvent: () => false,
    } as MediaQueryList;
  };
}
