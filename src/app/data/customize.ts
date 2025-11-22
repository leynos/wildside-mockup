/** @file Configurable values powering the route customiser screen. */

import type { TFunction } from "i18next";

import {
  formatDistance,
  formatDuration,
  metresFromKilometres,
  secondsFromMinutes,
} from "../units/unit-format";
import type { UnitSystem } from "../units/unit-system";

type SliderQuantity = "distance" | "duration";

export interface SliderConfig {
  id: string;
  label: string;
  iconToken: string;
  iconColorClass: string;
  min: number;
  max: number;
  step: number;
  initialValue: number;
  quantity: SliderQuantity;
  markers: number[];
}

export interface SegmentOption {
  id: string;
  label: string;
  description: string;
}

export interface SurfaceOption {
  id: string;
  label: string;
  iconToken: string;
  emphasis?: boolean;
}

export interface InterestMixSlice {
  id: string;
  label: string;
  iconToken: string;
  iconColorClass: string;
  allocation: number;
}

export interface RoutePreviewOption {
  id: string;
  title: string;
  distanceMetres: number;
  durationSeconds: number;
  iconColorClass: string;
  gradientClass: string;
  featured?: boolean;
}

export interface AdvancedToggleOption {
  id: string;
  label: string;
  description: string;
  iconToken: string;
  defaultEnabled: boolean;
}

export interface BottomNavigationItem {
  id: string;
  label: string;
  iconToken: string;
  href?: string;
  active?: boolean;
}

export const sliders: SliderConfig[] = [
  {
    id: "distance",
    label: "Distance",
    iconToken: "{icon.object.distance}",
    iconColorClass: "text-accent",
    min: metresFromKilometres(1),
    max: metresFromKilometres(10),
    step: metresFromKilometres(0.1),
    initialValue: metresFromKilometres(3.2),
    quantity: "distance",
    markers: [metresFromKilometres(1), metresFromKilometres(5), metresFromKilometres(10)],
  },
  {
    id: "duration",
    label: "Duration",
    iconToken: "{icon.object.duration}",
    iconColorClass: "text-accent",
    min: secondsFromMinutes(15),
    max: secondsFromMinutes(180),
    step: secondsFromMinutes(5),
    initialValue: secondsFromMinutes(75),
    quantity: "duration",
    markers: [secondsFromMinutes(15), secondsFromMinutes(90), secondsFromMinutes(180)],
  },
];

export const crowdLevelOptions: SegmentOption[] = [
  { id: "quiet", label: "Quiet", description: "Tranquil streets" },
  { id: "balanced", label: "Balanced", description: "Local buzz" },
  { id: "lively", label: "Lively", description: "Popular spots" },
];

export const elevationOptions: SegmentOption[] = [
  { id: "flat", label: "Flat", description: "Minimal climbs" },
  { id: "rolling", label: "Rolling", description: "Gentle hills" },
  { id: "steep", label: "Steep", description: "Challenge me" },
];

export const surfaceOptions: SurfaceOption[] = [
  { id: "paved", label: "Paved", iconToken: "{icon.category.paved}", emphasis: true },
  { id: "trail", label: "Trail", iconToken: "{icon.category.trails}" },
  { id: "boardwalk", label: "Boardwalk", iconToken: "{icon.category.water}" },
  { id: "mixed", label: "Mixed", iconToken: "{icon.object.route}" },
];

export const interestMix: InterestMixSlice[] = [
  {
    id: "nature",
    label: "Nature",
    iconToken: "{icon.category.nature}",
    iconColorClass: "text-emerald-400",
    allocation: 40,
  },
  {
    id: "history",
    label: "History",
    iconToken: "{icon.category.history}",
    iconColorClass: "text-sky-400",
    allocation: 30,
  },
  {
    id: "food",
    label: "Food & Drink",
    iconToken: "{icon.category.food}",
    iconColorClass: "text-amber-400",
    allocation: 30,
  },
];

export const routePreviews: RoutePreviewOption[] = [
  {
    id: "route-a",
    title: "Route A",
    distanceMetres: metresFromKilometres(3.2),
    durationSeconds: secondsFromMinutes(75),
    iconColorClass: "text-accent",
    gradientClass: "from-accent/20 to-sky-400/20",
    featured: true,
  },
  {
    id: "route-b",
    title: "Route B",
    distanceMetres: metresFromKilometres(2.8),
    durationSeconds: secondsFromMinutes(68),
    iconColorClass: "text-emerald-400",
    gradientClass: "from-emerald-400/20 to-amber-400/20",
  },
  {
    id: "route-c",
    title: "Route C",
    distanceMetres: metresFromKilometres(3.6),
    durationSeconds: secondsFromMinutes(82),
    iconColorClass: "text-purple-400",
    gradientClass: "from-purple-400/20 to-pink-400/20",
  },
];

export const advancedOptions: AdvancedToggleOption[] = [
  {
    id: "safety",
    label: "Safety Priority",
    description: "Well-lit, busy routes",
    iconToken: "{icon.safety.priority}",
    defaultEnabled: false,
  },
  {
    id: "accessibility",
    label: "Accessibility",
    description: "Step-free routes",
    iconToken: "{icon.accessibility.stepFree}",
    defaultEnabled: true,
  },
  {
    id: "download",
    label: "Offline download",
    description: "Preload maps and audio",
    iconToken: "{icon.action.download}",
    defaultEnabled: false,
  },
];

export const bottomNavigation: BottomNavigationItem[] = [
  { id: "map", label: "Map", iconToken: "{icon.navigation.map}", href: "/map/quick" },
  { id: "discover", label: "Discover", iconToken: "{icon.navigation.explore}", href: "/explore" },
  {
    id: "routes",
    label: "Routes",
    iconToken: "{icon.object.route}",
    href: "/customize",
    active: true,
  },
  { id: "profile", label: "Profile", iconToken: "{icon.navigation.profile}", href: "/offline" },
];

/**
 * Format a slider value with unit precision in keeping with the mockup copy.
 *
 * @example
 * ```ts
 * formatSliderValue("distance", 3200, t, "en-GB", "metric"); // "3.2 km"
 * ```
 */
export function formatSliderValue(
  configId: string,
  value: number,
  t: TFunction,
  locale: string,
  unitSystem: UnitSystem,
): string {
  const slider = sliders.find((entry) => entry.id === configId);
  if (!slider) return value.toString();

  const sharedOptions = { t, locale, unitSystem };

  if (slider.quantity === "distance") {
    const { value: formattedValue, unitLabel } = formatDistance(value, {
      ...sharedOptions,
    });
    return `${formattedValue} ${unitLabel}`;
  }

  const { value: formattedValue, unitLabel } = formatDuration(value, {
    ...sharedOptions,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${formattedValue} ${unitLabel}`;
}
