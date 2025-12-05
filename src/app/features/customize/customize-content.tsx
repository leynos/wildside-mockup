/** @file Presentational body for the customize screen. */

import type { JSX } from "react";
import {
  advancedOptions,
  crowdLevelOptions,
  elevationOptions,
  interestMix,
  resolvedRoutePreviews,
  type SliderConfig,
  surfaceOptions,
} from "../../data/customize";
import type { LocalizedStringSet } from "../../domain/entities/localization";
import {
  AdvancedOptions,
  InterestMix,
  RoutePreview,
  SegmentPicker,
  SliderList,
  SurfacePicker,
} from "./customize-sections";

type LocalizedSlider = SliderConfig & { localization: LocalizedStringSet };

type CustomizeContentProps = {
  readonly sliders: readonly LocalizedSlider[];
  readonly sliderValues: Readonly<Record<string, number>>;
  readonly onSliderChange: (id: string, value: number) => void;
  readonly formatSliderValue: (id: string, value: number) => string;
  readonly crowdLabel: string;
  readonly elevationLabel: string;
  readonly crowdValue: string;
  readonly elevationValue: string;
  readonly onCrowdChange: (value: string) => void;
  readonly onElevationChange: (value: string) => void;
  readonly surfaceHeading: string;
  readonly surfaceAriaLabel: string;
  readonly surfaceValue: string;
  readonly onSurfaceChange: (value: string) => void;
  readonly interestValues: Readonly<Record<string, number>>;
  readonly onInterestChange: (id: string, value: number) => void;
  readonly selectedRoute: string;
  readonly onRouteSelect: (id: string) => void;
  readonly formatDistanceLabel: (metres: number) => string;
  readonly formatDurationLabel: (seconds: number) => string;
  readonly advancedValues: Readonly<Record<string, boolean>>;
  readonly onAdvancedToggle: (id: string, value: boolean) => void;
};

export const CustomizeContent = ({
  sliders,
  sliderValues,
  onSliderChange,
  formatSliderValue,
  crowdLabel,
  elevationLabel,
  crowdValue,
  elevationValue,
  onCrowdChange,
  onElevationChange,
  surfaceHeading,
  surfaceAriaLabel,
  surfaceValue,
  onSurfaceChange,
  interestValues,
  onInterestChange,
  selectedRoute,
  onRouteSelect,
  formatDistanceLabel,
  formatDurationLabel,
  advancedValues,
  onAdvancedToggle,
}: CustomizeContentProps): JSX.Element => (
  <main className="screen-scroll pb-6 pt-4">
    <SliderList
      sliders={sliders}
      sliderValues={sliderValues}
      formatSliderValue={formatSliderValue}
      onSliderChange={onSliderChange}
    />
    <SegmentPicker
      id="crowd"
      label={crowdLabel}
      iconToken="{icon.object.family}"
      options={crowdLevelOptions}
      value={crowdValue}
      onChange={onCrowdChange}
    />
    <SegmentPicker
      id="elevation"
      label={elevationLabel}
      iconToken="{icon.accessibility.elevation}"
      options={elevationOptions}
      value={elevationValue}
      onChange={onElevationChange}
    />
    <SurfacePicker
      heading={surfaceHeading}
      ariaLabel={surfaceAriaLabel}
      options={surfaceOptions}
      iconToken="{icon.category.paved}"
      value={surfaceValue}
      onChange={onSurfaceChange}
    />
    <InterestMix slices={interestMix} values={interestValues} onChange={onInterestChange} />
    <RoutePreview
      routes={resolvedRoutePreviews}
      selected={selectedRoute}
      onSelect={onRouteSelect}
      formatDistanceLabel={formatDistanceLabel}
      formatDurationLabel={formatDurationLabel}
    />
    <AdvancedOptions
      options={advancedOptions}
      values={advancedValues}
      onToggle={onAdvancedToggle}
    />
  </main>
);
