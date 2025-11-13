/** @file Shared locale metadata consumed by the i18n runtime and UI controls. */

export type TextDirection = "ltr" | "rtl";

export type SupportedLocale = {
  /** BCP-47 code used by i18next and Fluent when loading .ftl bundles. */
  code: string;
  /** Human-friendly label surfaced in selectors; include region when helpful. */
  label: string;
  /** Native spellings improve recognition when the UI is not yet translated. */
  nativeLabel: string;
  /** Optional text direction override when the language is RTL. */
  direction?: TextDirection;
};

export const SUPPORTED_LOCALES = [
  { code: "en-GB", label: "English (UK)", nativeLabel: "English (UK)" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", direction: "rtl" },
  { code: "cy", label: "Welsh", nativeLabel: "Cymraeg" },
  { code: "da", label: "Danish", nativeLabel: "Dansk" },
  { code: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "el", label: "Greek", nativeLabel: "Ελληνικά" },
  { code: "en-US", label: "English (US)", nativeLabel: "English (US)" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "fi", label: "Finnish", nativeLabel: "Suomi" },
  { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "gd", label: "Scots Gaelic", nativeLabel: "Gàidhlig" },
  { code: "he", label: "Hebrew", nativeLabel: "עברית", direction: "rtl" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "it", label: "Italian", nativeLabel: "Italiano" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "ko", label: "Korean", nativeLabel: "한국어" },
  { code: "nb", label: "Norwegian", nativeLabel: "Norsk Bokmål" },
  { code: "nl", label: "Dutch", nativeLabel: "Nederlands" },
  { code: "pl", label: "Polish", nativeLabel: "Polski" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português" },
  { code: "ru", label: "Russian", nativeLabel: "Русский" },
  { code: "sv", label: "Swedish", nativeLabel: "Svenska" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { code: "th", label: "Thai", nativeLabel: "ไทย" },
  { code: "tr", label: "Turkish", nativeLabel: "Türkçe" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt" },
  { code: "zh-CN", label: "Chinese (Simplified)", nativeLabel: "简体中文" },
  { code: "zh-TW", label: "Chinese (Traditional)", nativeLabel: "繁體中文" },
] as const satisfies Readonly<[SupportedLocale, ...SupportedLocale[]]>;

export const DEFAULT_LOCALE = "en-GB";

const defaultLocaleMetadata = (() => {
  const locale = SUPPORTED_LOCALES.find((entry) => entry.code === DEFAULT_LOCALE);
  if (!locale) {
    throw new Error(`DEFAULT_LOCALE '${DEFAULT_LOCALE}' is not present in SUPPORTED_LOCALES`);
  }
  return locale;
})();

const normaliseLocale = (code: string): string => code.toLowerCase();

const extractLanguagePart = (code: string): string => {
  const language = code.split("-")[0] as string;
  return language;
};

const fuzzyMatchLocale = (code: string): SupportedLocale | undefined => {
  const normalised = normaliseLocale(code);
  const normalisedLanguage = extractLanguagePart(normalised);
  return (
    SUPPORTED_LOCALES.find((locale) => normaliseLocale(locale.code) === normalised) ??
    SUPPORTED_LOCALES.find(
      (locale) => normaliseLocale(extractLanguagePart(locale.code)) === normalisedLanguage,
    )
  );
};

export const getLocaleMetadata = (code: string | undefined): SupportedLocale => {
  if (!code) {
    return defaultLocaleMetadata;
  }

  return fuzzyMatchLocale(code) ?? defaultLocaleMetadata;
};

export const getLocaleDirection = (code: string | undefined): TextDirection => {
  return getLocaleMetadata(code).direction ?? "ltr";
};

export const isRtlLocale = (code: string | undefined): boolean => {
  return getLocaleDirection(code) === "rtl";
};

/**@example
 * ```ts
 * import { SUPPORTED_LOCALES } from "./supported-locales";
 *
 * SUPPORTED_LOCALES.forEach((locale) => console.log(locale.code));
 * ```
 */
