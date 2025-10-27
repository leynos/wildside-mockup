/** @file Aggregates the router tree for the application. */

import { customizeRoute } from "./customize/route";
import { discoverRoute } from "./discover/route";
import { exploreRoute } from "./explore/route";
import { indexRoute } from "./index-route";
import { mapItineraryRoute } from "./map/itinerary-route";
import { mapQuickRoute } from "./map/quick-route";
import { offlineRoute } from "./offline/route";
import { rootRoute } from "./root-route";
import { safetyAccessibilityRoute } from "./safety-accessibility/route";
import { savedRoute } from "./saved/route";
import { walkCompleteRoute } from "./walk-complete/route";
import { wizardIndexRoute } from "./wizard/index-route";
import { wizardStepOneRoute } from "./wizard/step-one-route";
import { wizardStepThreeRoute } from "./wizard/step-three-route";
import { wizardStepTwoRoute } from "./wizard/step-two-route";

export const routeTree = rootRoute.addChildren([
  indexRoute,
  discoverRoute,
  exploreRoute,
  customizeRoute,
  mapQuickRoute,
  mapItineraryRoute,
  savedRoute,
  wizardIndexRoute,
  wizardStepOneRoute,
  wizardStepTwoRoute,
  wizardStepThreeRoute,
  walkCompleteRoute,
  offlineRoute,
  safetyAccessibilityRoute,
]);
