/** @file Reusable stat display for map route metrics (distance, duration, stops). */

import type { JSX } from "react";

export type MapRouteStatProps = {
  readonly label: string;
  readonly value: string | number;
};

export function MapRouteStat({ label, value }: MapRouteStatProps): JSX.Element {
  return (
    <span className="map-route__stat">
      <p className="map-route__stat-value">{value}</p>
      {label}
    </span>
  );
}
