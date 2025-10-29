import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";

import { DisplayModeProvider } from "../src/app/providers/display-mode-provider";
import { ThemeProvider } from "../src/app/providers/theme-provider";
import { AppRoutes, createAppRouter } from "../src/app/routes/app-routes";

type TestRoute =
  | "/discover"
  | "/explore"
  | "/customize"
  | "/map/quick"
  | "/map/itinerary"
  | "/saved"
  | "/wizard/step-1"
  | "/wizard/step-2"
  | "/wizard/step-3"
  | "/walk-complete"
  | "/offline"
  | "/safety-accessibility";

async function renderRoute(path: TestRoute) {
  window.history.replaceState(null, "", path);
  const routerInstance = createAppRouter();
  await routerInstance.navigate({ to: path, replace: true });
  const mount = document.createElement("div");
  document.body.appendChild(mount);
  const root = createRoot(mount);
  await act(async () => {
    root.render(
      <DisplayModeProvider>
        <ThemeProvider>
          <AppRoutes routerInstance={routerInstance} />
        </ThemeProvider>
      </DisplayModeProvider>,
    );
    await Promise.resolve();
  });
  return { mount, root };
}

function requireContainer(target: HTMLDivElement | null): HTMLDivElement {
  if (!target) {
    throw new Error("Expected test container to be mounted");
  }
  return target;
}

describe("Stage 1 routed flows", () => {
  let root: Root | null = null;
  let mount: HTMLDivElement | null = null;

  function cleanup() {
    if (root && mount) {
      act(() => {
        root?.unmount();
      });
    }
    root = null;
    mount?.remove();
    mount = null;
    document.body.innerHTML = "";
  }

  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("tracks selected interests on the discover route", async () => {
    ({ mount, root } = await renderRoute("/discover"));
    const container = requireContainer(mount);
    const chips = Array.from(container.querySelectorAll("button"));
    const parksChip = chips.find((chip) => chip.textContent?.includes("Parks & Nature"));
    expect(parksChip).toBeTruthy();
    act(() => parksChip?.click());

    const indicator = Array.from(container.querySelectorAll<HTMLParagraphElement>("p")).find((p) =>
      p.textContent?.includes("themes selected"),
    );
    expect(indicator?.querySelector("span")?.textContent).toBe("3");
  });

  it("navigates from explore to discover via the filter button", async () => {
    ({ mount, root } = await renderRoute("/explore"));
    const container = requireContainer(mount);
    const filterButton = container.querySelector<HTMLButtonElement>(
      "button[aria-label='Filter walks']",
    );
    expect(filterButton).toBeTruthy();

    await act(async () => {
      filterButton?.click();
      // allow the router navigation microtask to flush
      await Promise.resolve();
    });
    const header = Array.from(container.querySelectorAll("h1, h2"))
      .map((node) => node.textContent?.trim())
      .filter(Boolean);
    expect(header).toContain("Discover Your Perfect Walk");
  });

  it("toggles advanced switches on the customize route", async () => {
    ({ mount, root } = await renderRoute("/customize"));
    const container = requireContainer(mount);
    const safetySwitch = container.querySelector<HTMLButtonElement>("#safety");
    expect(safetySwitch?.getAttribute("data-state")).toBe("unchecked");

    act(() => safetySwitch?.click());
    expect(safetySwitch?.getAttribute("data-state")).toBe("checked");
  });
});

