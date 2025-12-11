/** @file Reusable stat display for map route metrics (distance, duration, stops). */

import type { JSX } from "react";

/**
 * Props for the MapRouteStat component.
 *
 * @property label - Descriptive text displayed below the value (e.g., "Distance").
 * @property value - Numeric or string metric to display prominently.
 */
export type MapRouteStatProps = {
  readonly label: string;
  readonly value: string | number;
};

/**
 * Displays a single route statistic with a prominent value and label.
 *
 * Numeric values are rendered inside a semantic `<data>` element with
 * a machine-readable `value` attribute; string values use a `<span>`.
 *
 * @example
 * // String value with unit
 * <MapRouteStat label="Distance" value="4.2 km" />
 * // Renders:
 * // <span class="map-route__stat">
 * //   <span class="map-route__stat-value">4.2 km</span>
 * //   Distance
 * // </span>
 *
 * @example
 * // Numeric value renders inside <data>
 * <MapRouteStat label="Stops" value={5} />
 * // Renders:
 * // <span class="map-route__stat">
 * //   <data class="map-route__stat-value" value="5">5</data>
 * //   Stops
 * // </span>
 */
export function MapRouteStat({ label, value }: MapRouteStatProps): JSX.Element {
  return (
    <span className="map-route__stat">
      {typeof value === "number" ? (
        <data className="map-route__stat-value" value={String(value)}>
          {value}
        </data>
      ) : (
        <span className="map-route__stat-value">{value}</span>
      )}
      {label}
    </span>
  );
}
