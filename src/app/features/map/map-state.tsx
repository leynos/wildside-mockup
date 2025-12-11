/** @file Shared map state store enabling MapLibre persistence across screens. */

import type { FeatureCollection, Point } from "geojson";
import type { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl";
import {
  createContext,
  type JSX,
  type ReactNode,
  useContext,
  useRef,
  useSyncExternalStore,
} from "react";

import { waterfrontDiscoveryRoute } from "../../data/map";
import { type LocaleCode, pickLocalization } from "../../domain/entities/localization";

type LngLatTuple = [number, number];

export interface MapViewportSnapshot {
  center: LngLatTuple;
  zoom: number;
  bearing: number;
  pitch: number;
}

export interface MapStateSnapshot {
  viewport: MapViewportSnapshot;
  highlightedPoiIds: readonly string[];
  visibleLayers: Readonly<Record<string, boolean>>;
}

export interface MapStateActions {
  setViewport(options: SetViewportOptions): void;
  highlightPois(ids: readonly string[]): void;
  toggleLayer(id: string, visible: boolean): void;
  setLocale(locale: LocaleCode): void;
  registerMap(map: MapLibreMap): void;
  unregisterMap(map: MapLibreMap): void;
}

export interface SetViewportOptions {
  center?: LngLatTuple;
  zoom?: number;
  bearing?: number;
  pitch?: number;
  animate?: boolean;
}

export interface MapStateStore {
  getSnapshot: () => MapStateSnapshot;
  subscribe(listener: () => void): () => void;
  actions: MapStateActions;
}

interface InternalState extends MapStateSnapshot {
  map: MapLibreMap | null;
  locale: LocaleCode;
}

const DEFAULT_CENTER: LngLatTuple = [11.404, 47.267];
const DEFAULT_ZOOM = 12;

const defaultSnapshot: MapStateSnapshot = {
  viewport: {
    center: [...DEFAULT_CENTER] as LngLatTuple,
    zoom: DEFAULT_ZOOM,
    bearing: 0,
    pitch: 0,
  },
  highlightedPoiIds: [],
  visibleLayers: {},
};

const poiCoordinates: Record<string, LngLatTuple> = {
  "blue-bottle-coffee": [11.4012, 47.2668],
  "harbor-pier": [11.4054, 47.2689],
  "mural-alley": [11.3988, 47.2675],
  "riverside-garden": [11.4092, 47.2651],
  "lighthouse-market": [11.4125, 47.2698],
  "skyline-bridge": [11.4078, 47.2712],
};

function buildPoiData(locale: LocaleCode): FeatureCollection<Point, { id: string; name: string }> {
  // Filter out POIs with missing/invalid localizations to prevent map init crash
  const validFeatures = waterfrontDiscoveryRoute.pointsOfInterest
    .map((poi) => {
      try {
        const coordinates = poiCoordinates[poi.id] ?? DEFAULT_CENTER;
        const localization = pickLocalization(poi.localizations, locale);
        return {
          type: "Feature" as const,
          id: poi.id,
          properties: {
            id: poi.id,
            name: localization.name,
          },
          geometry: {
            type: "Point" as const,
            coordinates,
          },
        };
      } catch {
        // Skip POIs with invalid localizations rather than crash the map
        return null;
      }
    })
    .filter((feature) => feature !== null);

  return {
    type: "FeatureCollection",
    features: validFeatures,
  };
}

function createInternalState(): InternalState {
  return {
    ...defaultSnapshot,
    map: null,
    locale: "en-GB",
  };
}

function cloneSnapshot(state: InternalState): MapStateSnapshot {
  return {
    viewport: {
      ...state.viewport,
      center: [...state.viewport.center] as LngLatTuple,
    },
    highlightedPoiIds: [...state.highlightedPoiIds],
    visibleLayers: { ...state.visibleLayers },
  };
}

function createMapStateStore(): MapStateStore {
  let state: InternalState = createInternalState();
  let snapshot: MapStateSnapshot = cloneSnapshot(state);
  const listeners = new Set<() => void>();

  let subscriptions: Array<{ event: string; handler: () => void }> = [];

  function emit() {
    snapshot = cloneSnapshot(state);
    listeners.forEach((listener) => {
      listener();
    });
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function getSnapshot() {
    return snapshot;
  }

  function applyViewportToMap(
    map: MapLibreMap,
    viewport: MapViewportSnapshot,
    animate = true,
  ): void {
    map[animate ? "easeTo" : "jumpTo"]({
      center: viewport.center,
      zoom: viewport.zoom,
      bearing: viewport.bearing,
      pitch: viewport.pitch,
      duration: animate ? 450 : 0,
    });
  }

  function ensureBaseLayers(map: MapLibreMap, locale: LocaleCode) {
    if (!map.getSource("wildside-pois")) {
      map.addSource("wildside-pois", {
        type: "geojson",
        data: buildPoiData(locale),
      });
    }

    if (!map.getLayer("wildside-pois-circles")) {
      map.addLayer({
        id: "wildside-pois-circles",
        type: "circle",
        source: "wildside-pois",
        paint: {
          "circle-radius": ["case", ["boolean", ["feature-state", "highlighted"], false], 10, 7],
          "circle-color": [
            "case",
            ["boolean", ["feature-state", "highlighted"], false],
            "#f97316",
            "#2563eb",
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });
    }

    if (!map.getLayer("wildside-pois-labels")) {
      map.addLayer({
        id: "wildside-pois-labels",
        type: "symbol",
        source: "wildside-pois",
        layout: {
          "text-field": ["get", "name"],
          "text-offset": [0, 1.2],
          "text-anchor": "top",
          "text-size": 12,
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": "#111827",
          "text-halo-width": 1,
        },
      });
    }
  }

  function clearSubscriptions(targetMap: MapLibreMap | null) {
    if (!targetMap || subscriptions.length === 0) return;
    subscriptions.forEach(({ event, handler }) => {
      targetMap.off(event as Parameters<MapLibreMap["off"]>[0], handler);
    });
    subscriptions = [];
  }

  function updateViewportFromMap(map: MapLibreMap) {
    const center = map.getCenter();
    const nextViewport: MapViewportSnapshot = {
      center: [center.lng, center.lat],
      zoom: map.getZoom(),
      bearing: map.getBearing(),
      pitch: map.getPitch(),
    };
    state = {
      ...state,
      viewport: nextViewport,
    };
    emit();
  }

  function applyVisibleLayers(map: MapLibreMap, visibility: Record<string, boolean>) {
    Object.entries(visibility).forEach(([layerId, isVisible]) => {
      if (!map.getLayer(layerId)) return;
      map.setLayoutProperty(layerId, "visibility", isVisible ? "visible" : "none");
    });
  }

  function applyHighlights(map: MapLibreMap, previous: readonly string[], next: readonly string[]) {
    const source = map.getSource("wildside-pois") as GeoJSONSource | undefined;
    if (!source) return;
    const prevSet = new Set(previous);
    prevSet.forEach((id) => {
      if (next.includes(id)) return;
      map.removeFeatureState({ source: "wildside-pois", id });
    });
    next.forEach((id) => {
      map.setFeatureState({ source: "wildside-pois", id }, { highlighted: true });
    });
  }

  function registerMap(map: MapLibreMap) {
    if (state.map === map) {
      return;
    }
    clearSubscriptions(state.map);
    state = {
      ...state,
      map,
    };
    ensureBaseLayers(map, state.locale);
    applyVisibleLayers(map, state.visibleLayers);
    applyHighlights(map, [], state.highlightedPoiIds);
    applyViewportToMap(map, state.viewport, false);
    emit();

    const handleMove = () => updateViewportFromMap(map);
    const events: Array<Parameters<MapLibreMap["on"]>> = [
      ["moveend", handleMove],
      ["zoomend", handleMove],
      ["rotateend", handleMove],
      ["pitchend", handleMove],
    ];
    subscriptions = events.map(([event, handler]) => ({
      event: event as string,
      handler: handler as () => void,
    }));
    events.forEach(([event, handler]) => {
      map.on(event, handler);
    });
  }

  function unregisterMap(map: MapLibreMap) {
    if (state.map !== map) {
      return;
    }
    clearSubscriptions(map);
    state = {
      ...state,
      map: null,
    };
    emit();
  }

  function setViewport(options: SetViewportOptions) {
    const nextViewport: MapViewportSnapshot = {
      center: options.center
        ? ([...options.center] as LngLatTuple)
        : ([...state.viewport.center] as LngLatTuple),
      zoom: options.zoom ?? state.viewport.zoom,
      bearing: options.bearing ?? state.viewport.bearing,
      pitch: options.pitch ?? state.viewport.pitch,
    };
    state = {
      ...state,
      viewport: nextViewport,
    };
    emit();
    if (state.map) {
      applyViewportToMap(state.map, nextViewport, options.animate ?? true);
    }
  }

  function highlightPois(ids: readonly string[]) {
    const unique = Array.from(new Set(ids));
    const previous = state.highlightedPoiIds;
    state = {
      ...state,
      highlightedPoiIds: unique,
    };
    emit();
    if (state.map) {
      applyHighlights(state.map, previous, unique);
    }
  }

  function toggleLayer(id: string, visible: boolean) {
    state = {
      ...state,
      visibleLayers: {
        ...state.visibleLayers,
        [id]: visible,
      },
    };
    emit();
    if (state.map?.getLayer(id)) {
      state.map.setLayoutProperty(id, "visibility", visible ? "visible" : "none");
    }
  }

  function setLocale(locale: LocaleCode) {
    if (state.locale === locale) {
      return;
    }
    state = {
      ...state,
      locale,
    };
    emit();
    if (state.map) {
      const source = state.map.getSource("wildside-pois") as GeoJSONSource | undefined;
      if (source) {
        source.setData(buildPoiData(locale));
      }
    }
  }

  return {
    getSnapshot,
    subscribe,
    actions: {
      setViewport,
      highlightPois,
      toggleLayer,
      setLocale,
      registerMap,
      unregisterMap,
    },
  };
}

const storeInstance: MapStateStore = createMapStateStore();

/** Test helper returning a fresh, isolated map state store instance. */
export function createMapStateStoreForTests(): MapStateStore {
  return createMapStateStore();
}

const MapStateContext = createContext<MapStateStore | null>(null);

export function MapStateProvider({ children }: { children: ReactNode }): JSX.Element {
  const storeRef = useRef(storeInstance);
  return <MapStateContext.Provider value={storeRef.current}>{children}</MapStateContext.Provider>;
}

function useMapStateContext(): MapStateStore {
  const store = useContext(MapStateContext);
  if (!store) {
    throw new Error("useMapState* hooks must be used within a MapStateProvider.");
  }
  return store;
}

export function useMapStateSnapshot(): MapStateSnapshot {
  const store = useMapStateContext();
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

export function useMapActions(): MapStateActions {
  const store = useMapStateContext();
  return store.actions;
}

export function useOptionalMapStore(): MapStateStore | null {
  return useContext(MapStateContext);
}

export const mapDefaults = {
  center: [...DEFAULT_CENTER] as LngLatTuple,
  zoom: DEFAULT_ZOOM,
};
