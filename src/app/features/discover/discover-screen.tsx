/** @file Discover onboarding screen composed from Radix primitives. */

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Icon } from "../../components/icon";
import {
  type DiscoverInterest,
  defaultSelectedInterests,
  discoverInterests,
} from "../../data/discover";
import { MobileShell } from "../../layout/mobile-shell";

interface InterestChipProps {
  interest: DiscoverInterest;
}

function InterestChip({ interest }: InterestChipProps): JSX.Element {
  return (
    <ToggleGroup.Item
      value={interest.id}
      className="group rounded-2xl border-2 border-transparent bg-base-300/40 p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 data-[state=on]:border-accent data-[state=on]:bg-accent/10"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-base-200/70 text-xl text-base-content/70 group-data-[state=on]:bg-accent/20">
        <Icon
          token={interest.iconToken}
          className={`${interest.iconColorClass} text-2xl`}
          aria-hidden
        />
      </div>
      <h3 className="text-center text-sm font-medium text-base-content group-data-[state=on]:text-accent">
        {interest.label}
      </h3>
    </ToggleGroup.Item>
  );
}

export function DiscoverScreen(): JSX.Element {
  const [selected, setSelected] = useState<string[]>([...defaultSelectedInterests]);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const selectedCount = useMemo(() => selected.length, [selected]);

  const handleStart = () => {
    setIsGenerating(true);
    window.setTimeout(() => {
      setIsGenerating(false);
      navigate({ to: "/explore" });
    }, 800);
  };

  return (
    <MobileShell
      tone="dark"
      background={
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(74,240,213,0.08),_transparent_55%),linear-gradient(135deg,_rgba(13,26,38,1)_0%,_rgba(32,52,69,0.85)_100%)]" />
      }
    >
      <div className="relative flex flex-1 flex-col px-6 pb-10 pt-20">
        <button
          type="button"
          onClick={() => navigate({ to: "/explore" })}
          className="absolute right-6 top-16 rounded-full px-4 py-2 text-sm font-medium text-base-content/70 transition-colors hover:text-base-content"
        >
          Skip
        </button>

        <section className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Icon token="{icon.object.magic}" className="text-3xl" aria-hidden />
          </div>
          <h1 className="text-3xl font-semibold text-base-content">Discover Your Perfect Walk</h1>
          <p className="mt-3 text-base text-base-content/70">
            Tell us what interests you and we will craft magical routes tailored for you.
          </p>
        </section>

        <section className="mt-10 flex flex-1 flex-col">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-base-content">What sparks your curiosity?</h2>
            <p className="mt-1 text-sm text-base-content/60">
              Select a few themes that catch your eye.
            </p>
          </div>
          <ToggleGroup.Root
            type="multiple"
            className="grid flex-1 grid-cols-2 gap-3"
            aria-label="Interests"
            value={selected}
            onValueChange={(values) => setSelected(values)}
          >
            {discoverInterests.map((interest) => (
              <InterestChip key={interest.id} interest={interest} />
            ))}
          </ToggleGroup.Root>
          <p className="mt-8 text-center text-sm text-base-content/70">
            <span className="font-semibold text-accent">{selectedCount}</span> themes selected
          </p>
        </section>

        <section className="mt-6">
          <button
            type="button"
            className="btn btn-accent btn-lg w-full rounded-2xl text-base font-semibold"
            onClick={handleStart}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <Icon token="{icon.action.loading}" className="h-5 w-5 animate-spin" aria-hidden />
                Creating your experience...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Start Exploring
                <Icon token="{icon.navigation.forward}" aria-hidden className="h-4 w-4" />
              </span>
            )}
          </button>
          <p className="mt-3 text-center text-sm text-base-content/60">
            You can always change these later.
          </p>
        </section>
      </div>
    </MobileShell>
  );
}
