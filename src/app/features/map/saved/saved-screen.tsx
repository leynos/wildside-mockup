/** @file Saved walk detail screen with MapLibre map and tabbed layout. */

import * as Dialog from "@radix-ui/react-dialog";
import type { TabsContentProps } from "@radix-ui/react-tabs";
import * as Tabs from "@radix-ui/react-tabs";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, type ReactNode, useState } from "react";

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

type RouteSummaryMetaProps = {
  readonly iconToken: string;
  readonly children: ReactNode;
};

function RouteSummaryMeta({ iconToken, children }: RouteSummaryMetaProps): JSX.Element {
  return (
    <span className="route-summary__meta">
      <Icon token={iconToken} className="text-accent" aria-hidden />
      {children}
    </span>
  );
}

type MapOverlayProps = TabsContentProps;

function MapOverlay({ className, ...props }: MapOverlayProps): JSX.Element {
  const composedClassName = className ? `map-overlay ${className}` : "map-overlay";
  return <Tabs.Content {...props} className={composedClassName} />;
}

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
      <main className="map-shell__main">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="map-shell__pane">
          <div className="map-shell__viewport">
            <MapOverlay value="map" forceMount>
              <MapViewport
                map={<WildsideMap />}
                gradientClassName="bg-gradient-to-t from-base-900/80 via-base-900/30 to-transparent"
              >
                <div className="flex flex-col justify-between px-6 pb-6 pt-8">
                  <div className="flex items-center justify-between text-base-100">
                    <button
                      type="button"
                      aria-label="Back"
                      className="circle-action-button"
                      onClick={() => navigate({ to: "/map/quick" })}
                    >
                      <Icon token="{icon.navigation.back}" aria-hidden className="h-5 w-5" />
                    </button>
                    <Dialog.Root open={shareOpen} onOpenChange={setShareOpen}>
                      <Dialog.Trigger asChild>
                        <button type="button" aria-label="Share" className="circle-action-button">
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
                          <div className="route-share__preview">
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
                      <RouteSummaryMeta iconToken="{icon.object.route}">
                        {savedRoute.distance}
                      </RouteSummaryMeta>
                      <RouteSummaryMeta iconToken="{icon.object.duration}">
                        {savedRoute.duration}
                      </RouteSummaryMeta>
                      <RouteSummaryMeta iconToken="{icon.object.stops}">
                        {savedRoute.stopsCount} stops
                      </RouteSummaryMeta>
                    </div>
                  </div>
                </div>
              </MapViewport>
            </MapOverlay>

            <MapOverlay value="stops">
              <div className="pointer-events-none px-6 pb-6">
                <div className="map-panel map-panel--stacked max-h-[60vh]">
                  <div className="map-panel__handle">
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
                  <div className="map-overlay__fade map-overlay__fade--top" aria-hidden="true" />
                  <div className="map-overlay__fade map-overlay__fade--bottom" aria-hidden="true" />
                </div>
              </div>
            </MapOverlay>

            <MapOverlay value="notes">
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
                      <span key={highlight} className="route-highlight">
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
            </MapOverlay>
          </div>

          <Tabs.List className="map-panel__tablist">
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
