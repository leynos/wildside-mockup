/** @file Route customiser translating slider-heavy mockups to Radix UI. */

import * as Slider from "@radix-ui/react-slider";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppBottomNavigation } from "../../components/app-bottom-navigation";
import { Icon } from "../../components/icon";
import { PreferenceToggleCard } from "../../components/preference-toggle-card";
import { SectionHeading } from "../../components/section-heading";
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
  const { t } = useTranslation();

  const resolvedOptions = options.map((option) => {
    const optionLabel = t(`customize-${id}-option-${option.id}-label`, {
      defaultValue: option.label,
    });
    const optionDescription = t(`customize-${id}-option-${option.id}-description`, {
      defaultValue: option.description,
    });
    return {
      ...option,
      label: optionLabel,
      description: optionDescription,
    };
  });

  return (
    <section className="mb-8" data-segment-id={id}>
      <SectionHeading iconToken={iconToken}>{label}</SectionHeading>
      <ToggleGroup.Root
        type="single"
        value={value}
        onValueChange={(next) => next && onChange(next)}
        aria-label={label}
        className="grid grid-cols-3 gap-3"
      >
        {resolvedOptions.map((option) => (
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
  const { t } = useTranslation();
  const heading = t("customize-surface-heading", { defaultValue: "Surface Type" });
  const ariaLabel = t("customize-surface-aria-label", { defaultValue: "Surface type" });

  return (
    <section className="mb-8">
      <SectionHeading iconToken="{icon.category.paved}">{heading}</SectionHeading>
      <ToggleGroup.Root
        type="single"
        value={value}
        onValueChange={(next) => next && onChange(next)}
        aria-label={ariaLabel}
        className="grid grid-cols-2 gap-3"
      >
        {surfaceOptions.map((surface) => {
          const surfaceLabel = t(`customize-surface-option-${surface.id}-label`, {
            defaultValue: surface.label,
          });
          return (
            <ToggleGroup.Item
              key={surface.id}
              value={surface.id}
              className="customize-surface__option"
            >
              <Icon token={surface.iconToken} className="text-base" aria-hidden />
              {surfaceLabel}
            </ToggleGroup.Item>
          );
        })}
      </ToggleGroup.Root>
    </section>
  );
}

interface InterestMixProps {
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
}

function InterestMix({ onChange, values }: InterestMixProps): JSX.Element {
  const { t } = useTranslation();
  const heading = t("customize-interest-heading", { defaultValue: "Interest Mix" });

  return (
    <section className="mb-8">
      <SectionHeading iconToken="{icon.action.like}">{heading}</SectionHeading>
      <div className="space-y-6">
        {interestMix.map((slice) => {
          const value = values[slice.id] ?? slice.allocation;
          const sliceLabel = t(`customize-interest-${slice.id}-label`, {
            defaultValue: slice.label,
          });
          return (
            <div key={slice.id}>
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-base-content">
                  <Icon token={slice.iconToken} className={slice.iconColorClass} aria-hidden />
                  {sliceLabel}
                </span>
                <span className="text-sm font-semibold text-accent">{value}%</span>
              </div>
              <Slider.Root
                value={[value]}
                min={0}
                max={100}
                step={5}
                onValueChange={(next) => onChange(slice.id, next[0] ?? value)}
                className="interest-mix__slider"
              >
                <Slider.Track className="interest-mix__track">
                  <Slider.Range className="interest-mix__range" />
                </Slider.Track>
                <Slider.Thumb
                  className="interest-mix__thumb"
                  aria-label={t("customize-interest-thumb-aria", {
                    label: sliceLabel,
                    defaultValue: `${sliceLabel} allocation`,
                  })}
                />
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
  const { t } = useTranslation();
  const heading = t("customize-route-preview-heading", { defaultValue: "Route Preview" });
  const regenerateLabel = t("customize-route-preview-regenerate", { defaultValue: "Regenerate" });
  const startLabel = t("customize-route-preview-start", { defaultValue: "Start Route" });

  return (
    <section className="mb-8">
      <SectionHeading iconToken="{icon.action.preview}">{heading}</SectionHeading>
      <div className="grid grid-cols-3 gap-3">
        {routePreviews.map((route) => {
          const isActive = route.id === selected;
          const title = t(`customize-route-preview-${route.id}-title`, {
            defaultValue: route.title,
          });
          return (
            <button
              key={route.id}
              type="button"
              onClick={() => onSelect(route.id)}
              className={`rounded-lg border px-3 py-3 text-start text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
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
              <p className="font-semibold">{title}</p>
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
          <Icon token="{icon.action.regenerate}" aria-hidden className="me-2 h-4 w-4" />
          {regenerateLabel}
        </button>
        <button
          type="button"
          className="btn btn-accent btn-sm flex-1 rounded-xl text-base font-semibold"
        >
          <Icon token="{icon.action.play}" aria-hidden className="me-2 h-4 w-4" />
          {startLabel}
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
  const { t } = useTranslation();
  const heading = t("customize-advanced-heading", { defaultValue: "Advanced Options" });

  return (
    <section className="mb-8">
      <SectionHeading iconToken="{icon.action.settings}">{heading}</SectionHeading>
      <div className="space-y-3">
        {advancedOptions.map((option) => {
          const checked = values[option.id] ?? option.defaultEnabled;
          const title = t(`customize-advanced-${option.id}-title`, {
            defaultValue: option.label,
          });
          const description = t(`customize-advanced-${option.id}-description`, {
            defaultValue: option.description,
          });
          return (
            <PreferenceToggleCard
              key={option.id}
              id={`advanced-${option.id}`}
              iconToken={option.iconToken}
              title={title}
              description={description}
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
  const { t } = useTranslation();
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
  const bottomNavAriaLabel = t("nav-primary-aria-label", { defaultValue: "Primary navigation" });

  const navigate = useNavigate();

  return (
    <MobileShell
      tone="dark"
      background={
        <div className="h-full w-full bg-gradient-to-b from-base-300/40 via-transparent to-transparent" />
      }
    >
      <div className="screen-stack">
        <AppHeader
          title={t("customize-header-title", { defaultValue: "Customise Route" })}
          subtitle={t("customize-header-subtitle", {
            defaultValue: "Fine-tune your walking adventure",
          })}
          leading={
            <button
              type="button"
              aria-label={t("customize-header-back-label", { defaultValue: "Back to map" })}
              className="header-nav-button"
              onClick={() => navigate({ to: "/map/quick" })}
            >
              <Icon token="{icon.navigation.back}" aria-hidden className="h-5 w-5" />
            </button>
          }
          trailing={
            <button
              type="button"
              aria-label={t("customize-header-help-label", { defaultValue: "Help" })}
              className="header-icon-button"
            >
              <Icon token="{icon.action.help}" aria-hidden className="h-5 w-5" />
            </button>
          }
        />
        <main className="screen-scroll pb-6 pt-4">
          {sliders.map(({ id, iconToken, iconColorClass, label, markers, max, min, step }) => {
            const currentValue = sliderValues[id] ?? min;
            const sliderLabel = t(`customize-slider-${id}-label`, { defaultValue: label });
            const sliderAriaLabel = t(`customize-slider-${id}-aria`, {
              defaultValue: `${label} slider`,
            });
            const translatedMarkers = markers.map((marker, index) =>
              t(`customize-slider-${id}-marker-${index}`, { defaultValue: marker }),
            );
            return (
              <SliderControl
                key={id}
                id={id}
                label={sliderLabel}
                iconToken={iconToken}
                iconClassName={iconColorClass}
                className="mb-8"
                min={min}
                max={max}
                step={step}
                value={currentValue}
                valueFormatter={(value) => formatSliderValue(id, value)}
                markers={translatedMarkers}
                ariaLabel={sliderAriaLabel}
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
            label={t("customize-crowd-heading", { defaultValue: "Crowd Level" })}
            iconToken="{icon.object.family}"
            options={crowdLevelOptions}
            value={crowdLevel}
            onChange={setCrowdLevel}
          />
          <SegmentPicker
            id="elevation"
            label={t("customize-elevation-heading", { defaultValue: "Elevation Preference" })}
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
          aria-label={bottomNavAriaLabel}
          items={bottomNavigation.map((item) => ({
            ...item,
            label: t(`nav-${item.id}-label`, { defaultValue: item.label }),
            isActive: Boolean(item.active),
          }))}
        />
      </div>
    </MobileShell>
  );
}
