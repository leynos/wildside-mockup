/** @file Shared layout for wizard steps providing header, stepper, and footer actions. */

import type { JSX, ReactNode } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const wizardTitle = t("wizard-header-title", { defaultValue: "Walk Wizard" });
  const backLabel = t("wizard-header-back-label", { defaultValue: "Back" });
  const helpLabel = t("wizard-header-help-label", { defaultValue: "Help" });

  const localizedSteps = useMemo(
    () =>
      steps.map((step) => ({
        ...step,
        title: t(`wizard-${step.id}-title`, { defaultValue: step.title }),
        description: t(`wizard-${step.id}-description`, {
          defaultValue: step.description,
        }),
      })),
    [steps, t],
  );

  return (
    <MobileShell tone="dark">
      <div className="screen-stack">
        <AppHeader
          variant="wizard"
          title={wizardTitle}
          leading={
            onBack ? (
              <button
                type="button"
                aria-label={backLabel}
                className="header-nav-button"
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
                aria-label={helpLabel}
                className="header-icon-button"
                onClick={onHelp}
              >
                <Icon token="{icon.action.help}" aria-hidden className="h-5 w-5" />
              </button>
            ) : undefined
          }
        >
          <WizardStepper steps={localizedSteps} activeStepId={activeStepId} />
        </AppHeader>
        <main className="screen-scroll pt-6">{children}</main>
        {footer ? (
          <footer className="sticky bottom-0 bg-base-900/85 px-6 py-5 backdrop-blur">
            {footer}
          </footer>
        ) : null}
      </div>
    </MobileShell>
  );
}
