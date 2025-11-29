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

export const image = (url: string, alt: string): ImageAsset => ({ url, alt });

type BaseLocalization = { readonly name: string; readonly description?: string };

/**
 * Expand a base localisation across all supported locales, with optional
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

export const fillLocalizations = (
  localizations: EntityLocalizations,
  fallbackLocale: LocaleCode = "en-GB",
  context?: string,
): EntityLocalizations => {
  const fallback =
    localizations[fallbackLocale] ??
    Object.values(localizations).find((value): value is NonNullable<typeof value> =>
      Boolean(value),
    ) ??
    undefined;
  if (!fallback) {
    return localizations;
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
