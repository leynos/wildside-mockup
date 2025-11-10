/** @file Shared preference toggle card used across customise/offline screens. */

import * as Switch from "@radix-ui/react-switch";
import type { JSX } from "react";

import { Icon } from "./icon";

export interface PreferenceToggleCardProps {
  id: string;
  iconToken: string;
  iconClassName?: string;
  title: string;
  description: string;
  isChecked: boolean;
  onCheckedChange: (next: boolean) => void;
  switchTestId?: string;
}

export function PreferenceToggleCard({
  id,
  iconToken,
  iconClassName = "text-accent",
  title,
  description,
  isChecked,
  onCheckedChange,
  switchTestId,
}: PreferenceToggleCardProps): JSX.Element {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const switchClasses = [
    "toggle-switch",
    "toggle-switch--accent",
    "preference-card__switch",
    !isChecked ? "toggle-switch--muted" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="preference-card">
      <div className="preference-card__content">
        <Icon token={iconToken} className={`preference-card__icon ${iconClassName}`} aria-hidden />
        <div className="preference-card__copy">
          <p id={titleId} className="preference-card__title">
            {title}
          </p>
          <p id={descriptionId} className="preference-card__description">
            {description}
          </p>
        </div>
      </div>
      <Switch.Root
        id={id}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        checked={isChecked}
        onCheckedChange={onCheckedChange}
        className={switchClasses}
        data-testid={switchTestId}
      >
        <Switch.Thumb className="toggle-switch__thumb" />
      </Switch.Root>
    </article>
  );
}
