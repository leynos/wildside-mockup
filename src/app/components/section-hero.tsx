/** @file Shared hero heading for screen intros with badge, title, and description. */

import type { JSX, ReactNode } from "react";

import { Icon } from "./icon";

type SectionHeroBadgeTone = "accent" | "celebration";

interface SectionHeroProps {
  iconToken: string;
  title: string;
  description?: ReactNode;
  badgeTone?: SectionHeroBadgeTone;
  iconAriaLabel?: string;
  iconClassName?: string;
}

export function SectionHero({
  iconToken,
  title,
  description,
  badgeTone = "accent",
  iconAriaLabel,
  iconClassName,
}: SectionHeroProps): JSX.Element {
  const badgeClass =
    badgeTone === "celebration"
      ? "section-hero__badge section-hero__badge--celebration"
      : "section-hero__badge section-hero__badge--accent";

  return (
    <header className="section-hero">
      <div className={badgeClass}>
        <Icon
          token={iconToken}
          className={iconClassName ? `section-hero__icon ${iconClassName}` : "section-hero__icon"}
          aria-hidden={iconAriaLabel == null}
        />
        {iconAriaLabel != null ? <span className="sr-only">{iconAriaLabel}</span> : null}
      </div>
      <h1 className="section-hero__title">{title}</h1>
      {description != null ? <p className="section-hero__description">{description}</p> : null}
    </header>
  );
}
