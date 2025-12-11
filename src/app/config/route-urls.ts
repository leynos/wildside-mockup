/** @file URL configuration for route sharing and deep links. */

/**
 * Base URL for public route sharing links.
 *
 * @example
 * getRouteShareUrl("route-123") // => "https://wildside.app/routes/route-123"
 */
export const ROUTE_SHARE_BASE_URL = "https://wildside.app/routes";

/**
 * Constructs a shareable URL for a given route ID.
 *
 * Route IDs use kebab-case and require no URL-encoding.
 *
 * @example
 * getRouteShareUrl("harbour-lights") // => "https://wildside.app/routes/harbour-lights"
 * getRouteShareUrl("coffee-culture-loop") // => "https://wildside.app/routes/coffee-culture-loop"
 */
export function getRouteShareUrl(routeId: string): string {
  return `${ROUTE_SHARE_BASE_URL}/${routeId}`;
}
