/** @file Shared helpers for Explore fixture definitions. */

import type { ImageAsset } from "../domain/entities/localization";
import type {
  CommunityPickId,
  RouteCategoryId,
  RouteCollectionId,
  RouteId,
  ThemeId,
} from "./explore.models";
import { fillLocalizations, localizeAcrossLocales } from "./fixture-localization";
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

/**
 * Unsafe cast helpers for branded IDs. Callers must ensure the provided string
 * is a valid identifier before casting.
 */
export const unsafeRouteId = (value: string): RouteId => value as RouteId;
export const unsafeRouteCategoryId = (value: string): RouteCategoryId => value as RouteCategoryId;
export const unsafeThemeId = (value: string): ThemeId => value as ThemeId;
export const unsafeRouteCollectionId = (value: string): RouteCollectionId =>
  value as RouteCollectionId;
/**
 * Unsafe cast to a badge identifier. `BadgeId` is a literal union sourced from
 * `badgeDescriptors`; callers must ensure the value exists there. Use
 * `getBadgeDescriptor` for runtime validation when resolving descriptors.
 */
export const unsafeBadgeId = (value: string): BadgeId => value as BadgeId;
export const unsafeCommunityPickId = (value: string): CommunityPickId => value as CommunityPickId;

export { fillLocalizations, localizeAcrossLocales };
