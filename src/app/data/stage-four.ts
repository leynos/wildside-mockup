/** @file Data fixtures supporting Stage 4 routes (completion and safety flows). */

import walkRouteMap1 from "../../assets/walks/walk-route-map-1.png";
import type { EntityLocalizations } from "../domain/entities/localization";
import { metresFromKilometres, secondsFromMinutes } from "../units/unit-format";
import { localisation } from "./fixture-localization";

export interface WalkCompletionStat {
  id: string;
  label: string;
  value:
    | { kind: "distance"; metres: number }
    | { kind: "duration"; seconds: number }
    | { kind: "count"; value: number; unitToken?: string }
    | { kind: "energy"; kilocalories: number };
  iconToken: string;
}

export const walkCompletionPrimaryStats: WalkCompletionStat[] = [
  {
    id: "distance",
    label: "Distance",
    value: { kind: "distance", metres: metresFromKilometres(3.2) },
    iconToken: "{icon.object.distance}",
  },
  {
    id: "duration",
    label: "Duration",
    value: { kind: "duration", seconds: secondsFromMinutes(58) },
    iconToken: "{icon.object.duration}",
  },
];

export const walkCompletionSecondaryStats: WalkCompletionStat[] = [
  {
    id: "calories",
    label: "Calories",
    value: { kind: "energy", kilocalories: 247 },
    iconToken: "{icon.object.calories}",
  },
  {
    id: "stops",
    label: "Stops",
    value: { kind: "count", value: 7, unitToken: "count-stop" },
    iconToken: "{icon.object.stops}",
  },
  {
    id: "starred",
    label: "Starred",
    value: { kind: "count", value: 3 },
    iconToken: "{icon.object.star}",
  },
];

const withBasePath = (path: string): string => {
  const base = import.meta.env.BASE_URL ?? "/";
  const cleanedPath = path.replace(/^\/+/, "");
  return `${base}${cleanedPath}`.replace(/\/+/g, "/");
};

