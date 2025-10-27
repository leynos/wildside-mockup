/** @file Discover route binding the onboarding screen into the router tree. */

import { createRoute } from "@tanstack/react-router";

import { DiscoverScreen } from "../../features/discover";
import { rootRoute } from "../root-route";

export const discoverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/discover",
  component: DiscoverScreen,
});
