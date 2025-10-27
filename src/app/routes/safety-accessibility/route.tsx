/** @file Route for safety & accessibility preferences screen. */

import { createRoute } from "@tanstack/react-router";

import { SafetyAccessibilityScreen } from "../../features/safety";
import { rootRoute } from "../root-route";

export const safetyAccessibilityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety-accessibility",
  component: SafetyAccessibilityScreen,
});
