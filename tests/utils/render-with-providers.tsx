import { type RenderOptions, type RenderResult, render } from "@testing-library/react";
import type { ReactElement } from "react";

import { DisplayModeProvider } from "../../src/app/providers/display-mode-provider";
import { ThemeProvider } from "../../src/app/providers/theme-provider";

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {}

export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
): RenderResult {
  return render(ui, {
    wrapper: ({ children }) => (
      <DisplayModeProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </DisplayModeProvider>
    ),
    ...options,
  });
}
