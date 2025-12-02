/** @file Shared types for safety screen data and presentation. */

import type { SafetyPreset, SafetyToggle, SafetyToggleId } from "../../data/stage-four";

export type ToggleState = Record<SafetyToggleId, boolean>;

export type ResolvedSafetyToggle = SafetyToggle & {
  readonly label: string;
  readonly description?: string;
};

export type ResolvedSafetySection = {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly iconToken: string;
  readonly accentClass: string;
  readonly toggleIds: readonly SafetyToggleId[];
  readonly toggles: ResolvedSafetyToggle[];
};

export type ResolvedSafetyPreset = Omit<SafetyPreset, "localizations"> & {
  readonly title: string;
  readonly description?: string;
};

export type SafetyTranslations = {
  readonly backLabel: string;
  readonly headerTitle: string;
  readonly headerDescription: string;
  readonly presetsHeading: string;
  readonly saveButtonLabel: string;
  readonly dialogTitle: string;
  readonly dialogDescription: string;
  readonly dialogContinue: string;
  readonly presetAlert: (title: string) => string;
  readonly dialogChipFallback: (id: string) => string;
};
