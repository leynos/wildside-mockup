/** @file Map itinerary route with MapLibre canvas, tabs, and POI details. */

import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Icon } from "../../../components/icon";
import { MapBottomNavigation } from "../../../components/map-bottom-navigation";
import { MapViewport } from "../../../components/map-viewport";
import { PointOfInterestList } from "../../../components/point-of-interest-list";
import { WildsideMap } from "../../../components/wildside-map";
import { waterfrontDiscoveryRoute } from "../../../data/map";
import { MobileShell } from "../../../layout/mobile-shell";

const tabTriggerClass =
  "py-3 text-sm font-semibold text-base-content/70 data-[state=active]:text-accent";

const stickyHandleClass = "mx-auto block h-2 w-12 rounded-full bg-base-300/70";

export function ItineraryScreen(): JSX.Element {
  const navigate = useNavigate();
  const [isFavourite, setIsFavourite] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("map");

  return (
    <MobileShell tone="dark">
      <main className="relative flex flex-1 min-h-0 flex-col overflow-hidden">
        <Tabs.Root
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-1 min-h-0 flex-col justify-end overflow-hidden"
        >
          <div className="relative flex flex-1 flex-col justify-end overflow-hidden">
            <Tabs.Content
              value="map"
              forceMount
              className="absolute inset-0 flex flex-col justify-end"
            >
              <MapViewport
                map={<WildsideMap />}
                gradientClassName="bg-gradient-to-t from-base-900/85 via-base-900/40 to-transparent"
              >
                <div className="flex flex-col justify-between px-6 pb-6 pt-12">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/70 bg-base-200/80 text-base-content"
                      aria-label="Back"
                      onClick={() => navigate({ to: "/map/quick" })}
                    >
                      <Icon token="{icon.navigation.back}" aria-hidden className="h-5 w-5" />
                    </button>
                    <div className="rounded-2xl border border-base-300/60 bg-base-200/80 px-4 py-2 text-xs text-base-content/70 shadow-lg shadow-base-300/30 backdrop-blur">
                      <div className="flex items-center gap-4">
                        <span className="text-center">
                          <p className="text-lg font-semibold text-accent">
                            {waterfrontDiscoveryRoute.distance}
                          </p>
                          Distance
                        </span>
                        <span className="text-center">
                          <p className="text-lg font-semibold text-accent">
                            {waterfrontDiscoveryRoute.duration}
                          </p>
                          Walking
                        </span>
                        <span className="text-center">
                          <p className="text-lg font-semibold text-accent">
                            {waterfrontDiscoveryRoute.stopsCount}
                          </p>
                          Stops
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/70 bg-base-200/80 text-base-content"
                      aria-label="Locate"
                    >
                      <Icon token="{icon.object.locationArrow}" aria-hidden className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="rounded-3xl border border-base-300/60 bg-base-100/90 p-5 shadow-2xl backdrop-blur">
                      <p className="text-sm font-medium text-base-content/60">Suggested route</p>
                      <h1 className="mt-1 text-2xl font-semibold text-base-content">
                        {waterfrontDiscoveryRoute.title}
                      </h1>
                      <p className="mt-3 text-sm text-base-content/70">
                        {waterfrontDiscoveryRoute.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {waterfrontDiscoveryRoute.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="rounded-full border border-accent/40 bg-base-200/70 px-3 py-1 text-xs font-medium text-accent"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className={`flex h-10 w-10 items-center justify-center rounded-full border border-base-300/60 transition ${
                          isFavourite
                            ? "bg-accent text-base-900"
                            : "bg-base-200/70 text-base-content"
                        }`}
                        aria-pressed={isFavourite}
                        onClick={() => setIsFavourite((prev) => !prev)}
                      >
                        <Icon
                          token={isFavourite ? "{icon.action.like}" : "{icon.action.unlike}"}
                          aria-hidden
                        />
                      </button>
                      <Dialog.Root open={shareOpen} onOpenChange={setShareOpen}>
                        <Dialog.Trigger asChild>
                          <button
                            type="button"
                            className="flex items-center gap-2 rounded-full border border-base-300/60 bg-base-200/70 px-4 py-2 text-sm font-medium text-base-content"
                          >
                            <Icon token="{icon.action.share}" aria-hidden />
                            Share
                          </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                          <Dialog.Overlay className="fixed inset-0 bg-black/60" />
                          <Dialog.Content className="fixed inset-0 m-auto flex h-fit w-80 flex-col gap-4 rounded-2xl border border-base-300/60 bg-base-100 p-6 shadow-2xl">
                            <Dialog.Title className="text-lg font-semibold text-base-content">
                              Share this walk
                            </Dialog.Title>
                            <Dialog.Description className="text-sm text-base-content/70">
                              Copy the preview link or send it to friends once real sharing is wired
                              up.
                            </Dialog.Description>
                            <div className="rounded-xl border border-base-300/60 bg-base-200/80 p-3 text-xs text-base-content/70">
                              https://wildside.app/routes/{waterfrontDiscoveryRoute.id}
                            </div>
                            <div className="flex justify-end gap-2">
                              <Dialog.Close asChild>
                                <button type="button" className="btn btn-ghost btn-sm">
                                  Close
                                </button>
                              </Dialog.Close>
                              <button type="button" className="btn btn-accent btn-sm" disabled>
                                Coming soon
                              </button>
                            </div>
                          </Dialog.Content>
                        </Dialog.Portal>
                      </Dialog.Root>
                    </div>
                  </div>
                </div>
              </MapViewport>
            </Tabs.Content>

            <Tabs.Content value="stops" className="absolute inset-0 flex flex-col justify-end">
              <div className="pointer-events-none px-6 pb-6">
                <div className="pointer-events-auto relative flex max-h-[60vh] flex-col overflow-hidden rounded-3xl border border-base-300/60 bg-base-900/70 text-base-100 shadow-2xl backdrop-blur">
                  <div className="flex justify-center bg-base-900/70 pb-3 pt-3">
                    <button
                      type="button"
                      className={stickyHandleClass}
                      aria-label="Dismiss panel"
                      onClick={() => setActiveTab("map")}
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto px-5 pb-5">
                    <PointOfInterestList points={waterfrontDiscoveryRoute.pointsOfInterest} />
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

            <Tabs.Content value="notes" className="absolute inset-0 flex flex-col justify-end">
              <div className="pointer-events-none px-6 pb-6">
                <div className="pointer-events-auto max-h-[60vh] overflow-y-auto rounded-3xl border border-base-300/60 bg-base-900/70 p-5 text-sm text-base-100 shadow-2xl backdrop-blur">
                  <p className="text-base font-semibold text-base-100">Route notes</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-base-100/80">
                    {waterfrontDiscoveryRoute.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Tabs.Content>
          </div>

          <Tabs.List className="grid grid-cols-3 shrink-0 border-t border-base-300/60 bg-base-200/80">
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

        <MapBottomNavigation activeId="map" />
      </main>
    </MobileShell>
  );
}
