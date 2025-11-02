/** @file Shared list rendering points of interest with Radix dialog sheets. */

import * as Dialog from "@radix-ui/react-dialog";
import type { JSX } from "react";

import type { WalkPointOfInterest } from "../data/map";
import { useOptionalMapStore } from "../features/map/map-state";
import { Icon } from "./icon";

export interface PointOfInterestListProps {
  points: WalkPointOfInterest[];
}

export function PointOfInterestList({ points }: PointOfInterestListProps): JSX.Element {
  const mapStore = useOptionalMapStore();
  const highlightPois = mapStore?.actions.highlightPois;

  return (
    <div className="space-y-3">
      {points.map((poi) => (
        <Dialog.Root key={poi.id}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="poi-list__item"
              onMouseEnter={() => highlightPois?.([poi.id])}
              onFocus={() => highlightPois?.([poi.id])}
              onMouseLeave={() => highlightPois?.([])}
              onBlur={() => highlightPois?.([])}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-base-content">{poi.name}</h3>
                  <p className="mt-1 text-sm text-base-content/70">{poi.description}</p>
                </div>
                {poi.rating ? (
                  <span className="flex items-center gap-1 text-sm font-semibold text-amber-400">
                    <Icon token="{icon.object.star}" aria-hidden className="h-4 w-4" />
                    {poi.rating.toFixed(1)}
                  </span>
                ) : null}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-accent">
                <span className="poi-highlight">
                  <Icon
                    token={poi.categoryIconToken}
                    className={`h-4 w-4 ${poi.categoryColorClass}`}
                    aria-hidden
                  />
                  Highlight
                </span>
                {poi.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-base-300/60 bg-base-100 px-2 py-0.5 text-base-content/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60" />
            <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="poi-sheet">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Dialog.Title className="text-lg font-semibold text-base-content">
                      {poi.name}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-base-content/70">
                      {poi.description}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button type="button" className="btn btn-ghost btn-sm">
                      Close
                    </button>
                  </Dialog.Close>
                </div>
                <div className="mt-4 space-y-2 text-sm text-base-content/70">
                  {poi.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {poi.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-base-300/60 bg-base-200/70 px-3 py-1 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {poi.openHours ? (
                    <p className="flex items-center gap-2 text-xs text-base-content/60">
                      <Icon token="{icon.object.duration}" aria-hidden className="h-4 w-4" />
                      {poi.openHours}
                    </p>
                  ) : null}
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ))}
    </div>
  );
}
