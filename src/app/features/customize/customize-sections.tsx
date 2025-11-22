/** @file Presentational helpers for the customise route screen. */

import * as Slider from "@radix-ui/react-slider";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import { PreferenceToggleCard } from "../../components/preference-toggle-card";
import { SectionHeading } from "../../components/section-heading";
import {
  type AdvancedToggleOption,
  type InterestMixSlice,
  type RoutePreviewOption,
  type SegmentOption,
  type SurfaceOption,
} from "../../data/customize";
import { CustomizeSegmentToggle } from "./segment-toggle-card";

export interface SegmentPickerProps {
  id: string;
  label: string;
  iconToken: string;
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentPicker({
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

export interface SurfacePickerProps {
  heading: string;
  ariaLabel: string;
  value: string;
  options: SurfaceOption[];
  onChange: (value: string) => void;
}

export function SurfacePicker({ ariaLabel, heading, onChange, options, value }: SurfacePickerProps): JSX.Element {
  const { t } = useTranslation();
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
        {options.map((surface) => (
          <ToggleGroup.Item
            key={surface.id}
            value={surface.id}
            className="customize-surface__option"
          >
            <Icon token={surface.iconToken} className="text-base" aria-hidden />
            {t(`customize-surface-option-${surface.id}-label`, { defaultValue: surface.label })}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </section>
  );
}

export interface InterestMixProps {
  slices: InterestMixSlice[];
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
}

export function InterestMix({ onChange, slices, values }: InterestMixProps): JSX.Element {
  const { t } = useTranslation();
  const heading = t("customize-interest-heading", { defaultValue: "Interest Mix" });

  return (
    <section className="mb-8">
      <SectionHeading iconToken="{icon.action.like}">{heading}</SectionHeading>
      <div className="space-y-6">
        {slices.map((slice) => {
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

export interface RoutePreviewProps {
  routes: RoutePreviewOption[];
  selected: string;
  onSelect: (id: string) => void;
  formatDistanceLabel: (metres: number) => string;
  formatDurationLabel: (seconds: number) => string;
}

export function RoutePreview({
  routes,
  formatDistanceLabel,
  formatDurationLabel,
  onSelect,
  selected,
}: RoutePreviewProps): JSX.Element {
  const { t } = useTranslation();
  const heading = t("customize-route-preview-heading", { defaultValue: "Route Preview" });
  const regenerateLabel = t("customize-route-preview-regenerate", { defaultValue: "Regenerate" });
  const startLabel = t("customize-route-preview-start", { defaultValue: "Start Route" });

  return (
    <section className="mb-8">
      <SectionHeading iconToken="{icon.action.preview}">{heading}</SectionHeading>
      <div className="grid grid-cols-3 gap-3">
        {routes.map((route) => {
          const isActive = route.id === selected;
          const title = t(`customize-route-preview-${route.id}-title`, {
            defaultValue: route.title,
          });
          const distanceLabel = formatDistanceLabel(route.distanceMetres);
          const durationLabel = formatDurationLabel(route.durationSeconds);
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
                {distanceLabel} • {durationLabel}
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

export interface AdvancedOptionsProps {
  options: AdvancedToggleOption[];
  values: Record<string, boolean>;
  onToggle: (id: string, value: boolean) => void;
}

export function AdvancedOptions({ onToggle, options, values }: AdvancedOptionsProps): JSX.Element {
  const { t } = useTranslation();
  const heading = t("customize-advanced-heading", { defaultValue: "Advanced Options" });

  return (
    <section className="mb-8">
      <SectionHeading iconToken="{icon.action.settings}">{heading}</SectionHeading>
      <div className="space-y-3">
        {options.map((option) => {
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
