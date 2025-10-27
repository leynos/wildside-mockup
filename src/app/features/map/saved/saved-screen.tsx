/** @file Saved walk detail screen with MapLibre map and tabbed layout. */

import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { FontAwesomeIcon } from "../../../components/font-awesome-icon";
import { MapBottomNavigation } from "../../../components/map-bottom-navigation";
import { MapViewport } from "../../../components/map-viewport";
import { PointOfInterestList } from "../../../components/point-of-interest-list";
import { WildsideMap } from "../../../components/wildside-map";
import { savedRoutes } from "../../../data/map";
import { MobileShell } from "../../../layout/mobile-shell";

const [savedRoute] = savedRoutes;
const tabTriggerClass =
  "py-3 text-sm font-semibold text-base-content/70 data-[state=active]:text-accent";

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-semibold text-base-content">{value}</p>
      <p className="text-xs text-base-content/60">{label}</p>
    </div>
  );
}

export function SavedScreen(): JSX.Element {
  const navigate = useNavigate();
  const [isFavourite, setIsFavourite] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("map");

  return (
    <MobileShell tone="dark">
      <div className="relative flex h-full flex-col">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
          <div className="relative flex-1 overflow-hidden">
            <Tabs.Content value="map" forceMount className="flex h-full flex-col">
              <MapViewport
                map={<WildsideMap />}
                gradientClassName="bg-gradient-to-t from-base-900/80 via-base-900/30 to-transparent"
              >
                <div className="flex flex-col justify-between px-6 pb-6 pt-8">
                  <div className="flex items-center justify-between text-base-100">
                    <button
                      type="button"
                      aria-label="Back"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-base-900/70"
                      onClick={() => navigate({ to: "/map/quick" })}
                    >
                      <FontAwesomeIcon name="fa-solid fa-arrow-left" />
                    </button>
                    <Dialog.Root open={shareOpen} onOpenChange={setShareOpen}>
                      <Dialog.Trigger asChild>
                        <button
                          type="button"
                          aria-label="Share"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-base-900/70"
                        >
                          <FontAwesomeIcon name="fa-solid fa-share" />
                        </button>
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
                        <Dialog.Content className="fixed inset-0 m-auto flex h-fit w-80 flex-col gap-4 rounded-2xl border border-base-300/60 bg-base-100 p-6 shadow-2xl">
                          <Dialog.Title className="text-lg\ font-semibold text-base-content">
                            Share saved walk
                          </Dialog.Title>
                          <Dialog.Description className="text-sm text-base-content/70">
                            Sharing is not wired up yet, but this is where the integration will
                            live.
                          </Dialog.Description>
                          <div className="rounded-xl border border-base-300/60 bg-base-200/80 p-3 text-xs text-base-content/70">
                            https://wildside.app/routes/{savedRoute.id}
                          </div>
                          <Dialog.Close asChild>
                            <button type="button" className="btn btn-accent btn-sm self-end">
                              Close
                            </button>
                          </Dialog.Close>
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>
                  </div>

                  <div className="mt-auto rounded-3xl border border-base-300/60 bg-base-100/90 p-6 text-base-content shadow-2xl backdrop-blur">
                    <h1 className="text-2xl font-semibold">{savedRoute.title}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-base-content/70">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon name="fa-solid fa-route" className="text-accent" />
                        {savedRoute.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon name="fa-regular fa-clock" className="text-accent" />
                        {savedRoute.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon name="fa-solid fa-location-dot" className="text-accent" />
                        {savedRoute.stopsCount} stops
                      </span>
                    </div>
                  </div>
                </div>
              </MapViewport>
            </Tabs.Content>

            <Tabs.Content value="stops" className="h-full overflow-y-auto px-6 pb-28 pt-6">
              <PointOfInterestList points={savedRoute.pointsOfInterest} />
            </Tabs.Content>

            <Tabs.Content
              value="notes"
              className="h-full overflow-y-auto px-6 pb-28 pt-6 text-sm text-base-content/70"
            >
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <Metric label="Rating" value={savedRoute.rating.toFixed(1)} />
                  <Metric label="Saves" value={savedRoute.saves.toString()} />
                  <Metric label="Difficulty" value={savedRoute.difficulty} />
                  <Metric label="Updated" value={savedRoute.updatedAgo} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {savedRoute.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-accent/40 bg-base-200/80 px-3 py-1 text-xs font-medium text-accent"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
                <p>{savedRoute.description}</p>
                <ul className="list-disc space-y-2 pl-5">
                  {savedRoute.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </Tabs.Content>
          </div>

          <Tabs.List className="grid grid-cols-3 border-t border-base-300/60 bg-base-200/80">
            <Tabs.Trigger value="map" className={tabTriggerClass}>
              Map
            </Tabs.Trigger>
            <Tabs.Trigger value="stops" className={tabTriggerClass}>
              Stops
            </Tabs.Trigger>
            <Tabs.Trigger value="notes" className={tabTriggerClass}>
              Notes
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        <div className="absolute bottom-[116px] right-6 z-30">
          <button
            type="button"
            className={`flex h-16 w-16 items-center justify-center rounded-full border border-base-300/60 text-base-100 shadow-xl transition ${
              isFavourite ? "bg-accent text-base-900" : "bg-base-900/80"
            }`}
            aria-pressed={isFavourite}
            onClick={() => setIsFavourite((prev) => !prev)}
          >
            <FontAwesomeIcon
              name={isFavourite ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}
            />
          </button>
        </div>

        <MapBottomNavigation activeId="saved" />
      </div>
    </MobileShell>
  );
}
