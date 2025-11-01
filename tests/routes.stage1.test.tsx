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

const clickElement = (element: Element | null | undefined): void => {
  if (element instanceof HTMLElement) {
    element.click();
  }
};

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
    const discoverCards = container.querySelectorAll(".discover-interest__card");
    expect(discoverCards.length).toBeGreaterThan(0);
    act(() => clickElement(parksChip));

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
      clickElement(filterButton);
      // allow the router navigation microtask to flush
      await Promise.resolve();
    });
    const header = Array.from(container.querySelectorAll("h1, h2"))
      .map((node) => node.textContent?.trim())
      .filter(Boolean);
    expect(header).toContain("Discover Your Perfect Walk");
  });

  it("renders explore panels using semantic classes", async () => {
    ({ mount, root } = await renderRoute("/explore"));
    const container = requireContainer(mount);

    const featuredPanel = container.querySelector(".explore-featured__panel");
    expect(featuredPanel).toBeTruthy();

    const compactCards = container.querySelectorAll(".explore-compact__card");
    expect(compactCards.length).toBeGreaterThan(0);

    const collectionCards = container.querySelectorAll(".explore-collection__card");
    expect(collectionCards.length).toBeGreaterThan(0);

    const infoPanel = container.querySelector(".explore-info__panel");
    expect(infoPanel).toBeTruthy();
  });

  it("toggles advanced switches on the customize route", async () => {
    ({ mount, root } = await renderRoute("/customize"));
    const container = requireContainer(mount);
    const safetySwitch = container.querySelector<HTMLButtonElement>("#advanced-safety");
    expect(safetySwitch?.getAttribute("data-state")).toBe("unchecked");

    act(() => clickElement(safetySwitch));
    expect(safetySwitch?.getAttribute("data-state")).toBe("checked");

    const surfaceOptions = container.querySelectorAll(".customize-surface__option");
    expect(surfaceOptions.length).toBeGreaterThan(0);
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
    act(() => clickElement(coffeeChip));

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
      clickElement(saveAction);
      await Promise.resolve();
    });

    const heading = Array.from(container.querySelectorAll("h1")).find((h1) =>
      h1.textContent?.includes("Waterfront Discovery Walk"),
    );
    expect(heading).toBeTruthy();
  });

  it("uses semantic map panel classes on the quick walk route", async () => {
    ({ mount, root } = await renderRoute("/map/quick"));
    const container = requireContainer(mount);

    const stopsPanel = container.querySelector("[data-testid='quick-walk-stops-panel']");
    expect(stopsPanel).toBeTruthy();
    expect(stopsPanel?.classList.contains("map-panel")).toBe(true);
    expect(stopsPanel?.classList.contains("map-panel--stacked")).toBe(true);

    const notesPanel = container.querySelector("[data-testid='quick-walk-notes-panel']");
    expect(notesPanel).toBeTruthy();
    expect(notesPanel?.classList.contains("map-panel")).toBe(true);
    expect(notesPanel?.classList.contains("map-panel--scroll")).toBe(true);
  });

  it("launches the wizard from the quick walk magic wand", async () => {
    ({ mount, root } = await renderRoute("/map/quick"));
    const container = requireContainer(mount);
    const wandTrigger = container.querySelector<HTMLButtonElement>(
      "button[aria-label='Generate a new walk']",
    );
    expect(wandTrigger).toBeTruthy();

    await act(async () => {
      clickElement(wandTrigger);
      await Promise.resolve();
    });

    const wizardHeading = Array.from(container.querySelectorAll("h1")).find((h1) =>
      h1.textContent?.includes("Walk Wizard"),
    );
    expect(wizardHeading).toBeTruthy();
  });

  it("applies semantic classes to quick walk tab panels", async () => {
    ({ mount, root } = await renderRoute("/map/quick"));
    const container = requireContainer(mount);
    const tabPanels = container.querySelectorAll<HTMLElement>("[role='tabpanel']");
    expect(tabPanels.length).toBeGreaterThanOrEqual(3);
    tabPanels.forEach((panel) => {
      expect(panel.classList.contains("map-viewport__tab")).toBe(true);
    });

    const generatorPanel = container.querySelector(".quick-walk__panel");
    expect(generatorPanel).toBeTruthy();
  });

  it("toggles itinerary favourites and opens the share dialog", async () => {
    ({ mount, root } = await renderRoute("/map/itinerary"));
    const container = requireContainer(mount);
    const summaryPanel = container.querySelector(".map-route__summary");
    expect(summaryPanel).toBeTruthy();
    const overlayPanels = container.querySelectorAll(".map-overlay");
    expect(overlayPanels.length).toBeGreaterThanOrEqual(3);

    const favouriteButton = container.querySelector<HTMLButtonElement>(
      "button[aria-pressed='false']",
    );
    expect(favouriteButton).toBeTruthy();

    act(() => clickElement(favouriteButton));
    expect(favouriteButton?.getAttribute("aria-pressed")).toBe("true");

    const shareButton = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Share"),
    );
    expect(shareButton).toBeTruthy();

    await act(async () => {
      clickElement(shareButton);
      await Promise.resolve();
    });

    const dialog = document.querySelector("[role='dialog']");
    expect(dialog).toBeTruthy();
    const closeControl = Array.from(dialog?.querySelectorAll("button") ?? []).find((btn) =>
      btn.textContent?.includes("Close"),
    );
    expect(closeControl).toBeTruthy();
    act(() => clickElement(closeControl));
  });

  it("opens the saved walk share dialog from the saved route", async () => {
    ({ mount, root } = await renderRoute("/saved"));
    const container = requireContainer(mount);
    const overlayPanels = container.querySelectorAll(".map-overlay");
    expect(overlayPanels.length).toBeGreaterThanOrEqual(3);
    const shareTrigger = Array.from(container.querySelectorAll("button")).find(
      (btn) => btn.getAttribute("aria-label") === "Share",
    );
    expect(shareTrigger).toBeTruthy();

    await act(async () => {
      clickElement(shareTrigger);
      await Promise.resolve();
    });

    const dialog = document.querySelector("[role='dialog']");
    expect(dialog).toBeTruthy();
    const closeButton = Array.from(dialog?.querySelectorAll("button") ?? []).find((btn) =>
      btn.textContent?.includes("Close"),
    );
    act(() => clickElement(closeButton));

    const favouriteButton = container.querySelector<HTMLButtonElement>(
      "button[aria-pressed='true']",
    );
    expect(favouriteButton).toBeTruthy();
    act(() => clickElement(favouriteButton));
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
      clickElement(continueButton);
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
      clickElement(saveButton);
      await Promise.resolve();
    });

    const dialog = document.querySelector("[role='dialog']");
    expect(dialog).toBeTruthy();

    const closeButton = Array.from(dialog?.querySelectorAll("button") ?? []).find((btn) =>
      btn.textContent?.includes("Close"),
    );
    expect(closeButton).toBeTruthy();
    act(() => clickElement(closeButton));
  });

  it("renders saved summary panel with semantic class", async () => {
    ({ mount, root } = await renderRoute("/saved"));
    const container = requireContainer(mount);
    const summaryPanel = container.querySelector(".saved-summary__panel");
    expect(summaryPanel).toBeTruthy();
  });

  it("renders wizard summary panels with semantic class", async () => {
    ({ mount, root } = await renderRoute("/wizard/step-3"));
    const container = requireContainer(mount);
    const panels = container.querySelectorAll(".wizard-summary__panel");
    expect(panels.length).toBeGreaterThanOrEqual(4);
    panels.forEach((panel) => {
      expect(panel.classList.contains("wizard-summary__panel")).toBe(true);
    });
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
    const badge = container.querySelector(".walk-complete__badge");
    expect(badge).toBeTruthy();
    const rateButton = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Rate this walk"),
    );
    expect(rateButton).toBeTruthy();

    await act(async () => {
      clickElement(rateButton);
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

  it("renders offline storage overview with semantic class", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const container = requireContainer(mount);
    const overview = container.querySelector(".offline-overview__panel");
    expect(overview).toBeTruthy();
  });

  it("opens the offline download dialog with the semantic surface class", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const container = requireContainer(mount);
    const addButton = container.querySelector<HTMLButtonElement>(
      "button[aria-label='Add offline area']",
    );
    expect(addButton).toBeTruthy();

    await act(async () => {
      clickElement(addButton);
      await Promise.resolve();
    });

    const dialog = document.querySelector<HTMLElement>("[role='dialog']");
    expect(dialog).toBeTruthy();
    expect(dialog?.classList.contains("dialog-surface")).toBe(true);
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

    const firstCardTitle = cardsBefore[0]?.querySelector("h3")?.textContent?.trim();
    expect(firstCardTitle).toBeTruthy();

    await act(async () => {
      clickElement(manageButton);
      await Promise.resolve();
    });

    const deleteButtons = container.querySelectorAll("[data-testid='offline-delete-button']");
    expect(deleteButtons.length).toBe(cardsBefore.length);

    await act(async () => {
      clickElement(deleteButtons[0]);
      await Promise.resolve();
    });

    const cardsAfter = container.querySelectorAll("[data-testid='offline-download-card']");
    expect(cardsAfter.length).toBe(cardsBefore.length - 1);

    const undoCards = container.querySelectorAll("[data-testid='offline-undo-card']");
    expect(undoCards.length).toBe(1);
    expect(undoCards[0]?.textContent).toContain(firstCardTitle ?? "");
  });

  it("restores a download via undo", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const container = requireContainer(mount);
    const manageButton = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Manage"),
    );
    expect(manageButton).toBeTruthy();

    const initialCards = container.querySelectorAll("[data-testid='offline-download-card']");
    expect(initialCards.length).toBeGreaterThan(0);

    await act(async () => {
      clickElement(manageButton);
      await Promise.resolve();
    });

    const deleteButtons = container.querySelectorAll("[data-testid='offline-delete-button']");
    expect(deleteButtons.length).toBe(initialCards.length);

    await act(async () => {
      clickElement(deleteButtons[0]);
      await Promise.resolve();
    });

    const undoButton = container.querySelector<HTMLButtonElement>(
      "[data-testid='offline-undo-button']",
    );
    expect(undoButton).toBeTruthy();

    await act(async () => {
      clickElement(undoButton);
      await Promise.resolve();
    });

    const cardsAfterUndo = container.querySelectorAll("[data-testid='offline-download-card']");
    expect(cardsAfterUndo.length).toBe(initialCards.length);
    expect(container.querySelectorAll("[data-testid='offline-undo-card']").length).toBe(0);
  });

  it("clears undo panels when finishing manage mode", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const container = requireContainer(mount);
    const manageButton = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Manage"),
    );
    expect(manageButton).toBeTruthy();

    await act(async () => {
      clickElement(manageButton);
      await Promise.resolve();
    });

    const deleteButtons = container.querySelectorAll("[data-testid='offline-delete-button']");
    expect(deleteButtons.length).toBeGreaterThan(0);

    await act(async () => {
      clickElement(deleteButtons[0]);
      await Promise.resolve();
    });

    const undoCard = container.querySelector("[data-testid='offline-undo-card']");
    expect(undoCard).toBeTruthy();

    const doneButton = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Done"),
    );
    expect(doneButton).toBeTruthy();

    await act(async () => {
      clickElement(doneButton);
      await Promise.resolve();
    });

    expect(container.querySelectorAll("[data-testid='offline-undo-card']").length).toBe(0);
    expect(container.querySelectorAll("[data-testid='offline-download-card']").length).toBe(
      deleteButtons.length - 1,
    );
  });

  it("wraps offline download cards with semantic classes", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const container = requireContainer(mount);
    const downloadCards = container.querySelectorAll("[data-testid='offline-download-card']");
    expect(downloadCards.length).toBeGreaterThan(0);
    downloadCards.forEach((card) => {
      expect(card.classList.contains("offline-download__card")).toBe(true);
    });

    const manageButton = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Manage"),
    );
    expect(manageButton).toBeTruthy();

    await act(async () => {
      clickElement(manageButton);
      await Promise.resolve();
    });

    const deleteButton = container.querySelector<HTMLButtonElement>(
      "[data-testid='offline-delete-button']",
    );
    expect(deleteButton).toBeTruthy();

    await act(async () => {
      clickElement(deleteButton);
      await Promise.resolve();
    });

    const undoCard = container.querySelector("[data-testid='offline-undo-card']");
    expect(undoCard).toBeTruthy();
    expect(undoCard?.classList.contains("offline-download__undo")).toBe(true);
  });

  it("toggles auto-management switches", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const container = requireContainer(mount);
    const switches = container.querySelectorAll<HTMLElement>(
      "[data-testid^='auto-management-switch-']",
    );
    expect(switches.length).toBeGreaterThan(0);

    const automationCards = container.querySelectorAll(".preference-card");
    expect(automationCards.length).toBe(switches.length);

    switches.forEach((toggle) => {
      expect(toggle.classList.contains("toggle-switch")).toBe(true);
    });

    const firstSwitch = switches[0];
    if (!firstSwitch) {
      throw new Error("Expected at least one auto-management switch");
    }
    const initialState = firstSwitch.getAttribute("data-state");

    await act(async () => {
      clickElement(firstSwitch);
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
    if (!firstSwitch) {
      throw new Error("Expected at least one safety switch");
    }
    const initialState = firstSwitch.getAttribute("data-state");
    act(() => clickElement(firstSwitch));
    expect(firstSwitch.getAttribute("data-state")).not.toBe(initialState);

    const saveButton = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Save preferences"),
    );
    expect(saveButton).toBeTruthy();

    await act(async () => {
      clickElement(saveButton);
      await Promise.resolve();
    });

    const dialog = document.querySelector("[role='dialog']");
    expect(dialog).toBeTruthy();
  });
});
