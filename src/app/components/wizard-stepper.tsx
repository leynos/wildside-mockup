/** @file Stepper indicator for the three-step walk wizard. */

import type { JSX } from "react";
import type { WizardStep } from "../data/wizard";

export interface WizardStepperProps {
  steps: WizardStep[];
  activeStepId: string;
}

export function WizardStepper({ activeStepId, steps }: WizardStepperProps): JSX.Element {
  return (
    <div className="pb-2">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isActive = step.id === activeStepId;
          const isCompleted = steps.findIndex((candidate) => candidate.id === activeStepId) > index;
          return (
            <div key={step.id} className="flex items-center gap-2">
              <div className="relative flex h-2 w-2 items-center justify-center">
                <span
                  className={`block h-2 w-2 rounded-full ${
                    isActive || isCompleted ? "bg-accent" : "bg-base-300"
                  }`}
                />
                {isActive ? <span className="wizard-stepper__pulse" /> : null}
              </div>
              {index < steps.length - 1 ? (
                <span className={`h-0.5 w-8 ${isCompleted ? "bg-accent" : "bg-base-300"}`} />
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs">
        {steps.find((step) => step.id === activeStepId)?.title ?? ""}
      </p>
    </div>
  );
}
