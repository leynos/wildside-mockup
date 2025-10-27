/** @file Route for wizard step one. */

import { createRoute } from "@tanstack/react-router";

import { WizardStepOne } from "../../features/wizard";
import { rootRoute } from "../root-route";

export const wizardStepOneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wizard/step-1",
  component: WizardStepOne,
});
