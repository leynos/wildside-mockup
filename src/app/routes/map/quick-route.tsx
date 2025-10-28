/** @file Route binding for the quick map generator. */

import { createRoute } from "@tanstack/react-router";

import { QuickWalkScreen } from "../../features/map";
import { mapLayoutRoute } from "./layout-route";

export const mapQuickRoute = createRoute({
  getParentRoute: () => mapLayoutRoute,
  path: "quick",
  component: QuickWalkScreen,
});
