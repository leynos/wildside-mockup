import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CustomizeSegmentToggle } from "../src/app/features/customize/segment-toggle-card";
import { axe } from "./utils/axe";

describe("CustomizeSegmentToggle accessibility", () => {
  it("renders without axe violations for common states", async () => {
    const { container, rerender } = render(
      <ToggleGroup.Root type="single" value="balanced" aria-label="Crowd level selector">
        <CustomizeSegmentToggle
          value="balanced"
          label="Balanced"
          description="Keeps a steady crowd mix"
        />
        <CustomizeSegmentToggle
          value="quiet"
          label="Quiet"
          description="Avoids the busiest spots"
        />
      </ToggleGroup.Root>,
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <ToggleGroup.Root type="single" value="quiet" aria-label="Crowd level selector">
        <CustomizeSegmentToggle
          value="balanced"
          label="Balanced"
          description="Keeps a steady crowd mix"
        />
        <CustomizeSegmentToggle
          value="quiet"
          label="Quiet"
          description="Avoids the busiest spots"
        />
      </ToggleGroup.Root>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
