/** @file Bottom navigation used across map-related flows. */

import { useNavigate } from "@tanstack/react-router";
import type { JSX, ReactNode } from "react";

import { Icon } from "./icon";

export interface BottomNavItem {
  id: string;
  label: string;
  iconToken: string;
  href: string;
}

export interface MapBottomNavigationProps {
  /** Route identifier that should render in an active state. */
  activeId: string;
  /** Navigation items shown along the bottom edge. */
  items?: BottomNavItem[];
  /** Optional slot for additional actions (e.g., fab inset). */
  trailingSlot?: ReactNode;
}

const baseItems: BottomNavItem[] = [
  { id: "map", label: "Map", iconToken: "{icon.navigation.map}", href: "/map/quick" },
  { id: "discover", label: "Discover", iconToken: "{icon.navigation.explore}", href: "/explore" },
  { id: "routes", label: "Routes", iconToken: "{icon.object.route}", href: "/customize" },
  { id: "profile", label: "Profile", iconToken: "{icon.navigation.profile}", href: "/offline" },
];

function resolveItems(customItems?: BottomNavItem[]): BottomNavItem[] {
  if (!customItems || customItems.length === 0) {
    return baseItems;
  }
  return customItems;
}

export function MapBottomNavigation({
  activeId,
  items,
  trailingSlot,
}: MapBottomNavigationProps): JSX.Element {
  const navigate = useNavigate();
  const resolved = resolveItems(items);

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
              onClick={() => navigate({ to: item.href })}
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
