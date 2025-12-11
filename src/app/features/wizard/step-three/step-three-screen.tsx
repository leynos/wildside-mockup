/** @file Walk wizard step three: review summary and confirm dialog. */

import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, type ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../../components/icon";
import { WizardLayout } from "../../../components/wizard-layout";
import { WizardSection, type WizardSectionProps } from "../../../components/wizard-section";
import {
  wizardGeneratedStops,
  wizardRouteSummary,
  wizardSteps,
  wizardSummaryHighlights,
} from "../../../data/wizard";
import { pickLocalization } from "../../../domain/entities/localization";
import { formatDistance } from "../../../units/unit-format";
import { useUnitPreferences } from "../../../units/unit-preferences-provider";
import { buildWizardRouteStats } from "./build-wizard-route-stats";
import { buildWizardWeatherCopy } from "./build-wizard-weather-copy";

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
  const { t, i18n } = useTranslation();
  const { unitSystem } = useUnitPreferences();
  const [dialogOpen, setDialogOpen] = useState(false);
  const helpMessage = t("wizard-help-placeholder", {
    defaultValue: "Contextual help coming soon",
  });
  const routeStats = useMemo(
    () => buildWizardRouteStats(t, i18n.language, unitSystem),
    [t, i18n.language, unitSystem],
  );
  const weatherCopy = useMemo(
    () => buildWizardWeatherCopy(t, i18n.language, unitSystem),
    [t, i18n.language, unitSystem],
  );

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
                {dialogOpen
                  ? (() => {
                      const routeTitle = pickLocalization(
                        wizardRouteSummary.localizations,
                        i18n.language,
                      ).name;
                      return (
                        <>
                          <Dialog.Title className="text-lg font-semibold text-base-content">
                            {t("wizard-step-three-dialog-title", {
                              defaultValue: "Walk saved!",
                            })}
                          </Dialog.Title>
                          <Dialog.Description className="text-sm text-base-content/70">
                            {t("wizard-step-three-dialog-description", {
                              routeTitle,
                              defaultValue: `${routeTitle} is ready under your saved walks. Start the route now or continue exploring other wizard options.`,
                            })}
                          </Dialog.Description>
                        </>
                      );
                    })()
                  : null}
                <div className="flex justify-end gap-2">
                  <Dialog.Close asChild>
                    <button type="button" className="btn btn-ghost btn-sm">
                      {t("wizard-step-three-dialog-close", {
                        defaultValue: "Close",
                      })}
                    </button>
                  </Dialog.Close>
                  <button
                    type="button"
                    className="btn btn-accent btn-sm"
                    onClick={() => navigate({ to: "/map/quick" })}
                  >
                    {t("wizard-step-three-dialog-view-map", {
                      defaultValue: "View on map",
                    })}
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      }
    >
      <WizardSummaryPanel
        aria-label={t("wizard-step-three-route-panel-aria", {
          defaultValue: "Hidden Gems Loop summary",
        })}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {pickLocalization(wizardRouteSummary.localizations, i18n.language).name}
          </h2>
          <span className="wizard-badge font-semibold">
            {pickLocalization(wizardRouteSummary.badgeLocalizations, i18n.language).name}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm text-base-content/70">
          {routeStats.map((stat) => (
            <div key={stat.id}>
              <p className="text-lg font-semibold text-accent">{stat.value}</p>
              <p>{stat.unitLabel}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-base-content/70">
          {pickLocalization(wizardRouteSummary.localizations, i18n.language).description}
        </p>
      </WizardSummaryPanel>

      <WizardSummaryPanel
        aria-label={t("wizard-step-three-preferences-panel-aria", {
          defaultValue: "Your preferences applied",
        })}
      >
        <h3 className="text-lg font-semibold">
          {t("wizard-step-three-preferences-heading", {
            defaultValue: "Your preferences applied",
          })}
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          {wizardSummaryHighlights.map((highlight) => {
            const localized = pickLocalization(highlight.localizations, i18n.language);
            return (
              <div key={highlight.id} className="wizard-summary__highlight">
                <Icon
                  token={highlight.iconToken}
                  className="wizard-summary__highlight-icon"
                  aria-hidden
                />
                <div>
                  <p className="font-semibold">{localized.name}</p>
                  <p className="text-xs text-base-content/60">{localized.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </WizardSummaryPanel>

      <WizardSummaryPanel
        aria-label={t("wizard-step-three-stops-panel-aria", {
          defaultValue: "Featured stops",
        })}
      >
        <h3 className="text-lg font-semibold">
          {t("wizard-step-three-stops-heading", {
            defaultValue: "Featured stops",
          })}
        </h3>
        <div className="mt-4 space-y-3">
          {wizardGeneratedStops.map((stop) => {
            const localized = pickLocalization(stop.localizations, i18n.language);
            const noteLocalized = pickLocalization(stop.noteLocalizations, i18n.language);
            const distanceLabel =
              stop.noteDistanceMetres != null
                ? (() => {
                    const formatted = formatDistance(stop.noteDistanceMetres, {
                      t,
                      locale: i18n.language,
                      unitSystem,
                    });
                    const unitKeySuffix =
                      formatted.unitToken === "distance-mile"
                        ? "mi"
                        : formatted.unitToken === "distance-kilometre"
                          ? "km"
                          : unitSystem === "imperial"
                            ? "mi"
                            : "km";
                    const unitLabel = t(`wizard-step-three-stop-distance-unit-${unitKeySuffix}`, {
                      defaultValue: formatted.unitLabel,
                    });
                    return { ...formatted, unitLabel };
                  })()
                : undefined;
            const note = distanceLabel
              ? `${noteLocalized.name} • ${distanceLabel.value} ${distanceLabel.unitLabel}`
              : noteLocalized.name;
            return (
              <div key={stop.id} className="wizard-summary__stop">
                <span className="wizard-summary__stop-icon">
                  <Icon token={stop.iconToken} className={stop.accentClass} aria-hidden />
                </span>
                <div>
                  <p className="text-base font-semibold">{localized.name}</p>
                  <p className="text-sm text-base-content/70">{localized.description}</p>
                  <p className="mt-1 text-xs text-base-content/60">{note}</p>
                </div>
              </div>
            );
          })}
        </div>
      </WizardSummaryPanel>

      <WizardSummaryPanel aria-label={weatherCopy.title}>
        <h3 className="section-heading text-base-content">
          <Icon token="{icon.object.weatherSunny}" className="text-amber-400" aria-hidden />
          {weatherCopy.title}
        </h3>
        <div className="wizard-summary__weather">
          <div>
            <p className="font-semibold">{weatherCopy.summary}</p>
            <p className="text-xs text-base-content/60">{weatherCopy.reminder}</p>
          </div>
          <div className="text-end">
            <p className="text-lg font-semibold text-accent">{weatherCopy.temperatureLabel}</p>
            <p className="text-xs text-base-content/60">{weatherCopy.sentiment}</p>
          </div>
        </div>
      </WizardSummaryPanel>
    </WizardLayout>
  );
}
