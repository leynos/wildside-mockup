/** @file Behavioural coverage for the safety & accessibility screen. */

import { beforeAll, describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { JSX } from "react";
import { I18nextProvider } from "react-i18next";
import { vi } from "vitest";

// @ts-expect-error -- vi.mock is provided by Vitest runtime at test time.
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
}));

import { SafetyAccessibilityScreen } from "../src/app/features/safety/safety-accessibility-screen";
import { DisplayModeProvider } from "../src/app/providers/display-mode-provider";
import { changeLanguage, i18n, i18nReady } from "./helpers/i18nTestHelpers";

const renderWithI18n = (ui: JSX.Element) =>
  render(
    <I18nextProvider i18n={i18n}>
      <DisplayModeProvider>{ui}</DisplayModeProvider>
    </I18nextProvider>,
  );

beforeAll(async () => {
  await i18nReady;
});

describe("SafetyAccessibilityScreen", () => {
  it("renders translated copy and dialog content for Spanish", async () => {
    await changeLanguage("es");
    const user = userEvent.setup();

    renderWithI18n(<SafetyAccessibilityScreen />);

    expect(await screen.findByText("Seguridad y accesibilidad")).toBeInTheDocument();
    expect(screen.getByText("Rutas sin escalones")).toBeInTheDocument();
    expect(screen.getByText("Perfiles predefinidos")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Guardar preferencias" }));

    expect(await screen.findByText("Preferencias guardadas")).toBeInTheDocument();
    expect(screen.getAllByText("Rutas sin escalones")[0]).toBeInTheDocument();
  });
});
