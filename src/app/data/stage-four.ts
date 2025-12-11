/** @file Data fixtures supporting Stage 4 routes (completion and safety flows). */

import walkRouteMap1 from "../../assets/walks/walk-route-map-1.png";
import type { EntityLocalizations, ImageAsset } from "../domain/entities/localization";
import { metresFromKilometres, secondsFromMinutes } from "../units/unit-format";
import { fillLocalizations, localizeAcrossLocales } from "./fixture-localization";

export interface WalkCompletionStat {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly value:
    | { kind: "distance"; metres: number }
    | { kind: "duration"; seconds: number }
    | { kind: "count"; value: number; unitToken?: string }
    | { kind: "energy"; kilocalories: number };
  readonly iconToken: string;
}

export const walkCompletionPrimaryStats: ReadonlyArray<WalkCompletionStat> = [
  {
    id: "distance",
    localizations: {
      "en-GB": { name: "Distance" },
      "en-US": { name: "Distance" },
      ar: { name: "المسافة" },
      cy: { name: "Pellter" },
      da: { name: "Distance" },
      de: { name: "Distanz" },
      el: { name: "Απόσταση" },
      es: { name: "Distancia" },
      fi: { name: "Matka" },
      fr: { name: "Distance" },
      gd: { name: "Astar" },
      he: { name: "מרחק" },
      hi: { name: "दूरी" },
      it: { name: "Distanza" },
      ja: { name: "距離" },
      ko: { name: "거리" },
      nb: { name: "Distanse" },
      nl: { name: "Afstand" },
      pl: { name: "Dystans" },
      pt: { name: "Distância" },
      ru: { name: "Дистанция" },
      sv: { name: "Distans" },
      ta: { name: "தூரம்" },
      th: { name: "ระยะทาง" },
      tr: { name: "Mesafe" },
      vi: { name: "Quãng đường" },
      "zh-CN": { name: "距离" },
      "zh-TW": { name: "距離" },
    },
    value: { kind: "distance", metres: metresFromKilometres(3.2) },
    iconToken: "{icon.object.distance}",
  },
  {
    id: "duration",
    localizations: {
      "en-GB": { name: "Duration" },
      "en-US": { name: "Duration" },
      ar: { name: "المدة" },
      cy: { name: "Hyd" },
      da: { name: "Varighed" },
      de: { name: "Dauer" },
      el: { name: "Διάρκεια" },
      es: { name: "Duración" },
      fi: { name: "Kesto" },
      fr: { name: "Durée" },
      gd: { name: "Ùine" },
      he: { name: "משך" },
      hi: { name: "अवधि" },
      it: { name: "Durata" },
      ja: { name: "所要時間" },
      ko: { name: "소요 시간" },
      nb: { name: "Varighet" },
      nl: { name: "Duur" },
      pl: { name: "Czas trwania" },
      pt: { name: "Duração" },
      ru: { name: "Длительность" },
      sv: { name: "Varaktighet" },
      ta: { name: "காலம்" },
      th: { name: "ระยะเวลา" },
      tr: { name: "Süre" },
      vi: { name: "Thời gian" },
      "zh-CN": { name: "时长" },
      "zh-TW": { name: "時間" },
    },
    value: { kind: "duration", seconds: secondsFromMinutes(58) },
    iconToken: "{icon.object.duration}",
  },
];

