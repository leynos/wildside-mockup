/** @file Walk wizard step three: review summary and confirm dialog. */

import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, type ReactNode, useState } from "react";

import { Icon } from "../../../components/icon";
import { WizardLayout } from "../../../components/wizard-layout";
import { WizardSection } from "../../../components/wizard-section";
import {
  wizardGeneratedStops,
  wizardSteps,
  wizardSummaryHighlights,
  wizardWeatherSummary,
} from "../../../data/wizard";

type WizardSummaryPanelProps = {
  readonly className?: string;
  readonly children: ReactNode;
};

function WizardSummaryPanel({ className, children }: WizardSummaryPanelProps): JSX.Element {
  const classNames = className ? `wizard-summary__panel ${className}` : "wizard-summary__panel";

  return <WizardSection className={classNames}>{children}</WizardSection>;
}

export function WizardStepThree(): JSX.Element {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <WizardLayout
      steps={wizardSteps}
      activeStepId="step-3"
      onBack={() => navigate({ to: "/wizard/step-2" })}
      onHelp={() => window.alert("Contextual help coming soon")}
      footer={
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate({ to: "/wizard/step-1" })}
          >
            Start over
          </button>
          <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
            <Dialog.Trigger asChild>
              <button type="button" className="btn btn-accent btn-lg w-full">
                Save walk and view map
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/60" />
              <Dialog.Content className="dialog-surface">
                <Dialog.Title className="text-lg font-semibold text-base-content">
                  Walk saved!
                </Dialog.Title>
                <Dialog.Description className="text-sm text-base-content/70">
                  The Hidden Gems Loop is ready under your saved walks. Start the route now or
                  continue exploring other wizard options.
                </Dialog.Description>
                <div className="flex justify-end gap-2">
                  <Dialog.Close asChild>
                    <button type="button" className="btn btn-ghost btn-sm">
                      Close
                    </button>
                  </Dialog.Close>
                  <button
                    type="button"
                    className="btn btn-accent btn-sm"
                    onClick={() => navigate({ to: "/map/quick" })}
                  >
                    View on map
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      }
    >
      <WizardSummaryPanel>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Hidden Gems Loop</h2>
          <span className="wizard-badge font-semibold">Custom</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm text-base-content/70">
          <div>
            <p className="text-lg font-semibold text-accent">2.3</p>
            <p>miles</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-accent">45</p>
            <p>minutes</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-accent">7</p>
            <p>stops</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-base-content/70">
          A personalised walk blending street art laneways, independent cafés, and quiet waterfront
          viewpoints.
        </p>
      </WizardSummaryPanel>

      <WizardSummaryPanel>
        <h3 className="text-lg font-semibold">Your preferences applied</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          {wizardSummaryHighlights.map((highlight) => (
            <div key={highlight.id} className="wizard-summary__highlight">
              <Icon
                token={highlight.iconToken}
                className="wizard-summary__highlight-icon"
                aria-hidden
              />
              <div>
                <p className="font-semibold">{highlight.label}</p>
                <p className="text-xs text-base-content/60">{highlight.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </WizardSummaryPanel>

      <WizardSummaryPanel>
        <h3 className="text-lg font-semibold">Featured stops</h3>
        <div className="mt-4 space-y-3">
          {wizardGeneratedStops.map((stop) => (
            <div key={stop.id} className="wizard-summary__stop">
              <span className="wizard-summary__stop-icon">
                <Icon token={stop.iconToken} className={stop.accentClass} aria-hidden />
              </span>
              <div>
                <p className="text-base font-semibold">{stop.name}</p>
                <p className="text-sm text-base-content/70">{stop.description}</p>
                <p className="mt-1 text-xs text-base-content/60">{stop.note}</p>
              </div>
            </div>
          ))}
        </div>
      </WizardSummaryPanel>

      <WizardSummaryPanel>
        <h3 className="section-heading text-base-content">
          <Icon token="{icon.object.weatherSunny}" className="text-amber-400" aria-hidden />
          {wizardWeatherSummary.title}
        </h3>
        <div className="wizard-summary__weather">
          <div>
            <p className="font-semibold">{wizardWeatherSummary.summary}</p>
            <p className="text-xs text-base-content/60">Pack light layers just in case.</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-accent">{wizardWeatherSummary.temperature}</p>
            <p className="text-xs text-base-content/60">{wizardWeatherSummary.sentiment}</p>
          </div>
        </div>
      </WizardSummaryPanel>
    </WizardLayout>
  );
}
