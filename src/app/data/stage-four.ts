/** @file Data fixtures supporting Stage 4 routes (completion and safety flows). */

import walkRouteMap1 from "../../assets/walks/walk-route-map-1.png";
import type { EntityLocalizations, ImageAsset } from "../domain/entities/localization";
import { metresFromKilometres, secondsFromMinutes } from "../units/unit-format";
import { fillLocalizations, localizeAcrossLocales } from "./fixture-localization";

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

const withBasePath = (path: string, alt: string): ImageAsset => {
  const base = import.meta.env.BASE_URL ?? "/";
  const cleanedPath = path.replace(/^\/+/, "");
  // Collapse duplicate slashes but preserve protocol separators (://)
  const url = `${base}${cleanedPath}`.replace(/([^:]\/)\/+/g, "$1");
  return { url, alt };
};

export interface OfflineSuggestion {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly ctaLocalizations: EntityLocalizations;
  readonly iconToken: string;
  readonly accentClass: string;
  readonly iconClassName?: string;
}

export interface OfflineMapArea {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly image: ImageAsset;
  readonly sizeBytes: number;
  readonly progress: number;
  readonly status: "complete" | "updating" | "downloading";
  readonly lastUpdatedAt: string;
}

export interface AutoManagementOption {
  id: string;
  localizations: EntityLocalizations;
  iconToken: string;
  iconClassName: string;
  defaultEnabled: boolean;
  retentionDays?: number;
}

export const offlineSuggestions: OfflineSuggestion[] = [
  {
    id: "reykjavik",
    localizations: fillLocalizations(
      localizeAcrossLocales(
        {
          name: "Upcoming Trip Detected",
          description: "Add Reykjavik before your Iceland trip next week",
        },
        {
          es: {
            name: "Viaje próximo detectado",
            description: "Añade Reikiavik antes de tu viaje a Islandia la próxima semana",
          },
        },
      ),
      "en-GB",
      "offline-suggestion: reykjavik",
    ),
    ctaLocalizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "Download Reykjavik" },
        { es: { name: "Descargar Reikiavik" } },
      ),
      "en-GB",
      "offline-suggestion-cta: reykjavik",
    ),
    iconToken: "{icon.object.travel}",
    accentClass: "from-sky-500 via-indigo-500 to-purple-600",
    iconClassName: "text-[color:var(--b3)]",
  },
  {
    id: "kyoto",
    localizations: fillLocalizations(
      localizeAcrossLocales(
        {
          name: "Weekend City Break",
          description: "Save Kyoto before your autumn temple tour",
        },
        {
          ja: {
            name: "週末シティブレイク",
            description: "秋の寺巡りに備えて京都を保存しましょう",
          },
        },
      ),
      "en-GB",
      "offline-suggestion: kyoto",
    ),
    ctaLocalizations: fillLocalizations(
      localizeAcrossLocales({ name: "Download Kyoto" }, { ja: { name: "京都をダウンロード" } }),
      "en-GB",
      "offline-suggestion-cta: kyoto",
    ),
    iconToken: "{icon.navigation.download}",
    accentClass: "from-amber-500 via-rose-500 to-fuchsia-600",
  },
];

export const offlineMapAreas: OfflineMapArea[] = [
  {
    id: "nyc",
    localizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "New York, NY", description: "Downtown and Brooklyn offline pack" },
        { es: { name: "Nueva York, NY", description: "Paquete offline de Downtown y Brooklyn" } },
      ),
      "en-GB",
      "offline-area: nyc",
    ),
    image: withBasePath("images/empire.png", "Empire State Building viewed from above"),
    sizeBytes: 847 * 1024 ** 2,
    progress: 1,
    status: "complete",
    lastUpdatedAt: "2025-11-29T15:00:00Z",
  },
  {
    id: "sf",
    localizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "San Francisco, CA", description: "Waterfront and downtown core" },
        { es: { name: "San Francisco, CA", description: "Embarcadero y centro de la ciudad" } },
      ),
      "en-GB",
      "offline-area: sf",
    ),
    image: withBasePath("images/goldengate.png", "Golden Gate Bridge from an overlook"),
    sizeBytes: 623 * 1024 ** 2,
    progress: 1,
    status: "complete",
    lastUpdatedAt: "2025-11-23T10:00:00Z",
  },
  {
    id: "london",
    localizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "London, UK", description: "Central London with Thames overlays" },
        { es: { name: "Londres, Reino Unido", description: "Centro de Londres y el Támesis" } },
      ),
      "en-GB",
      "offline-area: london",
    ),
    image: withBasePath("images/londoneye.png", "London skyline with the London Eye"),
    sizeBytes: Math.round(1.2 * 1024 ** 3),
    progress: 0.65,
    status: "downloading",
    lastUpdatedAt: "2025-12-04T08:30:00Z",
  },
];

export const autoManagementOptions: AutoManagementOption[] = [
  {
    id: "auto-delete",
    localizations: fillLocalizations(
      localizeAcrossLocales({
        name: "Auto-delete old maps",
        description: "Remove maps after a retention window",
      }),
      "en-GB",
      "offline-auto: auto-delete",
    ),
    iconToken: "{icon.offline.delete}",
    iconClassName: "text-amber-400",
    defaultEnabled: true,
    retentionDays: 30,
  },
  {
    id: "wifi-only",
    localizations: fillLocalizations(
      localizeAcrossLocales({
        name: "Wi-Fi-only downloads",
        description: "Download maps only on trusted networks",
      }),
      "en-GB",
      "offline-auto: wifi-only",
    ),
    iconToken: "{icon.offline.connectivity}",
    iconClassName: "text-accent",
    defaultEnabled: true,
  },
  {
    id: "auto-update",
    localizations: fillLocalizations(
      localizeAcrossLocales({
        name: "Auto-update maps",
        description: "Keep offline areas fresh in the background",
      }),
      "en-GB",
      "offline-auto: auto-update",
    ),
    iconToken: "{icon.offline.sync}",
    iconClassName: "text-purple-400",
    defaultEnabled: false,
  },
];
