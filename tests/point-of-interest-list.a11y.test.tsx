import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { PointOfInterestList } from "../src/app/components/point-of-interest-list";
import { waterfrontDiscoveryRoute } from "../src/app/data/map";
import { axe } from "./utils/axe";
import { renderWithProviders } from "./utils/render-with-providers";

describe("PointOfInterestList accessibility", () => {
  const samplePoi = waterfrontDiscoveryRoute.pointsOfInterest[0];
  if (!samplePoi) {
    throw new Error("Expected at least one point of interest for accessibility tests");
  }

  it("exposes accessible trigger buttons and modal content", async () => {
    const { container } = renderWithProviders(<PointOfInterestList points={[samplePoi]} />);

    expect(await axe(container)).toHaveNoViolations();

    const trigger = screen.getByRole("button", { name: new RegExp(samplePoi.name, "i") });
    expect(trigger.classList.contains("poi-list__item")).toBe(true);
    await userEvent.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: samplePoi.name });
    expect(dialog).toBeInTheDocument();
    expect(dialog.querySelector(".poi-sheet")).not.toBeNull();
    expect(await axe(document.body)).toHaveNoViolations();

    await userEvent.click(screen.getByRole("button", { name: /close/i }));
  });
});
