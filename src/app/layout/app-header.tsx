/** @file Shared top navigation bar for primary Wildside screens. */

import type { ReactNode } from "react";

export interface AppHeaderProps {
  /** Main heading displayed within the shell. */
  title: string;
  /** Optional secondary text beneath the title. */
  subtitle?: string;
  /** Slot for leading controls (e.g., back button). */
  leading?: ReactNode;
  /** Slot for trailing controls (e.g., settings, theme toggle). */
  trailing?: ReactNode;
}

/**
 * Presents a consistent header layout with optional leading/trailing actions.
 *
 * @example
 * ```tsx
 * <AppHeader
 *   title="Discover"
 *   subtitle="Explore curated walks"
 *   trailing={<button className="btn btn-sm btn-ghost">Menu</button>}
 * />
 * ```
 */
export function AppHeader({ leading, subtitle, title, trailing }: AppHeaderProps): JSX.Element {
  return (
    <header className="flex select-none items-end justify-between gap-4 border-b border-base-300/60 bg-base-100/80 px-6 pb-4 pt-8">
      <div className="flex items-center gap-3">
        {leading ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-200/70 text-base-content/80">
            {leading}
          </div>
        ) : null}
        <div>
          <h1 className="text-xl font-semibold text-base-content">{title}</h1>
          {subtitle ? <p className="text-sm font-medium text-base-content/60">{subtitle}</p> : null}
        </div>
      </div>
      {trailing ? (
        <div className="flex items-center gap-2 text-base-content/80">{trailing}</div>
      ) : null}
    </header>
  );
}
