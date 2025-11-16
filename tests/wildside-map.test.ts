import { describe, expect, it } from "bun:test";

import {
  ensureFallbackLayers,
  ensureRtlTextPlugin,
  resetRtlTextPluginRegistrationForTests,
} from "../src/app/components/wildside-map";

describe("Wildside map RTL helpers", () => {
  it("registers the RTL text plugin only once when MapLibre exposes the hook", () => {
    resetRtlTextPluginRegistrationForTests();
    const pluginCalls: Array<readonly [string, unknown, unknown]> = [];
    const mockNamespace = {
      setRTLTextPlugin: (...args: [string, unknown, unknown]) => {
        pluginCalls.push(args);
      },
    } as unknown as typeof import("maplibre-gl");

    ensureRtlTextPlugin(mockNamespace);
    ensureRtlTextPlugin(mockNamespace);

    expect(pluginCalls).toHaveLength(1);
    expect(pluginCalls[0]?.[0]).toMatch(/maplibre-gl-rtl-text/u);

    resetRtlTextPluginRegistrationForTests();
    ensureRtlTextPlugin({} as typeof import("maplibre-gl"));
    expect(pluginCalls).toHaveLength(1);
  });

  it("adds fallback layers so label glyphs render for RTL locales", () => {
    type Layer = { id: string; layout?: Record<string, unknown>; source?: string };
    const sources = new Map<string, unknown>();
    const layers = new Map<string, Layer>();

    const mapStub = {
      getSource: (id: string) => sources.get(id),
      addSource: (id: string, definition: unknown) => {
        sources.set(id, definition);
      },
      getLayer: (id: string) => layers.get(id),
      addLayer: (layer: Layer) => {
        layers.set(layer.id, layer);
      },
    };

    ensureFallbackLayers(mapStub as never);

    const labelLayer = layers.get("wildside-pois-labels");
    expect(labelLayer?.layout?.["text-field"]).toEqual(["get", "name"]);
    expect(labelLayer?.source).toBe("wildside-pois");
    expect(layers.get("wildside-pois-circles")).toBeTruthy();
  });
});

/**@example
 * ```ts
 * import { ensureRtlTextPlugin } from "../src/app/components/wildside-map";
 *
 * ensureRtlTextPlugin(await import("maplibre-gl"));
 * ```
 */
