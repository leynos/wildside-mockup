/** @file Route summary with title, description, and highlight tags. */

import type { JSX } from "react";

import type { TagId } from "../../../../data/registries/tags";
import { getTagDescriptor } from "../../../../data/registries/tags";

export type RouteSummarySectionProps = {
  readonly routeName: string;
  readonly routeDescription: string | undefined;
  readonly highlightTagIds: readonly TagId[];
  readonly language: string;
};

export function RouteSummarySection({
  routeName,
  routeDescription,
  highlightTagIds,
  language,
}: RouteSummarySectionProps): JSX.Element {
  return (
    <div className="map-route__summary">
      <p className="text-sm font-medium text-base-content/60">Suggested route</p>
      <h1 className="mt-1 text-2xl font-semibold text-base-content">{routeName}</h1>
      <p className="mt-3 text-sm text-base-content/70">{routeDescription}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {highlightTagIds.map((tagId) => {
          const tag = getTagDescriptor(tagId, language);
          const label = tag?.localization.name ?? tagId;
          return (
            <span key={tagId} className="route-highlight">
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
