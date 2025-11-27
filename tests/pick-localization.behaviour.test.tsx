/** @file Behavioural tests for pickLocalization fallback and resolution. */
import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";

import {
  type EntityLocalizations,
  pickLocalization,
} from "../src/app/domain/entities/localization";

const DemoCard = ({
  locale,
  localizations,
}: {
  locale: string;
  localizations: EntityLocalizations;
}) => {
  const resolved = pickLocalization(localizations, locale);
  return <p>{resolved.name}</p>;
};

describe("pickLocalization behavioural usage", () => {
  it("falls back to en-GB when region-specific locale is missing", () => {
    render(
      <DemoCard
        locale="fr-CA"
        localizations={{
          "en-GB": { name: "Harbour Walk" },
          es: { name: "Paseo del puerto" },
        }}
      />,
    );

    expect(screen.getByText("Harbour Walk")).toBeInTheDocument();
  });
});
