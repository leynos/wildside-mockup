/** @file MapLibre wrapper rendering the Wildside demo map. */

import type { Map as MapLibreMap } from "maplibre-gl";
import { useEffect, useRef } from "react";

const DEFAULT_CENTER: Readonly<[number, number]> = Object.freeze([11.404, 47.267]);
const DEFAULT_ZOOM = 12;

export interface WildsideMapProps {
  /** Longitude/latitude pair for the initial view. */
  center?: [number, number];
  /** Initial zoom level for the map. */
  zoom?: number;
}

/**
 * Embeds a MapLibre GL JS map using the OpenMapTiles bright demo style.
 * The map initialises lazily so tests and non-WebGL environments can opt out
 * without throwing.
 */
export function WildsideMap({ center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM }: WildsideMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const centerRef = useRef(center);
  const zoomRef = useRef(zoom);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (typeof window === "undefined") return;
    if (!(window as typeof window & { WebGLRenderingContext?: unknown }).WebGLRenderingContext) {
      // Skip initialisation when WebGL is unavailable (e.g., unit tests).
      return;
    }

    let isCancelled = false;
    async function initialiseMap() {
      const [{ default: maplibre }] = await Promise.all([
        import("maplibre-gl"),
        import("maplibre-gl/dist/maplibre-gl.css"),
      ]);

      if (isCancelled) return;

      try {
        const mapInstance = new maplibre.Map({
          container,
          style: "https://demotiles.maplibre.org/styles/osm-bright-gl-style/style.json",
          center: centerRef.current,
          zoom: zoomRef.current,
          attributionControl: false,
        });
        mapRef.current = mapInstance;
        mapInstance.addControl(
          new maplibre.NavigationControl({ visualizePitch: true }),
          "top-right",
        );
        mapInstance.addControl(new maplibre.AttributionControl({ compact: true }));

        mapInstance.on("load", () => {
          if (!mapInstance) return;
          if (!mapInstance.getSource("wildside-pois")) {
            mapInstance.addSource("wildside-pois", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    properties: { name: "Start exploring" },
                    geometry: { type: "Point", coordinates: [11.4, 47.268] },
                  },
                ],
              },
            });
          }

          if (!mapInstance.getLayer("wildside-pois-circles")) {
            mapInstance.addLayer({
              id: "wildside-pois-circles",
              type: "circle",
              source: "wildside-pois",
              paint: {
                "circle-radius": 8,
                "circle-color": "#3b82f6",
                "circle-stroke-width": 2,
                "circle-stroke-color": "#ffffff",
              },
            });
          }

          if (!mapInstance.getLayer("wildside-pois-labels")) {
            mapInstance.addLayer({
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
                "text-halo-color": "#1f2937",
                "text-halo-width": 1,
              },
            });
          }
        });
      } catch (error) {
        console.warn("Wildside map failed to initialise", error);
      }
    }

    initialiseMap().catch((error) => {
      console.warn("Wildside map encountered an error", error);
    });

    return () => {
      isCancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    centerRef.current = center;
    if (!mapRef.current) return;
    mapRef.current.easeTo({ center, animate: false });
  }, [center]);

  useEffect(() => {
    zoomRef.current = zoom;
    if (!mapRef.current) return;
    mapRef.current.setZoom(zoom);
  }, [zoom]);

  return <div ref={containerRef} className="h-full w-full" />;
}
