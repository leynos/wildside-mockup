/** @file Shared layout for wizard steps providing header, stepper, and footer actions. */

import type { JSX, ReactNode } from "react";

import type { WizardStep } from "../data/wizard";
import { AppHeader } from "../layout/app-header";
import { MobileShell } from "../layout/mobile-shell";
import { Icon } from "./icon";
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
        <AppHeader
          variant="wizard"
          title="Walk Wizard"
          leading={
            onBack ? (
              <button
                type="button"
                aria-label="Back"
                className="flex h-full w-full items-center justify-center text-base-content"
                onClick={onBack}
              >
                <Icon token="{icon.navigation.back}" aria-hidden className="h-5 w-5" />
              </button>
            ) : undefined
          }
          trailing={
            onHelp ? (
              <button
                type="button"
                aria-label="Help"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/60 bg-base-200/60 text-accent shadow-sm shadow-base-300/30 transition hover:border-accent/60 hover:text-accent"
                onClick={onHelp}
              >
                <Icon token="{icon.action.help}" aria-hidden className="h-5 w-5" />
              </button>
            ) : undefined
          }
        >
          <WizardStepper steps={steps} activeStepId={activeStepId} />
        </AppHeader>
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
