/** @file Walk wizard step three: review summary and confirm dialog. */

import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../../components/icon";
import { WizardLayout } from "../../../components/wizard-layout";
import { WizardSection, type WizardSectionProps } from "../../../components/wizard-section";
import {
  wizardGeneratedStops,
  wizardRouteSummary,
  wizardSteps,
  wizardSummaryHighlights,
  wizardWeatherSummary,
} from "../../../data/wizard";

type WizardSummaryPanelProps = WizardSectionProps & {
  readonly className?: string;
  readonly children: ReactNode;
};

function WizardSummaryPanel({
  className,
  children,
  ...rest
}: WizardSummaryPanelProps): JSX.Element {
  const classNames = className ? `wizard-summary__panel ${className}` : "wizard-summary__panel";

  return (
    <WizardSection className={classNames} {...rest}>
      {children}
    </WizardSection>
  );
}

export function WizardStepThree(): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const helpMessage = t("wizard-help-placeholder", {
    defaultValue: "Contextual help coming soon",
  });

  return (
    <WizardLayout
      steps={wizardSteps}
      activeStepId="step-3"
      onBack={() => navigate({ to: "/wizard/step-2" })}
      onHelp={() => window.alert(helpMessage)}
      footer={
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate({ to: "/wizard/step-1" })}
          >
            {t("wizard-step-three-start-over", { defaultValue: "Start over" })}
          </button>
          <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
            <Dialog.Trigger asChild>
              <button type="button" className="btn btn-accent btn-lg w-full">
                {t("wizard-step-three-save-button", {
                  defaultValue: "Save walk and view map",
                })}
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/60" />
              <Dialog.Content className="dialog-surface">
                {(() => {
                  const routeTitle = t(wizardRouteSummary.titleKey, {
                    defaultValue: wizardRouteSummary.defaultTitle,
                  });
                  return (
                    <>
                      <Dialog.Title className="text-lg font-semibold text-base-content">
                        {t("wizard-step-three-dialog-title", { defaultValue: "Walk saved!" })}
                      </Dialog.Title>
                      <Dialog.Description className="text-sm text-base-content/70">
                        {t("wizard-step-three-dialog-description", {
                          routeTitle,
                          defaultValue: `${routeTitle} is ready under your saved walks. Start the route now or continue exploring other wizard options.`,
                        })}
                      </Dialog.Description>
                    </>
                  );
                })()}
                <div className="flex justify-end gap-2">
                  <Dialog.Close asChild>
                    <button type="button" className="btn btn-ghost btn-sm">
                      {t("wizard-step-three-dialog-close", { defaultValue: "Close" })}
                    </button>
                  </Dialog.Close>
                  <button
                    type="button"
                    className="btn btn-accent btn-sm"
                    onClick={() => navigate({ to: "/map/quick" })}
                  >
                    {t("wizard-step-three-dialog-view-map", { defaultValue: "View on map" })}
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      }
    >
      <WizardSummaryPanel
        aria-label={t(wizardRouteSummary.ariaLabelKey, {
          defaultValue: wizardRouteSummary.defaultAriaLabel,
        })}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {t(wizardRouteSummary.titleKey, { defaultValue: wizardRouteSummary.defaultTitle })}
          </h2>
          <span className="wizard-badge font-semibold">
            {t(wizardRouteSummary.badgeKey, { defaultValue: wizardRouteSummary.defaultBadge })}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm text-base-content/70">
          {wizardRouteSummary.stats.map((stat) => (
            <div key={stat.id}>
              <p className="text-lg font-semibold text-accent">{stat.value}</p>
              <p>{t(stat.unitKey, { defaultValue: stat.defaultUnit })}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-base-content/70">
          {t(wizardRouteSummary.descriptionKey, {
            defaultValue: wizardRouteSummary.defaultDescription,
          })}
        </p>
      </WizardSummaryPanel>

      <WizardSummaryPanel
        aria-label={t("wizard-step-three-preferences-panel-aria", {
          defaultValue: "Your preferences applied",
        })}
      >
        <h3 className="text-lg font-semibold">
          {t("wizard-step-three-preferences-heading", { defaultValue: "Your preferences applied" })}
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          {wizardSummaryHighlights.map((highlight) => {
            const label = t(highlight.labelKey, { defaultValue: highlight.defaultLabel });
            const detail = t(highlight.detailKey, { defaultValue: highlight.defaultDetail });
            return (
              <div key={highlight.id} className="wizard-summary__highlight">
                <Icon
                  token={highlight.iconToken}
                  className="wizard-summary__highlight-icon"
                  aria-hidden
                />
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-xs text-base-content/60">{detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </WizardSummaryPanel>

      <WizardSummaryPanel
        aria-label={t("wizard-step-three-stops-panel-aria", { defaultValue: "Featured stops" })}
      >
        <h3 className="text-lg font-semibold">
          {t("wizard-step-three-stops-heading", { defaultValue: "Featured stops" })}
        </h3>
        <div className="mt-4 space-y-3">
          {wizardGeneratedStops.map((stop) => {
            const name = t(stop.nameKey, { defaultValue: stop.defaultName });
            const description = t(stop.descriptionKey, { defaultValue: stop.defaultDescription });
            const note = t(stop.noteKey, { defaultValue: stop.defaultNote });
            return (
              <div key={stop.id} className="wizard-summary__stop">
                <span className="wizard-summary__stop-icon">
                  <Icon token={stop.iconToken} className={stop.accentClass} aria-hidden />
                </span>
                <div>
                  <p className="text-base font-semibold">{name}</p>
                  <p className="text-sm text-base-content/70">{description}</p>
                  <p className="mt-1 text-xs text-base-content/60">{note}</p>
                </div>
              </div>
            );
          })}
        </div>
      </WizardSummaryPanel>

      <WizardSummaryPanel
        aria-label={t(wizardWeatherSummary.titleKey, {
          defaultValue: wizardWeatherSummary.defaultTitle,
        })}
      >
        <h3 className="section-heading text-base-content">
          <Icon token="{icon.object.weatherSunny}" className="text-amber-400" aria-hidden />
          {t(wizardWeatherSummary.titleKey, { defaultValue: wizardWeatherSummary.defaultTitle })}
        </h3>
        <div className="wizard-summary__weather">
          <div>
            <p className="font-semibold">
              {t(wizardWeatherSummary.summaryKey, {
                defaultValue: wizardWeatherSummary.defaultSummary,
              })}
            </p>
            <p className="text-xs text-base-content/60">
              {t(wizardWeatherSummary.reminderKey, {
                defaultValue: wizardWeatherSummary.defaultReminder,
              })}
            </p>
          </div>
          <div className="text-end">
            <p className="text-lg font-semibold text-accent">{wizardWeatherSummary.temperature}</p>
            <p className="text-xs text-base-content/60">
              {t(wizardWeatherSummary.sentimentKey, {
                defaultValue: wizardWeatherSummary.defaultSentiment,
              })}
            </p>
          </div>
        </div>
      </WizardSummaryPanel>
    </WizardLayout>
  );
}
