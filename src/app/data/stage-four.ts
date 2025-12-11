/** @file Data fixtures supporting Stage 4 routes (completion and safety flows). */

import walkRouteMap1 from "../../assets/walks/walk-route-map-1.png";
import type { EntityLocalizations, ImageAsset } from "../domain/entities/localization";
import { metresFromKilometres, secondsFromMinutes } from "../units/unit-format";
import {
  brandLocalizations,
  fillLocalizations,
  localizeAcrossLocales,
} from "./fixture-localization";

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
    localizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "Distance" },
        {
          ar: { name: "المسافة" },
          cy: { name: "Pellter" },
          de: { name: "Distanz" },
          el: { name: "Απόσταση" },
          es: { name: "Distancia" },
          fi: { name: "Matka" },
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
      ),
      "en-GB",
      "stat: distance",
    ),
    value: { kind: "distance", metres: metresFromKilometres(3.2) },
    iconToken: "{icon.object.distance}",
  },
  {
    id: "duration",
    localizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "Duration" },
        {
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
      ),
      "en-GB",
      "stat: duration",
    ),
    value: { kind: "duration", seconds: secondsFromMinutes(58) },
    iconToken: "{icon.object.duration}",
  },
];

export const walkCompletionSecondaryStats: ReadonlyArray<WalkCompletionStat> = [
  {
    id: "energy",
    localizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "Energy" },
        {
          ar: { name: "الطاقة" },
          cy: { name: "Egni" },
          da: { name: "Energi" },
          de: { name: "Energie" },
          el: { name: "Ενέργεια" },
          es: { name: "Energía" },
          fi: { name: "Energia" },
          fr: { name: "Énergie" },
          gd: { name: "Lùths" },
          he: { name: "אנרגיה" },
          hi: { name: "ऊर्जा" },
          it: { name: "Energia" },
          ja: { name: "エネルギー" },
          ko: { name: "에너지" },
          nb: { name: "Energi" },
          nl: { name: "Energie" },
          pl: { name: "Energia" },
          pt: { name: "Energia" },
          ru: { name: "Энергия" },
          sv: { name: "Energi" },
          ta: { name: "ஆற்றல்" },
          th: { name: "พลังงาน" },
          tr: { name: "Enerji" },
          vi: { name: "Năng lượng" },
          "zh-CN": { name: "能量" },
          "zh-TW": { name: "能量" },
        },
      ),
      "en-GB",
      "stat: energy",
    ),
    value: { kind: "energy", kilocalories: 247 },
    iconToken: "{icon.object.calories}",
  },
  {
    id: "stops",
    localizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "Stops" },
        {
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
      ),
      "en-GB",
      "stat: stops",
    ),
    value: { kind: "count", value: 7, unitToken: "count-stop" },
    iconToken: "{icon.object.stops}",
  },
  {
    id: "starred",
    localizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "Starred" },
        {
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
      ),
      "en-GB",
      "stat: starred",
    ),
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
    localizations: brandLocalizations(
      "Facebook",
      { ar: "فيسبوك", he: "פייסבוק", hi: "फ़ेसबुक", ko: "페이스북", ta: "பேஸ்புக்" },
      "share-option: facebook",
    ),
    iconToken: "{icon.brand.facebook}",
    accentClass: "bg-blue-600",
  },
  {
    id: "instagram",
    localizations: brandLocalizations(
      "Instagram",
      { ar: "إنستغرام", he: "אינסטגרם", hi: "इंस्टाग्राम", ko: "인스타그램", ta: "இன்ஸ்டாகிராம்" },
      "share-option: instagram",
    ),
    iconToken: "{icon.brand.instagram}",
    accentClass: "bg-pink-600",
  },
  {
    id: "twitter",
    localizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "X (Twitter)" },
        {
          ar: { name: "X ‏(تويتر)" },
          he: { name: "X ‏(טוויטר)" },
          hi: { name: "X (ट्विटर)" },
          ja: { name: "X（Twitter）" },
          ko: { name: "X(트위터)" },
          ta: { name: "X (ட்விட்டர்)" },
          "zh-CN": { name: "X（Twitter）" },
          "zh-TW": { name: "X（Twitter）" },
        },
      ),
      "en-GB",
      "share-option: twitter",
    ),
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

export const offlineMapAreas: ReadonlyArray<OfflineMapArea> = [
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

export const autoManagementOptions: ReadonlyArray<AutoManagementOption> = [
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
