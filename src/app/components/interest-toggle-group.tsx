/** @file Shared multi-select interest chip group. */

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { interestDescriptors, type ResolvedInterestDescriptor } from "../data/registries/interests";
import { resolveDescriptor } from "../i18n/descriptors";
import { Icon } from "./icon";

const CHIP_BASE_CLASSES =
  "interest-chip inline-flex items-center gap-2 rounded-full border border-base-300/60 bg-base-200/60 px-4 py-2 text-sm font-medium text-base-content/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60";

export interface InterestToggleGroupProps {
  interestIds: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  ariaLabel: string;
  className?: string;
}

export function InterestToggleGroup({
  interestIds,
  selected,
  onChange,
  ariaLabel,
  className,
}: InterestToggleGroupProps): JSX.Element {
  const { t } = useTranslation();
  const interestLookup = new Map<string, ResolvedInterestDescriptor>(
    interestDescriptors.map((descriptor) => [descriptor.id, resolveDescriptor(descriptor, t)]),
  );

  return (
    <ToggleGroup.Root
      type="multiple"
      value={selected}
      onValueChange={onChange}
      aria-label={ariaLabel}
      className={`flex flex-wrap gap-2 ${className ?? ""}`.trim()}
    >
      {interestIds.map((id) => {
        const interest = interestLookup.get(id);
        if (!interest) return null;
        return (
          <ToggleGroup.Item key={id} value={id} className={CHIP_BASE_CLASSES}>
            <Icon
              token={interest.iconToken}
              className={`interest-chip__icon text-lg transition ${interest.iconColorClass}`}
              aria-hidden
            />
            {interest.label}
          </ToggleGroup.Item>
        );
      })}
    </ToggleGroup.Root>
  );
}
