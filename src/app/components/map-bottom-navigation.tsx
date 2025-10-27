/** @file Bottom navigation used across map-related flows. */

import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { FontAwesomeIcon } from "./font-awesome-icon";

export interface BottomNavItem {
  id: string;
  label: string;
  icon: string;
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
  { id: "map", label: "Map", icon: "fa-solid fa-map", href: "/map/quick" },
  { id: "explore", label: "Explore", icon: "fa-solid fa-compass", href: "/explore" },
  { id: "saved", label: "Saved", icon: "fa-solid fa-bookmark", href: "/saved" },
  { id: "profile", label: "Profile", icon: "fa-solid fa-user", href: "/profile" },
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
    <nav className="relative border-t border-base-300/40 bg-base-200/80 px-2 pb-3 pt-2 backdrop-blur">
      {trailingSlot}
      <div className="grid grid-cols-4 gap-1 text-xs font-medium">
        {resolved.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate({ to: item.href })}
              className={`flex flex-col items-center gap-1 rounded-xl py-2 transition hover:text-base-content ${
                isActive ? "text-base-content" : "text-base-content/60"
              }`}
            >
              <FontAwesomeIcon name={item.icon} className="text-lg" label={item.label} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
