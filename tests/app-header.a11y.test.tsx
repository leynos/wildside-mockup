import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Icon } from "../src/app/components/icon";
import { AppHeader } from "../src/app/layout/app-header";
import { renderWithProviders } from "./utils/render-with-providers";

const hasAxeMatcher = (() => {
  try {
    return (
      typeof (expect as unknown as (value: unknown) => { toHaveNoViolations?: unknown })({})
        .toHaveNoViolations === "function"
    );
  } catch {
    return false;
  }
})();

const describeIfVitest = hasAxeMatcher ? describe : describe.skip;

describeIfVitest("AppHeader accessibility", () => {
  it("renders without axe violations in default and wizard variants", async () => {
    const { container, rerender } = renderWithProviders(
      <AppHeader
        title="Discover"
        subtitle="Explore curated walks"
        leading={
          <button type="button" aria-label="Go back">
            ←
          </button>
        }
        trailing={
          <button type="button" aria-label="Open filters">
            <Icon token="{icon.action.filter}" aria-hidden />
          </button>
        }
      />,
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <AppHeader
        title="Plan your walk"
        subtitle="Step 1 of 3"
        variant="wizard"
        trailing={<button type="button">Skip</button>}
      >
        <p className="text-sm">Set your pace and desired distance to see curated options.</p>
      </AppHeader>,
    );

    expect(await axe(container)).toHaveNoViolations();

    expect(screen.getByRole("heading", { level: 1, name: "Plan your walk" })).toBeInTheDocument();
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
  });
});
