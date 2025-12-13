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

export type BrandTransliterationLocale = Extract<
  LocaleCode,
  "ar" | "el" | "he" | "hi" | "ja" | "ko" | "ru" | "ta" | "th" | "zh-CN" | "zh-TW"
>;

/**
 * Create localizations for brand names that need transliteration in specific scripts.
 * Most locales use the original brand name, but RTL and non-Latin scripts may need overrides.
 *
 * @example
 * const localizations = brandLocalizations("Facebook", { ar: "فيسبوك" });
 * // localizations["en-GB"].name === "Facebook"
 * // localizations["ar"].name === "فيسبوك"
 * // localizations["fr"].name === "Facebook" (falls back to Latin)
 *
 * @example
 * const localizations = brandLocalizations("Google", { ja: "グーグル", "zh-CN": "谷歌" });
 * // localizations["ja"].name === "グーグル"
 * // localizations["zh-CN"].name === "谷歌"
 * // localizations["en-GB"].name === "Google"
 * // localizations["es"].name === "Google"
 *
 * @param latinName - The brand name in Latin script (e.g., "Facebook")
 * @param scriptOverrides - Locale overrides for scripts that commonly transliterate brand names.
 *   This is intentionally a narrow set to keep call sites explicit, but includes the major non-Latin locales we ship.
 * @param context - Optional context string for debugging
 */
export const brandLocalizations = (
  latinName: string,
  scriptOverrides: Partial<Record<BrandTransliterationLocale, string>> = {},
  context?: string,
): EntityLocalizations => {
  const overrides: Partial<Record<LocaleCode, BaseLocalization>> = {};

  for (const locale of Object.keys(scriptOverrides) as BrandTransliterationLocale[]) {
    const name = scriptOverrides[locale];
    if (name) overrides[locale] = { name };
  }

  return fillLocalizations(
    localizeAcrossLocales({ name: latinName }, overrides),
    DEFAULT_LOCALE as LocaleCode,
    context,
  );
};
