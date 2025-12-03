/**
 * @file Shared helpers for seeding entity localization maps across fixtures.
 */

import type { EntityLocalizations, LocaleCode } from "../domain/entities/localization";
import { SUPPORTED_LOCALES } from "../i18n/supported-locales";

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
 * Normalise a partial localization map to cover all supported locales.
 */
export const fillLocalizations = (
  localizations: EntityLocalizations,
  fallbackLocale: LocaleCode = "en-GB",
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
  fillLocalizations(localizeAcrossLocales(base, overrides), "en-GB", context);
