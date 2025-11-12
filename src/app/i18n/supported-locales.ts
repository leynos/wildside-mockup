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
  { code: "en", label: "English (US)", nativeLabel: "English" },
  { code: "es", label: "Español", nativeLabel: "Español" },
] as const satisfies Readonly<[SupportedLocale, ...SupportedLocale[]]>;

export const DEFAULT_LOCALE = SUPPORTED_LOCALES[0].code;

/**@example
 * ```ts
 * import { SUPPORTED_LOCALES } from "./supported-locales";
 *
 * SUPPORTED_LOCALES.forEach((locale) => console.log(locale.code));
 * ```
 */
