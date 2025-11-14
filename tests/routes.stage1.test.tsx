import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { screen, within } from "@testing-library/dom";
import { act } from "react";
import type { Root } from "react-dom/client";
import { createRoot } from "react-dom/client";

import { OFFLINE_STORAGE_DEFAULTS } from "../src/app/config/offline-metrics";
import { savedRoutes, waterfrontDiscoveryRoute } from "../src/app/data/map";
import { autoManagementOptions, walkCompletionShareOptions } from "../src/app/data/stage-four";
import {
  accessibilityOptions,
  wizardGeneratedStops,
  wizardSummaryHighlights,
  wizardWeatherSummary,
} from "../src/app/data/wizard";
import { DisplayModeProvider } from "../src/app/providers/display-mode-provider";
import { ThemeProvider } from "../src/app/providers/theme-provider";
import { AppRoutes, createAppRouter } from "../src/app/routes/app-routes";
import i18n, { i18nReady } from "../src/i18n";

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

function escapeRegExp(raw: string): string {
  return raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const savedRoute = savedRoutes[0];

if (!savedRoute) {
  throw new Error("Expected at least one saved route for the routed flow tests");
}

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
    const view = within(container);
    expect(
      view.getByRole("heading", { level: 1, name: /discover your perfect walk/i }),
    ).toBeTruthy();

    const interestGroup = view.getByRole("group", { name: /interests/i });
    const parksChip = within(interestGroup).getByRole("button", { name: /parks & nature/i });
    act(() => clickElement(parksChip));

    const indicator = view.getByText(/themes selected/i);
    expect(indicator.textContent).toMatch(/3/);
    expect(view.getByRole("button", { name: /start exploring/i })).toBeTruthy();
  });

  it("navigates from explore to discover via the filter button", async () => {
    ({ mount, root } = await renderRoute("/explore"));
    const container = requireContainer(mount);
    const view = within(container);
    const filterButton = view.getByRole("button", { name: /filter walks/i });

    await act(async () => {
      clickElement(filterButton);
      // allow the router navigation microtask to flush
      await Promise.resolve();
    });
    expect(
      await screen.findByRole("heading", { name: /discover your perfect walk/i }),
    ).toBeTruthy();
  });

  it("renders explore panels using accessible regions", async () => {
    ({ mount, root } = await renderRoute("/explore"));
    const container = requireContainer(mount);
    const view = within(container);

    const featuredPanel = view.getByRole("region", { name: /walk of the week/i });
    expect(within(featuredPanel).getByText(/walk of the week/i)).toBeTruthy();

    expect(view.getByRole("region", { name: /popular themes/i })).toBeTruthy();
    expect(view.getByRole("region", { name: /curated collections/i })).toBeTruthy();
    expect(view.getByRole("region", { name: /trending now/i })).toBeTruthy();
    expect(view.getByRole("region", { name: /community favourite/i })).toBeTruthy();

    const searchInput = view.getByPlaceholderText(/search walks/i);
    expect(searchInput.getAttribute("type")).toBe("search");

    const bottomNav = view.getByRole("navigation", { name: /primary navigation/i });
    expect(bottomNav).toBeTruthy();
  });

  it("renders explore stats using Fluent pluralisation", async () => {
    ({ mount, root } = await renderRoute("/explore"));
    const container = requireContainer(mount);
    const view = within(container);

    const communityRegion = view.getByRole("region", { name: /community favourite/i });
    expect(within(communityRegion).getByText(/428 saves/i)).toBeTruthy();

    const curatedRegion = view.getByRole("region", { name: /curated collections/i });
    expect(within(curatedRegion).getByText(/6 routes/i)).toBeTruthy();

    const categoriesRegion = view.getByRole("region", { name: /popular categories/i });
    expect(within(categoriesRegion).getByText(/23 routes/i)).toBeTruthy();
  });

  it("formats explore counts with Fluent singular and plural forms", async () => {
    await i18nReady;

    const singularSave = i18n.t("explore-community-saves", { count: 1 });
    const pluralSave = i18n.t("explore-community-saves", { count: 3 });
    expect(singularSave).toMatch(/1 save/i);
    expect(pluralSave).toMatch(/3 saves/i);

    const singularRoute = i18n.t("explore-curated-route-count", { count: 1 });
    const pluralRoute = i18n.t("explore-curated-route-count", { count: 3 });
    expect(singularRoute).toMatch(/1 route/i);
    expect(pluralRoute).toMatch(/3 routes/i);
  });

  it("toggles advanced switches on the customize route", async () => {
    ({ mount, root } = await renderRoute("/customize"));
    const container = requireContainer(mount);
    const view = within(container);
    expect(view.getByRole("button", { name: /help/i })).toBeTruthy();

    const safetySwitch = view.getByRole("switch", { name: /safety priority/i });
    expect(safetySwitch.getAttribute("data-state")).toBe("unchecked");
    act(() => clickElement(safetySwitch));
    expect(safetySwitch.getAttribute("data-state")).toBe("checked");

    const surfacePicker = view.getByRole("group", { name: /surface type/i });
    expect(within(surfacePicker).getAllByRole("radio").length).toBeGreaterThan(0);

    expect(view.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("slider").length).toBeGreaterThan(0);
  });

  it("localises customize copy for alternate locales", async () => {
    await i18nReady;
    const previousLanguage = i18n.language;
    await act(async () => {
      await i18n.changeLanguage("es");
    });

    try {
      ({ mount, root } = await renderRoute("/customize"));
      const container = requireContainer(mount);
      const view = within(container);

      expect(view.getByRole("heading", { level: 2, name: /distancia/i })).toBeTruthy();
      expect(view.getByRole("group", { name: /tipo de superficie/i })).toBeTruthy();
      expect(view.getByRole("switch", { name: /prioridad de seguridad/i })).toBeTruthy();
      expect(view.getByRole("button", { name: /regenerar/i })).toBeTruthy();
    } finally {
      await act(async () => {
        await i18n.changeLanguage(previousLanguage ?? "en-GB");
      });
    }
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
    const view = within(container);
    const coffeeChip = view.getByRole("button", { name: /coffee spots/i });
    act(() => clickElement(coffeeChip));

    const selectionBadge = view.getByText(/selected/i);
    expect(selectionBadge.textContent).toContain("3 selected");

    const quickHeadings = view.getAllByRole("heading", { level: 2 });
    expect(quickHeadings.length).toBeGreaterThan(0);

    const saveAction = view.getByRole("button", { name: /save quick walk/i });

    await act(async () => {
      clickElement(saveAction);
      await Promise.resolve();
    });

    const heading = await screen.findByRole("heading", {
      name: /waterfront discovery walk/i,
    });
    expect(heading).toBeTruthy();
  });

  it("uses semantic map panel classes on the quick walk route", async () => {
    ({ mount, root } = await renderRoute("/map/quick"));
    const container = requireContainer(mount);
    const view = within(container);

    const stopsPanel = view.getByRole("region", { name: /quick walk stops/i });
    expect(stopsPanel.classList.contains("map-panel")).toBe(true);
    expect(stopsPanel.classList.contains("map-panel--stacked")).toBe(true);

    const notesPanel = view.getByRole("region", { name: /quick walk notes|planning notes/i });
    expect(notesPanel.classList.contains("map-panel")).toBe(true);
    expect(notesPanel.classList.contains("map-panel--scroll")).toBe(true);

    const mapHandles = view.getAllByRole("button", { name: /dismiss panel/i });
    expect(mapHandles.length).toBeGreaterThan(0);

    const tablist = view.getByRole("tablist");
    expect(tablist.classList.contains("map-panel__tablist")).toBe(true);

    const quickFabButton = view.getByRole("button", { name: /save quick walk/i });
    expect(quickFabButton.classList.contains("pointer-events-auto")).toBe(true);
  });

  it("launches the wizard from the quick walk magic wand", async () => {
    ({ mount, root } = await renderRoute("/map/quick"));
    const container = requireContainer(mount);
    const view = within(container);
    const wandTrigger = view.getByRole("button", { name: /generate a new walk/i });

    await act(async () => {
      clickElement(wandTrigger);
      await Promise.resolve();
    });

    expect(await screen.findByRole("heading", { name: /walk wizard/i })).toBeTruthy();
  });

  it("applies semantic classes to quick walk tab panels", async () => {
    ({ mount, root } = await renderRoute("/map/quick"));
    const container = requireContainer(mount);
    const view = within(container);
    const tabPanels = view.getAllByRole("tabpanel");
    expect(tabPanels.length).toBeGreaterThanOrEqual(3);
    tabPanels.forEach((panel) => {
      expect(panel.classList.contains("map-viewport__tab")).toBe(true);
    });

    const generatorHeading = view.getByRole("heading", { name: /quick walk generator/i });
    expect(generatorHeading).toBeTruthy();

    const mapTablist = view.getByRole("tablist");
    expect(mapTablist.classList.contains("map-panel__tablist")).toBe(true);

    const stopsRegion = view.getByRole("region", { name: /quick walk stops/i });
    expect(stopsRegion.classList.contains("map-panel")).toBe(true);

    const notesRegion = view.getByRole("region", { name: /planning notes/i });
    const notesList = within(notesRegion).getByRole("list");
    expect(within(notesList).getAllByRole("listitem").length).toBeGreaterThanOrEqual(3);
  });

  it("localises quick walk copy for alternate locales", async () => {
    await i18nReady;
    const previousLanguage = i18n.language;
    await act(async () => {
      await i18n.changeLanguage("es");
    });

    try {
      ({ mount, root } = await renderRoute("/map/quick"));
      const container = requireContainer(mount);
      const view = within(container);

      expect(
        view.getByRole("heading", { level: 1, name: /generador de caminatas rápidas/i }),
      ).toBeTruthy();
      expect(view.getByRole("heading", { level: 2, name: /intereses/i })).toBeTruthy();
      expect(view.getByRole("region", { name: /paradas de la caminata rápida/i })).toBeTruthy();
      expect(view.getByRole("button", { name: /guardar caminata rápida/i })).toBeTruthy();
    } finally {
      await act(async () => {
        await i18n.changeLanguage(previousLanguage ?? "en-GB");
      });
    }
  });

  it("toggles itinerary favourites and opens the share dialog", async () => {
    ({ mount, root } = await renderRoute("/map/itinerary"));
    const container = requireContainer(mount);
    const view = within(container);
    const tabPanels = view.getAllByRole("tabpanel");
    expect(tabPanels.length).toBeGreaterThanOrEqual(3);

    const routeSummaryHeading = view.getByRole("heading", {
      name: new RegExp(waterfrontDiscoveryRoute.title, "i"),
    });
    expect(routeSummaryHeading).toBeTruthy();

    expect(view.getByText(waterfrontDiscoveryRoute.distance)).toBeTruthy();
    expect(view.getByText(waterfrontDiscoveryRoute.duration)).toBeTruthy();
    expect(view.getByText(String(waterfrontDiscoveryRoute.stopsCount))).toBeTruthy();

    waterfrontDiscoveryRoute.highlights.forEach((highlight) => {
      expect(view.getAllByText(new RegExp(highlight, "i"))[0]).toBeTruthy();
    });

    const notesList = view.getByRole("list", { name: /route notes/i });
    expect(within(notesList).getAllByRole("listitem").length).toBe(
      waterfrontDiscoveryRoute.notes.length,
    );

    const stopsTab = view.getByRole("tab", { name: /stops/i });
    await act(async () => {
      clickElement(stopsTab);
      await Promise.resolve();
    });
    const stopsPanel = view.getByRole("tabpanel", { name: /stops/i });
    expect(stopsPanel.classList.contains("map-overlay")).toBe(true);
    waterfrontDiscoveryRoute.pointsOfInterest.forEach((poi) => {
      expect(
        within(stopsPanel).getByRole("button", { name: new RegExp(poi.name, "i") }),
      ).toBeTruthy();
    });

    const shareButton = view.getByRole("button", { name: /share/i });
    expect(shareButton.classList.contains("route-share__trigger")).toBe(true);

    await act(async () => {
      clickElement(shareButton);
      await Promise.resolve();
    });

    const dialog = await screen.findByRole("dialog", { name: /share this walk/i });
    expect(within(dialog).getByText(/wildside\.app\/routes/)).toBeTruthy();
    const closeControl = within(dialog).getByRole("button", { name: /close/i });
    act(() => clickElement(closeControl));

    const favouriteButton = view.getByRole("button", { name: /save this itinerary/i });
    act(() => clickElement(favouriteButton));
    const updatedFavourite = view.getByRole("button", { name: /remove saved itinerary/i });
    expect(updatedFavourite.getAttribute("aria-pressed")).toBe("true");
  });

  it("opens the saved walk share dialog from the saved route", async () => {
    ({ mount, root } = await renderRoute("/saved"));
    const container = requireContainer(mount);
    const view = within(container);

    const tabPanels = view.getAllByRole("tabpanel");
    expect(tabPanels.length).toBeGreaterThanOrEqual(3);

    const notesTabpanel = view.getByRole("tabpanel", { name: /notes/i });
    const notesList = within(notesTabpanel).getByRole("list", { name: /route notes/i });
    expect(notesList.classList.contains("route-note-list")).toBe(true);
    expect(within(notesList).getAllByRole("listitem").length).toBe(savedRoute.notes.length);

    const stopsTab = view.getByRole("tab", { name: /stops/i });
    await act(async () => {
      clickElement(stopsTab);
      await Promise.resolve();
    });
    const stopsTabpanel = view.getByRole("tabpanel", { name: /stops/i });
    savedRoute.pointsOfInterest.forEach((poi) => {
      expect(
        within(stopsTabpanel).getByRole("button", { name: new RegExp(poi.name, "i") }),
      ).toBeTruthy();
    });

    expect(view.getByRole("heading", { name: new RegExp(savedRoute.title, "i") })).toBeTruthy();
    expect(view.getByText(savedRoute.distance)).toBeTruthy();
    expect(view.getByText(savedRoute.duration)).toBeTruthy();

    const shareTrigger = view.getByRole("button", { name: /^share$/i });
    const favouriteButton = view.getByRole("button", { name: /remove saved walk/i });

    await act(async () => {
      clickElement(shareTrigger);
      await Promise.resolve();
    });

    const dialog = await screen.findByRole("dialog", { name: /share saved walk/i });
    expect(within(dialog).getByText(`https://wildside.app/routes/${savedRoute.id}`)).toBeTruthy();
    const closeButton = within(dialog).getByRole("button", { name: /close/i });
    act(() => clickElement(closeButton));

    act(() => clickElement(favouriteButton));
    const resetFavourite = view.getByRole("button", { name: /save this walk/i });
    expect(resetFavourite.getAttribute("aria-pressed")).toBe("false");
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
    const view = within(container);
    const durationSection = view.getByRole("region", { name: /walk duration controls/i });
    expect(durationSection.classList.contains("wizard-section")).toBe(true);
    const interestsSection = view.getByRole("region", { name: /interests/i });
    expect(interestsSection.classList.contains("wizard-section")).toBe(true);
    const continueButton = view.getByRole("button", { name: /continue to preferences/i });
    expect(continueButton.classList.contains("cta-button")).toBe(true);

    await act(async () => {
      clickElement(continueButton);
      await Promise.resolve();
    });

    const heading = await screen.findByRole("heading", { name: /discovery style/i });
    expect(heading).toBeTruthy();
  });

  it("renders wizard step two surfaces with semantic classes", async () => {
    ({ mount, root } = await renderRoute("/wizard/step-2"));
    const container = requireContainer(mount);
    const view = within(container);

    const discoveryRegion = view.getByRole("region", { name: /discovery style/i });
    expect(discoveryRegion.classList.contains("wizard-section")).toBe(true);
    expect(within(discoveryRegion).getByText(/balanced mix/i)).toBeInTheDocument();
    expect(within(discoveryRegion).getByText(/new/i).classList.contains("wizard-badge")).toBe(true);

    const accessibilityRegion = view.getByRole("region", { name: /accessibility & safety/i });
    expect(accessibilityRegion.classList.contains("wizard-section")).toBe(true);
    const switches = within(accessibilityRegion).getAllByRole("switch");
    expect(switches.length).toBe(accessibilityOptions.length);
    accessibilityOptions.forEach((option) => {
      expect(
        within(accessibilityRegion).getByRole("switch", { name: new RegExp(option.label, "i") }),
      ).toBeInTheDocument();
    });
  });

  it("opens the wizard confirmation dialog on step three", async () => {
    ({ mount, root } = await renderRoute("/wizard/step-3"));
    const container = requireContainer(mount);
    const view = within(container);
    const saveButton = view.getByRole("button", { name: /save walk and view map/i });

    await act(async () => {
      clickElement(saveButton);
      await Promise.resolve();
    });

    const dialog = await screen.findByRole("dialog", { name: /walk saved/i });
    const closeButton = within(dialog).getByRole("button", { name: /close/i });
    act(() => clickElement(closeButton));
  });

  it("renders saved summary panel with semantic class", async () => {
    ({ mount, root } = await renderRoute("/saved"));
    const container = requireContainer(mount);
    const view = within(container);
    expect(
      view.getByRole("heading", { name: new RegExp(savedRoute.title ?? "", "i") }),
    ).toBeTruthy();
    expect(view.getByText(savedRoute.distance ?? "")).toBeTruthy();
    expect(view.getByText(savedRoute.duration ?? "")).toBeTruthy();
    expect(view.getByText(new RegExp(`${savedRoute.stopsCount} stops`, "i"))).toBeTruthy();
  });

  it("renders wizard summary panels with semantic class", async () => {
    ({ mount, root } = await renderRoute("/wizard/step-3"));
    const container = requireContainer(mount);
    const view = within(container);
    const routePanel = view.getByRole("region", { name: /hidden gems loop/i });
    const preferencesPanel = view.getByRole("region", { name: /your preferences applied/i });
    const stopsPanel = view.getByRole("region", { name: /featured stops/i });
    const weatherPanel = view.getByRole("region", {
      name: new RegExp(wizardWeatherSummary.title, "i"),
    });

    [routePanel, preferencesPanel, stopsPanel, weatherPanel].forEach((panel) => {
      expect(panel.classList.contains("wizard-summary__panel")).toBe(true);
      expect(panel.classList.contains("wizard-section")).toBe(true);
    });

    const summaryBadge = within(routePanel).getByText(/custom/i);
    expect(summaryBadge.classList.contains("wizard-badge")).toBe(true);

    wizardSummaryHighlights.forEach((highlight) => {
      expect(within(preferencesPanel).getByText(new RegExp(highlight.label, "i"))).toBeTruthy();
    });

    wizardGeneratedStops.forEach((stop) => {
      expect(within(stopsPanel).getByText(new RegExp(stop.name, "i"))).toBeTruthy();
    });

    expect(within(weatherPanel).getByText(wizardWeatherSummary.summary)).toBeTruthy();
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
    const view = within(container);
    const badge = view.getByText(/route completed/i);
    expect(badge.classList.contains("walk-complete__badge")).toBe(true);

    const completionHeadings = view.getAllByRole("heading", { level: 2 });
    expect(completionHeadings.length).toBeGreaterThan(0);

    const rateButton = view.getByRole("button", { name: /rate this walk/i });
    await act(async () => {
      clickElement(rateButton);
      await Promise.resolve();
    });

    expect(await screen.findByText(/rating saved/i)).toBeTruthy();

    const shareButton = view.getByRole("button", { name: /^share$/i });
    await act(async () => {
      clickElement(shareButton);
      await Promise.resolve();
    });

    const dialog = await screen.findByRole("dialog", { name: /share highlights/i });
    walkCompletionShareOptions.forEach((option) => {
      expect(within(dialog).getByText(new RegExp(option.label, "i"))).toBeInTheDocument();
    });
    const cancelButton = within(dialog).getByRole("button", { name: /cancel/i });
    act(() => clickElement(cancelButton));
  });

  it("lists existing downloads on the offline manager route", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const view = within(requireContainer(mount));
    const downloadsRegion = view.getByRole("region", { name: /downloaded areas/i });
    expect(within(downloadsRegion).getAllByRole("article").length).toBeGreaterThan(0);
    expect(within(downloadsRegion).getByText(/manage maps for offline navigation/i)).toBeTruthy();
  });

  it("renders offline storage overview summary", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const view = within(requireContainer(mount));
    expect(view.getByText(/storage overview/i)).toBeTruthy();

    const { usedLabel, totalLabel } = OFFLINE_STORAGE_DEFAULTS;
    const pattern = new RegExp(`${escapeRegExp(usedLabel)}.*${escapeRegExp(totalLabel)}`, "i");

    expect(view.getByText(pattern)).toBeTruthy();
  });

  it("opens the offline download dialog with the add button", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const view = within(requireContainer(mount));
    const addButton = view.getByRole("button", { name: /add offline area/i });

    await act(async () => {
      clickElement(addButton);
      await Promise.resolve();
    });

    const dialog = await screen.findByRole("dialog", { name: /download new area/i });
    expect(dialog).toBeTruthy();
    expect(within(dialog).getByPlaceholderText(/search cities or regions/i)).toBeTruthy();
  });

  it("allows removing a download when managing the offline list", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const view = within(requireContainer(mount));
    const downloadsRegion = view.getByRole("region", { name: /downloaded areas/i });
    const initialDownloads = within(downloadsRegion).getAllByRole("article");
    expect(initialDownloads.length).toBeGreaterThan(0);

    const manageButton = within(downloadsRegion).getByRole("button", { name: /^manage$/i });

    await act(async () => {
      clickElement(manageButton);
      await Promise.resolve();
    });

    const deleteButtons = within(downloadsRegion).getAllByRole("button", { name: /delete/i });
    expect(deleteButtons.length).toBe(initialDownloads.length);

    await act(async () => {
      clickElement(deleteButtons[0]);
      await Promise.resolve();
    });

    const undoCards = within(downloadsRegion).getAllByRole("article", { name: /deleted/i });
    expect(undoCards.length).toBe(1);
  });

  it("restores a download via undo", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const view = within(requireContainer(mount));
    const downloadsRegion = view.getByRole("region", { name: /downloaded areas/i });
    const manageButton = within(downloadsRegion).getByRole("button", { name: /^manage$/i });

    await act(async () => {
      clickElement(manageButton);
      await Promise.resolve();
    });

    const deleteButtons = within(downloadsRegion).getAllByRole("button", { name: /delete/i });
    await act(async () => {
      clickElement(deleteButtons[0]);
      await Promise.resolve();
    });

    const undoCard = within(downloadsRegion).getByRole("article", { name: /deleted/i });
    const undoButton = within(undoCard).getByRole("button", { name: /undo/i });

    await act(async () => {
      clickElement(undoButton);
      await Promise.resolve();
    });

    expect(within(downloadsRegion).queryByRole("article", { name: /deleted/i })).toBeNull();
  });

  it("clears undo panels when finishing manage mode", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const view = within(requireContainer(mount));
    const downloadsRegion = view.getByRole("region", { name: /downloaded areas/i });
    const manageButton = within(downloadsRegion).getByRole("button", { name: /^manage$/i });

    await act(async () => {
      clickElement(manageButton);
      await Promise.resolve();
    });

    const deleteButtons = within(downloadsRegion).getAllByRole("button", { name: /delete/i });
    await act(async () => {
      clickElement(deleteButtons[0]);
      await Promise.resolve();
    });

    expect(within(downloadsRegion).getByRole("article", { name: /deleted/i })).toBeTruthy();

    const doneButton = within(downloadsRegion).getByRole("button", { name: /^done$/i });
    await act(async () => {
      clickElement(doneButton);
      await Promise.resolve();
    });

    expect(within(downloadsRegion).queryByRole("article", { name: /deleted/i })).toBeNull();
  });

  it("labels offline download cards as readable articles", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const view = within(requireContainer(mount));
    const downloadsRegion = view.getByRole("region", { name: /downloaded areas/i });
    const downloadCards = within(downloadsRegion).getAllByRole("article");
    expect(downloadCards.length).toBeGreaterThan(0);
    downloadCards.forEach((card) => {
      const heading = within(card).queryByRole("heading", { level: 3 });
      expect(heading?.textContent?.trim()).toBeTruthy();
    });
  });

  it("toggles auto-management switches", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const view = within(requireContainer(mount));
    const switches = autoManagementOptions.map((option) =>
      view.getByRole("switch", { name: new RegExp(option.title, "i") }),
    );
    const firstSwitch = switches.at(0);
    if (!firstSwitch) {
      throw new Error("Expected at least one auto-management switch");
    }
    const initialState = firstSwitch.getAttribute("aria-checked");

    await act(async () => {
      clickElement(firstSwitch);
      await Promise.resolve();
    });

    expect(firstSwitch.getAttribute("aria-checked")).not.toBe(initialState);
  });

  it("allows toggling a safety preference and saving", async () => {
    ({ mount, root } = await renderRoute("/safety-accessibility"));
    const view = within(requireContainer(mount));
    const switches = view.getAllByRole("switch");
    expect(switches.length).toBeGreaterThan(0);
    const firstSwitch = switches.at(0);
    if (!firstSwitch) {
      throw new Error("Expected at least one accessibility preference switch");
    }
    const initialState = firstSwitch.getAttribute("aria-checked");
    act(() => clickElement(firstSwitch));
    expect(firstSwitch.getAttribute("aria-checked")).not.toBe(initialState);

    const saveButton = view.getByRole("button", { name: /save preferences/i });

    await act(async () => {
      clickElement(saveButton);
      await Promise.resolve();
    });

    expect(await screen.findByRole("dialog", { name: /preferences saved/i })).toBeTruthy();
  });
});
