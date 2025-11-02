/** @file Walk wizard step two: discovery preferences and accessibility toggles. */

import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, useState } from "react";

import { Icon } from "../../../components/icon";
import { WizardLayout } from "../../../components/wizard-layout";
import { accessibilityOptions, wizardSteps } from "../../../data/wizard";

export function WizardStepTwo(): JSX.Element {
  const navigate = useNavigate();
  const [discoveryMix, setDiscoveryMix] = useState(60);
  const [accessibility, setAccessibility] = useState<Record<string, boolean>>({
    "well-lit": true,
    wheelchair: false,
    paved: true,
  });

  return (
    <WizardLayout
      steps={wizardSteps}
      activeStepId="step-2"
      onBack={() => navigate({ to: "/wizard/step-1" })}
      onHelp={() => window.alert("Contextual help coming soon")}
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            className="btn btn-ghost flex-1"
            onClick={() => navigate({ to: "/wizard/step-1" })}
          >
            Back
          </button>
          <button
            type="button"
            className="btn btn-accent flex-1"
            onClick={() => navigate({ to: "/wizard/step-3" })}
          >
            Review walk
          </button>
        </div>
      }
    >
      <section className="mb-8 rounded-3xl border border-base-300/40 bg-base-200/70 p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-heading section-heading--spacious text-base-content">
            <Icon token="{icon.navigation.explore}" className="text-accent" aria-hidden />
            Discovery style
          </h2>
          <span className="rounded-lg bg-accent/20 px-2 py-1 text-xs font-medium text-accent">
            New
          </span>
        </div>
        <p className="text-sm text-base-content/70">
          Balance popular hotspots with hidden gems to match today’s mood.
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-base-content/60">
          <span>Crowded</span>
          <span>Balanced</span>
          <span>Secluded</span>
        </div>
        <Slider.Root
          value={[discoveryMix]}
          min={0}
          max={100}
          step={5}
          onValueChange={(value) => setDiscoveryMix(value[0] ?? discoveryMix)}
          aria-label="Discovery slider"
          className="relative mt-3 flex h-7 items-center"
        >
          <Slider.Track className="relative h-3 flex-1 rounded-full bg-base-300/60">
            <Slider.Range className="absolute h-full rounded-full bg-accent" />
          </Slider.Track>
          <Slider.Thumb
            aria-label="Adjust discovery style balance"
            className="block h-6 w-6 rounded-full border-2 border-base-100 bg-accent shadow-lg shadow-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          />
        </Slider.Root>
        <div className="wizard-discovery__summary">
          {discoveryMix >= 70
            ? "Hidden gems heavy"
            : discoveryMix <= 30
              ? "Hotspot focused"
              : "Balanced mix"}
        </div>
      </section>

      <section className="rounded-3xl border border-base-300/40 bg-base-200/70 p-6">
        <h2 className="mb-4 text-lg font-semibold text-base-content">Accessibility & safety</h2>
        <div className="space-y-4">
          {accessibilityOptions.map((option) => {
            const checked = accessibility[option.id] ?? false;
            return (
              <div key={option.id} className="wizard-accessibility__option">
                <div className="flex items-center gap-3">
                  <span className="wizard-accessibility__icon">
                    <Icon token={option.iconToken} className="text-accent" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-base-content">{option.label}</p>
                    <p className="text-xs text-base-content/60">{option.description}</p>
                  </div>
                </div>
                <Switch.Root
                  id={option.id}
                  checked={checked}
                  onCheckedChange={(value) =>
                    setAccessibility((prev) => ({
                      ...prev,
                      [option.id]: value,
                    }))
                  }
                  className="wizard-accessibility__toggle"
                >
                  <Switch.Thumb className="wizard-accessibility__thumb" />
                </Switch.Root>
              </div>
            );
          })}
        </div>
      </section>
    </WizardLayout>
  );
}
