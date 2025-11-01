/** @file Saved walk detail screen with MapLibre map and tabbed layout. */

import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, useState } from "react";

import { Icon } from "../../../components/icon";
import { MapBottomNavigation } from "../../../components/map-bottom-navigation";
import { MapViewport } from "../../../components/map-viewport";
import { PointOfInterestList } from "../../../components/point-of-interest-list";
import { WildsideMap } from "../../../components/wildside-map";
import { savedRoutes } from "../../../data/map";
import { MobileShell } from "../../../layout/mobile-shell";

const savedRoute = savedRoutes[0];
const tabTriggerClass =
  "py-3 text-sm font-semibold text-base-content/70 data-[state=active]:text-accent";

const stickyHandleClass = "mx-auto block h-2 w-12 rounded-full bg-base-300/70";

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

  if (!savedRoute) {
    return (
      <MobileShell tone="dark">
        <main className="map-shell__main">
          <div className="flex flex-1 items-center justify-center px-6 text-center text-base-content/70">
            <p>No saved routes are available yet.</p>
          </div>
        </main>
      </MobileShell>
    );
  }

  return (
    <MobileShell tone="dark">
      <main className="relative flex flex-1 min-h-0 flex-col overflow-hidden">
        <Tabs.Root
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-1 min-h-0 flex-col justify-end overflow-hidden"
        >
          <div className="relative flex flex-1 flex-col justify-end overflow-hidden">
            <Tabs.Content value="map" forceMount className="map-overlay">
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
                      <Icon token="{icon.navigation.back}" aria-hidden className="h-5 w-5" />
                    </button>
                    <Dialog.Root open={shareOpen} onOpenChange={setShareOpen}>
                      <Dialog.Trigger asChild>
                        <button
                          type="button"
                          aria-label="Share"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-base-900/70"
                        >
                          <Icon token="{icon.action.share}" aria-hidden className="h-5 w-5" />
                        </button>
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
                        <Dialog.Content className="dialog-surface">
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

                  <div className="mt-auto saved-summary__panel">
                    <h1 className="text-2xl font-semibold">{savedRoute.title}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-base-content/70">
                      <span className="flex items-center gap-1">
                        <Icon token="{icon.object.route}" className="text-accent" aria-hidden />
                        {savedRoute.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon token="{icon.object.duration}" className="text-accent" aria-hidden />
                        {savedRoute.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon token="{icon.object.stops}" className="text-accent" aria-hidden />
                        {savedRoute.stopsCount} stops
                      </span>
                    </div>
                  </div>
                </div>
              </MapViewport>
            </Tabs.Content>

            <Tabs.Content value="stops" className="map-overlay">
              <div className="pointer-events-none px-6 pb-6">
                <div className="map-panel map-panel--stacked max-h-[60vh]">
                  <div className="flex justify-center bg-base-900/70 pb-3 pt-3">
                    <button
                      type="button"
                      className={stickyHandleClass}
                      aria-label="Dismiss panel"
                      onClick={() => setActiveTab("map")}
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto px-5 pb-5">
                    <PointOfInterestList points={savedRoute.pointsOfInterest} />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-base-900/70 to-transparent"
                    aria-hidden="true"
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-base-900/80 to-transparent"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="notes" className="map-overlay">
              <div className="pointer-events-none px-6 pb-6">
                <div className="map-panel map-panel--scroll max-h-[60vh] space-y-6 p-5 text-sm text-base-content">
                  <div className="grid grid-cols-4 gap-4 text-base-content">
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
                  <p className="text-base-content/80">{savedRoute.description}</p>
                  <ul className="list-disc space-y-2 pl-5 text-base-content/70">
                    {savedRoute.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Tabs.Content>
          </div>

          <Tabs.List className="grid grid-cols-3 shrink-0 border-t border-base-300/60 bg-base-200/80">
            <Tabs.Trigger value="map" className={tabTriggerClass}>
              Explore
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
            <Icon token={isFavourite ? "{icon.action.save}" : "{icon.action.unsave}"} aria-hidden />
          </button>
        </div>

        <MapBottomNavigation activeId="routes" />
      </main>
    </MobileShell>
  );
}
