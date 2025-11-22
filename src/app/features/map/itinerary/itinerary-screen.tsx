/** @file Map itinerary route with MapLibre canvas, tabs, and POI details. */

import * as Dialog from "@radix-ui/react-dialog";
import type { TabsContentProps } from "@radix-ui/react-tabs";
import * as Tabs from "@radix-ui/react-tabs";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../../components/icon";
import { MapBottomNavigation } from "../../../components/map-bottom-navigation";
import { MapViewport } from "../../../components/map-viewport";
import { PointOfInterestList } from "../../../components/point-of-interest-list";
import { WildsideMap } from "../../../components/wildside-map";
import { waterfrontDiscoveryRoute } from "../../../data/map";
import { MobileShell } from "../../../layout/mobile-shell";
import { formatDistance, formatDuration, formatStops } from "../../../units/unit-format";
import { useUnitPreferences } from "../../../units/unit-preferences-provider";

const tabTriggerClass =
  "py-3 text-sm font-semibold text-base-content/70 data-[state=active]:text-accent";

const stickyHandleClass = "mx-auto block h-2 w-12 rounded-full bg-base-300/70";

type MapOverlayProps = TabsContentProps;

function MapOverlay({ className, ...props }: MapOverlayProps): JSX.Element {
  const composedClassName = className ? `map-overlay ${className}` : "map-overlay";
  return <Tabs.Content {...props} className={composedClassName} />;
}

type MapRouteStatProps = {
  readonly label: string;
  readonly value: string | number;
};

function MapRouteStat({ label, value }: MapRouteStatProps): JSX.Element {
  return (
    <span className="map-route__stat">
      <p className="map-route__stat-value">{value}</p>
      {label}
    </span>
  );
}

export function ItineraryScreen(): JSX.Element {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { unitSystem } = useUnitPreferences();
  const unitOptions = useMemo(
    () => ({ t, locale: i18n.language, unitSystem }),
    [i18n.language, t, unitSystem],
  );
  const distance = formatDistance(waterfrontDiscoveryRoute.distanceMetres, unitOptions);
  const duration = formatDuration(waterfrontDiscoveryRoute.durationSeconds, {
    ...unitOptions,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const stops = formatStops(waterfrontDiscoveryRoute.stopsCount, {
    ...unitOptions,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const distanceLabel = t("map-itinerary-distance-label", { defaultValue: "Distance" });
  const durationLabel = t("map-itinerary-duration-label", { defaultValue: "Walking" });
  const stopsLabel = t("map-itinerary-stops-label", { defaultValue: "Stops" });
  const [isFavourite, setIsFavourite] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("map");

  return (
    <MobileShell tone="dark">
      <main className="map-shell__main">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="map-shell__pane">
          <div className="map-shell__viewport">
            <MapOverlay value="map" forceMount>
              <MapViewport
                map={<WildsideMap />}
                gradientClassName="bg-gradient-to-t from-base-900/85 via-base-900/40 to-transparent"
              >
                <div className="flex flex-col justify-between px-6 pb-6 pt-12">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="circle-action-button--ghost"
                      aria-label="Back"
                      onClick={() => navigate({ to: "/map/quick" })}
                    >
                      <Icon token="{icon.navigation.back}" aria-hidden className="h-5 w-5" />
                    </button>
                    <div className="map-route__meta">
                      <div className="flex items-center gap-4">
                        <MapRouteStat
                          label={distanceLabel}
                          value={`${distance.value} ${distance.unitLabel}`}
                        />
                        <MapRouteStat
                          label={durationLabel}
                          value={`${duration.value} ${duration.unitLabel}`}
                        />
                        <MapRouteStat
                          label={stopsLabel}
                          value={`${stops.value} ${stops.unitLabel}`}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="circle-action-button--ghost"
                      aria-label="Locate"
                    >
                      <Icon token="{icon.object.locationArrow}" aria-hidden className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="map-route__summary">
                      <p className="text-sm font-medium text-base-content/60">Suggested route</p>
                      <h1 className="mt-1 text-2xl font-semibold text-base-content">
                        {waterfrontDiscoveryRoute.title}
                      </h1>
                      <p className="mt-3 text-sm text-base-content/70">
                        {waterfrontDiscoveryRoute.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {waterfrontDiscoveryRoute.highlights.map((highlight) => (
                          <span key={highlight} className="route-highlight">
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
                        aria-label={isFavourite ? "Remove saved itinerary" : "Save this itinerary"}
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
                          <button type="button" className="route-share__trigger">
                            <Icon token="{icon.action.share}" aria-hidden />
                            Share
                          </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                          <Dialog.Overlay className="fixed inset-0 bg-black/60" />
                          <Dialog.Content className="dialog-surface">
                            <Dialog.Title className="text-lg font-semibold text-base-content">
                              Share this walk
                            </Dialog.Title>
                            <Dialog.Description className="text-sm text-base-content/70">
                              Copy the preview link or send it to friends once real sharing is wired
                              up.
                            </Dialog.Description>
                            <div className="route-share__preview">
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
            </MapOverlay>

            <MapOverlay value="stops" forceMount>
              <div className="pointer-events-none px-6 pb-6">
                <div className="map-panel map-panel--stacked max-h-[60vh]">
                  <div className="map-panel__handle bg-transparent">
                    <button
                      type="button"
                      className={stickyHandleClass}
                      aria-label="Dismiss panel"
                      onClick={() => setActiveTab("map")}
                    />
                  </div>
                  <div className="map-panel__body">
                    <PointOfInterestList points={waterfrontDiscoveryRoute.pointsOfInterest} />
                  </div>
                  <div className="map-overlay__fade map-overlay__fade--top" aria-hidden="true" />
                  <div className="map-overlay__fade map-overlay__fade--bottom" aria-hidden="true" />
                </div>
              </div>
            </MapOverlay>

            <MapOverlay value="notes" forceMount>
              <div className="pointer-events-none px-6 pb-6">
                <div className="map-panel map-panel--scroll map-panel__notes">
                  <p className="text-base font-semibold text-base-content">Route notes</p>
                  <ul className="mt-3 route-note-list" aria-label="Route notes">
                    {waterfrontDiscoveryRoute.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </MapOverlay>
          </div>

          <Tabs.List className="map-panel__tablist">
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
