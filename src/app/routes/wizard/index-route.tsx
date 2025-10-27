/** @file Redirect /wizard to the first wizard step. */

import { createRoute, redirect } from "@tanstack/react-router";

import { rootRoute } from "../root-route";

export const wizardIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wizard",
  beforeLoad: () => redirect({ to: "/wizard/step-1" }),
});