describe("Stage 2 routed flows", () => {
  let root: Root | null = null;
  let mount: HTMLDivElement | null = null;

  function cleanup() {
    if (root && mount) {
      act(() => {
        root?.unmount();
      });
    }
    root = null;
    mount?.remove();
    mount = null;
    document.body.innerHTML = "";
  }

  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("updates quick walk interests and navigates to saved", async () => {
    ({ mount, root } = await renderRoute("/map/quick"));
    const container = requireContainer(mount);
    const coffeeChip = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Coffee Spots"),
    );
    expect(coffeeChip).toBeTruthy();
    act(() => coffeeChip?.click());

    const selectionBadge = Array.from(container.querySelectorAll("span")).find((node) =>
      node.textContent?.includes("selected"),
    );
    expect(selectionBadge?.textContent).toContain("3 selected");

    const routesNav = Array.from(container.querySelectorAll("button")).find(
      (btn) => btn.textContent?.trim() === "Routes",
    );
    expect(routesNav).toBeTruthy();

    const saveAction = container.querySelector<HTMLButtonElement>(
      "button[aria-label='Save quick walk']",
    );
    expect(saveAction).toBeTruthy();

    await act(async () => {
      saveAction?.click();
      await Promise.resolve();
    });

    const heading = Array.from(container.querySelectorAll("h1")).find((h1) =>
      h1.textContent?.includes("Waterfront Discovery Walk"),
    );
    expect(heading).toBeTruthy();
  });

  it("launches the wizard from the quick walk magic wand", async () => {
    ({ mount, root } = await renderRoute("/map/quick"));
    const container = requireContainer(mount);
    const wandTrigger = container.querySelector<HTMLButtonElement>(
      "button[aria-label='Generate a new walk']",
    );
    expect(wandTrigger).toBeTruthy();

    await act(async () => {
      wandTrigger?.click();
      await Promise.resolve();
    });

    const wizardHeading = Array.from(container.querySelectorAll("h1")).find((h1) =>
      h1.textContent?.includes("Walk Wizard"),
    );
    expect(wizardHeading).toBeTruthy();
  });

  it("toggles itinerary favourites and opens the share dialog", async () => {
    ({ mount, root } = await renderRoute("/map/itinerary"));
    const container = requireContainer(mount);
    const favouriteButton = container.querySelector<HTMLButtonElement>(
      "button[aria-pressed='false']",
    );
    expect(favouriteButton).toBeTruthy();

    act(() => favouriteButton?.click());
    expect(favouriteButton?.getAttribute("aria-pressed")).toBe("true");

    const shareButton = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Share"),
    );
    expect(shareButton).toBeTruthy();

    await act(async () => {
      shareButton?.click();
      await Promise.resolve();
    });

    const dialog = document.querySelector("[role='dialog']");
    expect(dialog).toBeTruthy();
    const closeControl = Array.from(dialog?.querySelectorAll("button") ?? []).find((btn) =>
      btn.textContent?.includes("Close"),
    );
    expect(closeControl).toBeTruthy();
    act(() => closeControl?.click());
  });

  it("opens the saved walk share dialog from the saved route", async () => {
    ({ mount, root } = await renderRoute("/saved"));
    const container = requireContainer(mount);
    const shareTrigger = Array.from(container.querySelectorAll("button")).find(
      (btn) => btn.getAttribute("aria-label") === "Share",
    );
    expect(shareTrigger).toBeTruthy();

    await act(async () => {
      shareTrigger?.click();
      await Promise.resolve();
    });

    const dialog = document.querySelector("[role='dialog']");
    expect(dialog).toBeTruthy();
    const closeButton = Array.from(dialog?.querySelectorAll("button") ?? []).find((btn) =>
      btn.textContent?.includes("Close"),
    );
    act(() => closeButton?.click());

    const favouriteButton = container.querySelector<HTMLButtonElement>(
      "button[aria-pressed='true']",
    );
    expect(favouriteButton).toBeTruthy();
    act(() => favouriteButton?.click());
    expect(favouriteButton?.getAttribute("aria-pressed")).toBe("false");
  });
});

