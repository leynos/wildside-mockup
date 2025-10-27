/** @file Route binding for the quick map generator. */

import { createRoute } from "@tanstack/react-router";

import { QuickWalkScreen } from "../../features/map";
import { rootRoute } from "../root-route";

export const mapQuickRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/map/quick",
  component: QuickWalkScreen,
});
