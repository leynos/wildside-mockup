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

export const DEFAULT_LOCALE = SUPPORTED_LOCALES[0]?.code ?? "en-GB";

const LOCALE_MAP: Record<string, SupportedLocale> = SUPPORTED_LOCALES.reduce(
  (map, locale) => {
    const fullCode = locale.code.toLowerCase();
    map[fullCode] = locale;
    const [languagePart] = fullCode.split("-");
    const languageKey = languagePart ?? fullCode;
    if (!map[languageKey]) {
      map[languageKey] = locale;
    }
    return map;
  },
  {} as Record<string, SupportedLocale>,
);

const defaultLocaleMetadata = (() => {
  const locale = LOCALE_MAP[DEFAULT_LOCALE.toLowerCase()];
  if (!locale) {
    throw new Error(`DEFAULT_LOCALE '${DEFAULT_LOCALE}' is not present in SUPPORTED_LOCALES`);
  }
  return locale;
})();

export const getLocaleMetadata = (code: string | undefined): SupportedLocale => {
  if (!code) {
    return defaultLocaleMetadata;
  }

  const lookupKey = code.toLowerCase();
  const directMatch = LOCALE_MAP[lookupKey];
  if (directMatch) {
    return directMatch;
  }

  const [languagePart] = lookupKey.split("-");
  if (languagePart) {
    const languageMatch = LOCALE_MAP[languagePart];
    if (languageMatch) {
      return languageMatch;
    }
  }

  return defaultLocaleMetadata;
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
