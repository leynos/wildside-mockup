import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { GlobalControls } from "../src/app/layout/global-controls";
import { renderWithProviders } from "./utils/render-with-providers";

const DISPLAY_KEY = "wildside.displayMode";

describe("GlobalControls accessibility", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("meets axe rules in hosted mode", async () => {
    const { container } = renderWithProviders(<GlobalControls />);

    expect(await axe(container)).toHaveNoViolations();

    const toggle = screen.getByRole("button", { name: /switch to full view/i });
    await userEvent.click(toggle);

    const controlsLauncher = screen.getByRole("button", { name: /controls/i });
    expect(controlsLauncher).toBeInTheDocument();
    await userEvent.click(controlsLauncher);

    await screen.findByRole("button", { name: /switch to hosted frame/i });
  });

  it("renders accessible drawer controls in full-browser mode", async () => {
    window.localStorage.setItem(DISPLAY_KEY, "full-browser");

    const { container } = renderWithProviders(<GlobalControls />);

    expect(await axe(container)).toHaveNoViolations();

    const launcher = screen.getByRole("button", { name: /controls/i });
    await userEvent.click(launcher);

    const dialog = await screen.findByRole("dialog", { name: /display & theme/i });
    expect(dialog).toBeInTheDocument();
    expect(await axe(document.body)).toHaveNoViolations();

    await userEvent.click(screen.getByRole("button", { name: /close display controls/i }));
  });
});
