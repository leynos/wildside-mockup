/** @file Layout route wrapping map screens with persistent map state. */

import { createRoute, Outlet } from "@tanstack/react-router";
import type { JSX } from "react";

import { MapStateProvider } from "../../features/map/map-state";
import { rootRoute } from "../root-route";

export const mapLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/map",
  component: function MapLayoutRoute(): JSX.Element {
    return (
      <MapStateProvider>
        <Outlet />
      </MapStateProvider>
    );
  },
});
