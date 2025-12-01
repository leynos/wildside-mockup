/** @file Runtime localisation helpers shared across feature screens. */

import type {
  EntityLocalizations,
  LocaleCode,
  LocalizedStringSet,
} from "../domain/entities/localization";
import { defaultFallbackLocales, pickLocalization } from "../domain/entities/localization";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "../i18n/supported-locales";

type ResolutionOptions = {
  readonly fallbackLocales?: readonly LocaleCode[];
};

export const fallbackLocalization = (
  localizations: EntityLocalizations,
  fallbackName: string,
): LocalizedStringSet => Object.values(localizations).find(Boolean) ?? { name: fallbackName };

/**
 * Resolve an entity localisation with predictable fallbacks and safe logging.
 */
export const resolveLocalization = (
  localizations: EntityLocalizations,
  locale: LocaleCode,
  fallbackName: string,
  { fallbackLocales = defaultFallbackLocales }: ResolutionOptions = {},
): LocalizedStringSet => {
  const fallback = fallbackLocalization(localizations, fallbackName);
  try {
    return pickLocalization(localizations, locale, fallbackLocales);
  } catch (error) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("Falling back to default localisation", { locale, fallbackName, error });
    }
    return fallback;
  }
};

/**
 * Normalise an incoming language tag to a supported LocaleCode.
 */
export const coerceLocaleCode = (
  language: string | undefined,
  fallback: LocaleCode = DEFAULT_LOCALE as LocaleCode,
): LocaleCode => {
  if (!language) return fallback;
  const normalised = language.trim().toLowerCase();
  const direct = SUPPORTED_LOCALES.find((locale) => locale.code.toLowerCase() === normalised);
  if (direct) return direct.code as LocaleCode;

  const [languagePart] = normalised.split("-");
  const languageMatch = SUPPORTED_LOCALES.find(
    (locale) => locale.code.split("-")[0]?.toLowerCase() === languagePart,
  );
  if (languageMatch) return languageMatch.code as LocaleCode;

  const fallbackLocale =
    SUPPORTED_LOCALES.find((locale) => locale.code === fallback) ?? SUPPORTED_LOCALES[0];
  return fallbackLocale.code as LocaleCode;
};
