/** @file Shared layout for wizard steps providing header, stepper, and footer actions. */

import type { ReactNode } from "react";

import type { WizardStep } from "../data/wizard";
import { MobileShell } from "../layout/mobile-shell";
import { FontAwesomeIcon } from "./font-awesome-icon";
import { WizardStepper } from "./wizard-stepper";

export interface WizardLayoutProps {
  steps: WizardStep[];
  activeStepId: string;
  onBack?: () => void;
  onHelp?: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function WizardLayout({
  activeStepId,
  children,
  footer,
  onBack,
  onHelp,
  steps,
}: WizardLayoutProps): JSX.Element {
  return (
    <MobileShell tone="dark">
      <div className="flex h-full flex-col">
        <header className="bg-base-900/90 pb-4 pt-8 text-base-content shadow-sm shadow-base-900/40 backdrop-blur">
          <div className="flex items-center justify-between px-6">
            <button
              type="button"
              aria-label="Back"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/60 bg-base-200/60"
              onClick={onBack}
            >
              <FontAwesomeIcon name="fa-solid fa-arrow-left" />
            </button>
            <h1 className="text-lg font-semibold">Walk Wizard</h1>
            <button
              type="button"
              aria-label="Help"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/60 bg-base-200/60"
              onClick={onHelp}
            >
              <FontAwesomeIcon name="fa-solid fa-question" />
            </button>
          </div>
          <WizardStepper steps={steps} activeStepId={activeStepId} />
        </header>
        <main className="flex-1 overflow-y-auto px-6 pb-28 pt-6">{children}</main>
        {footer ? (
          <footer className="sticky bottom-0 bg-base-900/85 px-6 py-5 backdrop-blur">
            {footer}
          </footer>
        ) : null}
      </div>
    </MobileShell>
  );
}
