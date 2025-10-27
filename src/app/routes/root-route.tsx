/** @file Root TanStack Router route hosting the SPA outlet. */

import { createRootRoute, Outlet } from "@tanstack/react-router";

import { useTheme } from "../providers/theme-provider";

function FloatingThemeToggle(): JSX.Element {
  const { theme, setTheme, themes } = useTheme();
  const nextTheme = themes.find((entry) => entry !== theme) ?? theme;

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className="btn btn-xs md:btn-sm btn-ghost fixed bottom-6 right-6 z-50 bg-base-100/80 text-xs font-semibold shadow-lg shadow-base-300/40 backdrop-blur"
    >
      {nextTheme === "wildside-day" ? "Switch to Day" : "Switch to Night"}
    </button>
  );
}

export const rootRoute = createRootRoute({
  component: function RootRoute(): JSX.Element {
    return (
      <>
        <Outlet />
        <FloatingThemeToggle />
      </>
    );
  },
});
