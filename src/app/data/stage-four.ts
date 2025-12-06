/** @file Data fixtures supporting Stage 4 routes (completion and safety flows). */

import walkRouteMap1 from "../../assets/walks/walk-route-map-1.png";
import { metresFromKilometres, secondsFromMinutes } from "../units/unit-format";

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
