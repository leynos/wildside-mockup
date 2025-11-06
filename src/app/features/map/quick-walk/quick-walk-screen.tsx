/** @file Quick map generator flow with interactive MapLibre canvas and tabs. */

import * as Tabs from "@radix-ui/react-tabs";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { type JSX, useEffect, useMemo, useState } from "react";

import { Icon } from "../../../components/icon";
import { InterestToggleGroup } from "../../../components/interest-toggle-group";
import { MapBottomNavigation } from "../../../components/map-bottom-navigation";
import { MapViewport } from "../../../components/map-viewport";
import { PointOfInterestList } from "../../../components/point-of-interest-list";
import { SliderControl } from "../../../components/slider-control";
import { WildsideMap } from "../../../components/wildside-map";
import { defaultSelectedInterests } from "../../../data/discover";
import { quickWalkConfig, waterfrontDiscoveryRoute } from "../../../data/map";
import { MobileShell } from "../../../layout/mobile-shell";

function formatDuration(value: number) {
  return `${value} min`;
}

type TabKey = "map" | "stops" | "notes";

const tabTriggerClass =
  "py-3 text-sm font-semibold text-base-content/70 data-[state=active]:text-accent";

const panelHandleClass = "mx-auto mb-4 block h-2 w-12 rounded-full bg-base-300/70";

export function QuickWalkScreen(): JSX.Element {
  const [duration, setDuration] = useState<number>(quickWalkConfig.defaultDuration);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    ...defaultSelectedInterests,
  ]);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    if (typeof window === "undefined") {
      return "map";
    }
    return getHashTab(window.location.hash) ?? "map";
  });
  const navigate = useNavigate();

  const handleDismissPanels = () => {
    setActiveTab("map");
    navigate({ to: "." });
  };

  const selectedLabel = useMemo(
    () => `${selectedInterests.length} selected`,
    [selectedInterests.length],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const handleHashChange = () => setActiveTab(getHashTab(window.location.hash) ?? "map");
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    setActiveTab((current) => {
      const next = getHashTab(location.hash) ?? "map";
      return current === next ? current : next;
    });
  }, [location.hash]);

  return (
    <MobileShell tone="dark">
      <main className="map-shell__main">
        <Tabs.Root
          value={activeTab}
          onValueChange={(value) => {
            const nextTab = value as TabKey;
            setActiveTab(nextTab);
            if (nextTab === "map") {
              navigate({ to: "." });
            } else {
              navigate({ to: ".", hash: nextTab });
            }
          }}
          className="map-shell__pane"
        >
          <div className="map-shell__viewport">
            <MapViewport
              map={<WildsideMap />}
              gradientClassName="bg-gradient-to-t from-base-900/80 via-base-900/30 to-transparent"
              containerTestId="quick-walk-map-container"
            >
              <Tabs.Content value="map" forceMount className="map-viewport__tab">
                <div className="pointer-events-none px-6 pb-6">
                  <div className="quick-walk__panel">
                    <button
                      type="button"
                      onClick={handleDismissPanels}
                      className={panelHandleClass}
                      aria-label="Dismiss panel"
                    />
                    <header className="mb-6 flex items-center justify-between">
                      <div>
                        <h1 className="text-xl font-semibold text-base-content">
                          Quick Walk Generator
                        </h1>
                        <p className="text-sm text-base-content/70">
                          Dial in duration and interests to refresh suggestions.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-base-900 shadow-lg shadow-accent/40 transition hover:scale-105"
                        aria-label="Generate a new walk"
                        onClick={() => navigate({ to: "/wizard/step-1" })}
                      >
                        <Icon token="{icon.object.magic}" aria-hidden className="h-6 w-6" />
                      </button>
                    </header>

                    <SliderControl
                      id="quick-walk-duration"
                      label="Duration"
                      iconToken="{icon.object.duration}"
                      value={duration}
                      min={quickWalkConfig.durationRange.min}
                      max={quickWalkConfig.durationRange.max}
                      step={quickWalkConfig.durationRange.step}
                      valueFormatter={formatDuration}
                      markers={[
                        `${quickWalkConfig.durationRange.min}m`,
                        "90m",
                        `${quickWalkConfig.durationRange.max}m`,
                      ]}
                      ariaLabel="Walk duration"
                      onValueChange={setDuration}
                      className="mb-6"
                    />

                    <section>
                      <div className="mb-3 flex items-center justify-between">
                        <h2 className="section-heading text-base-content">
                          <Icon token="{icon.action.like}" className="text-accent" aria-hidden />
                          Interests
                        </h2>
                        <span className="text-xs font-medium text-base-content/60">
                          {selectedLabel}
                        </span>
                      </div>
                      <InterestToggleGroup
                        interestIds={quickWalkConfig.interestIds}
                        selected={selectedInterests}
                        onChange={setSelectedInterests}
                        ariaLabel="Select quick walk interests"
                      />
                    </section>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="stops" forceMount className="map-viewport__tab">
                <div className="pointer-events-none px-6 pb-6">
                  <div
                    className="map-panel map-panel--stacked max-h-[53vh]"
                    data-testid="quick-walk-stops-panel"
                  >
                    <div className="map-panel__handle bg-transparent">
                      <button
                        type="button"
                        onClick={handleDismissPanels}
                        className={panelHandleClass}
                        aria-label="Dismiss panel"
                      />
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 pb-5">
                      <PointOfInterestList points={waterfrontDiscoveryRoute.pointsOfInterest} />
                    </div>
                    <div className="map-overlay__fade map-overlay__fade--top" aria-hidden="true" />
                    <div
                      className="map-overlay__fade map-overlay__fade--bottom"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="notes" forceMount className="map-viewport__tab">
                <div className="pointer-events-none px-6 pb-6">
                  <div
                    className="map-panel map-panel--scroll max-h-[53vh] p-6 text-sm text-base-content"
                    data-testid="quick-walk-notes-panel"
                  >
                    <button
                      type="button"
                      onClick={handleDismissPanels}
                      className={panelHandleClass}
                      aria-label="Dismiss panel"
                    />
                    <p className="text-base font-semibold text-base-content">Planning notes</p>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-base-content/80">
                      <li>Sync the plan with your calendar to block out discovery time.</li>
                      <li>
                        Pack a reusable bottle – refill points are highlighted along the waterfront.
                      </li>
                      <li>
                        Invite friends and keep pace options flexible for an inclusive stroll.
                      </li>
                    </ul>
                  </div>
                </div>
              </Tabs.Content>
            </MapViewport>
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

        <div className="pointer-events-none absolute bottom-[116px] right-6 z-30">
          <button
            type="button"
            className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-base-900 shadow-xl shadow-accent/40 transition hover:scale-105"
            aria-label="Save quick walk"
            onClick={() => navigate({ to: "/saved" })}
          >
            <Icon token="{icon.action.save}" aria-hidden />
          </button>
        </div>
        <MapBottomNavigation activeId="map" />
      </main>
    </MobileShell>
  );
}

function getHashTab(hash?: string | null): TabKey | null {
  if (!hash || hash.length <= 1) {
    return null;
  }
  const candidate = hash.startsWith("#") ? hash.slice(1) : hash;
  return candidate === "map" || candidate === "stops" || candidate === "notes"
    ? (candidate as TabKey)
    : null;
}
