/** @file Configurable values powering the route customiser screen. */

export interface SliderConfig {
  id: string;
  label: string;
  iconToken: string;
  iconColorClass: string;
  min: number;
  max: number;
  step: number;
  initialValue: number;
  unit: string;
  markers: string[];
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
  distance: string;
  duration: string;
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
    min: 1,
    max: 10,
    step: 0.1,
    initialValue: 3.2,
    unit: "km",
    markers: ["1 km", "5 km", "10 km"],
  },
  {
    id: "duration",
    label: "Duration",
    iconToken: "{icon.object.duration}",
    iconColorClass: "text-accent",
    min: 15,
    max: 180,
    step: 5,
    initialValue: 75,
    unit: "min",
    markers: ["15m", "90m", "180m"],
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
    distance: "3.2 km",
    duration: "75 min",
    iconColorClass: "text-accent",
    gradientClass: "from-accent/20 to-sky-400/20",
    featured: true,
  },
  {
    id: "route-b",
    title: "Route B",
    distance: "2.8 km",
    duration: "68 min",
    iconColorClass: "text-emerald-400",
    gradientClass: "from-emerald-400/20 to-amber-400/20",
  },
  {
    id: "route-c",
    title: "Route C",
    distance: "3.6 km",
    duration: "82 min",
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
  { id: "discover", label: "Discover", iconToken: "{icon.navigation.explore}", href: "/discover" },
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
 * formatSliderValue("distance", 3.2); // "3.2 km"
 * ```
 */
export function formatSliderValue(configId: string, value: number): string {
  const slider = sliders.find((entry) => entry.id === configId);
  if (!slider) return value.toString();
  return `${value.toFixed(slider.step < 1 ? 1 : 0)} ${slider.unit}`;
}