export const walkCompletionSecondaryStats: ReadonlyArray<WalkCompletionStat> = [
  {
    id: "calories",
    localizations: {
      "en-GB": { name: "Calories" },
      "en-US": { name: "Calories" },
      ar: { name: "السعرات" },
      cy: { name: "Calorïau" },
      da: { name: "Kalorier" },
      de: { name: "Kalorien" },
      el: { name: "Θερμίδες" },
      es: { name: "Calorías" },
      fi: { name: "Kalorit" },
      fr: { name: "Calories" },
      gd: { name: "Calaraidhean" },
      he: { name: "קלוריות" },
      hi: { name: "कैलोरी" },
      it: { name: "Calorie" },
      ja: { name: "消費カロリー" },
      ko: { name: "칼로리" },
      nb: { name: "Kalorier" },
      nl: { name: "Calorieën" },
      pl: { name: "Kalorie" },
      pt: { name: "Calorias" },
      ru: { name: "Калории" },
      sv: { name: "Kalorier" },
      ta: { name: "கலோரிகள்" },
      th: { name: "แคลอรี" },
      tr: { name: "Kalori" },
      vi: { name: "Calo" },
      "zh-CN": { name: "卡路里" },
      "zh-TW": { name: "卡路里" },
    },
    value: { kind: "energy", kilocalories: 247 },
    iconToken: "{icon.object.calories}",
  },
  {
    id: "stops",
    localizations: {
      "en-GB": { name: "Stops" },
      "en-US": { name: "Stops" },
      ar: { name: "المحطات" },
      cy: { name: "Safleoedd" },
      da: { name: "Stop" },
      de: { name: "Stopps" },
      el: { name: "Στάσεις" },
      es: { name: "Paradas" },
      fi: { name: "Pysähdykset" },
      fr: { name: "Arrêts" },
      gd: { name: "Stadan" },
      he: { name: "עצירות" },
      hi: { name: "स्टॉप" },
      it: { name: "Fermate" },
      ja: { name: "立ち寄り" },
      ko: { name: "정차" },
      nb: { name: "Stopp" },
      nl: { name: "Stops" },
      pl: { name: "Przystanki" },
      pt: { name: "Paragens" },
      ru: { name: "Остановки" },
      sv: { name: "Stopp" },
      ta: { name: "நிறுத்தங்கள்" },
      th: { name: "จุดแวะ" },
      tr: { name: "Duraklar" },
      vi: { name: "Điểm dừng" },
      "zh-CN": { name: "站点" },
      "zh-TW": { name: "停靠點" },
    },
    value: { kind: "count", value: 7, unitToken: "count-stop" },
    iconToken: "{icon.object.stops}",
  },
  {
    id: "starred",
    localizations: {
      "en-GB": { name: "Starred" },
      "en-US": { name: "Starred" },
      ar: { name: "المفضلة" },
      cy: { name: "Ffefrynnau" },
      da: { name: "Favoritter" },
      de: { name: "Favoriten" },
      el: { name: "Αγαπημένα" },
      es: { name: "Favoritos" },
      fi: { name: "Suosikit" },
      fr: { name: "Favoris" },
      gd: { name: "Favouritan" },
      he: { name: "מועדפים" },
      hi: { name: "पसंदीदा" },
      it: { name: "Preferiti" },
      ja: { name: "お気に入り" },
      ko: { name: "즐겨찾기" },
      nb: { name: "Favoritter" },
      nl: { name: "Favorieten" },
      pl: { name: "Ulubione" },
      pt: { name: "Favoritos" },
      ru: { name: "Избранное" },
      sv: { name: "Favoriter" },
      ta: { name: "விருப்பமானவை" },
      th: { name: "รายการโปรด" },
      tr: { name: "Favoriler" },
      vi: { name: "Yêu thích" },
      "zh-CN": { name: "收藏" },
      "zh-TW": { name: "最愛" },
    },
    value: { kind: "count", value: 3 },
    iconToken: "{icon.object.star}",
  },
];

export interface WalkCompletionMoment {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly imageUrl: string;
}

export const walkCompletionMoments: ReadonlyArray<WalkCompletionMoment> = [
  {
    id: "coffee",
    localizations: fillLocalizations(
      localizeAcrossLocales({
        name: "Blue Bottle Coffee",
        description: "Perfect cortado & friendly barista",
      }),
      "en-GB",
      "moment: coffee",
    ),
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/03fdb8eff5-0706dc4eec4e2208ca2d.png",
  },
  {
    id: "mural",
    localizations: fillLocalizations(
      localizeAcrossLocales({
        name: "Hidden Mural",
        description: "Amazing street art in quiet alley",
      }),
      "en-GB",
      "moment: mural",
    ),
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/7c8c56a54b-101578a06001bb190271.png",
  },
  {
    id: "park",
    localizations: fillLocalizations(
      localizeAcrossLocales({
        name: "Meridian Hill Park",
        description: "Peaceful pond with friendly ducks",
      }),
      "en-GB",
      "moment: park",
    ),
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/ad4258f4ad-817a02de971280a8ef8b.png",
  },
];

export interface WalkCompletionShareOption {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly iconToken: string;
  readonly accentClass: string;
}

