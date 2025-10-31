/** @file Floating global controls for theme and display mode toggles. */

import { type JSX, useId, useState } from "react";

import { useDisplayMode } from "../providers/display-mode-provider";
import { useTheme } from "../providers/theme-provider";

const baseButtonClass =
  "btn btn-xs md:btn-sm btn-ghost bg-base-100/90 text-xs font-semibold shadow-lg shadow-base-300/40 backdrop-blur";

function ThemeToggleButton(): JSX.Element {
  const { theme, themes, setTheme } = useTheme();
  const nextTheme = themes.find((entry) => entry !== theme) ?? theme;
  const label = nextTheme === "wildside-day" ? "Switch to Day" : "Switch to Night";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className={baseButtonClass}
      aria-label={label}
    >
      {label}
    </button>
  );
}

function DisplayModeToggleButton(): JSX.Element {
  const { isHosted, setHosted, setFullBrowser } = useDisplayMode();
  const label = isHosted ? "Switch to Full View" : "Switch to Hosted Frame";

  return (
    <button
      type="button"
      onClick={() => (isHosted ? setFullBrowser() : setHosted())}
      className={baseButtonClass}
      aria-label={label}
    >
      {label}
    </button>
  );
}

function DrawerPanel({
  headingId,
  onClose,
}: {
  headingId: string;
  onClose: () => void;
}): JSX.Element {
  const { hasUserPreference, resetToSystemDefault } = useDisplayMode();

  return (
    <div className="flex w-56 flex-col gap-3 rounded-2xl border border-base-300/50 bg-base-100/95 p-4 shadow-2xl shadow-base-300/40 backdrop-blur">
      <div className="flex items-center justify-between">
        <h2 id={headingId} className="text-sm font-semibold text-base-content">
          Display & theme
        </h2>
        <button
          type="button"
          className="btn btn-ghost btn-xs text-xs"
          onClick={onClose}
          aria-label="Close display controls"
        >
          Close
        </button>
      </div>
      <DisplayModeToggleButton />
      <ThemeToggleButton />
      <button
        type="button"
        className="btn btn-xs btn-ghost text-xs text-base-content/70 hover:text-base-content"
        onClick={() => {
          resetToSystemDefault();
          onClose();
        }}
        disabled={!hasUserPreference}
      >
        Reset to device default
      </button>
    </div>
  );
}

function Drawer(): JSX.Element {
  const [open, setOpen] = useState(false);
  const headingId = useId();

  return (
    <div className="fixed inset-y-1/2 right-0 z-50 flex -translate-y-1/2 flex-col items-end gap-3 pr-0 sm:pr-3">
      <button
        type="button"
        aria-controls="global-controls-drawer"
        aria-expanded={open}
        className="pointer-events-auto rounded-l-2xl border border-r-0 border-base-300/50 bg-base-100/90 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-base-content/70 shadow-xl shadow-base-300/40 backdrop-blur transition hover:text-base-content"
        onClick={() => setOpen((prev) => !prev)}
      >
        Controls
      </button>
      <div
        id="global-controls-drawer"
        role="dialog"
        aria-modal="false"
        aria-hidden={!open}
        aria-labelledby={headingId}
        className={`transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-x-0 opacity-100"
            : "pointer-events-none translate-x-full opacity-0"
        }`}
      >
        {open ? <DrawerPanel headingId={headingId} onClose={() => setOpen(false)} /> : null}
      </div>
    </div>
  );
}

function FloatingStack(): JSX.Element {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <DisplayModeToggleButton />
      <ThemeToggleButton />
    </div>
  );
}

export function GlobalControls(): JSX.Element {
  const { isHosted } = useDisplayMode();

  return isHosted ? <FloatingStack /> : <Drawer />;
}
