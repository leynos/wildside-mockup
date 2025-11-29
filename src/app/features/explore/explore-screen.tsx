/** @file Explore catalogue screen presenting discovery content. */

import { useNavigate } from "@tanstack/react-router";
import type { TFunction } from "i18next";
import type { JSX } from "react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { AppBottomNavigation } from "../../components/app-bottom-navigation";
import { Icon } from "../../components/icon";
import { bottomNavigation } from "../../data/customize";
import {
  communityPick,
  curatedCollections,
  exploreCategories,
  exploreRoutes,
  featuredRoute,
  popularThemes,
  trendingRoutes,
} from "../../data/explore";
import type { Route, RouteCategory, RouteId } from "../../data/explore.models";
import { buildDifficultyLookup } from "../../data/registries/difficulties";
import { AppHeader } from "../../layout/app-header";
import { MobileShell } from "../../layout/mobile-shell";
import { formatDistance, formatDistanceRange, formatDuration } from "../../units/unit-format";
import { useUnitPreferences } from "../../units/unit-preferences-provider";
import {
  CategoryScroller,
  CommunityPickPanel,
  CuratedCollectionsList,
  defaultSaveCountLabel,
  FeaturedRouteCard,
  PopularThemesGrid,
  type TrendingRouteCard,
  TrendingRoutesList,
} from "./explore-sections";

type ExploreCopy = {
  headerTitle: string;
  headerSubtitle: string;
  filterLabel: string;
  searchPlaceholder: string;
  bottomNavAriaLabel: string;
};

export const buildExploreCopy = (t: TFunction): ExploreCopy => ({
  headerTitle: t("explore-header-title", { defaultValue: "Discover" }),
  headerSubtitle: t("explore-header-subtitle", {
    defaultValue: "Explore curated walks & hidden gems",
  }),
  filterLabel: t("explore-filter-aria-label", { defaultValue: "Filter walks" }),
  searchPlaceholder: t("explore-search-placeholder", {
    defaultValue: "Search walks, places, themes…",
  }),
  bottomNavAriaLabel: t("nav-primary-aria-label", { defaultValue: "Primary navigation" }),
});

export function ExploreScreen(): JSX.Element {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { unitSystem } = useUnitPreferences();
  const unitOptions = useMemo(
    () => ({ t, locale: i18n.language, unitSystem }),
    [i18n.language, t, unitSystem],
  );
  const formatDistanceLabel = useCallback(
    (metres: number) => {
      const { value, unitLabel } = formatDistance(metres, unitOptions);
      return `${value} ${unitLabel}`;
    },
    [unitOptions],
  );
  const formatDurationLabel = useCallback(
    (seconds: number) => {
      const { value, unitLabel } = formatDuration(seconds, {
        ...unitOptions,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return `${value} ${unitLabel}`;
    },
    [unitOptions],
  );
  const formatDistanceRangeLabel = useCallback(
    (range: readonly [number, number]) => {
      const { value, maxValue, unitLabel } = formatDistanceRange(range, unitOptions);
      return `${value}–${maxValue} ${unitLabel}`;
    },
    [unitOptions],
  );
  const formatDurationRangeLabel = useCallback(
    (range: readonly [number, number]) => {
      const [minSeconds, maxSeconds] = range;
      const minLabel = formatDuration(minSeconds, {
        ...unitOptions,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      const maxLabel = formatDuration(maxSeconds, {
        ...unitOptions,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return `${minLabel.value}–${maxLabel.value} ${maxLabel.unitLabel}`;
    },
    [unitOptions],
  );
  const formatSaveCount = useCallback(
    (count: number) =>
      t("explore-community-saves", {
        count,
        defaultValue: defaultSaveCountLabel(count),
      }),
    [t],
  );

  const copy = useMemo(() => buildExploreCopy(t), [t]);
  const difficultyLookup = useMemo(() => buildDifficultyLookup(t), [t]);
  const categories: readonly RouteCategory[] = exploreCategories;
  const routesById = useMemo(
    () => new Map<RouteId, Route>(exploreRoutes.map((route) => [route.id, route])),
    [],
  );
  const trendingRouteCards = useMemo<TrendingRouteCard[]>(
    () =>
      trendingRoutes.map((highlight) => {
        const route = routesById.get(highlight.routeId);
        if (!route) {
          throw new Error(`Missing route for trending highlight ${highlight.routeId}`);
        }
        return { route, highlight };
      }),
    [routesById],
  );

  return (
    <MobileShell>
      <div className="screen-stack">
        <AppHeader
          title={copy.headerTitle}
          subtitle={copy.headerSubtitle}
          trailing={
            <button
              type="button"
              onClick={() => navigate({ to: "/discover" })}
              className="header-icon-button"
              aria-label={copy.filterLabel}
            >
              <Icon token="{icon.action.filter}" aria-hidden className="h-5 w-5" />
            </button>
          }
        >
          <div className="relative">
            <Icon
              token="{icon.action.search}"
              aria-hidden
              className="explore-search__icon h-4 w-4"
            />
            <input
              type="search"
              placeholder={copy.searchPlaceholder}
              className="explore-search__input"
            />
          </div>
        </AppHeader>
        <main className="screen-scroll">
          <div className="space-y-8">
            <CategoryScroller categories={categories} />
            <FeaturedRouteCard
              formatDistanceLabel={formatDistanceLabel}
              formatDurationLabel={formatDurationLabel}
              route={featuredRoute}
            />
            <PopularThemesGrid
              formatDistanceRangeLabel={formatDistanceRangeLabel}
              themes={popularThemes}
            />
            <CuratedCollectionsList
              collections={curatedCollections}
              difficultyLookup={difficultyLookup}
              formatDistanceRangeLabel={formatDistanceRangeLabel}
              formatDurationRangeLabel={formatDurationRangeLabel}
            />
            <TrendingRoutesList routes={trendingRouteCards} />
            <CommunityPickPanel
              pick={communityPick}
              formatDistanceLabel={formatDistanceLabel}
              formatDurationLabel={formatDurationLabel}
              formatSaveCount={formatSaveCount}
            />
          </div>
        </main>
        <AppBottomNavigation
          aria-label={copy.bottomNavAriaLabel}
          items={bottomNavigation.map((item) => ({
            ...item,
            label: t(`nav-${item.id}-label`, { defaultValue: item.label }),
            isActive: item.id === "discover",
            ...(item.id === "discover" ? {} : { href: item.href }),
          }))}
        />
      </div>
    </MobileShell>
  );
}
