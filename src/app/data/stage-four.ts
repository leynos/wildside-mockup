/** @file Data fixtures supporting Stage 4 routes (completion and safety flows). */

export interface WalkCompletionStat {
  id: string;
  label: string;
  value: string;
  icon: string;
}

export const walkCompletionPrimaryStats: WalkCompletionStat[] = [
  { id: "distance", label: "Distance", value: "3.2 km", icon: "fa-solid fa-route" },
  { id: "duration", label: "Duration", value: "58 min", icon: "fa-regular fa-clock" },
];

export const walkCompletionSecondaryStats: WalkCompletionStat[] = [
  { id: "calories", label: "Calories", value: "247", icon: "fa-solid fa-fire" },
  { id: "stops", label: "Stops", value: "7", icon: "fa-solid fa-location-dot" },
  { id: "starred", label: "Starred", value: "3", icon: "fa-solid fa-star" },
];

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
  icon: string;
  accentClass: string;
}

export const walkCompletionShareOptions: WalkCompletionShareOption[] = [
  { id: "facebook", label: "Facebook", icon: "fa-brands fa-facebook", accentClass: "bg-blue-600" },
  {
    id: "instagram",
    label: "Instagram",
    icon: "fa-brands fa-instagram",
    accentClass: "bg-pink-600",
  },
  { id: "twitter", label: "Twitter", icon: "fa-brands fa-x-twitter", accentClass: "bg-blue-400" },
];

export const walkCompletionMapImage =
  "https://storage.googleapis.com/uxpilot-auth.appspot.com/06e75c31a1-bce51b16eb8b338859bf.png";

export interface OfflineSuggestion {
  id: string;
  title: string;
  description: string;
  callToAction: string;
  icon: string;
  accentClass: string;
  iconClassName?: string;
}

export interface AutoManagementOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconClassName: string;
  defaultEnabled: boolean;
}

export const offlineSuggestions: OfflineSuggestion[] = [
  {
    id: "reykjavik",
    title: "Upcoming Trip Detected",
    description: "Add Reykjavik before your Iceland trip next week",
    callToAction: "Download Reykjavik",
    icon: "fa-solid fa-plane",
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
    imageUrl: "/images/empire.png",
    status: "complete",
  },
  {
    id: "sf",
    title: "San Francisco, CA",
    subtitle: "Downloaded 1 week ago",
    size: "623 MB",
    progress: 1,
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/1ee5c3f4e6-26f337b26e695afe4c11.png",
    status: "complete",
  },
  {
    id: "london",
    title: "London, UK",
    subtitle: "Downloading • 1.2 GB",
    size: "1.2 GB",
    progress: 0.65,
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/0588c62612-0e0ea0cdb4f311e59cfd.png",
    status: "downloading",
  },
];

export const autoManagementOptions: AutoManagementOption[] = [
  {
    id: "auto-delete",
    title: "Auto-delete old maps",
    description: "Remove maps older than 30 days automatically",
    icon: "fa-solid fa-trash-alt",
    iconClassName: "text-amber-400",
    defaultEnabled: true,
  },
  {
    id: "wifi-only",
    title: "WiFi-only downloads",
    description: "Only download maps when connected to WiFi",
    icon: "fa-solid fa-wifi",
    iconClassName: "text-accent",
    defaultEnabled: true,
  },
  {
    id: "auto-update",
    title: "Auto-update maps",
    description: "Automatically update maps when new versions are available",
    icon: "fa-solid fa-sync-alt",
    iconClassName: "text-purple-400",
    defaultEnabled: false,
  },
];

export interface SafetyToggle {
  id: string;
  label: string;
  description: string;
  icon: string;
  accentClass: string;
  defaultChecked: boolean;
}

export interface SafetyAccordionSection {
  id: string;
  title: string;
  icon: string;
  accentClass: string;
  description: string;
  toggles: SafetyToggle[];
}

