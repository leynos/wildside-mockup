/** @file Shared locale metadata consumed by the i18n runtime and UI controls. */

export type SupportedLocale = {
  /** BCP-47 code used by i18next and Fluent when loading .ftl bundles. */
  code: string;
  /** Human-friendly label surfaced in selectors; include region when helpful. */
  label: string;
  /** Native spellings improve recognition when the UI is not yet translated. */
  nativeLabel: string;
};

export const SUPPORTED_LOCALES = [
  { code: "en-GB", label: "English (UK)", nativeLabel: "English (UK)" },
  { code: "en-US", label: "English (US)", nativeLabel: "English (US)" },
  { code: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português" },
  { code: "pl", label: "Polish", nativeLabel: "Polski" },
  { code: "ru", label: "Russian", nativeLabel: "Русский" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { code: "da", label: "Danish", nativeLabel: "Dansk" },
  { code: "zh-CN", label: "Chinese (Simplified)", nativeLabel: "简体中文" },
  { code: "zh-TW", label: "Chinese (Traditional)", nativeLabel: "繁體中文" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "ko", label: "Korean", nativeLabel: "한국어" },
  { code: "nl", label: "Dutch", nativeLabel: "Nederlands" },
  { code: "he", label: "Hebrew", nativeLabel: "עברית" },
  { code: "nb", label: "Norwegian", nativeLabel: "Norsk Bokmål" },
  { code: "sv", label: "Swedish", nativeLabel: "Svenska" },
  { code: "fi", label: "Finnish", nativeLabel: "Suomi" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt" },
  { code: "th", label: "Thai", nativeLabel: "ไทย" },
  { code: "cy", label: "Welsh", nativeLabel: "Cymraeg" },
  { code: "gd", label: "Scots Gaelic", nativeLabel: "Gàidhlig" },
] as const satisfies Readonly<[SupportedLocale, ...SupportedLocale[]]>;

export const DEFAULT_LOCALE = SUPPORTED_LOCALES[0].code;

/**@example
 * ```ts
 * import { SUPPORTED_LOCALES } from "./supported-locales";
 *
 * SUPPORTED_LOCALES.forEach((locale) => console.log(locale.code));
 * ```
 */
