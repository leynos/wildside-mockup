import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { ReactElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";

import { MobileShell } from "../src/app/layout/mobile-shell";
import { DisplayModeProvider } from "../src/app/providers/display-mode-provider";
import { ThemeProvider, useTheme } from "../src/app/providers/theme-provider";

describe("ThemeProvider", () => {
  let root: Root | null = null;

  function mountWithProvider(node: ReactElement) {
    const container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(<ThemeProvider>{node}</ThemeProvider>);
    });
    return container;
  }

  function cleanup() {
    if (root) {
      act(() => {
        root?.unmount();
      });
      root = null;
    }
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("data-theme");
    document.body.removeAttribute("data-theme");
    window.localStorage.clear();
  }

  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("applies the default theme to html and body", () => {
    const Probe = () => {
      const { theme } = useTheme();
      return <span data-theme={theme} />;
    };

    const container = mountWithProvider(<Probe />);
    const probe = container.querySelector("span[data-theme]");
    expect(probe?.dataset.theme).toBe("wildside-night");
    expect(document.documentElement.getAttribute("data-theme")).toBe("wildside-night");
    expect(document.body.getAttribute("data-theme")).toBe("wildside-night");
  });

  it("persists and reapplies a new theme", () => {
    const Toggle = () => {
      const { setTheme } = useTheme();
      return (
        <button
          type="button"
          onClick={() => setTheme("wildside-day")}
          aria-label="Switch to day theme"
        >
          toggle
        </button>
      );
    };

    const container = mountWithProvider(<Toggle />);
    const button = container.querySelector<HTMLButtonElement>("button");
    expect(button).toBeTruthy();
    act(() => {
      button?.click();
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("wildside-day");
    expect(window.localStorage.getItem("wildside.theme")).toBe("wildside-day");
  });
});

describe("MobileShell layout", () => {
  it("renders overlay content when provided", () => {
    const mount = document.createElement("div");
    document.body.appendChild(mount);
    const root = createRoot(mount);

    act(() => {
      root.render(
        <DisplayModeProvider>
          <MobileShell background={<div data-testid="overlay" />}>
            <section>content</section>
          </MobileShell>
        </DisplayModeProvider>,
      );
    });

    expect(mount.querySelector("[data-testid='overlay']")).toBeTruthy();
    act(() => {
      root.unmount();
    });
    window.localStorage.removeItem("wildside.displayMode");
  });

  it("applies hosted frame layout when display mode is hosted", () => {
    const mount = document.createElement("div");
    document.body.appendChild(mount);
    const root = createRoot(mount);

    act(() => {
      root.render(
        <DisplayModeProvider>
          <MobileShell>
            <section>framed</section>
          </MobileShell>
        </DisplayModeProvider>,
      );
    });

    const frame = mount.querySelector("div.h-\\[844px\\]");
    expect(frame).toBeTruthy();
    const surface = mount.querySelector("div.flex.min-h-screen");
    expect(surface).toBeTruthy();

    act(() => {
      root.unmount();
    });
  });

  it("expands to full-browser layout when display mode is persisted as full", () => {
    window.localStorage.setItem("wildside.displayMode", "full-browser");

    const mount = document.createElement("div");
    document.body.appendChild(mount);
    const root = createRoot(mount);

    act(() => {
      root.render(
        <DisplayModeProvider>
          <MobileShell>
            <section>full layout</section>
          </MobileShell>
        </DisplayModeProvider>,
      );
    });

    const fullSurface = mount.querySelector("div.min-h-screen.max-w-6xl");
    expect(fullSurface).toBeTruthy();
    const hostedFrame = mount.querySelector("div.h-\\[844px\\]");
    expect(hostedFrame).toBeNull();

    act(() => {
      root.unmount();
    });
    window.localStorage.removeItem("wildside.displayMode");
  });
});
