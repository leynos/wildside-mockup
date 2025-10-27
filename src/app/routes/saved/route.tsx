/** @file Route exposing the saved walk detail screen. */

import { createRoute } from "@tanstack/react-router";

import { SavedScreen } from "../../features/map";
import { rootRoute } from "../root-route";

export const savedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/saved",
  component: SavedScreen,
});
