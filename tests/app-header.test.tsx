import { afterAll, afterEach, beforeAll, describe, expect, it } from "bun:test";
import { cleanup, screen } from "@testing-library/react";

import { AppHeader } from "../src/app/layout/app-header";
import { installLogicalStyleStub } from "./support/logical-style-stub";
import { renderWithProviders } from "./utils/render-with-providers";

const resetDirection = () => {
  document.documentElement.dir = "ltr";
  document.documentElement.setAttribute("data-direction", "ltr");
  document.body.dir = "ltr";
  document.body.setAttribute("data-direction", "ltr");
};

describe("AppHeader logical alignment", () => {
  let removeStyles: (() => void) | undefined;

  beforeAll(() => {
    removeStyles = installLogicalStyleStub();
  });

  afterAll(() => {
    removeStyles?.();
  });

  afterEach(() => {
    cleanup();
    resetDirection();
  });

  it("aligns the title container with text-start semantics in both directions", () => {
    renderWithProviders(
      <AppHeader
        title="Discover"
        subtitle="Explore curated walks"
        leading={<button type="button">◀</button>}
      />,
    );
    const ltrHeading = screen.getByRole("heading", { level: 1, name: "Discover" });
    const ltrContainer = ltrHeading.parentElement as HTMLElement;
    expect(window.getComputedStyle(ltrContainer).textAlign).toBe("left");

    document.documentElement.dir = "rtl";
    document.documentElement.setAttribute("data-direction", "rtl");
    document.body.dir = "rtl";
    document.body.setAttribute("data-direction", "rtl");

    renderWithProviders(
      <AppHeader title="ابحث" subtitle="جولات مميزة" leading={<button type="button">◀</button>} />,
    );
    const rtlHeading = screen.getByRole("heading", { level: 1, name: "ابحث" });
    const rtlContainer = rtlHeading.parentElement as HTMLElement;
    expect(window.getComputedStyle(rtlContainer).textAlign).toBe("right");
  });
});

/**@example
 * ```ts
 * import { AppHeader } from "../src/app/layout/app-header";
 *
 * <AppHeader title="Discover" trailing={<button>Menu</button>} />;
 * ```
 */