export const walkCompletionShareOptions: ReadonlyArray<WalkCompletionShareOption> = [
  {
    id: "facebook",
    localizations: {
      "en-GB": { name: "Facebook" },
      "en-US": { name: "Facebook" },
      ar: { name: "فيسبوك" },
      cy: { name: "Facebook" },
      da: { name: "Facebook" },
      de: { name: "Facebook" },
      el: { name: "Facebook" },
      es: { name: "Facebook" },
      fi: { name: "Facebook" },
      fr: { name: "Facebook" },
      gd: { name: "Facebook" },
      he: { name: "פייסבוק" },
      hi: { name: "फ़ेसबुक" },
      it: { name: "Facebook" },
      ja: { name: "Facebook" },
      ko: { name: "페이스북" },
      nb: { name: "Facebook" },
      nl: { name: "Facebook" },
      pl: { name: "Facebook" },
      pt: { name: "Facebook" },
      ru: { name: "Facebook" },
      sv: { name: "Facebook" },
      ta: { name: "பேஸ்புக்" },
      th: { name: "Facebook" },
      tr: { name: "Facebook" },
      vi: { name: "Facebook" },
      "zh-CN": { name: "Facebook" },
      "zh-TW": { name: "Facebook" },
    },
    iconToken: "{icon.brand.facebook}",
    accentClass: "bg-blue-600",
  },
  {
    id: "instagram",
    localizations: {
      "en-GB": { name: "Instagram" },
      "en-US": { name: "Instagram" },
      ar: { name: "إنستغرام" },
      cy: { name: "Instagram" },
      da: { name: "Instagram" },
      de: { name: "Instagram" },
      el: { name: "Instagram" },
      es: { name: "Instagram" },
      fi: { name: "Instagram" },
      fr: { name: "Instagram" },
      gd: { name: "Instagram" },
      he: { name: "אינסטגרם" },
      hi: { name: "इंस्टाग्राम" },
      it: { name: "Instagram" },
      ja: { name: "Instagram" },
      ko: { name: "인스타그램" },
      nb: { name: "Instagram" },
      nl: { name: "Instagram" },
      pl: { name: "Instagram" },
      pt: { name: "Instagram" },
      ru: { name: "Instagram" },
      sv: { name: "Instagram" },
      ta: { name: "இன்ஸ்டாகிராம்" },
      th: { name: "Instagram" },
      tr: { name: "Instagram" },
      vi: { name: "Instagram" },
      "zh-CN": { name: "Instagram" },
      "zh-TW": { name: "Instagram" },
    },
    iconToken: "{icon.brand.instagram}",
    accentClass: "bg-pink-600",
  },
  {
    id: "twitter",
    localizations: {
      "en-GB": { name: "X (Twitter)" },
      "en-US": { name: "X (Twitter)" },
      ar: { name: "X ‏(تويتر)" },
      cy: { name: "X (Twitter)" },
      da: { name: "X (Twitter)" },
      de: { name: "X (Twitter)" },
      el: { name: "X (Twitter)" },
      es: { name: "X (Twitter)" },
      fi: { name: "X (Twitter)" },
      fr: { name: "X (Twitter)" },
      gd: { name: "X (Twitter)" },
      he: { name: "X ‏(טוויטר)" },
      hi: { name: "X (ट्विटर)" },
      it: { name: "X (Twitter)" },
      ja: { name: "X（Twitter）" },
      ko: { name: "X(트위터)" },
      nb: { name: "X (Twitter)" },
      nl: { name: "X (Twitter)" },
      pl: { name: "X (Twitter)" },
      pt: { name: "X (Twitter)" },
      ru: { name: "X (Twitter)" },
      sv: { name: "X (Twitter)" },
      ta: { name: "X (ட்விட்டர்)" },
      th: { name: "X (Twitter)" },
      tr: { name: "X (Twitter)" },
      vi: { name: "X (Twitter)" },
      "zh-CN": { name: "X（Twitter）" },
      "zh-TW": { name: "X（Twitter）" },
    },
    iconToken: "{icon.brand.x}",
    accentClass: "bg-blue-400",
  },
];

export const walkCompletionMapImage = walkRouteMap1;

const withBasePath = (path: string, alt: string): ImageAsset => {
  const base = import.meta.env.BASE_URL ?? "/";
  // Ensure base ends with / before concatenation
  const normalisedBase = base.endsWith("/") ? base : `${base}/`;
  const cleanedPath = path.replace(/^\/+/, "");
  // Collapse duplicate slashes but preserve protocol separators (://)
  const url = `${normalisedBase}${cleanedPath}`.replace(/([^:]\/)\/+/g, "$1");
  return { url, alt };
};

/**
 * A suggested offline map area for the user to download.
 *
 * @property id - Unique identifier for the suggestion.
 * @property localizations - Localised name and description for display.
 * @property ctaLocalizations - Localised call-to-action button label.
 * @property iconToken - Design token for the suggestion icon.
 * @property accentClass - Tailwind gradient classes for the card background.
 * @property iconClassName - Optional additional classes for icon styling.
 */
export interface OfflineSuggestion {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly ctaLocalizations: EntityLocalizations;
  readonly iconToken: string;
  readonly accentClass: string;
  readonly iconClassName?: string;
}

/**
 * A downloaded offline map area with progress and status metadata.
 *
 * @property id - Unique identifier for the map area.
 * @property localizations - Localised name and description for display.
 * @property image - Thumbnail image asset for the area.
 * @property sizeBytes - Total download size in bytes.
 * @property progress - Download progress as a decimal (0 to 1).
 * @property status - Current download state: complete, updating, or downloading.
 * @property lastUpdatedAt - ISO 8601 timestamp of last update.
 */
export interface OfflineMapArea {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly image: ImageAsset;
  readonly sizeBytes: number;
  readonly progress: number;
  readonly status: "complete" | "updating" | "downloading";
  readonly lastUpdatedAt: string;
}

/**
 * Configuration option for automatic offline map management.
 *
 * @property id - Unique identifier for the option.
 * @property localizations - Localised name and description for display.
 * @property iconToken - Design token for the option icon.
 * @property iconClassName - Tailwind classes for icon styling.
 * @property defaultEnabled - Whether the option is enabled by default.
 * @property retentionDays - Number of days to retain maps (for auto-delete option).
 */
export interface AutoManagementOption {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly iconToken: string;
  readonly iconClassName: string;
  readonly defaultEnabled: boolean;
  readonly retentionDays?: number;
}

export { offlineSuggestions } from "./offline-fixtures";

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
