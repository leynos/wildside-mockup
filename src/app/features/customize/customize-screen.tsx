/** @file Route customiser translating slider-heavy mockups to Radix UI. */

import * as Slider from "@radix-ui/react-slider";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";
import { useMemo, useState } from "react";

import { AppBottomNavigation } from "../../components/app-bottom-navigation";
import { Icon } from "../../components/icon";
import { PreferenceToggleCard } from "../../components/preference-toggle-card";
import { SliderControl } from "../../components/slider-control";
import type { SegmentOption } from "../../data/customize";
import {
  advancedOptions,
  bottomNavigation,
  crowdLevelOptions,
  elevationOptions,
  formatSliderValue,
  interestMix,
  routePreviews,
  sliders,
  surfaceOptions,
} from "../../data/customize";
import { AppHeader } from "../../layout/app-header";
import { MobileShell } from "../../layout/mobile-shell";
import { CustomizeSegmentToggle } from "./segment-toggle-card";

function SectionTitle({
  iconToken,
  label,
  iconClassName = "text-accent",
}: {
  iconToken: string;
  label: string;
  iconClassName?: string;
}): JSX.Element {
  return (
    <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-base-content">
      <Icon token={iconToken} className={iconClassName} aria-hidden />
      {label}
    </h2>
  );
}

interface SegmentPickerProps {
  id: string;
  label: string;
  iconToken: string;
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
}

function SegmentPicker({
  iconToken,
  id,
  label,
  onChange,
  options,
  value,
}: SegmentPickerProps): JSX.Element {
  return (
    <section className="mb-8" data-segment-id={id}>
      <SectionTitle iconToken={iconToken} label={label} />
      <ToggleGroup.Root
        type="single"
        value={value}
        onValueChange={(next) => next && onChange(next)}
        aria-label={label}
        className="grid grid-cols-3 gap-3"
      >
        {options.map((option) => (
          <CustomizeSegmentToggle
            key={option.id}
            value={option.id}
            label={option.label}
            description={option.description}
          />
        ))}
      </ToggleGroup.Root>
    </section>
  );
}

interface SurfacePickerProps {
  value: string;
  onChange: (value: string) => void;
}

