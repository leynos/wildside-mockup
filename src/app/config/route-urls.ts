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
 */
export function getRouteShareUrl(routeId: string): string {
  return `${ROUTE_SHARE_BASE_URL}/${routeId}`;
}
