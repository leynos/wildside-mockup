/** @file Route for the detailed map itinerary view. */

import { createRoute } from "@tanstack/react-router";

import { ItineraryScreen } from "../../features/map";
import { mapLayoutRoute } from "./layout-route";

export const mapItineraryRoute = createRoute({
  getParentRoute: () => mapLayoutRoute,
  path: "itinerary",
  component: ItineraryScreen,
});
