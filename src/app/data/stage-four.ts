/** @file Data fixtures supporting Stage 4 routes (completion and safety flows). */

import walkRouteMap1 from "../../assets/walks/walk-route-map-1.png";

export interface WalkCompletionStat {
  id: string;
  label: string;
  value: string;
  iconToken: string;
}

export const walkCompletionPrimaryStats: WalkCompletionStat[] = [
  { id: "distance", label: "Distance", value: "3.2 km", iconToken: "{icon.object.distance}" },
  { id: "duration", label: "Duration", value: "58 min", iconToken: "{icon.object.duration}" },
];

export const walkCompletionSecondaryStats: WalkCompletionStat[] = [
  { id: "calories", label: "Calories", value: "247", iconToken: "{icon.object.calories}" },
  { id: "stops", label: "Stops", value: "7", iconToken: "{icon.object.stops}" },
  { id: "starred", label: "Starred", value: "3", iconToken: "{icon.object.star}" },
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

export interface SafetyToggle {
  id: string;
  iconToken: string;
  accentClass: string;
  defaultChecked: boolean;
  labelKey: string;
  defaultLabel: string;
  descriptionKey: string;
  defaultDescription: string;
}

export interface SafetyAccordionSection {
  id: string;
  iconToken: string;
  accentClass: string;
  titleKey: string;
  defaultTitle: string;
  descriptionKey: string;
  defaultDescription: string;
  toggles: SafetyToggle[];
}

export const safetyAccordionSections: SafetyAccordionSection[] = [
  {
    id: "mobility",
    titleKey: "safety-section-mobility-title",
    defaultTitle: "Mobility Support",
    iconToken: "{icon.accessibility.stepFree}",
    accentClass: "bg-sky-500/20 text-sky-400",
    descriptionKey: "safety-section-mobility-description",
    defaultDescription: "Route adjustments for easier navigation",
    toggles: [
      {
        id: "step-free",
        labelKey: "safety-toggle-step-free-label",
        defaultLabel: "Step-free routes",
        descriptionKey: "safety-toggle-step-free-description",
        defaultDescription: "Avoid stairs and steps",
        iconToken: "{icon.accessibility.stepFree}",
        accentClass: "bg-green-500/20 text-green-400",
        defaultChecked: true,
      },
      {
        id: "avoid-hills",
        labelKey: "safety-toggle-avoid-hills-label",
        defaultLabel: "Avoid steep hills",
        descriptionKey: "safety-toggle-avoid-hills-description",
        defaultDescription: "Limit inclines above 5%",
        iconToken: "{icon.accessibility.elevation}",
        accentClass: "bg-orange-500/20 text-orange-400",
        defaultChecked: false,
      },
      {
        id: "wider-paths",
        labelKey: "safety-toggle-wider-paths-label",
        defaultLabel: "Prefer wider paths",
        descriptionKey: "safety-toggle-wider-paths-description",
        defaultDescription: "Optimised for chairs, buggies, or group walking",
        iconToken: "{icon.category.paved}",
        accentClass: "bg-purple-500/20 text-purple-400",
        defaultChecked: true,
      },
    ],
  },
  {
    id: "safety",
    titleKey: "safety-section-safety-title",
    defaultTitle: "Safety Features",
    iconToken: "{icon.safety.priority}",
    accentClass: "bg-yellow-500/20 text-yellow-400",
    descriptionKey: "safety-section-safety-description",
    defaultDescription: "Enhanced security for your walks",
    toggles: [
      {
        id: "well-lit",
        labelKey: "wizard-step-two-accessibility-well-lit-label",
        defaultLabel: "Well-lit paths",
        descriptionKey: "wizard-step-two-accessibility-well-lit-description",
        defaultDescription: "Prioritise brightly lit evening routes",
        iconToken: "{icon.object.guidance}",
        accentClass: "bg-amber-500/20 text-amber-400",
        defaultChecked: true,
      },
      {
        id: "busy-areas",
        labelKey: "safety-toggle-busy-areas-label",
        defaultLabel: "Prefer busy areas",
        descriptionKey: "safety-toggle-busy-areas-description",
        defaultDescription: "Stay in populated zones",
        iconToken: "{icon.safety.group}",
        accentClass: "bg-pink-500/20 text-pink-400",
        defaultChecked: false,
      },
      {
        id: "emergency-sharing",
        labelKey: "safety-toggle-emergency-sharing-label",
        defaultLabel: "Emergency sharing",
        descriptionKey: "safety-toggle-emergency-sharing-description",
        defaultDescription: "Share location with contacts",
        iconToken: "{icon.safety.emergencyPhone}",
        accentClass: "bg-red-500/20 text-red-400",
        defaultChecked: false,
      },
      {
        id: "avoid-isolated",
        labelKey: "safety-toggle-avoid-isolated-label",
        defaultLabel: "Avoid isolated areas",
        descriptionKey: "safety-toggle-avoid-isolated-description",
        defaultDescription: "Skip secluded locations",
        iconToken: "{icon.safety.hide}",
        accentClass: "bg-slate-500/20 text-slate-300",
        defaultChecked: true,
      },
    ],
  },
  {
    id: "comfort",
    titleKey: "safety-section-comfort-title",
    defaultTitle: "Comfort Settings",
    iconToken: "{icon.environment.toggle}",
    accentClass: "bg-emerald-500/20 text-emerald-400",
    descriptionKey: "safety-section-comfort-description",
    defaultDescription: "Personalise your walking experience",
    toggles: [
      {
        id: "shade",
        labelKey: "safety-toggle-shade-label",
        defaultLabel: "Prioritise shade",
        descriptionKey: "safety-toggle-shade-description",
        defaultDescription: "Choose tree-lined paths",
        iconToken: "{icon.category.trails}",
        accentClass: "bg-emerald-500/20 text-emerald-400",
        defaultChecked: false,
      },
      {
        id: "weather-adaptive",
        labelKey: "safety-toggle-weather-label",
        defaultLabel: "Weather-adaptive",
        descriptionKey: "safety-toggle-weather-description",
        defaultDescription: "Adjust routes for weather",
        iconToken: "{icon.object.weatherSunny}",
        accentClass: "bg-blue-500/20 text-blue-400",
        defaultChecked: true,
      },
      {
        id: "quiet-routes",
        labelKey: "safety-toggle-quiet-label",
        defaultLabel: "Prefer quiet routes",
        descriptionKey: "safety-toggle-quiet-description",
        defaultDescription: "Minimise traffic noise",
        iconToken: "{icon.object.audio}",
        accentClass: "bg-teal-500/20 text-teal-400",
        defaultChecked: false,
      },
    ],
  },
] as const;

export interface SafetyPreset {
  id: string;
  iconToken: string;
  accentClass: string;
  titleKey: string;
  defaultTitle: string;
  descriptionKey: string;
  defaultDescription: string;
}

export const safetyPresets: SafetyPreset[] = [
  {
    id: "family",
    titleKey: "safety-preset-family-title",
    defaultTitle: "Family Friendly",
    descriptionKey: "safety-preset-family-description",
    defaultDescription: "Gentle pace, playground stops, shade",
    iconToken: "{icon.object.family}",
    accentClass: "bg-amber-500/20 text-amber-400",
  },
  {
    id: "senior",
    titleKey: "safety-preset-senior-title",
    defaultTitle: "Senior Friendly",
    descriptionKey: "safety-preset-senior-description",
    defaultDescription: "Gentle slopes, resting points, well-lit",
    iconToken: "{icon.accessibility.mobilityAid}",
    accentClass: "bg-green-500/20 text-green-400",
  },
  {
    id: "night",
    titleKey: "safety-preset-night-title",
    defaultTitle: "Night Walker",
    descriptionKey: "safety-preset-night-description",
    defaultDescription: "Well-lit, busy areas, emergency sharing",
    iconToken: "{icon.object.weatherNight}",
    accentClass: "bg-indigo-500/20 text-indigo-300",
  },
] as const;
