/** @file Explore route connecting the catalogue experience. */

import { createRoute } from "@tanstack/react-router";

import { ExploreScreen } from "../../features/explore";
import { rootRoute } from "../root-route";

export const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/explore",
  component: ExploreScreen,
});
