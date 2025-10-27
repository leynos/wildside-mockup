import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";

import { ThemeProvider } from "../src/app/providers/theme-provider";
import { AppRoutes, createAppRouter } from "../src/app/routes/app-routes";

async function renderRoute(path: string) {
  window.history.replaceState(null, "", path);
  const pathname = path.split("#")[0] as "/map/quick";
  const router = createAppRouter();
  await router.navigate({ to: pathname, replace: true });
  if (path.includes("#")) {
    const [, hash] = path.split("#");
    window.location.hash = `#${hash}`;
  }
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  await act(async () => {
    root.render(
      <ThemeProvider>
        <AppRoutes routerInstance={router} />
      </ThemeProvider>,
    );
    await Promise.resolve();
  });
  return { root, host };
}

describe("quick map hash fragments", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;

  const cleanup = () => {
    if (root && host) {
      act(() => root?.unmount());
    }
    host?.remove();
    document.body.innerHTML = "";
    root = null;
    host = null;
  };

  beforeEach(() => cleanup());
  afterEach(() => cleanup());

  it("activates the stops tab when loading #stops", async () => {
    ({ root, host } = await renderRoute("/map/quick#stops"));
    await act(async () => {
      await Promise.resolve();
    });
    const mapContainer = document.querySelector("[data-testid='quick-walk-map-container']");
    expect(mapContainer).toBeTruthy();
    expect(mapContainer?.className.includes("flex")).toBe(true);

    const stopsPanel = document.querySelector("[data-testid='quick-walk-stops-panel']");
    expect(stopsPanel).toBeTruthy();
    const stopsTabpanel = stopsPanel?.closest("[role='tabpanel']");
    expect(stopsTabpanel).toBeTruthy();
    expect(stopsTabpanel?.hasAttribute("hidden")).toBe(false);
  });

  it("activates the notes tab with updated max height when loading #notes", async () => {
    ({ root, host } = await renderRoute("/map/quick#notes"));
    await act(async () => {
      await Promise.resolve();
    });
    const notesPanel = document.querySelector("[data-testid='quick-walk-notes-panel']");
    expect(notesPanel).toBeTruthy();
    expect(notesPanel?.className.includes("max-h-[53vh]")).toBe(true);
    const notesTabpanel = notesPanel?.closest("[role='tabpanel']");
    expect(notesTabpanel).toBeTruthy();
    expect(notesTabpanel?.hasAttribute("hidden")).toBe(false);
  });
});
