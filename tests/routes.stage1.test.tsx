import { afterAll, afterEach, beforeEach, describe, expect, it } from "bun:test";
import { screen, within } from "@testing-library/dom";
import { act } from "react";
import type { Root } from "react-dom/client";
import { createRoot } from "react-dom/client";
import { OFFLINE_STORAGE_PLACEHOLDERS } from "../src/app/config/offline-metrics";
import type { WalkRouteSummary } from "../src/app/data/map";
import { savedRoutes, waterfrontDiscoveryRoute } from "../src/app/data/map";
import { autoManagementOptions, walkCompletionShareOptions } from "../src/app/data/stage-four";
import {
  accessibilityOptions,
  wizardGeneratedStops,
  wizardRouteSummary,
  wizardSummaryHighlights,
  wizardWeatherSummary,
} from "../src/app/data/wizard";
import { buildWizardRouteStats } from "../src/app/features/wizard/step-three/build-wizard-route-stats";
import { buildWizardWeatherCopy } from "../src/app/features/wizard/step-three/build-wizard-weather-copy";
import { DisplayModeProvider } from "../src/app/providers/display-mode-provider";
import { ThemeProvider } from "../src/app/providers/theme-provider";
import { AppRoutes, createAppRouter } from "../src/app/routes/app-routes";
import { formatDistance, formatDuration, formatStops } from "../src/app/units/unit-format";
import { UnitPreferencesProvider } from "../src/app/units/unit-preferences-provider";
import { detectUnitSystem } from "../src/app/units/unit-system";
import {
  changeLanguage,
  escapeRegExp,
  i18n,
  i18nReady,
  resetLanguage,
  withI18nLanguage,
} from "./helpers/i18nTestHelpers";
import { installLogicalStyleStub } from "./support/logical-style-stub";

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

const savedRoute = savedRoutes[0];

if (!savedRoute) {
  throw new Error("Expected at least one saved route for the routed flow tests");
}

const translate = (
  key: string,
  defaultValue: string,
  options?: Record<string, unknown>,
): string | undefined => {
  return i18n.t(key, { defaultValue, ...(options ?? {}) });
};

const buildUnitOptions = () => ({
  t: i18n.t.bind(i18n),
  locale: i18n.language,
  unitSystem: detectUnitSystem(i18n.language),
});

