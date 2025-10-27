/** @file Quick map generator flow adapting the mockup controls. */

import * as Slider from "@radix-ui/react-slider";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { FontAwesomeIcon } from "../../../components/font-awesome-icon";
import { MapBottomNavigation } from "../../../components/map-bottom-navigation";
import { MapViewport } from "../../../components/map-viewport";
import { defaultSelectedInterests, discoverInterests } from "../../../data/discover";
import { quickWalkConfig } from "../../../data/map";
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

export function QuickWalkScreen(): JSX.Element {
  const [duration, setDuration] = useState<number>(quickWalkConfig.defaultDuration);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    ...defaultSelectedInterests,
  ]);
  const navigate = useNavigate();

  const selectedLabel = useMemo(
    () => `${selectedInterests.length} selected`,
    [selectedInterests.length],
  );

  return (
    <MobileShell
      tone="dark"
      background={
        <MapViewport
          backgroundImageUrl={quickWalkConfig.backgroundImageUrl}
          backgroundAlt={quickWalkConfig.backgroundAlt}
          gradientClassName="bg-gradient-to-t from-base-900/80 via-base-900/20 to-transparent"
        >
          <div className="absolute inset-x-6 bottom-32">
            <div className="rounded-3xl border border-base-300/40 bg-base-200/80 p-6 shadow-2xl backdrop-blur">
              <header className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-base-content">Quick Walk Generator</h1>
                  <p className="text-sm text-base-content/70">
                    Dial in duration and interests to refresh suggestions.
                  </p>
                </div>
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-base-900 shadow-lg shadow-accent/40 transition hover:scale-105"
                  aria-label="Generate a new walk"
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
                  <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-base-100 bg-accent shadow-lg shadow-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70" />
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
                  <span className="text-xs font-medium text-base-content/60">{selectedLabel}</span>
                </div>
                <InterestChips selected={selectedInterests} onChange={setSelectedInterests} />
              </section>
            </div>
          </div>
        </MapViewport>
      }
    >
      <div className="pointer-events-none absolute bottom-28 right-6 z-30">
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
    </MobileShell>
  );
}
