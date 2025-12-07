/** @file Saved walk detail screen with MapLibre map and tabbed layout. */

import * as Dialog from "@radix-ui/react-dialog";
import type { TabsContentProps } from "@radix-ui/react-tabs";
import * as Tabs from "@radix-ui/react-tabs";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, type ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../../components/icon";
import { MapBottomNavigation } from "../../../components/map-bottom-navigation";
import { MapViewport } from "../../../components/map-viewport";
import { PointOfInterestList } from "../../../components/point-of-interest-list";
import { WildsideMap } from "../../../components/wildside-map";
import { savedRoutes } from "../../../data/map";
import { buildDifficultyLookup } from "../../../data/registries/difficulties";
import { getTagDescriptor } from "../../../data/registries/tags";
import { pickLocalization } from "../../../domain/entities/localization";
import { MobileShell } from "../../../layout/mobile-shell";
import { formatRelativeTime } from "../../../lib/relative-time";
import { formatDistance, formatDuration, formatStops } from "../../../units/unit-format";
import { useUnitPreferences } from "../../../units/unit-preferences-provider";

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
  const { t, i18n } = useTranslation();
  const { unitSystem } = useUnitPreferences();
  const [isFavourite, setIsFavourite] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("map");
  const numberFormatter = useMemo(() => new Intl.NumberFormat(i18n.language), [i18n.language]);
  const ratingFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    [i18n.language],
  );
  const difficultyLookup = useMemo(() => buildDifficultyLookup(t), [t]);
  const unitOptions = useMemo(
    () => ({ t, locale: i18n.language, unitSystem }),
    [i18n.language, t, unitSystem],
  );

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

  const routeCopy = pickLocalization(savedRoute.localizations, i18n.language);
  const difficultyLabel =
    difficultyLookup.get(savedRoute.difficultyId)?.label ?? savedRoute.difficultyId;
  const updatedLabel = formatRelativeTime(savedRoute.lastUpdatedAt, i18n.language);

  const distance = formatDistance(savedRoute.distanceMetres, unitOptions);
  const duration = formatDuration(savedRoute.durationSeconds, {
    ...unitOptions,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const stops = formatStops(savedRoute.stopsCount, {
    ...unitOptions,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

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
                    <h1 className="text-2xl font-semibold">{routeCopy.name}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-base-content/70">
                      <RouteSummaryMeta iconToken="{icon.object.route}">
                        {t("saved-route-distance-value", {
                          value: distance.value,
                          unit: distance.unitLabel,
                          defaultValue: `${distance.value} ${distance.unitLabel}`,
                        })}
                      </RouteSummaryMeta>
                      <RouteSummaryMeta iconToken="{icon.object.duration}">
                        {t("saved-route-duration-value", {
                          value: duration.value,
                          unit: duration.unitLabel,
                          defaultValue: `${duration.value} ${duration.unitLabel}`,
                        })}
                      </RouteSummaryMeta>
                      <RouteSummaryMeta iconToken="{icon.object.stops}">
                        {t("saved-route-stops-value", {
                          value: stops.value,
                          unit: stops.unitLabel,
                          defaultValue: `${stops.value} ${stops.unitLabel}`,
                        })}
                      </RouteSummaryMeta>
                    </div>
                  </div>
                </div>
              </MapViewport>
            </MapOverlay>

            <MapOverlay value="stops" forceMount>
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
                  <div className="map-panel__body">
                    <PointOfInterestList points={savedRoute.pointsOfInterest} />
                  </div>
                  <div className="map-overlay__fade map-overlay__fade--top" aria-hidden="true" />
                  <div className="map-overlay__fade map-overlay__fade--bottom" aria-hidden="true" />
                </div>
              </div>
            </MapOverlay>

            <MapOverlay value="notes" forceMount>
              <div className="pointer-events-none px-6 pb-6">
                <div className="map-panel map-panel--scroll map-panel__notes map-panel__notes--spacious">
                  <div className="grid grid-cols-4 gap-4 text-base-content">
                    <Metric label="Rating" value={ratingFormatter.format(savedRoute.rating)} />
                    <Metric label="Saves" value={numberFormatter.format(savedRoute.saves)} />
                    <Metric label="Difficulty" value={difficultyLabel} />
                    <Metric label="Updated" value={updatedLabel} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {savedRoute.highlightTagIds.map((tagId) => {
                      const tag = getTagDescriptor(tagId, i18n.language);
                      const label = tag?.localization.name ?? tagId;
                      return (
                        <span key={tagId} className="route-highlight">
                          {label}
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-base-content/80">{routeCopy.description}</p>
                  <ul className="route-note-list" aria-label="Route notes">
                    {savedRoute.notes.map((note) => {
                      const noteCopy = pickLocalization(note.localizations, i18n.language);
                      return <li key={note.id}>{noteCopy.name}</li>;
                    })}
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

        <div className="map-fab-layer">
          <button
            type="button"
            className={`pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border border-base-300/60 text-base-100 shadow-xl transition ${
              isFavourite ? "bg-accent text-base-900" : "bg-base-900/80"
            }`}
            aria-label={isFavourite ? "Remove saved walk" : "Save this walk"}
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