const formatRouteMetrics = (route: WalkRouteSummary) => {
  const unitOptions = buildUnitOptions();
  const distance = formatDistance(route.distanceMetres, unitOptions);
  const duration = formatDuration(route.durationSeconds, {
    ...unitOptions,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const stops = formatStops(route.stopsCount, {
    ...unitOptions,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return {
    distance,
    duration,
    stops,
    distanceText: `${distance.value} ${distance.unitLabel}`,
    durationText: `${duration.value} ${duration.unitLabel}`,
    stopsText: `${stops.value} ${stops.unitLabel}`,
  };
};

const buildWizardStatsCopy = () =>
  buildWizardRouteStats(i18n.t.bind(i18n), i18n.language, detectUnitSystem(i18n.language));

const buildWizardWeather = () =>
  buildWizardWeatherCopy(i18n.t.bind(i18n), i18n.language, detectUnitSystem(i18n.language));

const defaultRouteCountLabel = (count: number): string =>
  `${count} ${count === 1 ? "route" : "routes"}`;

const defaultSaveCountLabel = (count: number): string =>
  `${count} ${count === 1 ? "save" : "saves"}`;

const defaultSelectionLabel = (count: number): string => `${count} selected`;

const localizedRegex = (value?: string) => new RegExp(escapeRegExp(value ?? ""), "i");

const offlineUndoDescriptionDefault = "Tap undo to restore this map.";

const buildSavedRouteCopy = (route: WalkRouteSummary) => {
  const savedMetrics = formatRouteMetrics(route);
  const savedDistanceCopy =
    i18n.t("saved-route-distance-value", {
      value: savedMetrics.distance.value,
      unit: savedMetrics.distance.unitLabel,
      defaultValue: savedMetrics.distanceText,
    }) ?? savedMetrics.distanceText;
  const savedDurationCopy =
    i18n.t("saved-route-duration-value", {
      value: savedMetrics.duration.value,
      unit: savedMetrics.duration.unitLabel,
      defaultValue: savedMetrics.durationText,
    }) ?? savedMetrics.durationText;
  const savedStopsCopy =
    i18n.t("saved-route-stops-value", {
      value: savedMetrics.stops.value,
      unit: savedMetrics.stops.unitLabel,
      defaultValue: savedMetrics.stopsText,
    }) ?? savedMetrics.stopsText;

  return {
    savedDistanceCopy,
    savedDurationCopy,
    savedStopsCopy,
  } as const;
};

const clickElement = (element: Element | null | undefined): void => {
  if (element instanceof HTMLElement) {
    element.click();
  }
};

const buildOfflineDownloadsCopy = () => {
  const downloadsHeading =
    translate("offline-downloads-heading", "Downloaded areas") ?? "Downloaded areas";
  const downloadsDescription =
    translate("offline-downloads-description", "Manage maps for offline navigation") ??
    "Manage maps for offline navigation";
  const manageLabel = translate("offline-downloads-manage", "Manage") ?? "Manage";
  const doneLabel = translate("offline-downloads-done", "Done") ?? "Done";
  const undoDescription =
    translate("offline-downloads-undo-description", offlineUndoDescriptionDefault) ??
    offlineUndoDescriptionDefault;
  const undoButtonLabel = translate("offline-downloads-undo-button", "Undo") ?? "Undo";
  const deleteAriaLabel = (title: string) =>
    translate("offline-downloads-delete-aria", `Delete ${title}`, { title }) ?? `Delete ${title}`;
  const undoAriaLabel = (title: string, description: string) =>
    translate("offline-downloads-undo-aria", "{{title}} deleted. {{description}}", {
      title,
      description,
    }) ?? `${title} deleted. ${description}`;

  return {
    downloadsHeading,
    downloadsDescription,
    manageLabel,
    doneLabel,
    undoDescription,
    undoButtonLabel,
    deleteAriaLabel,
    undoAriaLabel,
  } as const;
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
      <UnitPreferencesProvider>
        <DisplayModeProvider>
          <ThemeProvider>
            <AppRoutes routerInstance={routerInstance} />
          </ThemeProvider>
        </DisplayModeProvider>
      </UnitPreferencesProvider>,
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

const setDocumentDirection = (direction: "ltr" | "rtl") => {
  document.documentElement.dir = direction;
  document.documentElement.setAttribute("data-direction", direction);
  document.body.dir = direction;
  document.body.setAttribute("data-direction", direction);
};

const removeLogicalStyleStub = installLogicalStyleStub();

afterAll(() => {
  removeLogicalStyleStub();
});

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
    setDocumentDirection("ltr");
  });

  afterEach(async () => {
    cleanup();
    setDocumentDirection("ltr");
    await resetLanguage();
  });

  it("tracks selected interests on the discover route", async () => {
    ({ mount, root } = await renderRoute("/discover"));
    const container = requireContainer(mount);
    const view = within(container);
    const discoverHeading = translate("discover-hero-title", "Discover Your Perfect Walk");
    const interestsLabel = translate("wizard-step-one-interests-section-aria", "Interests");

    expect(
      view.getByRole("heading", {
        level: 1,
        name: localizedRegex(discoverHeading),
      }),
    ).toBeTruthy();

    const interestGroup = view.getByRole("group", { name: localizedRegex(interestsLabel) });
    const parksChip = within(interestGroup).getByRole("button", {
      name: /parks & nature/i,
    });
    act(() => clickElement(parksChip));

    const indicator = view.getByText(/themes selected/i);
    expect(indicator.textContent).toMatch(/3/);
    expect(view.getByRole("button", { name: /start exploring/i })).toBeTruthy();
  });

  it("navigates from explore to discover via the filter button", async () => {
    ({ mount, root } = await renderRoute("/explore"));
    const container = requireContainer(mount);
    const view = within(container);
    const filterButtonLabel = translate("explore-filter-aria-label", "Filter walks");
    const discoverHeading = translate("discover-hero-title", "Discover Your Perfect Walk");
    const filterButton = view.getByRole("button", {
      name: localizedRegex(filterButtonLabel),
    });

    await act(async () => {
      clickElement(filterButton);
      // allow the router navigation microtask to flush
      await Promise.resolve();
    });
    expect(
      await screen.findByRole("heading", {
        name: localizedRegex(discoverHeading),
      }),
    ).toBeTruthy();
  });

  it("renders explore panels using accessible regions", async () => {
    ({ mount, root } = await renderRoute("/explore"));
    const container = requireContainer(mount);
    const view = within(container);

    const featuredHeading = translate("explore-featured-heading", "Walk of the Week");
    const featuredPanel = view.getByRole("region", {
      name: localizedRegex(featuredHeading),
    });
    expect(within(featuredPanel).getByText(localizedRegex(featuredHeading))).toBeTruthy();

    const popularHeading = translate("explore-popular-heading", "Popular Themes");
    expect(view.getByRole("region", { name: localizedRegex(popularHeading) })).toBeTruthy();

    const curatedHeading = translate("explore-curated-heading", "Curated Collections");
    expect(view.getByRole("region", { name: localizedRegex(curatedHeading) })).toBeTruthy();

    const trendingHeading = translate("explore-trending-heading", "Trending Now");
    expect(view.getByRole("region", { name: localizedRegex(trendingHeading) })).toBeTruthy();

    const communityHeading = translate("explore-community-heading", "Community Favourite");
    expect(view.getByRole("region", { name: localizedRegex(communityHeading) })).toBeTruthy();

    const searchPlaceholder = translate(
      "explore-search-placeholder",
      "Search walks, places, themes...",
    );
    const searchInput = view.getByPlaceholderText(
      searchPlaceholder ?? "Search walks, places, themes...",
    );
    expect(searchInput.getAttribute("type")).toBe("search");

    const navLabel = translate("nav-primary-aria-label", "Primary navigation");
    const bottomNav = view.getByRole("navigation", {
      name: localizedRegex(navLabel),
    });
    expect(bottomNav).toBeTruthy();
  });

  it("updates explore headings and labels when the locale changes", async () => {
    await i18nReady;
    ({ mount, root } = await renderRoute("/explore"));
    const container = requireContainer(mount);
    const view = within(container);

    const initialHeading = view.getByRole("heading", {
      level: 1,
      name: /discover/i,
    });
    expect(initialHeading).toBeTruthy();

    await changeLanguage("es");

    const translatedTitle = i18n.t("explore-header-title");
    expect(translatedTitle).toBeTruthy();
    expect(
      view.getByRole("heading", {
        level: 1,
        name: new RegExp(escapeRegExp(translatedTitle ?? ""), "i"),
      }),
    ).toBeTruthy();

    expect(view.queryByRole("heading", { level: 1, name: /discover/i })).toBeNull();

    const searchPlaceholder = i18n.t("explore-search-placeholder");
    expect(searchPlaceholder).toBeTruthy();
    expect(view.getByPlaceholderText(searchPlaceholder)).toBeTruthy();

    const categoriesLabel = i18n.t("explore-categories-aria-label");
    expect(categoriesLabel).toBeTruthy();
    expect(
      view.getByRole("region", {
        name: new RegExp(escapeRegExp(categoriesLabel ?? ""), "i"),
      }),
    ).toBeTruthy();

    const featuredHeading = i18n.t("explore-featured-heading");
    expect(featuredHeading).toBeTruthy();
    expect(
      view.getByRole("region", {
        name: new RegExp(escapeRegExp(featuredHeading ?? ""), "i"),
      }),
    ).toBeTruthy();

    const navLabel = i18n.t("nav-primary-aria-label");
    expect(navLabel).toBeTruthy();
    expect(
      view.getByRole("navigation", {
        name: new RegExp(escapeRegExp(navLabel ?? ""), "i"),
      }),
    ).toBeTruthy();
  });

  it("renders explore stats using Fluent pluralisation", async () => {
    ({ mount, root } = await renderRoute("/explore"));
    const container = requireContainer(mount);
    const view = within(container);
    const communityHeading = translate("explore-community-heading", "Community Favourite");
    const curatedHeading = translate("explore-curated-heading", "Curated Collections");
    const categoriesHeading = translate("explore-categories-aria-label", "Popular categories");

    const communityRegion = view.getByRole("region", {
      name: localizedRegex(communityHeading),
    });
    const communitySaves = translate("explore-community-saves", defaultSaveCountLabel(428), {
      count: 428,
    });
    expect(within(communityRegion).getByText(localizedRegex(communitySaves))).toBeTruthy();

    const curatedRegion = view.getByRole("region", {
      name: localizedRegex(curatedHeading),
    });
    const curatedRoutes = translate("explore-curated-route-count", defaultRouteCountLabel(6), {
      count: 6,
    });
    expect(within(curatedRegion).getByText(localizedRegex(curatedRoutes))).toBeTruthy();

    const categoriesRegion = view.getByRole("region", {
      name: localizedRegex(categoriesHeading),
    });
    const categoriesRoutes = translate("explore-curated-route-count", defaultRouteCountLabel(23), {
      count: 23,
    });
    expect(within(categoriesRegion).getByText(localizedRegex(categoriesRoutes))).toBeTruthy();
  });

  it("formats explore counts with Fluent singular and plural forms", async () => {
    await i18nReady;
    const singularSave =
      translate("explore-community-saves", defaultSaveCountLabel(1), { count: 1 }) ?? "";
    const pluralSave =
      translate("explore-community-saves", defaultSaveCountLabel(3), { count: 3 }) ?? "";
    expect(singularSave).not.toEqual(pluralSave);
    expect(singularSave).toContain("1");
    expect(pluralSave).toContain("3");

    const singularRoute =
      translate("explore-curated-route-count", defaultRouteCountLabel(1), {
        count: 1,
      }) ?? "";
    const pluralRoute =
      translate("explore-curated-route-count", defaultRouteCountLabel(3), {
        count: 3,
      }) ?? "";
    expect(singularRoute).not.toEqual(pluralRoute);
    expect(singularRoute).toContain("1");
    expect(pluralRoute).toContain("3");
  });

  it("localises curated difficulty labels for alternate locales", async () => {
    await i18nReady;
    await withI18nLanguage("es", async () => {
      ({ mount, root } = await renderRoute("/explore"));
      const container = requireContainer(mount);
      const view = within(container);
      const easyLabel = i18n.t("difficulty-easy-label");
      const moderateLabel = i18n.t("difficulty-moderate-label");

      expect(view.getByText(new RegExp(escapeRegExp(easyLabel ?? ""), "i"))).toBeTruthy();
      expect(view.getByText(new RegExp(escapeRegExp(moderateLabel ?? ""), "i"))).toBeTruthy();
    });
  });

  it("toggles advanced switches on the customize route", async () => {
    ({ mount, root } = await renderRoute("/customize"));
    const container = requireContainer(mount);
    const view = within(container);
    const helpLabel = translate("customize-header-help-label", "Help");
    expect(view.getByRole("button", { name: localizedRegex(helpLabel) })).toBeTruthy();

    const safetyLabel = translate("customize-advanced-safety-title", "Safety Priority");
    const safetySwitch = view.getByRole("switch", {
      name: localizedRegex(safetyLabel),
    });
    expect(safetySwitch.getAttribute("data-state")).toBe("unchecked");
    act(() => clickElement(safetySwitch));
    expect(safetySwitch.getAttribute("data-state")).toBe("checked");

    const surfaceLabel = translate("customize-surface-aria-label", "Surface type");
    const surfacePicker = view.getByRole("group", {
      name: localizedRegex(surfaceLabel),
    });
    expect(within(surfacePicker).getAllByRole("radio").length).toBeGreaterThan(0);

    expect(view.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("slider").length).toBeGreaterThan(0);
  });

  it("localises customize copy for alternate locales", async () => {
    await i18nReady;
    await withI18nLanguage("es", async () => {
      ({ mount, root } = await renderRoute("/customize"));
      const container = requireContainer(mount);
      const view = within(container);

      const distanceHeading = translate("customize-slider-distance-label", "Distance");
      expect(
        view.getByRole("heading", {
          level: 2,
          name: localizedRegex(distanceHeading),
        }),
      ).toBeTruthy();
      const surfaceHeading = translate("customize-surface-aria-label", "Surface type");
      expect(view.getByRole("group", { name: localizedRegex(surfaceHeading) })).toBeTruthy();
      const safetyHeading = translate("customize-advanced-safety-title", "Safety Priority");
      expect(view.getByRole("switch", { name: localizedRegex(safetyHeading) })).toBeTruthy();
      const regenerateLabel = translate("customize-route-preview-regenerate", "Regenerate");
      expect(view.getByRole("button", { name: localizedRegex(regenerateLabel) })).toBeTruthy();
    });
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

  afterEach(async () => {
    cleanup();
    setDocumentDirection("ltr");
    await resetLanguage();
  });

  it("updates quick walk interests and navigates to saved", async () => {
    ({ mount, root } = await renderRoute("/map/quick"));
    const container = requireContainer(mount);
    const view = within(container);
    const coffeeLabel = translate("interest-coffee-label", "Coffee Spots");
    const coffeeChip = view.getByRole("button", {
      name: localizedRegex(coffeeLabel),
    });
    act(() => clickElement(coffeeChip));

    const expectedSelection = translate("quick-walk-interests-selected", defaultSelectionLabel(3), {
      count: 3,
    });
    const selectionBadge = view.getByText(localizedRegex(expectedSelection));
    expect(selectionBadge).toBeTruthy();

    const quickHeadings = view.getAllByRole("heading", { level: 2 });
    expect(quickHeadings.length).toBeGreaterThan(0);

    const saveLabel = translate("quick-walk-save-aria", "Save quick walk");
    const saveAction = view.getByRole("button", {
      name: localizedRegex(saveLabel),
    });

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

    const stopsHeading = translate("quick-walk-stops-heading", "Quick walk stops");
    const notesHeading = translate("quick-walk-notes-heading", "Planning notes");
    const dismissLabel = translate("quick-walk-dismiss-aria", "Dismiss panel");
    const stopsPanel = view.getByRole("region", {
      name: localizedRegex(stopsHeading),
    });
    expect(stopsPanel.classList.contains("map-panel")).toBe(true);
    expect(stopsPanel.classList.contains("map-panel--stacked")).toBe(true);

    const notesPanel = view.getByRole("region", {
      name: localizedRegex(notesHeading),
    });
    expect(notesPanel.classList.contains("map-panel")).toBe(true);
    expect(notesPanel.classList.contains("map-panel--scroll")).toBe(true);

    const mapHandles = view.getAllByRole("button", {
      name: localizedRegex(dismissLabel),
    });
    expect(mapHandles.length).toBeGreaterThan(0);

    const tablist = view.getByRole("tablist");
    expect(tablist.classList.contains("map-panel__tablist")).toBe(true);

    const saveQuickLabel = translate("quick-walk-save-aria", "Save quick walk");
    const quickFabButton = view.getByRole("button", {
      name: localizedRegex(saveQuickLabel),
    });
    expect(quickFabButton.classList.contains("pointer-events-auto")).toBe(true);
  });

  it("launches the wizard from the quick walk magic wand", async () => {
    ({ mount, root } = await renderRoute("/map/quick"));
    const container = requireContainer(mount);
    const view = within(container);
    const generateLabel = translate("quick-walk-generate-aria", "Generate a new walk");
    const wandTrigger = view.getByRole("button", {
      name: localizedRegex(generateLabel),
    });

    await act(async () => {
      clickElement(wandTrigger);
      await Promise.resolve();
    });

    const wizardHeading = translate("wizard-header-title", "Walk Wizard");
    expect(
      await screen.findByRole("heading", {
        name: localizedRegex(wizardHeading),
      }),
    ).toBeTruthy();
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

    const generatorTitle = translate("quick-walk-header-title", "Quick Walk Generator");
    const generatorHeading = view.getByRole("heading", {
      name: localizedRegex(generatorTitle),
    });
    expect(generatorHeading).toBeTruthy();

    const mapTablist = view.getByRole("tablist");
    expect(mapTablist.classList.contains("map-panel__tablist")).toBe(true);

    const stopsHeading = translate("quick-walk-stops-heading", "Quick walk stops");
    const stopsRegion = view.getByRole("region", {
      name: localizedRegex(stopsHeading),
    });
    expect(stopsRegion.classList.contains("map-panel")).toBe(true);

    const notesHeading = translate("quick-walk-notes-heading", "Planning notes");
    const notesRegion = view.getByRole("region", {
      name: localizedRegex(notesHeading),
    });
    const notesList = within(notesRegion).getByRole("list");
    expect(within(notesList).getAllByRole("listitem").length).toBeGreaterThanOrEqual(3);
  });

  it("localises quick walk copy for alternate locales", async () => {
    await i18nReady;
    await withI18nLanguage("es", async () => {
      ({ mount, root } = await renderRoute("/map/quick"));
      const container = requireContainer(mount);
      const view = within(container);

      const localizedTitle = translate("quick-walk-header-title", "Quick Walk Generator");
      expect(
        view.getByRole("heading", {
          level: 1,
          name: localizedRegex(localizedTitle),
        }),
      ).toBeTruthy();
      const interestsHeading = translate("quick-walk-interests-heading", "Interests");
      expect(
        view.getByRole("heading", {
          level: 2,
          name: localizedRegex(interestsHeading),
        }),
      ).toBeTruthy();
      const stopsHeading = translate("quick-walk-stops-heading", "Quick walk stops");
      expect(view.getByRole("region", { name: localizedRegex(stopsHeading) })).toBeTruthy();
      const saveLabel = translate("quick-walk-save-aria", "Save quick walk");
      expect(view.getByRole("button", { name: localizedRegex(saveLabel) })).toBeTruthy();
    });
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

    const itineraryMetrics = formatRouteMetrics(waterfrontDiscoveryRoute);
    expect(view.getByText(localizedRegex(itineraryMetrics.distanceText))).toBeTruthy();
    expect(view.getByText(localizedRegex(itineraryMetrics.durationText))).toBeTruthy();
    expect(view.getByText(localizedRegex(itineraryMetrics.stopsText))).toBeTruthy();

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
        within(stopsPanel).getByRole("button", {
          name: new RegExp(poi.name, "i"),
        }),
      ).toBeTruthy();
    });

    const shareButton = view.getByRole("button", { name: /share/i });
    expect(shareButton.classList.contains("route-share__trigger")).toBe(true);

    await act(async () => {
      clickElement(shareButton);
      await Promise.resolve();
    });

    const dialog = await screen.findByRole("dialog", {
      name: /share this walk/i,
    });
    expect(within(dialog).getByText(/wildside\.app\/routes/)).toBeTruthy();
    const closeControl = within(dialog).getByRole("button", { name: /close/i });
    act(() => clickElement(closeControl));

    const favouriteButton = view.getByRole("button", {
      name: /save this itinerary/i,
    });
    act(() => clickElement(favouriteButton));
    const updatedFavourite = view.getByRole("button", {
      name: /remove saved itinerary/i,
    });
    expect(updatedFavourite.getAttribute("aria-pressed")).toBe("true");
  });

  it("opens the saved walk share dialog from the saved route", async () => {
    ({ mount, root } = await renderRoute("/saved"));
    const container = requireContainer(mount);
    const view = within(container);

    const tabPanels = view.getAllByRole("tabpanel");
    expect(tabPanels.length).toBeGreaterThanOrEqual(3);

    const notesTabpanel = view.getByRole("tabpanel", { name: /notes/i });
    const notesList = within(notesTabpanel).getByRole("list", {
      name: /route notes/i,
    });
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
        within(stopsTabpanel).getByRole("button", {
          name: new RegExp(poi.name, "i"),
        }),
      ).toBeTruthy();
    });

    expect(view.getByRole("heading", { name: new RegExp(savedRoute.title, "i") })).toBeTruthy();
    const { savedDistanceCopy, savedDurationCopy, savedStopsCopy } =
      buildSavedRouteCopy(savedRoute);

    expect(view.getByText(localizedRegex(savedDistanceCopy))).toBeTruthy();
    expect(view.getByText(localizedRegex(savedDurationCopy))).toBeTruthy();
    expect(view.getByText(localizedRegex(savedStopsCopy))).toBeTruthy();

    const shareTrigger = view.getByRole("button", { name: /^share$/i });
    const favouriteButton = view.getByRole("button", {
      name: /remove saved walk/i,
    });

    await act(async () => {
      clickElement(shareTrigger);
      await Promise.resolve();
    });

    const dialog = await screen.findByRole("dialog", {
      name: /share saved walk/i,
    });
    expect(within(dialog).getByText(`https://wildside.app/routes/${savedRoute.id}`)).toBeTruthy();
    const closeButton = within(dialog).getByRole("button", { name: /close/i });
    act(() => clickElement(closeButton));

    act(() => clickElement(favouriteButton));
    const resetFavourite = view.getByRole("button", {
      name: /save this walk/i,
    });
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

  afterEach(async () => {
    cleanup();
    setDocumentDirection("ltr");
    await resetLanguage();
  });

  type WizardStepThreeTestContext = {
    view: ReturnType<typeof within>;
    container: HTMLDivElement;
    routeTitle: string;
  };

  const runWizardStepThreeSpanish = async (
    assertions: (context: WizardStepThreeTestContext) => Promise<void> | void,
  ): Promise<void> => {
    await i18nReady;
    await withI18nLanguage("es", async () => {
      ({ mount, root } = await renderRoute("/wizard/step-3"));
      const container = requireContainer(mount);
      const view = within(container);
      const routeTitle =
        translate(wizardRouteSummary.titleKey, wizardRouteSummary.defaultTitle) ??
        wizardRouteSummary.defaultTitle;
      await assertions({ view, container, routeTitle });
    });
  };

  it("advances from wizard step one to step two", async () => {
    ({ mount, root } = await renderRoute("/wizard/step-1"));
    const container = requireContainer(mount);
    const view = within(container);
    const durationAria =
      translate("wizard-step-one-duration-section-aria", "Walk duration controls") ??
      "Walk duration controls";
    const durationSection = view.getByRole("region", {
      name: localizedRegex(durationAria),
    });
    expect(durationSection.classList.contains("wizard-section")).toBe(true);
    const interestsAria =
      translate("wizard-step-one-interests-section-aria", "Interests") ?? "Interests";
    const interestsSection = view.getByRole("region", {
      name: localizedRegex(interestsAria),
    });
    expect(interestsSection.classList.contains("wizard-section")).toBe(true);
    const continueLabel =
      translate("wizard-step-one-continue", "Continue to preferences") ?? "Continue to preferences";
    const continueButton = view.getByRole("button", {
      name: localizedRegex(continueLabel),
    });
    expect(continueButton.classList.contains("cta-button")).toBe(true);

    await act(async () => {
      clickElement(continueButton);
      await Promise.resolve();
    });

    const discoveryHeading =
      translate("wizard-step-two-discovery-heading", "Discovery style") ?? "Discovery style";
    const heading = await screen.findByRole("heading", {
      name: localizedRegex(discoveryHeading),
    });
    expect(heading).toBeTruthy();
  });

  it("localises wizard step one copy and interpolations for Spanish", async () => {
    await i18nReady;
    await withI18nLanguage("es", async () => {
      ({ mount, root } = await renderRoute("/wizard/step-1"));
      const container = requireContainer(mount);
      const view = within(container);

      const durationAria = i18n.t("wizard-step-one-duration-section-aria") ?? "";
      expect(view.getByRole("region", { name: localizedRegex(durationAria) })).toBeTruthy();
      const continueLabel = i18n.t("wizard-step-one-continue") ?? "";
      expect(view.getByRole("button", { name: localizedRegex(continueLabel) })).toBeTruthy();

      const selectionSummary = view.getByText(/seleccionados$/i);
      expect(selectionSummary.textContent?.trim()).toBe("2 seleccionados");

      const streetArtLabel = i18n.t("interest-street-art-label") ?? "";
      const streetArtChip = view.getByRole("button", {
        name: new RegExp(escapeRegExp(streetArtLabel), "i"),
      });
      act(() => clickElement(streetArtChip));

      const updatedSummary = view.getByText(/seleccionado$/i);
      expect(updatedSummary.textContent?.trim()).toBe("1 seleccionado");
    });
  });

  it("renders wizard step two surfaces with semantic classes", async () => {
    ({ mount, root } = await renderRoute("/wizard/step-2"));
    const container = requireContainer(mount);
    const view = within(container);

    const discoveryAria =
      translate("wizard-step-two-discovery-aria", "Discovery style") ?? "Discovery style";
    const discoveryRegion = view.getByRole("region", {
      name: localizedRegex(discoveryAria),
    });
    expect(discoveryRegion.classList.contains("wizard-section")).toBe(true);
    const balancedSummary =
      translate("wizard-step-two-discovery-summary-balanced", "Balanced mix") ?? "Balanced mix";
    expect(within(discoveryRegion).getByText(localizedRegex(balancedSummary))).toBeTruthy();
    const badgeLabel = translate("wizard-step-two-discovery-badge", "New") ?? "New";
    expect(
      within(discoveryRegion)
        .getByText(localizedRegex(badgeLabel))
        .classList.contains("wizard-badge"),
    ).toBe(true);

    const accessibilityAria =
      translate("wizard-step-two-accessibility-section-aria", "Accessibility & safety") ??
      "Accessibility & safety";
    const accessibilityRegion = view.getByRole("region", {
      name: localizedRegex(accessibilityAria),
    });
    expect(accessibilityRegion.classList.contains("wizard-section")).toBe(true);
    const switches = within(accessibilityRegion).getAllByRole("switch");
    expect(switches.length).toBe(accessibilityOptions.length);
    accessibilityOptions.forEach((option) => {
      expect(
        within(accessibilityRegion).getByRole("switch", {
          name: localizedRegex(option.label),
        }),
      ).toBeInTheDocument();
    });
  });

  it("localises wizard step two discovery and accessibility copy for Spanish", async () => {
    await i18nReady;
    await withI18nLanguage("es", async () => {
      ({ mount, root } = await renderRoute("/wizard/step-2"));
      const container = requireContainer(mount);
      const view = within(container);

      const discoveryRegion = view.getByRole("region", {
        name: localizedRegex(i18n.t("wizard-step-two-discovery-aria") ?? ""),
      });
      expect(
        within(discoveryRegion).getByText(
          localizedRegex(i18n.t("wizard-step-two-discovery-description") ?? ""),
        ),
      ).toBeTruthy();
      expect(
        within(discoveryRegion).getByText(
          localizedRegex(i18n.t("wizard-step-two-discovery-badge") ?? ""),
        ),
      ).toBeTruthy();
      expect(
        within(discoveryRegion).getByText(
          localizedRegex(i18n.t("wizard-step-two-discovery-summary-balanced") ?? ""),
        ),
      ).toBeTruthy();

      const accessibilityRegion = view.getByRole("region", {
        name: localizedRegex(i18n.t("wizard-step-two-accessibility-section-aria") ?? ""),
      });
      const wellLitLabel = i18n.t("wizard-step-two-accessibility-well-lit-label") ?? "";
      const wheelchairLabel = i18n.t("wizard-step-two-accessibility-wheelchair-label") ?? "";
      const pavedLabel = i18n.t("wizard-step-two-accessibility-paved-label") ?? "";

      expect(within(accessibilityRegion).getByText(localizedRegex(wellLitLabel))).toBeTruthy();
      expect(
        within(accessibilityRegion).getByRole("switch", {
          name: localizedRegex(wellLitLabel),
        }),
      ).toBeTruthy();
      expect(within(accessibilityRegion).getByText(localizedRegex(wheelchairLabel))).toBeTruthy();
      expect(
        within(accessibilityRegion).getByRole("switch", {
          name: localizedRegex(wheelchairLabel),
        }),
      ).toBeTruthy();
      expect(within(accessibilityRegion).getByText(localizedRegex(pavedLabel))).toBeTruthy();
      expect(
        within(accessibilityRegion).getByRole("switch", {
          name: localizedRegex(pavedLabel),
        }),
      ).toBeTruthy();

      const footer = view.getByRole("contentinfo");
      expect(
        within(footer).getByRole("button", {
          name: localizedRegex(i18n.t("wizard-step-two-review") ?? ""),
        }),
      ).toBeTruthy();
      expect(
        within(footer).getByRole("button", {
          name: localizedRegex(i18n.t("wizard-header-back-label") ?? ""),
        }),
      ).toBeTruthy();
    });
  });

  it("localises wizard step three route summary for Spanish", async () => {
    await runWizardStepThreeSpanish(async ({ view, routeTitle }) => {
      expect(view.getByRole("heading", { name: localizedRegex(routeTitle) })).toBeTruthy();

      const startOverLabel =
        translate("wizard-step-three-start-over", "Start over") ?? "Start over";
      expect(view.getByRole("button", { name: localizedRegex(startOverLabel) })).toBeTruthy();

      const summaryRegionLabel =
        translate(wizardRouteSummary.ariaLabelKey, wizardRouteSummary.defaultAriaLabel) ??
        wizardRouteSummary.defaultAriaLabel;
      const summaryRegion = view.getByRole("region", {
        name: localizedRegex(summaryRegionLabel),
      });
      const localizedStats = buildWizardStatsCopy();
      localizedStats.forEach((stat) => {
        expect(within(summaryRegion).getByText(localizedRegex(stat.unitLabel))).toBeTruthy();
      });
    });
  });

  it("localises wizard step three preferences panel for Spanish", async () => {
    await runWizardStepThreeSpanish(async ({ view }) => {
      const preferencesHeading =
        translate("wizard-step-three-preferences-heading", "Your preferences applied") ??
        "Your preferences applied";
      expect(view.getByRole("heading", { name: localizedRegex(preferencesHeading) })).toBeTruthy();

      const preferencesPanelLabel =
        translate("wizard-step-three-preferences-panel-aria", "Your preferences applied") ??
        "Your preferences applied";
      const preferencesPanel = view.getByRole("region", {
        name: localizedRegex(preferencesPanelLabel),
      });

      wizardSummaryHighlights.forEach((highlight) => {
        const label =
          translate(highlight.labelKey, highlight.defaultLabel) ?? highlight.defaultLabel;
        expect(within(preferencesPanel).getByText(localizedRegex(label))).toBeTruthy();
      });
    });
  });

  it("localises wizard step three stops panel for Spanish", async () => {
    await runWizardStepThreeSpanish(async ({ view }) => {
      const stopsHeading =
        translate("wizard-step-three-stops-heading", "Featured stops") ?? "Featured stops";
      expect(view.getByRole("heading", { name: localizedRegex(stopsHeading) })).toBeTruthy();

      const stopsPanelLabel =
        translate("wizard-step-three-stops-panel-aria", "Featured stops") ?? "Featured stops";
      const stopsPanel = view.getByRole("region", {
        name: localizedRegex(stopsPanelLabel),
      });

      wizardGeneratedStops.forEach((stop) => {
        const name = translate(stop.nameKey, stop.defaultName) ?? stop.defaultName;
        const description =
          translate(stop.descriptionKey, stop.defaultDescription) ?? stop.defaultDescription;
        expect(within(stopsPanel).getByText(localizedRegex(name))).toBeTruthy();
        expect(within(stopsPanel).getByText(localizedRegex(description))).toBeTruthy();
      });
    });
  });

  it("localises wizard step three weather panel for Spanish", async () => {
    await runWizardStepThreeSpanish(async ({ view }) => {
      const weatherHeading =
        translate(wizardWeatherSummary.titleKey, wizardWeatherSummary.defaultTitle) ??
        wizardWeatherSummary.defaultTitle;
      expect(view.getByRole("heading", { name: localizedRegex(weatherHeading) })).toBeTruthy();

      const weatherPanel = view.getByRole("region", {
        name: localizedRegex(weatherHeading),
      });
      const spanishWeatherCopy = buildWizardWeather();
      expect(
        within(weatherPanel).getByText(spanishWeatherCopy.summary, {
          exact: false,
        }),
      ).toBeTruthy();
    });
  });

  it("localises wizard step three save dialog for Spanish", async () => {
    await runWizardStepThreeSpanish(async ({ view, routeTitle }) => {
      const saveLabel =
        translate("wizard-step-three-save-button", "Save walk and view map") ??
        "Save walk and view map";
      const saveButton = view.getByRole("button", {
        name: localizedRegex(saveLabel),
      });

      await act(async () => {
        clickElement(saveButton);
        await Promise.resolve();
      });

      const dialogTitle =
        translate("wizard-step-three-dialog-title", "Walk saved!") ?? "Walk saved!";
      const dialog = await screen.findByRole("dialog", {
        name: localizedRegex(dialogTitle),
      });
      const dialogDefault = `${routeTitle} is ready under your saved walks. Start the route now or continue exploring other wizard options.`;
      const dialogDescription =
        translate("wizard-step-three-dialog-description", dialogDefault, {
          routeTitle,
        }) ?? dialogDefault;
      expect(within(dialog).getByText(localizedRegex(dialogDescription))).toBeTruthy();

      const closeLabel = translate("wizard-step-three-dialog-close", "Close") ?? "Close";
      const viewMapLabel =
        translate("wizard-step-three-dialog-view-map", "View on map") ?? "View on map";
      expect(
        within(dialog).getByRole("button", {
          name: localizedRegex(closeLabel),
        }),
      ).toBeTruthy();
      expect(
        within(dialog).getByRole("button", {
          name: localizedRegex(viewMapLabel),
        }),
      ).toBeTruthy();
    });
  });

  it("opens the wizard confirmation dialog on step three", async () => {
    ({ mount, root } = await renderRoute("/wizard/step-3"));
    const container = requireContainer(mount);
    const view = within(container);
    const saveLabel =
      translate("wizard-step-three-save-button", "Save walk and view map") ??
      "Save walk and view map";
    const saveButton = view.getByRole("button", {
      name: localizedRegex(saveLabel),
    });

    await act(async () => {
      clickElement(saveButton);
      await Promise.resolve();
    });

    const dialogTitle = translate("wizard-step-three-dialog-title", "Walk saved!") ?? "Walk saved!";
    const dialog = await screen.findByRole("dialog", {
      name: localizedRegex(dialogTitle),
    });
    const closeLabel = translate("wizard-step-three-dialog-close", "Close") ?? "Close";
    const closeButton = within(dialog).getByRole("button", {
      name: localizedRegex(closeLabel),
    });
    act(() => clickElement(closeButton));
  });

  it("renders saved summary panel with semantic class", async () => {
    ({ mount, root } = await renderRoute("/saved"));
    const container = requireContainer(mount);
    const view = within(container);
    expect(
      view.getByRole("heading", {
        name: new RegExp(savedRoute.title ?? "", "i"),
      }),
    ).toBeTruthy();
    const { savedDistanceCopy, savedDurationCopy, savedStopsCopy } =
      buildSavedRouteCopy(savedRoute);

    expect(view.getByText(localizedRegex(savedDistanceCopy))).toBeTruthy();
    expect(view.getByText(localizedRegex(savedDurationCopy))).toBeTruthy();
    expect(view.getByText(localizedRegex(savedStopsCopy))).toBeTruthy();
  });

  it("renders wizard summary panels with semantic class", async () => {
    ({ mount, root } = await renderRoute("/wizard/step-3"));
    const container = requireContainer(mount);
    const view = within(container);
    const routePanelLabel =
      translate(wizardRouteSummary.ariaLabelKey, wizardRouteSummary.defaultAriaLabel) ??
      wizardRouteSummary.defaultAriaLabel;
    const preferencesPanelLabel =
      translate("wizard-step-three-preferences-panel-aria", "Your preferences applied") ??
      "Your preferences applied";
    const stopsPanelLabel =
      translate("wizard-step-three-stops-panel-aria", "Featured stops") ?? "Featured stops";
    const weatherPanelTitle =
      translate(wizardWeatherSummary.titleKey, wizardWeatherSummary.defaultTitle) ??
      wizardWeatherSummary.defaultTitle;

    const routePanel = view.getByRole("region", {
      name: localizedRegex(routePanelLabel),
    });
    const preferencesPanel = view.getByRole("region", {
      name: localizedRegex(preferencesPanelLabel),
    });
    const stopsPanel = view.getByRole("region", {
      name: localizedRegex(stopsPanelLabel),
    });
    const weatherPanel = view.getByRole("region", {
      name: localizedRegex(weatherPanelTitle),
    });

    [routePanel, preferencesPanel, stopsPanel, weatherPanel].forEach((panel) => {
      expect(panel.classList.contains("wizard-summary__panel")).toBe(true);
      expect(panel.classList.contains("wizard-section")).toBe(true);
    });

    const badgeLabel =
      translate(wizardRouteSummary.badgeKey, wizardRouteSummary.defaultBadge) ??
      wizardRouteSummary.defaultBadge;
    const summaryBadge = within(routePanel).getByText(localizedRegex(badgeLabel));
    expect(summaryBadge.classList.contains("wizard-badge")).toBe(true);

    wizardSummaryHighlights.forEach((highlight) => {
      const label = translate(highlight.labelKey, highlight.defaultLabel) ?? highlight.defaultLabel;
      expect(within(preferencesPanel).getByText(localizedRegex(label))).toBeTruthy();
    });

    wizardGeneratedStops.forEach((stop) => {
      const name = translate(stop.nameKey, stop.defaultName) ?? stop.defaultName;
      expect(within(stopsPanel).getByText(localizedRegex(name))).toBeTruthy();
    });

    const localizedWeatherCopy = buildWizardWeather();
    expect(
      within(weatherPanel).getByText(localizedWeatherCopy.summary, {
        exact: false,
      }),
    ).toBeTruthy();
  });
});

