/** @file Temporary routing stub until individual screens are ported. */

import { AppHeader } from "../layout/app-header";
import { MobileShell } from "../layout/mobile-shell";
import { useTheme } from "../providers/theme-provider";

function ThemeToggle(): JSX.Element {
  const { theme, setTheme, themes } = useTheme();
  const nextTheme = themes.find((candidate) => candidate !== theme) ?? theme;

  return (
    <button
      type="button"
      className="btn btn-sm btn-ghost text-sm font-medium"
      onClick={() => setTheme(nextTheme)}
    >
      {nextTheme === "wildside-day" ? "Day Mode" : "Night Mode"}
    </button>
  );
}

/**
 * Placeholder routes rendering the shared shell while migration work proceeds.
 */
export function AppRoutes(): JSX.Element {
  return (
    <MobileShell>
      <AppHeader
        title="Wildside Mockup"
        subtitle="React scaffolding in progress"
        trailing={<ThemeToggle />}
      />
      <main className="flex flex-1 items-center justify-center px-6 pb-12 pt-6">
        <article className="w-full max-w-sm rounded-3xl border border-base-300/70 bg-base-100/80 p-6 text-base-content/80 shadow-lg shadow-base-300/40">
          <h2 className="text-lg font-semibold text-base-content">Scaffolding ready</h2>
          <p className="mt-2 text-sm leading-relaxed text-base-content/70">
            The next step is to migrate each static HTML mockup into feature modules that compose
            Radix primitives, DaisyUI tokens, and shared layout components.
          </p>
        </article>
      </main>
    </MobileShell>
  );
}
