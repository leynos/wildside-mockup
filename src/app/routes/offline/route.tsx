/** @file Route for offline map manager screen. */

import { createRoute } from "@tanstack/react-router";

import { OfflineScreen } from "../../features/offline";
import { rootRoute } from "../root-route";

export const offlineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/offline",
  component: OfflineScreen,
});