describe("Stage 4 completion flows", () => {
  let root: Root | null = null;
  let mount: HTMLDivElement | null = null;

  const extractDownloadTitles = (cards: readonly HTMLElement[]): string[] =>
    cards.map((card) => {
      return within(card).getByRole("heading", { level: 3 }).textContent?.trim() ?? "Download";
    });

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

  afterEach(async () => {
    cleanup();
    setDocumentDirection("ltr");
    await resetLanguage();
  });

  it("shows a celebratory toast when rating a completed walk", async () => {
    ({ mount, root } = await renderRoute("/walk-complete"));
    const container = requireContainer(mount);
    const view = within(container);
    const badgeLabel = translate("walk-complete-badge-route", "Route completed");
    const badge = view.getByText(localizedRegex(badgeLabel));
    expect(badge.classList.contains("walk-complete__badge")).toBe(true);

    const completionHeadings = view.getAllByRole("heading", { level: 2 });
    expect(completionHeadings.length).toBeGreaterThan(0);

    const rateLabel = translate("walk-complete-actions-rate", "Rate this walk");
    const rateButton = view.getByRole("button", {
      name: localizedRegex(rateLabel),
    });
    await act(async () => {
      clickElement(rateButton);
      await Promise.resolve();
    });

    const toastLabel = translate("walk-complete-toast-rating-saved", "Rating saved");
    expect(await screen.findByText(localizedRegex(toastLabel))).toBeTruthy();

    const shareActionLabel = translate("walk-complete-actions-share", "Share");
    const shareButton = view.getByRole("button", {
      name: localizedRegex(shareActionLabel),
    });
    await act(async () => {
      clickElement(shareButton);
      await Promise.resolve();
    });

    const dialogTitle = translate("walk-complete-share-dialog-title", "Share highlights");
    const dialog = await screen.findByRole("dialog", {
      name: localizedRegex(dialogTitle),
    });
    walkCompletionShareOptions.forEach((option) => {
      expect(within(dialog).getByText(new RegExp(option.label, "i"))).toBeInTheDocument();
    });
    const cancelLabel = translate("walk-complete-share-dialog-cancel", "Cancel");
    const cancelButton = within(dialog).getByRole("button", {
      name: localizedRegex(cancelLabel),
    });
    act(() => clickElement(cancelButton));
  });

  it("lists existing downloads on the offline manager route", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const view = within(requireContainer(mount));
    const downloadsHeading = translate("offline-downloads-heading", "Downloaded areas");
    const downloadsRegion = view.getByRole("region", {
      name: localizedRegex(downloadsHeading),
    });
    expect(within(downloadsRegion).getAllByRole("article").length).toBeGreaterThan(0);
    const downloadsDescription = translate(
      "offline-downloads-description",
      "Manage maps for offline navigation",
    );
    expect(within(downloadsRegion).getByText(localizedRegex(downloadsDescription))).toBeTruthy();
  });

  it("renders offline storage overview summary", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const view = within(requireContainer(mount));
    const storageHeading = translate("offline-storage-heading", "Storage overview");
    expect(view.getByText(localizedRegex(storageHeading))).toBeTruthy();

    const { usedLabel, totalLabel } = OFFLINE_STORAGE_PLACEHOLDERS;
    const storageUsedDescription = translate(
      "offline-storage-used-description",
      `${usedLabel} of ${totalLabel}`,
      { used: usedLabel, total: totalLabel },
    );
    const pattern = localizedRegex(storageUsedDescription ?? `${usedLabel} ${totalLabel}`);

    expect(view.getByText(pattern)).toBeTruthy();
  });

  it("opens the offline download dialog with the add button", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const view = within(requireContainer(mount));
    const addAreaLabel = translate("offline-header-add-area-label", "Add offline area");
    const addButton = view.getByRole("button", {
      name: localizedRegex(addAreaLabel),
    });

    await act(async () => {
      clickElement(addButton);
      await Promise.resolve();
    });

    const dialogTitle = translate("offline-dialog-title", "Download new area");
    const dialog = await screen.findByRole("dialog", {
      name: localizedRegex(dialogTitle),
    });
    expect(dialog).toBeTruthy();
    const searchPlaceholder = translate(
      "offline-dialog-search-placeholder",
      "Search cities or regions",
    );
    expect(
      within(dialog).getByPlaceholderText(searchPlaceholder ?? "Search cities or regions"),
    ).toBeTruthy();
    const dialogCancel = translate("offline-dialog-cancel", "Cancel");
    expect(
      within(dialog).getByRole("button", {
        name: localizedRegex(dialogCancel),
      }),
    ).toBeTruthy();
  });

  it("allows removing a download when managing the offline list", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const view = within(requireContainer(mount));
    const offlineCopy = buildOfflineDownloadsCopy();
    const downloadsRegion = view.getByRole("region", {
      name: localizedRegex(offlineCopy.downloadsHeading),
    });
    const initialDownloads = within(downloadsRegion).getAllByRole("article");
    const downloadTitles = extractDownloadTitles(initialDownloads);
    expect(initialDownloads.length).toBeGreaterThan(0);

    const manageButton = within(downloadsRegion).getByRole("button", {
      name: localizedRegex(offlineCopy.manageLabel),
    });

    await act(async () => {
      clickElement(manageButton);
      await Promise.resolve();
    });

    const deleteButtons = initialDownloads.map((card, index) => {
      const title = downloadTitles[index] ?? "Download";
      return within(card).getByRole("button", {
        name: localizedRegex(offlineCopy.deleteAriaLabel(title)),
      });
    });
    expect(deleteButtons.length).toBe(initialDownloads.length);

    await act(async () => {
      clickElement(deleteButtons[0]);
      await Promise.resolve();
    });

    const deletedTitle = downloadTitles[0] ?? "Download";
    const undoCards = within(downloadsRegion).getAllByRole("article", {
      name: localizedRegex(offlineCopy.undoAriaLabel(deletedTitle, offlineCopy.undoDescription)),
    });
    expect(undoCards.length).toBe(1);
  });

  it("restores a download via undo", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const view = within(requireContainer(mount));
    const offlineCopy = buildOfflineDownloadsCopy();
    const downloadsRegion = view.getByRole("region", {
      name: localizedRegex(offlineCopy.downloadsHeading),
    });
    const manageButton = within(downloadsRegion).getByRole("button", {
      name: localizedRegex(offlineCopy.manageLabel),
    });

    await act(async () => {
      clickElement(manageButton);
      await Promise.resolve();
    });

    const downloadCards = within(downloadsRegion).getAllByRole("article");
    const downloadTitles = extractDownloadTitles(downloadCards);
    const deleteButtons = downloadCards.map((card, index) => {
      const title = downloadTitles[index] ?? "Download";
      return within(card).getByRole("button", {
        name: localizedRegex(offlineCopy.deleteAriaLabel(title)),
      });
    });
    await act(async () => {
      clickElement(deleteButtons[0]);
      await Promise.resolve();
    });

    const deletedTitle = downloadTitles[0] ?? "Download";
    const undoCard = within(downloadsRegion).getByRole("article", {
      name: localizedRegex(offlineCopy.undoAriaLabel(deletedTitle, offlineCopy.undoDescription)),
    });
    const undoButton = within(undoCard).getByRole("button", {
      name: localizedRegex(offlineCopy.undoButtonLabel),
    });

    await act(async () => {
      clickElement(undoButton);
      await Promise.resolve();
    });

    expect(
      within(downloadsRegion).queryByRole("article", {
        name: localizedRegex(offlineCopy.undoAriaLabel(deletedTitle, offlineCopy.undoDescription)),
      }),
    ).toBeNull();
  });

  it("clears undo panels when finishing manage mode", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const view = within(requireContainer(mount));
    const offlineCopy = buildOfflineDownloadsCopy();
    const downloadsRegion = view.getByRole("region", {
      name: localizedRegex(offlineCopy.downloadsHeading),
    });
    const manageButton = within(downloadsRegion).getByRole("button", {
      name: localizedRegex(offlineCopy.manageLabel),
    });

    await act(async () => {
      clickElement(manageButton);
      await Promise.resolve();
    });

    const downloadCards = within(downloadsRegion).getAllByRole("article");
    const downloadTitles = extractDownloadTitles(downloadCards);
    const deleteButtons = downloadCards.map((card, index) => {
      const title = downloadTitles[index] ?? "Download";
      return within(card).getByRole("button", {
        name: localizedRegex(offlineCopy.deleteAriaLabel(title)),
      });
    });
    await act(async () => {
      clickElement(deleteButtons[0]);
      await Promise.resolve();
    });

    const deletedTitle = downloadTitles[0] ?? "Download";
    expect(
      within(downloadsRegion).getByRole("article", {
        name: localizedRegex(offlineCopy.undoAriaLabel(deletedTitle, offlineCopy.undoDescription)),
      }),
    ).toBeTruthy();

    const doneButton = within(downloadsRegion).getByRole("button", {
      name: localizedRegex(offlineCopy.doneLabel),
    });
    await act(async () => {
      clickElement(doneButton);
      await Promise.resolve();
    });

    expect(
      within(downloadsRegion).queryByRole("article", {
        name: localizedRegex(offlineCopy.undoAriaLabel(deletedTitle, offlineCopy.undoDescription)),
      }),
    ).toBeNull();
  });

  it("labels offline download cards as readable articles", async () => {
    ({ mount, root } = await renderRoute("/offline"));
    const view = within(requireContainer(mount));
    const offlineCopy = buildOfflineDownloadsCopy();
    const downloadsRegion = view.getByRole("region", {
      name: localizedRegex(offlineCopy.downloadsHeading),
    });
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

  it("localises the safety & accessibility screen for Spanish", async () => {
    await i18nReady;
    await withI18nLanguage("es", async () => {
      ({ mount, root } = await renderRoute("/safety-accessibility"));
      const view = within(requireContainer(mount));

      const headerTitle =
        translate("safety-header-title", "Safety & Accessibility") ?? "Safety & Accessibility";
      const headerDescription =
        translate(
          "safety-header-description",
          "Customise your walking routes for comfort and safety",
        ) ?? "Customise your walking routes for comfort and safety";
      const saveLabel = translate("safety-save-button", "Save preferences") ?? "Save preferences";
      expect(view.getByRole("heading", { name: localizedRegex(headerTitle) })).toBeTruthy();
      expect(view.getByText(localizedRegex(headerDescription))).toBeTruthy();
      expect(view.getByRole("button", { name: localizedRegex(saveLabel) })).toBeTruthy();

      const accordionLabel =
        translate("safety-section-mobility-title", "Mobility Support") ?? "Mobility Support";
      const accordionItem = view.getByRole("button", {
        name: localizedRegex(accordionLabel),
      });
      expect(accordionItem).toBeTruthy();

      const toggleLabel =
        translate("safety-toggle-step-free-label", "Step-free routes") ?? "Step-free routes";
      const toggle = view.getByRole("switch", {
        name: localizedRegex(toggleLabel),
      });
      act(() => clickElement(toggle));

      const saveButton = view.getByRole("button", {
        name: localizedRegex(saveLabel),
      });
      await act(async () => {
        clickElement(saveButton);
        await Promise.resolve();
      });

      const dialogTitle =
        translate("safety-dialog-title", "Preferences saved") ?? "Preferences saved";
      const dialogDescription =
        translate(
          "safety-dialog-description",
          "Your safety and accessibility settings are now part of future walk planning.",
        ) ?? "Your safety and accessibility settings are now part of future walk planning.";
      const dialogContinue = translate("safety-dialog-continue", "Continue") ?? "Continue";

      const dialog = await screen.findByRole("dialog", {
        name: localizedRegex(dialogTitle),
      });
      expect(within(dialog).getByText(localizedRegex(dialogDescription))).toBeTruthy();
      expect(
        within(dialog).getByRole("button", {
          name: localizedRegex(dialogContinue),
        }),
      ).toBeTruthy();
    });
  });

  it("localises the safety & accessibility screen for Portuguese", async () => {
    await i18nReady;
    await withI18nLanguage("pt", async () => {
      ({ mount, root } = await renderRoute("/safety-accessibility"));
      const view = within(requireContainer(mount));

      const headerTitle =
        translate("safety-header-title", "Safety & Accessibility") ?? "Safety & Accessibility";
      const headerDescription =
        translate(
          "safety-header-description",
          "Customise your walking routes for comfort and safety",
        ) ?? "Customise your walking routes for comfort and safety";
      const saveLabel = translate("safety-save-button", "Save preferences") ?? "Save preferences";
      expect(view.getByRole("heading", { name: localizedRegex(headerTitle) })).toBeTruthy();
      expect(view.getByText(localizedRegex(headerDescription))).toBeTruthy();
      expect(view.getByRole("button", { name: localizedRegex(saveLabel) })).toBeTruthy();

      const accordionLabel =
        translate("safety-section-mobility-title", "Mobility Support") ?? "Mobility Support";
      const accordionItem = view.getByRole("button", {
        name: localizedRegex(accordionLabel),
      });
      expect(accordionItem).toBeTruthy();

      const toggleLabel =
        translate("safety-toggle-step-free-label", "Step-free routes") ?? "Step-free routes";
      const toggle = view.getByRole("switch", {
        name: localizedRegex(toggleLabel),
      });
      act(() => clickElement(toggle));

      const saveButton = view.getByRole("button", {
        name: localizedRegex(saveLabel),
      });
      await act(async () => {
        clickElement(saveButton);
        await Promise.resolve();
      });

      const dialogTitle =
        translate("safety-dialog-title", "Preferences saved") ?? "Preferences saved";
      const dialogDescription =
        translate(
          "safety-dialog-description",
          "Your safety and accessibility settings are now part of future walk planning.",
        ) ?? "Your safety and accessibility settings are now part of future walk planning.";
      const dialogContinue = translate("safety-dialog-continue", "Continue") ?? "Continue";

      const dialog = await screen.findByRole("dialog", {
        name: localizedRegex(dialogTitle),
      });
      expect(within(dialog).getByText(localizedRegex(dialogDescription))).toBeTruthy();
      expect(
        within(dialog).getByRole("button", {
          name: localizedRegex(dialogContinue),
        }),
      ).toBeTruthy();
    });
  });

  describe("Logical layout behaviour", () => {
    it("positions the discover skip action via logical offsets", async () => {
      await changeLanguage("en-GB");
      ({ mount, root } = await renderRoute("/discover"));
      const ltrContainer = requireContainer(mount);
      const ltrView = within(ltrContainer);
      const skipButton = ltrView.getByRole("button", { name: /skip/i });
      const readInset = (element: HTMLElement, property: string) =>
        window.getComputedStyle(element).getPropertyValue(property);

      expect(readInset(skipButton, "inset-inline-end")).toBe("1.5rem");

      cleanup();
      await changeLanguage("ar");
      setDocumentDirection("rtl");
      ({ mount, root } = await renderRoute("/discover"));
      const rtlContainer = requireContainer(mount);
      const rtlView = within(rtlContainer);
      const rtlSkipButton = rtlView.getByRole("button", { name: /skip/i });
      expect(readInset(rtlSkipButton, "inset-inline-end")).toBe("1.5rem");
    });

    it("aligns customize route previews using text-start semantics", async () => {
      await changeLanguage("en-GB");
      ({ mount, root } = await renderRoute("/customize"));
      let container = requireContainer(mount);
      let view = within(container);
      const findRouteButton = () => {
        const buttons = view.getAllByRole("button");
        const label = i18n.t("customize-route-preview-route-a-title", {
          defaultValue: "Route A",
        });
        const pattern = new RegExp(escapeRegExp(label), "i");
        return buttons.find((button) => pattern.test(button.textContent ?? ""));
      };
      const preview = findRouteButton();
      if (!preview) {
        throw new Error("Route A preview not rendered");
      }
      expect(window.getComputedStyle(preview).textAlign).toBe("left");

      cleanup();
      await changeLanguage("ar");
      setDocumentDirection("rtl");
      ({ mount, root } = await renderRoute("/customize"));
      container = requireContainer(mount);
      view = within(container);
      const rtlPreview = findRouteButton();
      if (!rtlPreview) {
        throw new Error("Route A preview not rendered for RTL");
      }
      expect(window.getComputedStyle(rtlPreview).textAlign).toBe("right");
    });

    it("keeps safety accordion triggers aligned for both directions", async () => {
      await changeLanguage("en-GB");
      ({ mount, root } = await renderRoute("/safety-accessibility"));
      let container = requireContainer(mount);
      let view = within(container);
      const ltrLabel = i18n.t("safety-section-mobility-title", {
        defaultValue: "Mobility Support",
      });
      const ltrHeading = view.getByText(new RegExp(escapeRegExp(ltrLabel ?? ""), "i"));
      const ltrTrigger = ltrHeading.closest("button");
      expect(ltrTrigger).toBeTruthy();
      expect(window.getComputedStyle(ltrTrigger as Element).textAlign).toBe("left");

      cleanup();
      await changeLanguage("ar");
      setDocumentDirection("rtl");
      ({ mount, root } = await renderRoute("/safety-accessibility"));
      container = requireContainer(mount);
      view = within(container);
      const rtlLabel = i18n.t("safety-section-mobility-title", {
        defaultValue: "Mobility Support",
      });
      const rtlHeading = view.getByText(new RegExp(escapeRegExp(rtlLabel ?? ""), "i"));
      const rtlTrigger = rtlHeading.closest("button");
      expect(rtlTrigger).toBeTruthy();
      expect(window.getComputedStyle(rtlTrigger as Element).textAlign).toBe("right");
    });

    it("mirrors wizard weather summaries with text-end alignment", async () => {
      await changeLanguage("en-GB");
      ({ mount, root } = await renderRoute("/wizard/step-3"));
      let container = requireContainer(mount);
      let view = within(container);
      let weatherCopy = buildWizardWeather();
      const temperature = view.getByText(weatherCopy.temperatureLabel);
      const summaryBlock = temperature.parentElement as HTMLElement;
      expect(window.getComputedStyle(summaryBlock).textAlign).toBe("right");

      cleanup();
      await changeLanguage("ar");
      setDocumentDirection("rtl");
      ({ mount, root } = await renderRoute("/wizard/step-3"));
      container = requireContainer(mount);
      view = within(container);
      weatherCopy = buildWizardWeather();
      const rtlTemperature = view.getByText(weatherCopy.temperatureLabel);
      const rtlSummaryBlock = rtlTemperature.parentElement as HTMLElement;
      expect(window.getComputedStyle(rtlSummaryBlock).textAlign).toBe("left");
    });
  });
});
