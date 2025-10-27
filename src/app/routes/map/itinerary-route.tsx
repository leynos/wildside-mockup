/** @file Route for the detailed map itinerary view. */

import { createRoute } from "@tanstack/react-router";

import { ItineraryScreen } from "../../features/map";
import { rootRoute } from "../root-route";

export const mapItineraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/map/itinerary",
  component: ItineraryScreen,
});
