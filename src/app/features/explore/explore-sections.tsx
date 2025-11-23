/** @file Presentational building blocks for the Explore catalogue screen. */

import * as ScrollArea from "@radix-ui/react-scroll-area";
import { type JSX, type ReactNode, useId } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import type {
  CommunityPick,
  CuratedCollection,
  ExploreCategory,
  FeaturedWalk,
  PopularTheme,
  TrendingRoute,
} from "../../data/explore";
import { formatRating } from "../../data/explore";
import type {
  DifficultyId,
  ResolvedDifficultyDescriptor,
} from "../../data/registries/difficulties";

type RouteMetricProps = {
  readonly iconToken: string;
  readonly children: ReactNode;
};

export const defaultRouteCountLabel = (count: number): string =>
  `${count} ${count === 1 ? "route" : "routes"}`;

export const defaultSaveCountLabel = (count: number): string =>
  `${count} ${count === 1 ? "save" : "saves"}`;

export function RouteMetric({ iconToken, children }: RouteMetricProps): JSX.Element {
  return (
    <span className="route-metric">
      <Icon token={iconToken} aria-hidden className="h-4 w-4" />
      {children}
    </span>
  );
}

export interface CategoryScrollerProps {
  categories: readonly ExploreCategory[];
}

export function CategoryScroller({ categories }: CategoryScrollerProps): JSX.Element {
  const { t } = useTranslation();
  const ariaLabel = t("explore-categories-aria-label", { defaultValue: "Popular categories" });
  const formatRouteCount = (count: number) =>
    t("explore-curated-route-count", {
      count,
      defaultValue: defaultRouteCountLabel(count),
    });
  const headingId = useId();
  return (
    <section className="w-full pt-2" aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        {ariaLabel}
      </h2>
      <ScrollArea.Root className="w-full" type="scroll">
        <ScrollArea.Viewport className="w-full">
          <div className="flex gap-3 pb-2" style={{ paddingInlineEnd: "1.5rem" }}>
            {categories.map((category) => (
              <article
                key={category.id}
                className={`flex min-w-[150px] flex-col gap-1 rounded-xl p-4 text-white shadow-lg shadow-base-300/20 ${category.gradientClass}`}
              >
                <Icon token={category.iconToken} className="text-lg" aria-hidden />
                <p className="text-sm font-semibold">{category.title}</p>
                <p className="text-xs text-white/70">{formatRouteCount(category.routes)}</p>
              </article>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" className="h-1 rounded bg-base-300/60">
          <ScrollArea.Thumb className="rounded bg-accent/60" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner className="bg-base-300/40" />
      </ScrollArea.Root>
    </section>
  );
}

type FeaturedWalkCardProps = {
  formatDistanceLabel: (metres: number) => string;
  formatDurationLabel: (seconds: number) => string;
  featuredWalk: FeaturedWalk;
};

export function FeaturedWalkCard({
  formatDistanceLabel,
  formatDurationLabel,
  featuredWalk,
}: FeaturedWalkCardProps): JSX.Element {
  const { t } = useTranslation();
  const heading = t("explore-featured-heading", { defaultValue: "Walk of the Week" });
  const headingId = useId();
  const distanceLabel = formatDistanceLabel(featuredWalk.distanceMetres);
  const durationLabel = formatDurationLabel(featuredWalk.durationSeconds);
  return (
    <section className="explore-featured__panel" aria-labelledby={headingId}>
      <h2 id={headingId} className="section-heading text-base-content">
        <Icon token="{icon.object.crown}" className="text-amber-400" aria-hidden />
        {heading}
      </h2>
      <figure className="overflow-hidden rounded-xl border border-base-300/50">
        <img
          src={featuredWalk.heroImageUrl}
          alt={featuredWalk.title}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      </figure>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-base-content">{featuredWalk.title}</h3>
            <p className="text-sm text-base-content/70">{featuredWalk.description}</p>
          </div>
          <div className="explore-stat-group">
            <span className="flex items-center gap-1 font-semibold text-base-content">
              <Icon token="{icon.object.route}" aria-hidden className="h-4 w-4" />
              {distanceLabel}
            </span>
            <span className="mt-1 flex items-center gap-1">
              <Icon token="{icon.object.duration}" aria-hidden className="h-4 w-4" />
              {durationLabel}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-base-content/80">
          <span className="rating-indicator">
            <Icon token="{icon.object.star}" aria-hidden className="h-4 w-4" />
            {formatRating(featuredWalk.rating)}
          </span>
          {featuredWalk.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

type PopularThemesGridProps = {
  formatDistanceRangeLabel: (range: readonly [number, number]) => string;
  themes: readonly PopularTheme[];
};

export function PopularThemesGrid({
  formatDistanceRangeLabel,
  themes,
}: PopularThemesGridProps): JSX.Element {
  const { t } = useTranslation();
  const heading = t("explore-popular-heading", { defaultValue: "Popular Themes" });
  const headingId = useId();
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="section-title">
        {heading}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {themes.map((theme) => (
          <article key={theme.id} className="explore-compact__card">
            <div className="relative mb-3 h-24 overflow-hidden rounded-lg">
              <img
                src={theme.imageUrl}
                alt={theme.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/25" />
              <span className="explore-theme__badge">{theme.walkCount}</span>
            </div>
            <h3 className="text-sm font-semibold text-base-content">{theme.title}</h3>
            <p className="mt-1 text-xs text-base-content/60">{theme.description}</p>
            <div className="mt-2 flex items-center justify-between text-xs text-base-content/60">
              <span className="flex items-center gap-1">
                <Icon token="{icon.object.route}" aria-hidden className="h-4 w-4" />
                {formatDistanceRangeLabel(theme.distanceRangeMetres)}
              </span>
              <span className="rating-indicator">
                <Icon token="{icon.object.star}" aria-hidden className="h-4 w-4" />
                {formatRating(theme.rating)}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

type CuratedCollectionsListProps = {
  collections: CuratedCollection[];
  difficultyLookup: Map<DifficultyId, ResolvedDifficultyDescriptor>;
  formatDistanceRangeLabel: (range: readonly [number, number]) => string;
  formatDurationRangeLabel: (range: readonly [number, number]) => string;
};

export function CuratedCollectionsList({
  collections,
  difficultyLookup,
  formatDistanceRangeLabel,
  formatDurationRangeLabel,
}: CuratedCollectionsListProps): JSX.Element {
  const { t } = useTranslation();
  const heading = t("explore-curated-heading", { defaultValue: "Curated Collections" });
  const formatRouteCount = (count: number) =>
    t("explore-curated-route-count", {
      count,
      defaultValue: defaultRouteCountLabel(count),
    });
  const headingId = useId();
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="section-title">
        {heading}
      </h2>
      <div className="space-y-4">
        {collections.map((collection) => (
          <article key={collection.id} className="explore-collection__card">
            <div className="flex gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-lg border border-base-300/50">
                <img
                  src={collection.leadImageUrl}
                  alt={collection.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-base-content">{collection.title}</h3>
                <p className="text-sm text-base-content/70">{collection.description}</p>
                <div className="mt-2 explore-meta-list">
                  <span className="flex items-center gap-1">
                    <Icon token="{icon.object.route}" aria-hidden className="h-4 w-4" />
                    {formatDistanceRangeLabel(collection.distanceRangeMetres)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon token="{icon.object.duration}" aria-hidden className="h-4 w-4" />
                    {formatDurationRangeLabel(collection.durationRangeSeconds)}
                  </span>
                  {(() => {
                    const difficulty = difficultyLookup.get(collection.difficultyId);
                    const badgeToneClass =
                      difficulty?.badgeToneClass ?? "bg-base-300/40 text-base-content";
                    return (
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeToneClass}`}
                      >
                        {difficulty?.label ?? collection.difficultyId}
                      </span>
                    );
                  })()}
                </div>
              </div>
              <div className="explore-stat-group explore-stat-group--right">
                <span className="text-sm font-semibold text-base-content">
                  {formatRouteCount(collection.routes)}
                </span>
              </div>
            </div>
            <figure className="mt-3 h-12 overflow-hidden rounded-lg border border-base-300/50">
              <img
                src={collection.mapImageUrl}
                alt={`${collection.title} map preview`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </figure>
          </article>
        ))}
      </div>
    </section>
  );
}

type TrendingRoutesListProps = {
  readonly routes: readonly TrendingRoute[];
};

export function TrendingRoutesList({ routes }: TrendingRoutesListProps): JSX.Element {
  const { t } = useTranslation();
  const heading = t("explore-trending-heading", { defaultValue: "Trending Now" });
  const headingId = useId();
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="section-title">
        {heading}
      </h2>
      <div className="space-y-3">
        {routes.map((route) => (
          <article key={route.id} className="explore-trending__card">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-lg">
                <img
                  src={route.imageUrl}
                  alt={route.title}
                  className="h-full w-full"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-base-content">{route.title}</p>
                <p className="text-xs text-base-content/60">{route.subtitle}</p>
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-orange-300">
                <Icon token="{icon.object.trend}" aria-hidden className="h-4 w-4" />
                {route.trendDelta}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

type CommunityPickPanelProps = {
  pick: CommunityPick;
  formatDistanceLabel: (metres: number) => string;
  formatDurationLabel: (seconds: number) => string;
  formatSaveCount: (count: number) => string;
};

export function CommunityPickPanel({
  pick,
  formatDistanceLabel,
  formatDurationLabel,
  formatSaveCount,
}: CommunityPickPanelProps): JSX.Element {
  const { t } = useTranslation();
  const heading = t("explore-community-heading", { defaultValue: "Community Favourite" });
  const subtitle = t("explore-community-subtitle", { defaultValue: "Most shared this week" });
  const headingId = useId();
  return (
    <section className="explore-info__panel" aria-labelledby={headingId}>
      <h2 id={headingId} className="section-heading mb-4 text-base-content">
        <Icon token="{icon.object.family}" className="text-accent" aria-hidden />
        {heading}
      </h2>
      <div className="mb-3 flex items-center gap-3">
        <div className="h-9 w-9 overflow-hidden rounded-full border border-base-300/60">
          <img
            src={pick.curatorAvatarUrl}
            alt={pick.curator}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-base-content">{pick.curator}</p>
          <p className="text-xs text-base-content/60">{subtitle}</p>
        </div>
        <span className="rating-indicator rating-indicator--strong">
          <Icon token="{icon.object.star}" aria-hidden className="h-4 w-4" />
          {formatRating(pick.rating)}
        </span>
      </div>
      <h3 className="text-base font-semibold text-base-content">{pick.title}</h3>
      <p className="mt-2 text-sm text-base-content/70">{pick.description}</p>
      <div className="mt-3 explore-meta-list">
        <RouteMetric iconToken="{icon.object.route}">
          {formatDistanceLabel(pick.distanceMetres)}
        </RouteMetric>
        <RouteMetric iconToken="{icon.object.duration}">
          {formatDurationLabel(pick.durationSeconds)}
        </RouteMetric>
        <RouteMetric iconToken="{icon.action.save}">{formatSaveCount(pick.saves)}</RouteMetric>
      </div>
    </section>
  );
}
