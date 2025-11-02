/** @file Walk wizard step one: duration and interests. */

import { useNavigate } from "@tanstack/react-router";
import { type JSX, useMemo, useState } from "react";

import { Icon } from "../../../components/icon";
import { InterestToggleGroup } from "../../../components/interest-toggle-group";
import { SliderControl } from "../../../components/slider-control";
import { WizardLayout } from "../../../components/wizard-layout";
import { defaultSelectedInterests, discoverInterests } from "../../../data/discover";
import { wizardSteps } from "../../../data/wizard";

function formatDuration(value: number) {
  return `${value} min`;
}

export function WizardStepOne(): JSX.Element {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(60);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    ...defaultSelectedInterests,
  ]);

  const interestIds = useMemo(
    () =>
      Array.from(
        new Set<string>([
          ...defaultSelectedInterests,
          ...discoverInterests.map((option) => option.id),
        ]),
      ),
    [],
  );

  const selectedLabel = useMemo(
    () => `${selectedInterests.length} selected`,
    [selectedInterests.length],
  );

  return (
    <WizardLayout
      steps={wizardSteps}
      activeStepId="step-1"
      onBack={() => navigate({ to: "/explore" })}
      onHelp={() => window.alert("Contextual help coming soon")}
      footer={
        <button
          type="button"
          className="btn btn-accent btn-lg w-full text-base font-semibold"
          onClick={() => navigate({ to: "/wizard/step-2" })}
        >
          Continue to preferences
        </button>
      }
    >
      <section className="mb-8 rounded-3xl border border-base-300/40 bg-base-200/70 p-6">
        <SliderControl
          id="wizard-duration"
          label="Walk duration"
          iconToken="{icon.object.duration}"
          value={duration}
          min={15}
          max={180}
          step={5}
          valueFormatter={formatDuration}
          markers={["15m", "90m", "180m"]}
          ariaLabel="Walk duration slider"
          onValueChange={setDuration}
        />
      </section>

      <section className="rounded-3xl border border-base-300/40 bg-base-200/70 p-6">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="section-heading section-heading--spacious text-base-content">
            <Icon token="{icon.action.like}" className="text-accent" aria-hidden />
            Interests
          </h2>
          <span className="text-xs font-medium text-base-content/60">{selectedLabel}</span>
        </header>
        <InterestToggleGroup
          interestIds={interestIds}
          selected={selectedInterests}
          onChange={setSelectedInterests}
          ariaLabel="Select walk interests"
        />
      </section>
    </WizardLayout>
  );
}
