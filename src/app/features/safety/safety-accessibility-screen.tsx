/** @file Safety & accessibility preferences screen using accordions and toggles. */

import * as Accordion from "@radix-ui/react-accordion";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import {
  type SafetyAccordionSection,
  type SafetyPreset,
  type SafetyToggle,
  safetyAccordionSections,
  safetyPresets,
} from "../../data/stage-four";
import { MobileShell } from "../../layout/mobile-shell";

type ToggleState = Record<string, boolean>;

type ResolvedSafetyToggle = Omit<
  SafetyToggle,
  "labelKey" | "defaultLabel" | "descriptionKey" | "defaultDescription"
> & {
  readonly label: string;
  readonly description: string;
};

type ResolvedSafetySection = Omit<SafetyAccordionSection, "toggles"> & {
  readonly title: string;
  readonly description: string;
  readonly toggles: ResolvedSafetyToggle[];
};

type ResolvedSafetyPreset = SafetyPreset & {
  readonly title: string;
  readonly description: string;
};

export function SafetyAccessibilityScreen(): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toggleState, setToggleState] = useState<ToggleState>(() => {
    const accumulator: ToggleState = {};
    for (const section of safetyAccordionSections) {
      for (const toggle of section.toggles) {
        accumulator[toggle.id] = toggle.defaultChecked;
      }
    }
    return accumulator;
  });

  const handleToggle = (toggleId: string, value: boolean) => {
    setToggleState((prev) => ({ ...prev, [toggleId]: value }));
  };

  const resolvedSections: ResolvedSafetySection[] = safetyAccordionSections.map((section) => {
    const title = t(section.titleKey, { defaultValue: section.defaultTitle });
    const description = t(section.descriptionKey, { defaultValue: section.defaultDescription });
    const toggles = section.toggles.map((toggle) => ({
      ...toggle,
      label: t(toggle.labelKey, { defaultValue: toggle.defaultLabel }),
      description: t(toggle.descriptionKey, { defaultValue: toggle.defaultDescription }),
    }));
    return { ...section, title, description, toggles } as ResolvedSafetySection;
  });

  const toggleLabelLookup = (() => {
    const entries = new Map<string, string>();
    resolvedSections.forEach((section) => {
      section.toggles.forEach((toggle) => {
        entries.set(toggle.id, toggle.label);
      });
    });
    return entries;
  })();

  const resolvedPresets: ResolvedSafetyPreset[] = safetyPresets.map((preset) => ({
    ...preset,
    title: t(preset.titleKey, { defaultValue: preset.defaultTitle }),
    description: t(preset.descriptionKey, { defaultValue: preset.defaultDescription }),
  }));

  const backLabel = t("wizard-header-back-label", { defaultValue: "Back" });
  const headerTitle = t("safety-header-title", { defaultValue: "Safety & Accessibility" });
  const headerDescription = t("safety-header-description", {
    defaultValue: "Customise your walking routes for comfort and safety",
  });
  const presetsHeading = t("safety-presets-heading", { defaultValue: "Preset profiles" });
  const saveButtonLabel = t("safety-save-button", { defaultValue: "Save preferences" });
  const dialogTitle = t("safety-dialog-title", { defaultValue: "Preferences saved" });
  const dialogDescription = t("safety-dialog-description", {
    defaultValue: "Your safety and accessibility settings are now part of future walk planning.",
  });
  const dialogContinue = t("safety-dialog-continue", { defaultValue: "Continue" });

  return (
    <MobileShell tone="dark">
      <div className="screen-stack">
        <header className="px-6 pt-16 pb-6 text-base-100">
          <div className="mb-4 flex items-center gap-4">
            <button
              type="button"
              aria-label={backLabel}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/60 bg-base-200/30"
              onClick={() => navigate({ to: "/explore" })}
            >
              <Icon token="{icon.navigation.back}" className="text-accent" aria-hidden />
            </button>
            <h1 className="text-2xl font-semibold">{headerTitle}</h1>
          </div>
          <p className="text-sm text-base-300">{headerDescription}</p>
        </header>

        <main className="shell-scroll space-y-6">
          <Accordion.Root
            type="multiple"
            defaultValue={safetyAccordionSections.map((section) => section.id)}
            className="space-y-4"
          >
            {resolvedSections.map((section) => (
              <Accordion.Item
                key={section.id}
                value={section.id}
                className="rounded-2xl border border-base-300/60 bg-base-200/20"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${section.accentClass}`}
                      >
                        <Icon token={section.iconToken} aria-hidden />
                      </span>
                      <div>
                        <p className="text-base font-semibold text-base-100">{section.title}</p>
                        <p className="text-xs text-base-300">{section.description}</p>
                      </div>
                    </div>
                    <Icon
                      token="{icon.navigation.chevronDown}"
                      className="text-base-300 transition data-[state=open]:rotate-180"
                      aria-hidden
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="space-y-5 px-5 pb-5 pt-2 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  {section.toggles.map((toggle) => {
                    const isEnabled = toggleState[toggle.id] ?? false;
                    const labelId = `${toggle.id}-label`;
                    const descriptionId = `${toggle.id}-description`;
                    return (
                      <div key={toggle.id} className="preference-toggle">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${toggle.accentClass}`}
                          >
                            <Icon token={toggle.iconToken} aria-hidden />
                          </span>
                          <div>
                            <p id={labelId} className="font-medium text-base-100">
                              {toggle.label}
                            </p>
                            <p id={descriptionId} className="text-xs text-base-300">
                              {toggle.description}
                            </p>
                          </div>
                        </div>
                        <Switch.Root
                          className="toggle-switch toggle-switch--accent"
                          checked={isEnabled}
                          aria-labelledby={labelId}
                          aria-describedby={descriptionId}
                          onCheckedChange={(checked) => handleToggle(toggle.id, checked)}
                        >
                          <Switch.Thumb className="toggle-switch__thumb" />
                        </Switch.Root>
                      </div>
                    );
                  })}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-base-100">{presetsHeading}</h2>
            <div className="grid gap-3">
              {resolvedPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="safety__preset"
                  onClick={() =>
                    window.alert(
                      t("safety-preset-alert", {
                        title: preset.title,
                        defaultValue: `Preset "${preset.title}" will be applied in a future build.`,
                      }),
                    )
                  }
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${preset.accentClass}`}
                  >
                    <Icon token={preset.iconToken} aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold text-base-100">{preset.title}</p>
                    <p className="text-xs text-base-300">{preset.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <button
              type="button"
              className="btn btn-accent w-full justify-center gap-2"
              onClick={() => setDialogOpen(true)}
            >
              <Icon token="{icon.action.savePrefs}" aria-hidden />
              {saveButtonLabel}
            </button>
          </section>
        </main>
      </div>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60" />
          <Dialog.Content className="modal-panel">
            <Dialog.Title className="text-lg font-semibold text-base-content">
              {dialogTitle}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-base-content/70">
              {dialogDescription}
            </Dialog.Description>
            <div className="chip-row text-sm text-base-content/80">
              {Object.entries(toggleState)
                .filter(([, value]) => value)
                .map(([id]) => (
                  <span key={id} className="rounded-full border border-base-300/60 px-3 py-1">
                    {toggleLabelLookup.get(id) ??
                      t("safety-dialog-chip-fallback", {
                        id,
                        defaultValue: id.replace(/-/g, " "),
                      })}
                  </span>
                ))}
            </div>
            <div className="flex justify-end">
              <Dialog.Close asChild>
                <button type="button" className="btn btn-accent btn-sm">
                  {dialogContinue}
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </MobileShell>
  );
}
