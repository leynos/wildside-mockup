/** @file Quick map generator flow with interactive MapLibre canvas and tabs. */

import * as Slider from "@radix-ui/react-slider";
import * as Tabs from "@radix-ui/react-tabs";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { FontAwesomeIcon } from "../../../components/font-awesome-icon";
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
}: { selected: string[]; onChange: (next: string[]) => void }) {
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
        const iconClass = `${interest.icon} ${interest.iconColorClass}`;
        return (
          <ToggleGroup.Item
            key={id}
            value={id}
            className="flex items-center gap-2 rounded-full border border-base-300/60 bg-base-200/50 px-4 py-2 text-sm font-medium text-base-content/70 transition data-[state=on]:bg-accent data-[state=on]:text-base-100"
          >
            <FontAwesomeIcon name={iconClass} />
            {interest.label}
          </ToggleGroup.Item>
        );
      })}
    </ToggleGroup.Root>
  );
}

const tabTriggerClass =
  "py-3 text-sm font-semibold text-base-content/70 data-[state=active]:text-accent";

export function QuickWalkScreen(): JSX.Element {
  const [duration, setDuration] = useState<number>(quickWalkConfig.defaultDuration);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    ...defaultSelectedInterests,
  ]);
  const location = useLocation();
  const initialTab = location.hash?.slice(1) || "map";
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();

  const selectedLabel = useMemo(
    () => `${selectedInterests.length} selected`,
    [selectedInterests.length],
  );

  useEffect(() => {
    const next = location.hash?.slice(1) || "map";
    setActiveTab((current) => (current === next ? current : next));
  }, [location.hash]);

  return (
    <MobileShell tone="dark">
      <main className="relative flex h-full flex-col">
        <Tabs.Root
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            navigate({
              to: ".",
              hash: value === "map" ? undefined : value,
            });
          }}
          className="flex h-full flex-col"
        >
          <div className="relative flex-1 overflow-hidden">
            <Tabs.Content
              value="map"
              forceMount
              className="absolute inset-0 flex flex-col data-[state=inactive]:hidden"
            >
              <MapViewport
                map={<WildsideMap />}
                gradientClassName="bg-gradient-to-t from-base-900/80 via-base-900/30 to-transparent"
              >
                <div className="mt-auto px-6 pb-6">
                  <div className="rounded-3xl border border-base-300/40 bg-base-200/80 p-6 shadow-2xl backdrop-blur">
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
                        <FontAwesomeIcon name="fa-solid fa-wand-magic-sparkles" />
                      </button>
                    </header>

                    <section className="mb-6">
                      <div className="mb-3 flex items-center justify-between text-base-content">
                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                          <FontAwesomeIcon name="fa-regular fa-clock" className="text-accent" />
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
                          <FontAwesomeIcon name="fa-solid fa-heart" className="text-accent" />
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
              </MapViewport>
            </Tabs.Content>

            <Tabs.Content
              value="stops"
              forceMount
              className="absolute inset-0 flex flex-col data-[state=inactive]:hidden"
            >
              <MapViewport
                map={<WildsideMap />}
                gradientClassName="bg-gradient-to-t from-base-900/80 via-base-900/20 to-transparent"
              >
                <div className="mt-auto px-6 pb-6">
                  <div className="max-h-[60vh] overflow-y-auto rounded-3xl border border-base-300/60 bg-base-900/70 p-4 text-base-100 shadow-2xl backdrop-blur">
                    <PointOfInterestList points={waterfrontDiscoveryRoute.pointsOfInterest} />
                  </div>
                </div>
              </MapViewport>
            </Tabs.Content>

            <Tabs.Content
              value="notes"
              forceMount
              className="absolute inset-0 flex flex-col data-[state=inactive]:hidden"
            >
              <MapViewport
                map={<WildsideMap />}
                gradientClassName="bg-gradient-to-t from-base-900/80 via-base-900/20 to-transparent"
              >
                <div className="mt-auto px-6 pb-6">
                  <div className="max-h-[50vh] overflow-y-auto rounded-3xl border border-base-300/60 bg-base-900/70 p-6 text-sm text-base-100 shadow-2xl backdrop-blur">
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
              </MapViewport>
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

        <div className="pointer-events-none absolute bottom-[116px] right-6 z-30">
          <button
            type="button"
            className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-base-900 shadow-xl shadow-accent/40 transition hover:scale-105"
            aria-label="Save quick walk"
            onClick={() => navigate({ to: "/saved" })}
          >
            <FontAwesomeIcon name="fa-solid fa-bookmark" />
          </button>
        </div>
        <MapBottomNavigation activeId="map" />
      </main>
    </MobileShell>
  );
}
