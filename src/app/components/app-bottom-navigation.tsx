/** @file Shared bottom navigation bar used in discovery flows. */

import { useNavigate } from "@tanstack/react-router";

import { FontAwesomeIcon } from "./font-awesome-icon";

export interface AppBottomNavigationItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  isActive?: boolean;
}

export interface AppBottomNavigationProps {
  items: AppBottomNavigationItem[];
}

export function AppBottomNavigation({ items }: AppBottomNavigationProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <nav className="border-t border-base-300/60 bg-base-200/80 px-6 py-4">
      <div className="flex justify-between gap-4 text-xs font-medium text-base-content/70">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`flex w-1/4 flex-col items-center gap-1 transition hover:text-base-content ${
              item.isActive ? "text-base-content" : ""
            }`}
            onClick={() => {
              if (item.href) {
                navigate({ to: item.href });
              }
            }}
          >
            <FontAwesomeIcon name={item.icon} className="text-lg" />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
