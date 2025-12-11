import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { PointOfInterestList } from "../src/app/components/point-of-interest-list";
import { waterfrontDiscoveryRoute } from "../src/app/data/map";
import { getTagDescriptor } from "../src/app/data/registries/tags";
import { pickLocalization } from "../src/app/domain/entities/localization";
import { i18nReady, withI18nLanguage } from "./helpers/i18nTestHelpers";
import { axe } from "./utils/axe";
import { renderWithProviders } from "./utils/render-with-providers";

describe("PointOfInterestList accessibility", () => {
  const samplePoi = waterfrontDiscoveryRoute.pointsOfInterest[0];
  if (!samplePoi) {
    throw new Error("Expected at least one point of interest for accessibility tests");
  }
  const poiCopy = pickLocalization(samplePoi.localizations, "en-GB");
  const category = getTagDescriptor(samplePoi.categoryId, "en-GB");
  const ratingLabel =
    typeof samplePoi.rating === "number"
      ? new Intl.NumberFormat("en-GB", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(samplePoi.rating)
      : undefined;

  it("exposes accessible trigger buttons and modal content", async () => {
    await i18nReady;
    await withI18nLanguage("en-GB", async () => {
      const { container } = renderWithProviders(<PointOfInterestList points={[samplePoi]} />);

      expect(await axe(container)).toHaveNoViolations();

      const trigger = screen.getByRole("button", { name: new RegExp(poiCopy.name, "i") });
      if (poiCopy.description) {
        expect(within(trigger).getByText(poiCopy.description)).toBeInTheDocument();
      }
      if (ratingLabel) {
        expect(within(trigger).getByText(ratingLabel)).toBeInTheDocument();
      }
      const highlightIcon = within(trigger).getByRole("img", {
        name: category?.localization.name ?? samplePoi.categoryId,
      });
      expect(highlightIcon).toBeInTheDocument();

      await userEvent.click(trigger);

      const dialog = await screen.findByRole("dialog", { name: poiCopy.name });
      expect(dialog).toBeInTheDocument();
      if (poiCopy.description) {
        expect(within(dialog).getByText(poiCopy.description)).toBeInTheDocument();
      }
      expect(await axe(document.body)).toHaveNoViolations();

      await userEvent.click(screen.getByRole("button", { name: /close/i }));
    });
  });
});
