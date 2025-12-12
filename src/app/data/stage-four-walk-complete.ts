/** @file Stage 4 fixtures for the walk completion flow. */

import walkRouteMap1 from "../../assets/walks/walk-route-map-1.png";
import type { EntityLocalizations } from "../domain/entities/localization";
import { metresFromKilometres, secondsFromMinutes } from "../units/unit-format";
import {
  brandLocalizations,
  fillLocalizations,
  localizeAcrossLocales,
} from "./fixture-localization";
import {
  coffeeMomentLocalizations,
  muralMomentLocalizations,
  parkMomentLocalizations,
} from "./walk-complete-moment-localizations";

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
          da: { name: "Afstand" },
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
    localizations: coffeeMomentLocalizations,
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/03fdb8eff5-0706dc4eec4e2208ca2d.png",
  },
  {
    id: "mural",
    localizations: muralMomentLocalizations,
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/7c8c56a54b-101578a06001bb190271.png",
  },
  {
    id: "park",
    localizations: parkMomentLocalizations,
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
