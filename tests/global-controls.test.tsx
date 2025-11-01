import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { act, type JSX } from "react";
import { createRoot, type Root } from "react-dom/client";

import { GlobalControls } from "../src/app/layout/global-controls";
import { DisplayModeProvider, useDisplayMode } from "../src/app/providers/display-mode-provider";
import { ThemeProvider } from "../src/app/providers/theme-provider";

function ModeProbe(): JSX.Element {
  const { mode } = useDisplayMode();
  return <span data-testid="mode-probe" data-mode={mode} />;
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
    const modeProbe = document.querySelector("[data-testid='mode-probe']");
    expect(modeProbe?.getAttribute("data-mode")).toBe("hosted");

    const displayToggle = mountNode?.querySelector<HTMLButtonElement>(
      "button[aria-label='Switch to Full View']",
    );
    expect(displayToggle).toBeTruthy();
    const stack = mountNode?.querySelector(".global-controls__stack");
    expect(stack).toBeTruthy();

    act(() => {
      displayToggle?.click();
    });

    const updatedProbe = document.querySelector("[data-testid='mode-probe']");
    expect(updatedProbe?.getAttribute("data-mode")).toBe("full-browser");
  });

  it("shows a drawer interface in full-browser mode", () => {
    window.localStorage.setItem(STORAGE_KEY, "full-browser");
    mount(<GlobalControls />);

    const drawerTrigger = mountNode?.querySelector<HTMLButtonElement>(
      "button[aria-controls='global-controls-drawer']",
    );
    expect(drawerTrigger).toBeTruthy();
    expect(drawerTrigger?.classList.contains("global-controls__trigger")).toBe(true);
    expect(drawerTrigger?.getAttribute("aria-expanded")).toBe("false");

    act(() => {
      drawerTrigger?.click();
    });

    const drawer = mountNode?.querySelector<HTMLDivElement>("#global-controls-drawer");
    expect(drawer).toBeTruthy();

    const panel = drawer?.querySelector(".global-controls__panel");
    expect(panel).toBeTruthy();

    const closeButton = Array.from(
      drawer?.querySelectorAll<HTMLButtonElement>("button") ?? [],
    ).find((btn) => btn.getAttribute("aria-label") === "Close display controls");
    expect(closeButton).toBeTruthy();

    const modeProbe = document.querySelector("[data-testid='mode-probe']");
    expect(modeProbe?.getAttribute("data-mode")).toBe("full-browser");

    const reset = Array.from(drawer?.querySelectorAll<HTMLButtonElement>("button") ?? []).find(
      (btn) => btn.textContent?.trim() === "Reset to device default",
    );
    expect(reset).toBeTruthy();

    act(() => {
      reset?.click();
    });

    const updatedProbe = document.querySelector("[data-testid='mode-probe']");
    expect(updatedProbe?.getAttribute("data-mode")).toBe("hosted");
  });
});