function SurfacePicker({ onChange, value }: SurfacePickerProps): JSX.Element {
  return (
    <section className="mb-8">
      <SectionTitle iconToken="{icon.category.paved}" label="Surface Type" />
      <ToggleGroup.Root
        type="single"
        value={value}
        onValueChange={(next) => next && onChange(next)}
        aria-label="Surface type"
        className="grid grid-cols-2 gap-3"
      >
        {surfaceOptions.map((surface) => (
          <ToggleGroup.Item
            key={surface.id}
            value={surface.id}
            className="customize-surface__option"
          >
            <Icon token={surface.iconToken} className="text-base" aria-hidden />
            {surface.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </section>
  );
}

interface InterestMixProps {
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
}

function InterestMix({ onChange, values }: InterestMixProps): JSX.Element {
  return (
    <section className="mb-8">
      <SectionTitle iconToken="{icon.action.like}" label="Interest Mix" />
      <div className="space-y-6">
        {interestMix.map((slice) => {
          const value = values[slice.id] ?? slice.allocation;
          return (
            <div key={slice.id}>
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-base-content">
                  <Icon token={slice.iconToken} className={slice.iconColorClass} aria-hidden />
                  {slice.label}
                </span>
                <span className="text-sm font-semibold text-accent">{value}%</span>
              </div>
              <Slider.Root
                value={[value]}
                min={0}
                max={100}
                step={5}
                onValueChange={(next) => onChange(slice.id, next[0] ?? value)}
                className="relative flex h-5 w-full items-center"
              >
                <Slider.Track className="relative h-2 w-full overflow-hidden rounded-full bg-base-300/60">
                  <Slider.Range className="absolute h-full rounded-full bg-accent" />
                </Slider.Track>
                <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-base-100 bg-accent shadow shadow-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50" />
              </Slider.Root>
            </div>
          );
        })}
      </div>
    </section>
  );
}

interface RoutePreviewProps {
  selected: string;
  onSelect: (id: string) => void;
}

function RoutePreview({ onSelect, selected }: RoutePreviewProps): JSX.Element {
  return (
    <section className="mb-8">
      <SectionTitle iconToken="{icon.action.preview}" label="Route Preview" />
      <div className="grid grid-cols-3 gap-3">
        {routePreviews.map((route) => {
          const isActive = route.id === selected;
          return (
            <button
              key={route.id}
              type="button"
              onClick={() => onSelect(route.id)}
              className={`rounded-lg border px-3 py-3 text-left text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                isActive
                  ? "border-accent bg-accent/15 text-base-content"
                  : "border-base-300/70 bg-base-200/60 text-base-content/80"
              }`}
              aria-pressed={isActive}
            >
              <div
                className={`mb-2 flex h-16 items-center justify-center rounded bg-gradient-to-br ${route.gradientClass}`}
              >
                <Icon
                  token="{icon.object.route}"
                  className={`text-xl ${route.iconColorClass}`}
                  aria-hidden
                />
              </div>
              <p className="font-semibold">{route.title}</p>
              <p className="text-[11px] text-base-content/60">
                {route.distance} • {route.duration}
              </p>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="btn btn-ghost btn-sm flex-1 rounded-xl border border-base-300/70 bg-base-200/60 text-base-content"
        >
          <Icon token="{icon.action.regenerate}" aria-hidden className="mr-2 h-4 w-4" />
          Regenerate
        </button>
        <button
          type="button"
          className="btn btn-accent btn-sm flex-1 rounded-xl text-base font-semibold"
        >
          <Icon token="{icon.action.play}" aria-hidden className="mr-2 h-4 w-4" />
          Start Route
        </button>
      </div>
    </section>
  );
}

interface AdvancedOptionsProps {
  values: Record<string, boolean>;
  onToggle: (id: string, value: boolean) => void;
}

function AdvancedOptions({ onToggle, values }: AdvancedOptionsProps): JSX.Element {
  return (
    <section className="mb-8">
      <SectionTitle iconToken="{icon.action.settings}" label="Advanced Options" />
      <div className="space-y-3">
        {advancedOptions.map((option) => {
          const checked = values[option.id] ?? option.defaultEnabled;
          return (
            <PreferenceToggleCard
              key={option.id}
              id={`advanced-${option.id}`}
              iconToken={option.iconToken}
              title={option.label}
              description={option.description}
              isChecked={checked}
              onCheckedChange={(next) => onToggle(option.id, next)}
            />
          );
        })}
      </div>
    </section>
  );
}

export function CustomizeScreen(): JSX.Element {
  const sliderInitialValues = useMemo(
    () => Object.fromEntries(sliders.map((slider) => [slider.id, slider.initialValue])),
    [],
  );
  const interestInitialValues = useMemo(
    () => Object.fromEntries(interestMix.map((slice) => [slice.id, slice.allocation])),
    [],
  );
  const advancedInitial = useMemo(
    () => Object.fromEntries(advancedOptions.map((option) => [option.id, option.defaultEnabled])),
    [],
  );

  const [sliderValues, setSliderValues] = useState<Record<string, number>>(sliderInitialValues);
  const [crowdLevel, setCrowdLevel] = useState(crowdLevelOptions[1]?.id ?? "balanced");
  const [elevation, setElevation] = useState(elevationOptions[0]?.id ?? "flat");
  const [surface, setSurface] = useState(
    surfaceOptions.find((option) => option.emphasis)?.id ?? surfaceOptions[0]?.id ?? "paved",
  );
  const [interestValues, setInterestValues] =
    useState<Record<string, number>>(interestInitialValues);
  const [selectedRoute, setSelectedRoute] = useState(routePreviews[0]?.id ?? "route-a");
  const [advancedValues, setAdvancedValues] = useState<Record<string, boolean>>(advancedInitial);

  const navigate = useNavigate();

  return (
    <MobileShell
      tone="dark"
      background={
        <div className="h-full w-full bg-gradient-to-b from-base-300/40 via-transparent to-transparent" />
      }
    >
      <div className="flex h-full flex-col">
        <AppHeader
          title="Customise Route"
          subtitle="Fine-tune your walking adventure"
          leading={
            <button
              type="button"
              aria-label="Back to map"
              className="flex h-full w-full items-center justify-center"
              onClick={() => navigate({ to: "/map/quick" })}
            >
              <Icon token="{icon.navigation.back}" aria-hidden className="h-5 w-5" />
            </button>
          }
          trailing={
            <button
              type="button"
              aria-label="Help"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/60 bg-base-200/60 text-accent shadow-sm shadow-base-300/30 transition hover:border-accent/60 hover:text-accent"
            >
              <Icon token="{icon.action.help}" aria-hidden className="h-5 w-5" />
            </button>
          }
        />
        <main className="flex-1 overflow-y-auto px-6 pb-6 pt-4">
          {sliders.map(({ id, iconToken, iconColorClass, label, markers, max, min, step }) => {
            const currentValue = sliderValues[id] ?? min;
            return (
              <SliderControl
                key={id}
                id={id}
                label={label}
                iconToken={iconToken}
                iconClassName={iconColorClass}
                className="mb-8"
                min={min}
                max={max}
                step={step}
                value={currentValue}
                valueFormatter={(value) => formatSliderValue(id, value)}
                markers={markers}
                ariaLabel={`${label} slider`}
                onValueChange={(value) =>
                  setSliderValues((current) => ({
                    ...current,
                    [id]: value,
                  }))
                }
              />
            );
          })}
          <SegmentPicker
            id="crowd"
            label="Crowd Level"
            iconToken="{icon.object.family}"
            options={crowdLevelOptions}
            value={crowdLevel}
            onChange={setCrowdLevel}
          />
          <SegmentPicker
            id="elevation"
            label="Elevation Preference"
            iconToken="{icon.accessibility.elevation}"
            options={elevationOptions}
            value={elevation}
            onChange={setElevation}
          />
          <SurfacePicker value={surface} onChange={setSurface} />
          <InterestMix
            values={interestValues}
            onChange={(id, value) =>
              setInterestValues((current) => ({
                ...current,
                [id]: Math.min(100, Math.max(0, value)),
              }))
            }
          />
          <RoutePreview selected={selectedRoute} onSelect={setSelectedRoute} />
          <AdvancedOptions
            values={advancedValues}
            onToggle={(id, value) =>
              setAdvancedValues((current) => ({
                ...current,
                [id]: value,
              }))
            }
          />
        </main>
        <AppBottomNavigation
          items={bottomNavigation.map((item) => ({ ...item, isActive: Boolean(item.active) }))}
        />
      </div>
    </MobileShell>
  );
}
