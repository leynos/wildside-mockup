/** @file Route for the walk completion summary screen. */

import { createRoute } from "@tanstack/react-router";

import { WalkCompleteScreen } from "../../features/walk-complete";
import { rootRoute } from "../root-route";

export const walkCompleteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/walk-complete",
  component: WalkCompleteScreen,
});
