/** @file Route for wizard step two. */

import { createRoute } from "@tanstack/react-router";

import { WizardStepTwo } from "../../features/wizard";
import { rootRoute } from "../root-route";

export const wizardStepTwoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wizard/step-2",
  component: WizardStepTwo,
});
