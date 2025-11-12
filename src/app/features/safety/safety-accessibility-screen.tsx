/** @file Safety & accessibility preferences screen using accordions and toggles. */

import * as Accordion from "@radix-ui/react-accordion";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, useMemo, useState } from "react";

import { Icon } from "../../components/icon";
import { type SafetyToggle, safetyAccordionSections, safetyPresets } from "../../data/stage-four";
import { MobileShell } from "../../layout/mobile-shell";

type ToggleState = Record<string, boolean>;

export function SafetyAccessibilityScreen(): JSX.Element {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const initialState = useMemo<ToggleState>(() => {
    const accumulator: ToggleState = {};
    for (const section of safetyAccordionSections) {
      for (const toggle of section.toggles) {
        accumulator[toggle.id] = toggle.defaultChecked;
      }
    }
    return accumulator;
  }, []);
  const [toggleState, setToggleState] = useState<ToggleState>(initialState);

  const handleToggle = (toggle: SafetyToggle, value: boolean) => {
    setToggleState((prev) => ({ ...prev, [toggle.id]: value }));
  };

  return (
    <MobileShell tone="dark">
      <div className="screen-stack">
        <header className="px-6 pt-16 pb-6 text-base-100">
          <div className="mb-4 flex items-center gap-4">
            <button
              type="button"
              aria-label="Back"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/60 bg-base-200/30"
              onClick={() => navigate({ to: "/explore" })}
            >
              <Icon token="{icon.navigation.back}" className="text-accent" aria-hidden />
            </button>
            <h1 className="text-2xl font-semibold">Safety &amp; Accessibility</h1>
          </div>
          <p className="text-sm text-base-300">
            Customise your walking routes for comfort and safety
          </p>
        </header>

        <main className="shell-scroll space-y-6">
          <Accordion.Root
            type="multiple"
            defaultValue={safetyAccordionSections.map((section) => section.id)}
            className="space-y-4"
          >
            {safetyAccordionSections.map((section) => (
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
                          onCheckedChange={(checked) => handleToggle(toggle, checked)}
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
            <h2 className="text-base font-semibold text-base-100">Preset profiles</h2>
            <div className="grid gap-3">
              {safetyPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="safety__preset"
                  onClick={() =>
                    window.alert(`Preset "${preset.title}" will be applied in a future build.`)
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
              Save preferences
            </button>
          </section>
        </main>
      </div>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60" />
          <Dialog.Content className="modal-panel">
            <Dialog.Title className="text-lg font-semibold text-base-content">
              Preferences saved
            </Dialog.Title>
            <Dialog.Description className="text-sm text-base-content/70">
              Your safety and accessibility settings are now part of future walk planning.
            </Dialog.Description>
            <div className="chip-row text-sm text-base-content/80">
              {Object.entries(toggleState)
                .filter(([, value]) => value)
                .map(([id]) => (
                  <span key={id} className="rounded-full border border-base-300/60 px-3 py-1">
                    {id.replace(/-/g, " ")}
                  </span>
                ))}
            </div>
            <div className="flex justify-end">
              <Dialog.Close asChild>
                <button type="button" className="btn btn-accent btn-sm">
                  Continue
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </MobileShell>
  );
}
