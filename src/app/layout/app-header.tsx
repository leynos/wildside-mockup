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
  /** Optional slot rendered beneath the primary heading row. */
  children?: ReactNode;
  /** Visual variant for the header shell. */
  variant?: "default" | "wizard";
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
export function AppHeader({
  children,
  leading,
  subtitle,
  title,
  trailing,
  variant = "default",
}: AppHeaderProps): JSX.Element {
  const isWizard = variant === "wizard";

  const headerClassName =
    "select-none px-6 border-b border-base-300/60 bg-base-100/80 pb-4 pt-8 text-base-content";

  const leadingContainerClassName = [
    "flex h-10 w-10 items-center justify-center rounded-full border border-base-300/60",
    isWizard ? "bg-base-800/60 text-base-content" : "bg-base-200/70 text-base-content/80",
  ].join(" ");

  const titleContainerClassName = ["flex-1", isWizard ? "text-center" : "text-left"].join(" ");

  const trailingContainerClassName = [
    "flex items-center gap-2",
    isWizard ? "text-base-content" : "text-base-content/80",
  ].join(" ");

  const subtitleClassName = "text-sm font-medium text-base-content/60";

  return (
    <header className={headerClassName}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          {leading ? <div className={leadingContainerClassName}>{leading}</div> : null}
          <div className={titleContainerClassName}>
            <h1 className="text-xl font-semibold text-base-content">{title}</h1>
            {subtitle ? <p className={subtitleClassName}>{subtitle}</p> : null}
          </div>
        </div>
        {trailing ? <div className={trailingContainerClassName}>{trailing}</div> : null}
      </div>
      {children ? <div className="mt-4 space-y-2">{children}</div> : null}
    </header>
  );
}
