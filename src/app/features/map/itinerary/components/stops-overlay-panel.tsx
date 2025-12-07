/** @file Overlay panel displaying stops along a route. */

import type { JSX } from "react";

import { PointOfInterestList } from "../../../../components/point-of-interest-list";
import type { WalkPointOfInterest } from "../../../../data/map";

const stickyHandleClass = "mx-auto block h-2 w-12 rounded-full bg-base-300/70";

export type StopsOverlayPanelProps = {
  readonly points: WalkPointOfInterest[];
  readonly onDismiss: () => void;
};

export function StopsOverlayPanel({ points, onDismiss }: StopsOverlayPanelProps): JSX.Element {
  return (
    <div className="pointer-events-none px-6 pb-6">
      <div className="map-panel map-panel--stacked max-h-[60vh]">
        <div className="map-panel__handle bg-transparent">
          <button
            type="button"
            className={stickyHandleClass}
            aria-label="Dismiss panel"
            onClick={onDismiss}
          />
        </div>
        <div className="map-panel__body">
          <PointOfInterestList points={points} />
        </div>
        <div className="map-overlay__fade map-overlay__fade--top" aria-hidden="true" />
        <div className="map-overlay__fade map-overlay__fade--bottom" aria-hidden="true" />
      </div>
    </div>
  );
}
