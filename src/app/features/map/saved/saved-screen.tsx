/** @file Saved walk detail screen with MapLibre map and tabbed layout. */

import * as Tabs from "@radix-ui/react-tabs";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../../components/icon";
import { MapBottomNavigation } from "../../../components/map-bottom-navigation";
import { savedRoutes } from "../../../data/map";
import { MobileShell } from "../../../layout/mobile-shell";
import { MapTabContent, NotesTabContent, StopsTabContent } from "./saved-screen-tabs";
import { useSavedRouteData } from "./use-saved-route-data";

const savedRoute = savedRoutes[0];
const tabTriggerClass =
  "py-3 text-sm font-semibold text-base-content/70 data-[state=active]:text-accent";

export function SavedScreen(): JSX.Element {
  if (!savedRoute) {
    return (
      <MobileShell tone="dark">
        <main className="map-shell__main">
          <div className="flex flex-1 items-center justify-center px-6 text-center text-base-content/70">
            <p>No saved routes are available yet.</p>
          </div>
        </main>
      </MobileShell>
    );
  }

  return <SavedScreenWithRoute savedRoute={savedRoute} />;
}

type SavedScreenWithRouteProps = {
  readonly savedRoute: NonNullable<typeof savedRoute>;
};

function SavedScreenWithRoute({ savedRoute }: SavedScreenWithRouteProps): JSX.Element {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isFavourite, setIsFavourite] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("map");

  const {
    routeCopy,
    distance,
    duration,
    stops,
    difficultyLabel,
    updatedLabel,
    numberFormatter,
    ratingFormatter,
  } = useSavedRouteData(savedRoute);

  return (
    <MobileShell tone="dark">
      <main className="map-shell__main">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="map-shell__pane">
          <div className="map-shell__viewport">
            <MapTabContent
              savedRoute={savedRoute}
              routeCopy={routeCopy}
              distance={distance}
              duration={duration}
              stops={stops}
              t={t}
              onBack={() => navigate({ to: "/map/quick" })}
              shareOpen={shareOpen}
              onShareOpenChange={setShareOpen}
            />

            <StopsTabContent savedRoute={savedRoute} onClose={() => setActiveTab("map")} />

            <NotesTabContent
              savedRoute={savedRoute}
              routeCopy={routeCopy}
              difficultyLabel={difficultyLabel}
              updatedLabel={updatedLabel}
              numberFormatter={numberFormatter}
              ratingFormatter={ratingFormatter}
              i18nLanguage={i18n.language}
            />
          </div>

          <Tabs.List className="map-panel__tablist">
            <Tabs.Trigger value="map" className={tabTriggerClass}>
              Explore
            </Tabs.Trigger>
            <Tabs.Trigger value="stops" className={tabTriggerClass}>
              Stops
            </Tabs.Trigger>
            <Tabs.Trigger value="notes" className={tabTriggerClass}>
              Notes
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        <div className="map-fab-layer">
          <button
            type="button"
            className={`pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border border-base-300/60 text-base-100 shadow-xl transition ${
              isFavourite ? "bg-accent text-base-900" : "bg-base-900/80"
            }`}
            aria-label={isFavourite ? "Remove saved walk" : "Save this walk"}
            aria-pressed={isFavourite}
            onClick={() => setIsFavourite((prev) => !prev)}
          >
            <Icon token={isFavourite ? "{icon.action.save}" : "{icon.action.unsave}"} aria-hidden />
          </button>
        </div>

        <MapBottomNavigation activeId="routes" />
      </main>
    </MobileShell>
  );
}