export const safetyAccordionSections: SafetyAccordionSection[] = [
  {
    id: "mobility",
    title: "Mobility Support",
    icon: "fa-solid fa-wheelchair",
    accentClass: "bg-sky-500/20 text-sky-400",
    description: "Route adjustments for easier navigation",
    toggles: [
      {
        id: "step-free",
        label: "Step-free routes",
        description: "Avoid stairs and steps",
        icon: "fa-solid fa-stairs",
        accentClass: "bg-green-500/20 text-green-400",
        defaultChecked: true,
      },
      {
        id: "avoid-hills",
        label: "Avoid steep hills",
        description: "Limit inclines above 5%",
        icon: "fa-solid fa-mountain",
        accentClass: "bg-orange-500/20 text-orange-400",
        defaultChecked: false,
      },
      {
        id: "wider-paths",
        label: "Prefer wider paths",
        description: "Optimised for chairs, buggies, or group walking",
        icon: "fa-solid fa-road",
        accentClass: "bg-purple-500/20 text-purple-400",
        defaultChecked: true,
      },
    ],
  },
  {
    id: "safety",
    title: "Safety Features",
    icon: "fa-solid fa-shield-halved",
    accentClass: "bg-yellow-500/20 text-yellow-400",
    description: "Enhanced security for your walks",
    toggles: [
      {
        id: "well-lit",
        label: "Well-lit routes",
        description: "Prioritise illuminated paths",
        icon: "fa-solid fa-lightbulb",
        accentClass: "bg-amber-500/20 text-amber-400",
        defaultChecked: true,
      },
      {
        id: "busy-areas",
        label: "Prefer busy areas",
        description: "Stay in populated zones",
        icon: "fa-solid fa-people-group",
        accentClass: "bg-pink-500/20 text-pink-400",
        defaultChecked: false,
      },
      {
        id: "emergency-sharing",
        label: "Emergency sharing",
        description: "Share location with contacts",
        icon: "fa-solid fa-phone",
        accentClass: "bg-red-500/20 text-red-400",
        defaultChecked: false,
      },
      {
        id: "avoid-isolated",
        label: "Avoid isolated areas",
        description: "Skip secluded locations",
        icon: "fa-solid fa-eye-slash",
        accentClass: "bg-slate-500/20 text-slate-300",
        defaultChecked: true,
      },
    ],
  },
  {
    id: "comfort",
    title: "Comfort Settings",
    icon: "fa-solid fa-leaf",
    accentClass: "bg-emerald-500/20 text-emerald-400",
    description: "Personalise your walking experience",
    toggles: [
      {
        id: "shade",
        label: "Prioritise shade",
        description: "Choose tree-lined paths",
        icon: "fa-solid fa-tree",
        accentClass: "bg-emerald-500/20 text-emerald-400",
        defaultChecked: false,
      },
      {
        id: "weather-adaptive",
        label: "Weather-adaptive",
        description: "Adjust routes for weather",
        icon: "fa-solid fa-cloud-sun",
        accentClass: "bg-blue-500/20 text-blue-400",
        defaultChecked: true,
      },
      {
        id: "quiet-routes",
        label: "Prefer quiet routes",
        description: "Minimise traffic noise",
        icon: "fa-solid fa-volume-low",
        accentClass: "bg-teal-500/20 text-teal-400",
        defaultChecked: false,
      },
    ],
  },
];

export interface SafetyPreset {
  id: string;
  title: string;
  description: string;
  icon: string;
  accentClass: string;
}

export const safetyPresets: SafetyPreset[] = [
  {
    id: "family",
    title: "Family Friendly",
    description: "Gentle pace, playground stops, shade",
    icon: "fa-solid fa-children",
    accentClass: "bg-amber-500/20 text-amber-400",
  },
  {
    id: "senior",
    title: "Senior Friendly",
    description: "Gentle slopes, resting points, well-lit",
    icon: "fa-solid fa-walking-cane",
    accentClass: "bg-green-500/20 text-green-400",
  },
  {
    id: "night",
    title: "Night Walker",
    description: "Well-lit, busy areas, emergency sharing",
    icon: "fa-solid fa-moon",
    accentClass: "bg-indigo-500/20 text-indigo-300",
  },
];
