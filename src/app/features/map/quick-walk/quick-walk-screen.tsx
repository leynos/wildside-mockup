/** @file Quick map generator flow with interactive MapLibre canvas and tabs. */

import * as Slider from "@radix-ui/react-slider";
import * as Tabs from "@radix-ui/react-tabs";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { Icon } from "../../../components/icon";
import { MapBottomNavigation } from "../../../components/map-bottom-navigation";
import { MapViewport } from "../../../components/map-viewport";
import { PointOfInterestList } from "../../../components/point-of-interest-list";
import { WildsideMap } from "../../../components/wildside-map";
import { defaultSelectedInterests, discoverInterests } from "../../../data/discover";
import { quickWalkConfig, waterfrontDiscoveryRoute } from "../../../data/map";
import { MobileShell } from "../../../layout/mobile-shell";

const interestLookup = new Map(discoverInterests.map((interest) => [interest.id, interest]));

function formatDuration(value: number) {
  return `${value} min`;
}

function InterestChips({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <ToggleGroup.Root
      type="multiple"
      value={selected}
      onValueChange={onChange}
      aria-label="Select quick walk interests"
      className="flex flex-wrap gap-2"
    >
      {quickWalkConfig.interestIds.map((id) => {
        const interest = interestLookup.get(id);
        if (!interest) return null;
        return (
          <ToggleGroup.Item
            key={id}
            value={id}
            className="group flex items-center gap-2 rounded-full border border-base-300/60 bg-base-200/50 px-4 py-2 text-sm font-medium text-base-content/70 transition data-[state=on]:bg-accent data-[state=on]:text-base-100"
          >
            <Icon
              token={interest.iconToken}
              className={`text-lg transition ${interest.iconColorClass} group-data-[state=on]:text-base-content`}
              aria-hidden
            />
            {interest.label}
          </ToggleGroup.Item>
        );
      })}
    </ToggleGroup.Root>
  );
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
    navigate({ to: ".", hash: undefined });
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
      <main className="relative flex flex-1 min-h-0 flex-col overflow-hidden">
        <Tabs.Root
          value={activeTab}
          onValueChange={(value) => {
            const nextTab = value as TabKey;
            setActiveTab(nextTab);
            navigate({
              to: ".",
              hash: nextTab === "map" ? undefined : nextTab,
            });
          }}
          className="flex flex-1 min-h-0 flex-col justify-end overflow-hidden"
        >
          <div className="relative flex flex-1 min-h-0 flex-col justify-end overflow-hidden">
            <MapViewport
              map={<WildsideMap />}
              gradientClassName="bg-gradient-to-t from-base-900/80 via-base-900/30 to-transparent"
              containerTestId="quick-walk-map-container"
            >
              <Tabs.Content
                value="map"
                forceMount
                className="flex flex-1 min-h-0 flex-col justify-end data-[state=inactive]:hidden"
              >
                <div className="pointer-events-none px-6 pb-6">
                  <div className="pointer-events-auto rounded-3xl border border-base-300/40 bg-base-200/80 p-6 shadow-2xl backdrop-blur">
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

                    <section className="mb-6">
                      <div className="mb-3 flex items-center justify-between text-base-content">
                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                          <Icon
                            token="{icon.object.duration}"
                            className="text-accent"
                            aria-hidden
                          />
                          Duration
                        </h2>
                        <span className="text-sm font-semibold">{formatDuration(duration)}</span>
                      </div>
                      <Slider.Root
                        value={[duration]}
                        min={quickWalkConfig.durationRange.min}
                        max={quickWalkConfig.durationRange.max}
                        step={quickWalkConfig.durationRange.step}
                        onValueChange={(value) => setDuration(value[0] ?? duration)}
                        aria-label="Walk duration"
                        className="relative flex h-6 items-center"
                      >
                        <Slider.Track className="relative h-2 flex-1 rounded-full bg-base-300/60">
                          <Slider.Range className="absolute h-full rounded-full bg-accent" />
                        </Slider.Track>
                        <Slider.Thumb
                          aria-label="Adjust walk duration"
                          className="block h-5 w-5 rounded-full border-2 border-base-100 bg-accent shadow-lg shadow-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                        />
                      </Slider.Root>
                      <div className="mt-2 flex justify-between text-xs text-base-content/50">
                        <span>{quickWalkConfig.durationRange.min}m</span>
                        <span>90m</span>
                        <span>{quickWalkConfig.durationRange.max}m</span>
                      </div>
                    </section>

                    <section>
                      <div className="mb-3 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-base-content">
                          <Icon token="{icon.action.like}" className="text-accent" aria-hidden />
                          Interests
                        </h2>
                        <span className="text-xs font-medium text-base-content/60">
                          {selectedLabel}
                        </span>
                      </div>
                      <InterestChips selected={selectedInterests} onChange={setSelectedInterests} />
                    </section>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content
                value="stops"
                forceMount
                className="flex flex-1 min-h-0 flex-col justify-end data-[state=inactive]:hidden"
              >
                <div className="pointer-events-none px-6 pb-6">
                  <div
                    className="pointer-events-auto relative flex max-h-[53vh] flex-col overflow-hidden rounded-3xl border border-base-300/60 bg-base-900/70 text-base-100 shadow-2xl backdrop-blur"
                    data-testid="quick-walk-stops-panel"
                  >
                    <div className="flex justify-center bg-base-900/70 pb-3 pt-3">
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

              <Tabs.Content
                value="notes"
                forceMount
                className="flex flex-1 min-h-0 flex-col justify-end data-[state=inactive]:hidden"
              >
                <div className="pointer-events-none px-6 pb-6">
                  <div
                    className="pointer-events-auto max-h-[53vh] overflow-y-auto rounded-3xl border border-base-300/60 bg-base-900/70 p-6 text-sm text-base-100 shadow-2xl backdrop-blur"
                    data-testid="quick-walk-notes-panel"
                  >
                    <button
                      type="button"
                      onClick={handleDismissPanels}
                      className={panelHandleClass}
                      aria-label="Dismiss panel"
                    />
                    <p className="text-base font-semibold text-base-100/90">Planning notes</p>
                    <ul className="mt-3 list-disc space-y-2 pl-5">
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
