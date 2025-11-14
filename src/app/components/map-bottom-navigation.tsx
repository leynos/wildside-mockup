/** @file Bottom navigation used across map-related flows. */

import { useNavigate } from "@tanstack/react-router";
import type { JSX, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "./icon";
import type { BottomNavigationItem } from "../data/customize";
import { bottomNavigation } from "../data/customize";

export interface MapBottomNavigationProps {
  /** Route identifier that should render in an active state. */
  activeId: string;
  /** Navigation items shown along the bottom edge. */
  items?: BottomNavigationItem[];
  /** Optional slot for additional actions (e.g., fab inset). */
  trailingSlot?: ReactNode;
}

export function MapBottomNavigation({
  activeId,
  items,
  trailingSlot,
}: MapBottomNavigationProps): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const resolvedSource = items && items.length > 0 ? items : bottomNavigation;
  const resolved = resolvedSource.map((item) => ({
    ...item,
    label: t(`nav-${item.id}-label`, { defaultValue: item.label }),
  }));

  return (
    <nav className="bottom-nav bottom-nav--map">
      {trailingSlot}
      <div className="bottom-nav__grid">
        {resolved.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => item.href && navigate({ to: item.href })}
              className={`bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`}
            >
              <Icon token={item.iconToken} className="text-lg" label={item.label} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
