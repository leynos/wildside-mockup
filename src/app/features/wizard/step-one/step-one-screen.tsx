/** @file Walk wizard step one: duration and interests. */

import * as Slider from "@radix-ui/react-slider";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, useMemo, useState } from "react";

import { Icon } from "../../../components/icon";
import { WizardLayout } from "../../../components/wizard-layout";
import { defaultSelectedInterests, discoverInterests } from "../../../data/discover";
import { wizardSteps } from "../../../data/wizard";

const interestLookup = new Map(discoverInterests.map((interest) => [interest.id, interest]));

function formatDuration(value: number) {
  return `${value} min`;
}

function InterestChips({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
}) {
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

  return (
    <ToggleGroup.Root
      type="multiple"
      value={selected}
      onValueChange={onChange}
      aria-label="Select walk interests"
      className="flex flex-wrap gap-2"
    >
      {interestIds.map((id) => {
        const interest = interestLookup.get(id);
        if (!interest) return null;
        return (
          <ToggleGroup.Item key={id} value={id} className="wizard-step__interest-chip">
            <Icon
              token={interest.iconToken}
              className={`text-lg ${interest.iconColorClass}`}
              aria-hidden
            />
            {interest.label}
          </ToggleGroup.Item>
        );
      })}
    </ToggleGroup.Root>
  );
}

export function WizardStepOne(): JSX.Element {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(60);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    ...defaultSelectedInterests,
  ]);

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
        <header className="mb-4 flex items-center justify-between text-base-content">
          <h2 className="flex items-center gap-3 text-lg font-semibold">
            <Icon token="{icon.object.duration}" className="text-accent" aria-hidden />
            Walk duration
          </h2>
          <span className="text-xl font-semibold text-accent">{formatDuration(duration)}</span>
        </header>
        <Slider.Root
          value={[duration]}
          min={15}
          max={180}
          step={5}
          onValueChange={(value) => setDuration(value[0] ?? duration)}
          aria-label="Walk duration slider"
          className="relative flex h-6 items-center"
        >
          <Slider.Track className="relative h-2 flex-1 rounded-full bg-base-300/60">
            <Slider.Range className="absolute h-full rounded-full bg-accent" />
          </Slider.Track>
          <Slider.Thumb
            aria-label="Adjust walk duration"
            className="block h-5 w-5 rounded-full border-2 border-base-100 bg-accent shadow-lg shadow-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          />
        </Slider.Root>
        <div className="mt-2 flex justify-between text-xs text-base-content/50">
          <span>15m</span>
          <span>90m</span>
          <span>180m</span>
        </div>
      </section>

      <section className="rounded-3xl border border-base-300/40 bg-base-200/70 p-6">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-3 text-lg font-semibold text-base-content">
            <Icon token="{icon.action.like}" className="text-accent" aria-hidden />
            Interests
          </h2>
          <span className="text-xs font-medium text-base-content/60">{selectedLabel}</span>
        </header>
        <InterestChips selected={selectedInterests} onChange={setSelectedInterests} />
      </section>
    </WizardLayout>
  );
}
