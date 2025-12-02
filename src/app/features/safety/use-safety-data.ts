/** @file Hooks for resolving safety screen data and translations. */

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import type { SafetyToggleId } from "../../data/stage-four";
import { safetyAccordionSections, safetyPresets, safetyToggles } from "../../data/stage-four";
import { coerceLocaleCode, resolveLocalization } from "../../lib/localization-runtime";
import type {
  ResolvedSafetyPreset,
  ResolvedSafetySection,
  ResolvedSafetyToggle,
  SafetyTranslations,
  ToggleState,
} from "./safety-types";

export const useSafetyToggles = () => {
  const [toggleState, setToggleState] = useState<ToggleState>(() => {
    const accumulator: ToggleState = {} as ToggleState;
    for (const toggle of safetyToggles) {
      accumulator[toggle.id] = toggle.defaultChecked;
    }
    return accumulator;
  });

  const handleToggle = (toggleId: SafetyToggleId, value: boolean) => {
    setToggleState((prev) => ({ ...prev, [toggleId]: value }));
  };

  return { toggleState, handleToggle } as const;
};

export const useSafetyData = (localeInput: string) => {
  const locale = coerceLocaleCode(localeInput);
  const { t } = useTranslation();

  const toggleLookup = useMemo(
    () => new Map(safetyToggles.map((toggle) => [toggle.id, toggle])),
    [],
  );

  const resolvedSections: ResolvedSafetySection[] = useMemo(
    () =>
      safetyAccordionSections.map((section) => {
        const sectionLocalization = resolveLocalization(section.localizations, locale, section.id);
        const toggles = section.toggleIds.reduce<ResolvedSafetyToggle[]>((acc, toggleId) => {
          const toggle = toggleLookup.get(toggleId);
          if (!toggle) {
            if (import.meta.env.DEV) {
              // eslint-disable-next-line no-console
              console.warn("Missing safety toggle", { toggleId, sectionId: section.id });
            }
            return acc;
          }
          const localization = resolveLocalization(toggle.localizations, locale, toggle.id);
          const label = t(`safety-toggle-${toggle.id}-label`, {
            defaultValue: localization.name,
          });
          const description = t(`safety-toggle-${toggle.id}-description`, {
            defaultValue: localization.description ?? "",
          });
          acc.push({
            ...toggle,
            label,
            description,
          });
          return acc;
        }, []);

        return {
          id: section.id,
          title: t(`safety-section-${section.id}-title`, {
            defaultValue: sectionLocalization.name,
          }),
          description: t(`safety-section-${section.id}-description`, {
            defaultValue: sectionLocalization.description ?? "",
          }),
          iconToken: section.iconToken,
          accentClass: section.accentClass,
          toggleIds: section.toggleIds,
          toggles,
        };
      }),
    [locale, t, toggleLookup],
  );

  const toggleLabelLookup = useMemo(() => {
    const entries = new Map<SafetyToggleId, string>();
    resolvedSections.forEach((section) => {
      section.toggles.forEach((toggle) => {
        entries.set(toggle.id, toggle.label);
      });
    });
    return entries;
  }, [resolvedSections]);

  const resolvedPresets: ResolvedSafetyPreset[] = useMemo(() => {
    return safetyPresets.map((preset) => {
      const localization = resolveLocalization(preset.localizations, locale, preset.id);
      const title = t(`safety-preset-${preset.id}-title`, {
        defaultValue: localization.name,
      });
      const description = t(`safety-preset-${preset.id}-description`, {
        defaultValue: localization.description ?? "",
      });
      return { ...preset, title, description };
    });
  }, [locale, t]);

  return { resolvedSections, resolvedPresets, toggleLookup, toggleLabelLookup } as const;
};

export const useSafetyTranslations = (): SafetyTranslations => {
  const { t } = useTranslation();
  return {
    backLabel: t("wizard-header-back-label", { defaultValue: "Back" }),
    headerTitle: t("safety-header-title", { defaultValue: "Safety & Accessibility" }),
    headerDescription: t("safety-header-description", {
      defaultValue: "Customise your walking routes for comfort and safety",
    }),
    presetsHeading: t("safety-presets-heading", { defaultValue: "Preset profiles" }),
    saveButtonLabel: t("safety-save-button", { defaultValue: "Save preferences" }),
    dialogTitle: t("safety-dialog-title", { defaultValue: "Preferences saved" }),
    dialogDescription: t("safety-dialog-description", {
      defaultValue: "Your safety and accessibility settings are now part of future walk planning.",
    }),
    dialogContinue: t("safety-dialog-continue", { defaultValue: "Continue" }),
    presetAlert: (title: string) =>
      t("safety-preset-alert", {
        title,
        defaultValue: `Preset "${title}" will be applied in a future build.`,
      }),
    dialogChipFallback: (id: string) =>
      t("safety-dialog-chip-fallback", { id, defaultValue: id.replace(/-/g, " ") }),
  };
};