describe("Stage 3 wizard flows", () => {
  let root: Root | null = null;
  let mount: HTMLDivElement | null = null;

  function cleanup() {
    if (root && mount) {
      act(() => {
        root?.unmount();
      });
    }
    root = null;
    mount?.remove();
    mount = null;
    document.body.innerHTML = "";
  }

  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("advances from wizard step one to step two", async () => {
    ({ mount, root } = await renderRoute("/wizard/step-1"));
    const container = requireContainer(mount);
    const continueButton = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Continue to preferences"),
    );
    expect(continueButton).toBeTruthy();

    await act(async () => {
      continueButton?.click();
      await Promise.resolve();
    });

    const heading = Array.from(container.querySelectorAll("h2")).find((node) =>
      node.textContent?.includes("Discovery style"),
    );
    expect(heading).toBeTruthy();
  });

  it("opens the wizard confirmation dialog on step three", async () => {
    ({ mount, root } = await renderRoute("/wizard/step-3"));
    const container = requireContainer(mount);

    const saveButton = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Save walk"),
    );
    expect(saveButton).toBeTruthy();

    await act(async () => {
      saveButton?.click();
      await Promise.resolve();
    });

    const dialog = document.querySelector("[role='dialog']");
    expect(dialog).toBeTruthy();

    const closeButton = Array.from(dialog?.querySelectorAll("button") ?? []).find((btn) =>
      btn.textContent?.includes("Close"),
    );
    expect(closeButton).toBeTruthy();
    act(() => closeButton?.click());
  });
});

describe("Stage 4 completion flows", () => {
  let root: Root | null = null;
  let mount: HTMLDivElement | null = null;

  function cleanup() {
    if (root && mount) {
      act(() => {
        root?.unmount();
      });
    }
    root = null;
    mount?.remove();
    mount = null;
    document.body.innerHTML = "";
  }

  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows a celebratory toast when rating a completed walk", async () => {
    ({ mount, root } = await renderRoute("/walk-complete"));
    const container = requireContainer(mount);
    const rateButton = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Rate this walk"),
    );
    expect(rateButton).toBeTruthy();

    await act(async () => {
      rateButton?.click();
      await Promise.resolve();
    });

    const toast = document.querySelector(".alert-success");
    expect(toast?.textContent).toContain("Rating saved");
  });

  it("lists existing downloads on the offline manager route", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const container = requireContainer(mount);
    const downloadCards = container.querySelectorAll("article");
    expect(downloadCards.length).toBeGreaterThan(0);
    const header = Array.from(container.querySelectorAll("h2")).find((node) =>
      node.textContent?.includes("Downloaded areas"),
    );
    expect(header).toBeTruthy();
  });

  it("allows removing a download when managing the offline list", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const container = requireContainer(mount);
    const manageButton = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Manage"),
    );
    expect(manageButton).toBeTruthy();

    const cardsBefore = container.querySelectorAll("[data-testid='offline-download-card']");
    expect(cardsBefore.length).toBeGreaterThan(0);

    await act(async () => {
      manageButton?.click();
      await Promise.resolve();
    });

    const deleteButtons = container.querySelectorAll("[data-testid='offline-delete-button']");
    expect(deleteButtons.length).toBe(cardsBefore.length);

    await act(async () => {
      deleteButtons[0]?.click();
      await Promise.resolve();
    });

    const cardsAfter = container.querySelectorAll("[data-testid='offline-download-card']");
    expect(cardsAfter.length).toBe(cardsBefore.length - 1);
  });

  it("toggles auto-management switches", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const container = requireContainer(mount);
    const switches = container.querySelectorAll<HTMLElement>(
      "[data-testid^='auto-management-switch-']",
    );
    expect(switches.length).toBeGreaterThan(0);

    const firstSwitch = switches[0];
    const initialState = firstSwitch.getAttribute("data-state");

    await act(async () => {
      firstSwitch.click();
      await Promise.resolve();
    });

    expect(firstSwitch.getAttribute("data-state")).not.toBe(initialState);
  });

  it("allows toggling a safety preference and saving", async () => {
    ({ mount, root } = await renderRoute("/safety-accessibility"));
    const container = requireContainer(mount);
    const switches = container.querySelectorAll<HTMLButtonElement>("[role='switch']");
    expect(switches.length).toBeGreaterThan(0);

    const firstSwitch = switches[0];
    const initialState = firstSwitch.getAttribute("data-state");
    act(() => firstSwitch.click());
    expect(firstSwitch.getAttribute("data-state")).not.toBe(initialState);

    const saveButton = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Save preferences"),
    );
    expect(saveButton).toBeTruthy();

    await act(async () => {
      saveButton?.click();
      await Promise.resolve();
    });

    const dialog = document.querySelector("[role='dialog']");
    expect(dialog).toBeTruthy();
  });
});
