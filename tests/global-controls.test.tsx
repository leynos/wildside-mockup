import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { within } from "@testing-library/dom";
import { act, type JSX } from "react";
import { createRoot, type Root } from "react-dom/client";

import { GlobalControls } from "../src/app/layout/global-controls";
import { DisplayModeProvider, useDisplayMode } from "../src/app/providers/display-mode-provider";
import { ThemeProvider } from "../src/app/providers/theme-provider";

function ModeProbe(): JSX.Element {
  const { mode } = useDisplayMode();
  return (
    <output aria-label="Display mode" data-mode={mode}>
      {mode}
    </output>
  );
}

function HostWrapper({ children }: { children: JSX.Element }): JSX.Element {
  return (
    <DisplayModeProvider>
      <ThemeProvider>
        {children}
        <ModeProbe />
      </ThemeProvider>
    </DisplayModeProvider>
  );
}

describe("GlobalControls", () => {
  const STORAGE_KEY = "wildside.displayMode";
  let root: Root | null = null;
  let mountNode: HTMLDivElement | null = null;

  function mount(element: JSX.Element) {
    mountNode = document.createElement("div");
    document.body.appendChild(mountNode);
    root = createRoot(mountNode);
    act(() => {
      root?.render(<HostWrapper>{element}</HostWrapper>);
    });
  }

  function cleanup() {
    if (root) {
      act(() => root?.unmount());
      root = null;
    }
    mountNode?.remove();
    mountNode = null;
    document.body.innerHTML = "";
    window.localStorage.removeItem(STORAGE_KEY);
  }

  beforeEach(() => cleanup());
  afterEach(() => cleanup());

  it("surfaces toggles in hosted mode", () => {
    mount(<GlobalControls />);
    if (!mountNode) throw new Error("GlobalControls did not mount");
    const ui = within(mountNode);

    const modeProbe = within(document.body).getByRole("status", { name: /display mode/i });
    expect(modeProbe.textContent).toBe("hosted");

    const displayToggle = ui.getByRole("button", { name: /switch to full view/i });
    const toggleButtons = ui.getAllByRole("button", { name: /switch to/i });
    expect(toggleButtons.length).toBeGreaterThanOrEqual(2);

    act(() => {
      displayToggle.click();
    });

    const updatedProbe = within(document.body).getByRole("status", { name: /display mode/i });
    expect(updatedProbe.textContent).toBe("full-browser");
  });

  it("shows a drawer interface in full-browser mode", () => {
    window.localStorage.setItem(STORAGE_KEY, "full-browser");
    mount(<GlobalControls />);

    if (!mountNode) throw new Error("GlobalControls did not mount");
    const ui = within(mountNode);

    const drawerTrigger = ui.getByRole("button", { name: /controls/i });
    expect(drawerTrigger.classList.contains("global-controls__trigger")).toBe(true);
    expect(drawerTrigger.getAttribute("aria-expanded")).toBe("false");

    act(() => {
      drawerTrigger.click();
    });

    const drawer = ui.getByRole("dialog", { name: /display & theme/i });
    const drawerToggles = within(drawer).getAllByRole("button", { name: /switch to/i });
    expect(drawerToggles.length).toBeGreaterThanOrEqual(2);

    within(drawer).getByRole("button", { name: /close display controls/i });

    const modeProbe = within(document.body).getByRole("status", { name: /display mode/i });
    expect(modeProbe.textContent).toBe("full-browser");

    const reset = within(drawer).getByRole("button", { name: /reset to device default/i });

    act(() => {
      reset.click();
    });

    const updatedProbe = within(document.body).getByRole("status", { name: /display mode/i });
    expect(updatedProbe.textContent).toBe("hosted");
  });
});
