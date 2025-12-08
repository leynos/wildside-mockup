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
 * // Numeric value
 * <MapRouteStat label="Stops" value={5} />
 * // Renders:
 * // <span class="map-route__stat">
 * //   <span class="map-route__stat-value">5</span>
 * //   Stops
 * // </span>
 */
export function MapRouteStat({ label, value }: MapRouteStatProps): JSX.Element {
  return (
    <span className="map-route__stat">
      <span className="map-route__stat-value">{value}</span>
      {label}
    </span>
  );
}
