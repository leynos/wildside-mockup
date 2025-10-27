/** @file Route for wizard step three. */

import { createRoute } from "@tanstack/react-router";

import { WizardStepThree } from "../../features/wizard";
import { rootRoute } from "../root-route";

export const wizardStepThreeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wizard/step-3",
  component: WizardStepThree,
});
