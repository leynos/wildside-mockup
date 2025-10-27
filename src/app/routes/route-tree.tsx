/** @file Aggregates the router tree for the application. */

import { customizeRoute } from "./customize/route";
import { discoverRoute } from "./discover/route";
import { exploreRoute } from "./explore/route";
import { indexRoute } from "./index-route";
import { mapItineraryRoute } from "./map/itinerary-route";
import { mapQuickRoute } from "./map/quick-route";
import { rootRoute } from "./root-route";
import { savedRoute } from "./saved/route";

export const routeTree = rootRoute.addChildren([
  indexRoute,
  discoverRoute,
  exploreRoute,
  customizeRoute,
  mapQuickRoute,
  mapItineraryRoute,
  savedRoute,
]);
