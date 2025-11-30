/** @file Shared helpers for Explore fixture definitions. */

import type { EntityLocalizations, ImageAsset, LocaleCode } from "../domain/entities/localization";
import { SUPPORTED_LOCALES } from "../i18n/supported-locales";
import type {
  CommunityPickId,
  RouteCategoryId,
  RouteCollectionId,
  RouteId,
  ThemeId,
} from "./explore.models";
import type { BadgeId } from "./registries/badges";

/**
 * Create an image asset tuple for fixtures.
 *
 * @param url - Absolute or relative image URL.
 * @param alt - Human-friendly alt text describing the image.
 * @returns An ImageAsset with `url` and `alt` fields.
 *
 * @example
 * const hero = image("https://example.com/pic.jpg", "Harbour at dusk");
 * // hero = { url: "https://example.com/pic.jpg", alt: "Harbour at dusk" }
 */
export const image = (url: string, alt: string): ImageAsset => ({ url, alt });

type BaseLocalization = { readonly name: string; readonly description?: string };

/**
 * Expand a base localisation across all supported locales, with optional
 * per-locale overrides when translations are available.
 *
 * @example
 * const base = { name: "Market Hop", description: "Local food and crafts" };
 * const overrides = { es: { name: "Ruta de mercados", description: "Comida y artesanía" } };
 * const localized = localizeAcrossLocales(base, overrides);
 * // localized.en-GB.name === "Market Hop"
 * // localized.es.name === "Ruta de mercados"
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

/**
 * Unsafe cast helpers for branded IDs. Callers must ensure the provided string
 * is a valid identifier before casting.
 */
export const unsafeRouteId = (value: string): RouteId => value as RouteId;
export const unsafeRouteCategoryId = (value: string): RouteCategoryId => value as RouteCategoryId;
export const unsafeThemeId = (value: string): ThemeId => value as ThemeId;
export const unsafeRouteCollectionId = (value: string): RouteCollectionId =>
  value as RouteCollectionId;
export const unsafeBadgeId = (value: string): BadgeId => value as BadgeId;
export const unsafeCommunityPickId = (value: string): CommunityPickId => value as CommunityPickId;

const supportedLocaleCodes: readonly LocaleCode[] = SUPPORTED_LOCALES.map(
  (locale) => locale.code as LocaleCode,
);

/**
 * Normalise a partial localisation map to cover all supported locales.
 *
 * Missing locales are filled from the provided `fallbackLocale` (or the first
 * available entry). In development a warning is logged when any locales are
 * backfilled, but the behaviour is unchanged in production.
 *
 * @param localizations - Partial map of locale code to localisation strings.
 * @param fallbackLocale - Preferred locale to use when filling gaps.
 * @param context - Optional identifier included in the dev-only warning.
 * @returns A localisation map with entries for every supported locale.
 *
 * @example
 * const sparse = { "en-GB": { name: "Harbour Lights" } };
 * const filled = fillLocalizations(sparse, "en-GB", "route: harbour-lights");
 * // filled["en-GB"].name === "Harbour Lights"
 * // filled["es"].name === "Harbour Lights" (backfilled from en-GB)
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