export interface WalkCompletionMoment {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export const walkCompletionMoments: WalkCompletionMoment[] = [
  {
    id: "coffee",
    name: "Blue Bottle Coffee",
    description: "Perfect cortado & friendly barista",
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/03fdb8eff5-0706dc4eec4e2208ca2d.png",
  },
  {
    id: "mural",
    name: "Hidden Mural",
    description: "Amazing street art in quiet alley",
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/7c8c56a54b-101578a06001bb190271.png",
  },
  {
    id: "park",
    name: "Meridian Hill Park",
    description: "Peaceful pond with friendly ducks",
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/ad4258f4ad-817a02de971280a8ef8b.png",
  },
];

export interface WalkCompletionShareOption {
  id: string;
  label: string;
  iconToken: string;
  accentClass: string;
}

export const walkCompletionShareOptions: WalkCompletionShareOption[] = [
  {
    id: "facebook",
    label: "Facebook",
    iconToken: "{icon.brand.facebook}",
    accentClass: "bg-blue-600",
  },
  {
    id: "instagram",
    label: "Instagram",
    iconToken: "{icon.brand.instagram}",
    accentClass: "bg-pink-600",
  },
  {
    id: "twitter",
    label: "Twitter",
    iconToken: "{icon.brand.x}",
    accentClass: "bg-blue-400",
  },
];

export const walkCompletionMapImage = walkRouteMap1;

export interface OfflineSuggestion {
  id: string;
  title: string;
  description: string;
  callToAction: string;
  iconToken: string;
  accentClass: string;
  iconClassName?: string;
}

export interface AutoManagementOption {
  id: string;
  title: string;
  description: string;
  iconToken: string;
  iconClassName: string;
  defaultEnabled: boolean;
}

export const offlineSuggestions: OfflineSuggestion[] = [
  {
    id: "reykjavik",
    title: "Upcoming Trip Detected",
    description: "Add Reykjavik before your Iceland trip next week",
    callToAction: "Download Reykjavik",
    iconToken: "{icon.object.travel}",
    accentClass: "from-sky-500 via-indigo-500 to-purple-600",
    iconClassName: "text-[color:var(--b3)]",
  },
];

export interface OfflineDownload {
  id: string;
  title: string;
  subtitle: string;
  size: string;
  progress: number;
  imageUrl: string;
  status?: "complete" | "updating" | "downloading";
}

export const offlineDownloads: OfflineDownload[] = [
  {
    id: "nyc",
    title: "New York, NY",
    subtitle: "Downloaded 3 days ago",
    size: "847 MB",
    progress: 1,
    imageUrl: withBasePath("images/empire.png"),
    status: "complete",
  },
  {
    id: "sf",
    title: "San Francisco, CA",
    subtitle: "Downloaded 1 week ago",
    size: "623 MB",
    progress: 1,
    imageUrl: withBasePath("images/goldengate.png"),
    status: "complete",
  },
  {
    id: "london",
    title: "London, UK",
    subtitle: "Downloading • 1.2 GB",
    size: "1.2 GB",
    progress: 0.65,
    imageUrl: withBasePath("images/londoneye.png"),
    status: "downloading",
  },
];

export const autoManagementOptions: AutoManagementOption[] = [
  {
    id: "auto-delete",
    title: "Auto-delete old maps",
    description: "Remove maps older than 30 days automatically",
    iconToken: "{icon.offline.delete}",
    iconClassName: "text-amber-400",
    defaultEnabled: true,
  },
  {
    id: "wifi-only",
    title: "Wi-Fi-only downloads",
    description: "Only download maps when connected to Wi-Fi",
    iconToken: "{icon.offline.connectivity}",
    iconClassName: "text-accent",
    defaultEnabled: true,
  },
  {
    id: "auto-update",
    title: "Auto-update maps",
    description: "Automatically update maps when new versions are available",
    iconToken: "{icon.offline.sync}",
    iconClassName: "text-purple-400",
    defaultEnabled: false,
  },
];

export type SafetyToggleId = string;

export interface SafetyToggle {
  readonly id: SafetyToggleId;
  readonly localizations: EntityLocalizations;
  readonly iconToken: string;
  readonly accentClass: string;
  readonly defaultChecked: boolean;
}

export interface SafetyAccordionSection {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly iconToken: string;
  readonly accentClass: string;
  readonly toggleIds: readonly SafetyToggleId[];
}

export interface SafetyPreset {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly iconToken: string;
  readonly accentClass: string;
  readonly appliedToggleIds: readonly SafetyToggleId[];
}

export const safetyToggles: SafetyToggle[] = [
  {
    id: "step-free",
    localizations: localisation(
      { name: "Step-free routes", description: "Avoid stairs and steps" },
      {},
      "safety-toggle:step-free",
    ),
    iconToken: "{icon.accessibility.stepFree}",
    accentClass: "bg-green-500/20 text-green-400",
    defaultChecked: true,
  },
  {
    id: "avoid-hills",
    localizations: localisation(
      { name: "Avoid steep hills", description: "Limit inclines above 5%" },
      {},
      "safety-toggle:avoid-hills",
    ),
    iconToken: "{icon.accessibility.elevation}",
    accentClass: "bg-orange-500/20 text-orange-400",
    defaultChecked: false,
  },
  {
    id: "wider-paths",
    localizations: localisation(
      {
        name: "Prefer wider paths",
        description: "Optimised for chairs, buggies, or group walking",
      },
      {},
      "safety-toggle:wider-paths",
    ),
    iconToken: "{icon.category.paved}",
    accentClass: "bg-purple-500/20 text-purple-400",
    defaultChecked: true,
  },
  {
    id: "well-lit",
    localizations: localisation(
      { name: "Well-lit paths", description: "Prioritise brightly lit evening routes" },
      {},
      "safety-toggle:well-lit",
    ),
    iconToken: "{icon.object.guidance}",
    accentClass: "bg-amber-500/20 text-amber-400",
    defaultChecked: true,
  },
  {
    id: "busy-areas",
    localizations: localisation(
      { name: "Prefer busy areas", description: "Stay in populated zones" },
      {},
      "safety-toggle:busy-areas",
    ),
    iconToken: "{icon.safety.group}",
    accentClass: "bg-pink-500/20 text-pink-400",
    defaultChecked: false,
  },
  {
    id: "emergency-sharing",
    localizations: localisation(
      { name: "Emergency sharing", description: "Share location with contacts" },
      {},
      "safety-toggle:emergency-sharing",
    ),
    iconToken: "{icon.safety.emergencyPhone}",
    accentClass: "bg-red-500/20 text-red-400",
    defaultChecked: false,
  },
  {
    id: "avoid-isolated",
    localizations: localisation(
      { name: "Avoid isolated areas", description: "Skip secluded locations" },
      {},
      "safety-toggle:avoid-isolated",
    ),
    iconToken: "{icon.safety.hide}",
    accentClass: "bg-slate-500/20 text-slate-300",
    defaultChecked: true,
  },
  {
    id: "shade",
    localizations: localisation(
      { name: "Prioritise shade", description: "Choose tree-lined paths" },
      {},
      "safety-toggle:shade",
    ),
    iconToken: "{icon.category.trails}",
    accentClass: "bg-emerald-500/20 text-emerald-400",
    defaultChecked: false,
  },
  {
    id: "weather-adaptive",
    localizations: localisation(
      { name: "Weather-adaptive", description: "Adjust routes for weather" },
      {},
      "safety-toggle:weather",
    ),
    iconToken: "{icon.object.weatherSunny}",
    accentClass: "bg-blue-500/20 text-blue-400",
    defaultChecked: true,
  },
  {
    id: "quiet-routes",
    localizations: localisation(
      { name: "Prefer quiet routes", description: "Minimise traffic noise" },
      {},
      "safety-toggle:quiet",
    ),
    iconToken: "{icon.object.audio}",
    accentClass: "bg-teal-500/20 text-teal-400",
    defaultChecked: false,
  },
];

export const safetyAccordionSections: SafetyAccordionSection[] = [
  {
    id: "mobility",
    localizations: localisation(
      { name: "Mobility Support", description: "Route adjustments for easier navigation" },
      {},
      "safety-section:mobility",
    ),
    iconToken: "{icon.accessibility.stepFree}",
    accentClass: "bg-sky-500/20 text-sky-400",
    toggleIds: ["step-free", "avoid-hills", "wider-paths"],
  },
  {
    id: "safety",
    localizations: localisation(
      { name: "Safety Features", description: "Enhanced security for your walks" },
      {},
      "safety-section:safety",
    ),
    iconToken: "{icon.safety.priority}",
    accentClass: "bg-yellow-500/20 text-yellow-400",
    toggleIds: ["well-lit", "busy-areas", "emergency-sharing", "avoid-isolated"],
  },
  {
    id: "comfort",
    localizations: localisation(
      { name: "Comfort Settings", description: "Personalise your walking experience" },
      {},
      "safety-section:comfort",
    ),
    iconToken: "{icon.environment.toggle}",
    accentClass: "bg-emerald-500/20 text-emerald-400",
    toggleIds: ["shade", "weather-adaptive", "quiet-routes"],
  },
];

export const safetyPresets: SafetyPreset[] = [
  {
    id: "family",
    localizations: localisation(
      { name: "Family Friendly", description: "Gentle pace, playground stops, shade" },
      {},
      "safety-preset:family",
    ),
    iconToken: "{icon.object.family}",
    accentClass: "bg-amber-500/20 text-amber-400",
    appliedToggleIds: ["wider-paths", "shade", "avoid-hills", "weather-adaptive"],
  },
  {
    id: "senior",
    localizations: localisation(
      { name: "Senior Friendly", description: "Gentle slopes, resting points, well-lit" },
      {},
      "safety-preset:senior",
    ),
    iconToken: "{icon.accessibility.mobilityAid}",
    accentClass: "bg-green-500/20 text-green-400",
    appliedToggleIds: ["step-free", "avoid-hills", "wider-paths", "well-lit"],
  },
  {
    id: "night",
    localizations: localisation(
      { name: "Night Walker", description: "Well-lit, busy areas, emergency sharing" },
      {},
      "safety-preset:night",
    ),
    iconToken: "{icon.object.weatherNight}",
    accentClass: "bg-indigo-500/20 text-indigo-300",
    appliedToggleIds: ["well-lit", "busy-areas", "emergency-sharing", "avoid-isolated"],
  },
];
