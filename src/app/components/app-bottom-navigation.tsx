/** @file Shared bottom navigation bar used in discovery flows. */

import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";

import { Icon } from "./icon";

export interface AppBottomNavigationItem {
  id: string;
  label: string;
  iconToken: string;
  href?: string;
  isActive?: boolean;
}

export interface AppBottomNavigationProps {
  items: AppBottomNavigationItem[];
}

export function AppBottomNavigation({ items }: AppBottomNavigationProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__grid">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`bottom-nav__item ${item.isActive ? "bottom-nav__item--active" : ""}`}
            onClick={() => {
              if (item.href) {
                navigate({ to: item.href });
              }
            }}
          >
            <Icon token={item.iconToken} className="text-lg" label={item.label} />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
