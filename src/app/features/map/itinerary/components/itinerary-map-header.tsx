/** @file Top header bar for the itinerary map view with stats and navigation. */

import type { JSX } from "react";

import { Icon } from "../../../../components/icon";
import { MapRouteStat } from "../../../../components/map/map-route-stat";
import type { LocalisedUnitValue } from "../../../../units/unit-format";
import type { ItineraryLabels } from "../hooks/use-itinerary-data";

export type ItineraryMapHeaderProps = {
  readonly distance: LocalisedUnitValue;
  readonly duration: LocalisedUnitValue;
  readonly stops: LocalisedUnitValue;
  readonly labels: ItineraryLabels;
  readonly onBack: () => void;
};

export function ItineraryMapHeader({
  distance,
  duration,
  stops,
  labels,
  onBack,
}: ItineraryMapHeaderProps): JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        className="circle-action-button--ghost"
        aria-label="Back"
        onClick={onBack}
      >
        <Icon token="{icon.navigation.back}" aria-hidden className="h-5 w-5" />
      </button>
      <div className="map-route__meta">
        <div className="flex items-center gap-4">
          <MapRouteStat label={labels.distance} value={`${distance.value} ${distance.unitLabel}`} />
          <MapRouteStat label={labels.duration} value={`${duration.value} ${duration.unitLabel}`} />
          <MapRouteStat label={labels.stops} value={`${stops.value} ${stops.unitLabel}`} />
        </div>
      </div>
      <button type="button" className="circle-action-button--ghost" aria-label="Locate">
        <Icon token="{icon.object.locationArrow}" aria-hidden className="h-5 w-5" />
      </button>
    </div>
  );
}
