/** @file Route customiser translating slider-heavy mockups to Radix UI. */

import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppBottomNavigation } from "../../components/app-bottom-navigation";
import { Icon } from "../../components/icon";
import { SliderControl } from "../../components/slider-control";
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
import { formatDistance, formatDuration } from "../../units/unit-format";
import { useUnitPreferences } from "../../units/unit-preferences-provider";
import {
  AdvancedOptions,
  InterestMix,
  RoutePreview,
  SegmentPicker,
  SurfacePicker,
} from "./customize-sections";

export function CustomizeScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const { unitSystem } = useUnitPreferences();
  const unitOptions = useMemo(
    () => ({ t, locale: i18n.language, unitSystem }),
    [i18n.language, t, unitSystem],
  );
  const formatDistanceLabel = useCallback(
    (metres: number) => {
      const { value, unitLabel } = formatDistance(metres, unitOptions);
      return `${value} ${unitLabel}`;
    },
    [unitOptions],
  );
  const formatDurationLabel = useCallback(
    (seconds: number) => {
      const { value, unitLabel } = formatDuration(seconds, {
        ...unitOptions,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return `${value} ${unitLabel}`;
    },
    [unitOptions],
  );

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
            const markerLabels = markers.map((marker) =>
              formatSliderValue(id, marker, t, i18n.language, unitSystem),
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
                valueFormatter={(value) =>
                  formatSliderValue(id, value, t, i18n.language, unitSystem)
                }
                markers={markerLabels}
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
          <SurfacePicker
            heading={t("customize-surface-heading", { defaultValue: "Surface Type" })}
            ariaLabel={t("customize-surface-aria-label", { defaultValue: "Surface type" })}
            options={surfaceOptions}
            value={surface}
            onChange={setSurface}
          />
          <InterestMix
            slices={interestMix}
            values={interestValues}
            onChange={(id, value) =>
              setInterestValues((current) => ({
                ...current,
                [id]: Math.min(100, Math.max(0, value)),
              }))
            }
          />
          <RoutePreview
            routes={routePreviews}
            selected={selectedRoute}
            onSelect={setSelectedRoute}
            formatDistanceLabel={formatDistanceLabel}
            formatDurationLabel={formatDurationLabel}
          />
          <AdvancedOptions
            options={advancedOptions}
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
