/**
 * @file Shared helpers for seeding entity localization maps across fixtures.
 */

import type { EntityLocalizations, LocaleCode } from "../domain/entities/localization";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "../i18n/supported-locales";

type BaseLocalization = {
  readonly name: string;
  readonly description?: string;
  readonly shortLabel?: string;
};

/**
 * Expand a base localization across all supported locales, with optional
 * per-locale overrides when translations are available.
 */
export const localizeAcrossLocales = (
  base: BaseLocalization,
  overrides: Partial<Record<LocaleCode, BaseLocalization>> = {},
): EntityLocalizations =>
  SUPPORTED_LOCALES.reduce<EntityLocalizations>((acc, locale) => {
    const code = locale.code as LocaleCode;
    acc[code] = overrides[code] ?? base;
    return acc;
  }, {});

const supportedLocaleCodes: readonly LocaleCode[] = SUPPORTED_LOCALES.map(
  (locale) => locale.code as LocaleCode,
);

/**
 * Normalize a partial localization map to cover all supported locales.
 */
export const fillLocalizations = (
  localizations: EntityLocalizations,
  fallbackLocale: LocaleCode = DEFAULT_LOCALE as LocaleCode,
  context?: string,
): EntityLocalizations => {
  const fallback =
    localizations[fallbackLocale] ??
    Object.values(localizations).find((value): value is NonNullable<typeof value> =>
      Boolean(value),
    );

  if (!fallback) {
    throw new Error(
      `fillLocalizations failed: no fallback found (requested '${fallbackLocale}'), locales present: ${Object.keys(localizations).join(", ")}`,
    );
  }

  const missingLocales = supportedLocaleCodes.filter((code) => !localizations[code]);
  if (import.meta.env.DEV && missingLocales.length > 0) {
    // eslint-disable-next-line no-console
    console.warn("fillLocalizations applied fallback", {
      context,
      missingLocales,
      availableLocales: Object.keys(localizations),
      fallbackLocale,
    });
  }

  return supportedLocaleCodes.reduce<EntityLocalizations>((acc, code) => {
    acc[code] = localizations[code] ?? fallback;
    return acc;
  }, {});
};

export const localisation = (
  base: { name: string; description?: string; shortLabel?: string },
  overrides: Partial<
    Record<LocaleCode, { name: string; description?: string; shortLabel?: string }>
  > = {},
  context?: string,
): EntityLocalizations =>
  fillLocalizations(localizeAcrossLocales(base, overrides), DEFAULT_LOCALE as LocaleCode, context);

/**
 * Create localizations for brand names that need transliteration in specific scripts.
 * Most locales use the original brand name, but RTL and non-Latin scripts may need overrides.
 *
 * @param latinName - The brand name in Latin script (e.g., "Facebook")
 * @param scriptOverrides - Names for locales using non-Latin scripts (ar, he, hi, ko, ta).
 *   This intentionally targets the scripts where we most commonly transliterate brand names in the UI; most other
 *   supported locales keep the Latin spelling rather than introducing a locale-specific translation.
 * @param context - Optional context string for debugging
 */
export const brandLocalizations = (
  latinName: string,
  // Only RTL and select Indic/CJK scripts typically transliterate brand names; Japanese, Chinese, Thai, Greek, and
  // Cyrillic usually retain the Latin spellings shown in apps and maps.
  scriptOverrides: Partial<Record<"ar" | "he" | "hi" | "ko" | "ta", string>> = {},
  context?: string,
): EntityLocalizations => {
  const overrides: Partial<Record<LocaleCode, BaseLocalization>> = {};

  for (const [locale, name] of Object.entries(scriptOverrides)) {
    if (name) {
      overrides[locale as LocaleCode] = { name };
    }
  }

  return fillLocalizations(
    localizeAcrossLocales({ name: latinName }, overrides),
    DEFAULT_LOCALE as LocaleCode,
    context,
  );
};
