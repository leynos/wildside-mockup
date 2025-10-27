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
    <nav className="border-t border-base-300/60 bg-base-200/80 px-2 pb-3 pt-2 backdrop-blur">
      <div className="grid grid-cols-4 gap-1 text-xs font-medium">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`flex flex-col items-center gap-1 rounded-xl py-2 transition hover:text-base-content ${
              item.isActive ? "text-base-content" : "text-base-content/60"
            }`}
            onClick={() => {
              if (item.href) {
                navigate({ to: item.href });
              }
            }}
          >
            <FontAwesomeIcon name={item.icon} className="text-lg" label={item.label} />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
