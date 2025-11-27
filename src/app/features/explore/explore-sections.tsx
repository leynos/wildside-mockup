/** @file Presentational building blocks for the Explore catalogue screen. */

import * as ScrollArea from "@radix-ui/react-scroll-area";
import { type JSX, type ReactNode, useId } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import { formatRating } from "../../data/explore";
import type {
  CommunityPick,
  Route,
  RouteCategory,
  RouteCollection,
  Theme,
  TrendingRouteHighlight,
} from "../../data/explore.models";
import { getBadgeDescriptor } from "../../data/registries/badges";
import type {
  DifficultyId,
  ResolvedDifficultyDescriptor,
} from "../../data/registries/difficulties";
import { pickLocalization } from "../../domain/entities/localization";

type RouteMetricProps = {
  readonly iconToken: string;
  readonly children: ReactNode;
};

export const defaultRouteCountLabel = (count: number): string =>
  `${count} ${count === 1 ? "route" : "routes"}`;

export const defaultWalkCountLabel = (count: number): string =>
  `${count} ${count === 1 ? "walk" : "walks"}`;

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
  categories: readonly RouteCategory[];
}

export function CategoryScroller({ categories }: CategoryScrollerProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
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
                <p className="text-sm font-semibold">
                  {pickLocalization(category.localizations, locale).name}
                </p>
                <p className="text-xs text-white/70">{formatRouteCount(category.routeCount)}</p>
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

type FeaturedRouteCardProps = {
  formatDistanceLabel: (metres: number) => string;
  formatDurationLabel: (seconds: number) => string;
  route: Route;
};

export function FeaturedRouteCard({
  formatDistanceLabel,
  formatDurationLabel,
  route,
}: FeaturedRouteCardProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const heading = t("explore-featured-heading", { defaultValue: "Walk of the Week" });
  const headingId = useId();
  const distanceLabel = formatDistanceLabel(route.distanceMetres);
  const durationLabel = formatDurationLabel(route.durationSeconds);
  const localization = pickLocalization(route.localizations, locale);
  return (
    <section className="explore-featured__panel" aria-labelledby={headingId}>
      <h2 id={headingId} className="section-heading text-base-content">
        <Icon token="{icon.object.crown}" className="text-amber-400" aria-hidden />
        {heading}
      </h2>
      <figure className="overflow-hidden rounded-xl border border-base-300/50">
        <img
          src={route.heroImage.url}
          alt={route.heroImage.alt}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      </figure>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-base-content">{localization.name}</h3>
            <p className="text-sm text-base-content/70">{localization.description}</p>
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
            {formatRating(route.rating)}
          </span>
          {route.badges.map((badgeId) => {
            const badgeDescriptor = getBadgeDescriptor(badgeId, locale);
            const badgeLabel =
              badgeDescriptor?.localization.shortLabel ??
              badgeDescriptor?.localization.name ??
              badgeId;
            const badgeToneClass = badgeDescriptor?.accentClass ?? "bg-accent/20 text-accent";
            return (
              <span
                key={badgeId}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeToneClass}`}
              >
                {badgeLabel}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type PopularThemesGridProps = {
  formatDistanceRangeLabel: (range: readonly [number, number]) => string;
  themes: readonly Theme[];
};

export function PopularThemesGrid({
  formatDistanceRangeLabel,
  themes,
}: PopularThemesGridProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const heading = t("explore-popular-heading", { defaultValue: "Popular Themes" });
  const headingId = useId();
  const formatWalkCount = (count: number) =>
    t("explore-theme-walk-count", {
      count,
      defaultValue: defaultWalkCountLabel(count),
    });
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="section-title">
        {heading}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {themes.map((theme) => (
          <article key={theme.id} className="explore-compact__card">
            {(() => {
              const localization = pickLocalization(theme.localizations, locale);
              return (
                <>
                  <div className="relative mb-3 h-24 overflow-hidden rounded-lg">
                    <img
                      src={theme.image.url}
                      alt={theme.image.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/25" />
                    <span className="explore-theme__badge">{formatWalkCount(theme.walkCount)}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-base-content">{localization.name}</h3>
                  <p className="mt-1 text-xs text-base-content/60">{localization.description}</p>
                </>
              );
            })()}
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
  collections: readonly RouteCollection[];
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
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
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
                  src={collection.leadImage.url}
                  alt={collection.leadImage.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                {(() => {
                  const localization = pickLocalization(collection.localizations, locale);
                  return (
                    <>
                      <h3 className="text-base font-semibold text-base-content">
                        {localization.name}
                      </h3>
                      <p className="text-sm text-base-content/70">{localization.description}</p>
                    </>
                  );
                })()}
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
                  {formatRouteCount(collection.routeIds.length)}
                </span>
              </div>
            </div>
            <figure className="mt-3 h-12 overflow-hidden rounded-lg border border-base-300/50">
              <img
                src={collection.mapPreview.url}
                alt={collection.mapPreview.alt}
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

export type TrendingRouteCard = {
  readonly route: Route;
  readonly highlight: TrendingRouteHighlight;
};

type TrendingRoutesListProps = {
  readonly routes: readonly TrendingRouteCard[];
};

export function TrendingRoutesList({ routes }: TrendingRoutesListProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const heading = t("explore-trending-heading", { defaultValue: "Trending Now" });
  const headingId = useId();
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="section-title">
        {heading}
      </h2>
      <div className="space-y-3">
        {routes.map(({ route, highlight }) => {
          const routeLocalization = pickLocalization(route.localizations, locale);
          const subtitle = pickLocalization(highlight.subtitleLocalizations, locale).name;
          return (
            <article key={route.id} className="explore-trending__card">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-lg">
                  <img
                    src={route.heroImage.url}
                    alt={route.heroImage.alt}
                    className="h-full w-full"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-base-content">
                    {routeLocalization.name}
                  </p>
                  <p className="text-xs text-base-content/60">{subtitle}</p>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-orange-300">
                  <Icon token="{icon.object.trend}" aria-hidden className="h-4 w-4" />
                  {highlight.trendDelta}
                </span>
              </div>
            </article>
          );
        })}
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
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const heading = t("explore-community-heading", { defaultValue: "Community Favourite" });
  const subtitle = t("explore-community-subtitle", { defaultValue: "Most shared this week" });
  const headingId = useId();
  const localization = pickLocalization(pick.localizations, locale);
  const curator = pickLocalization(pick.curator.localizations, locale);
  return (
    <section className="explore-info__panel" aria-labelledby={headingId}>
      <h2 id={headingId} className="section-heading mb-4 text-base-content">
        <Icon token="{icon.object.family}" className="text-accent" aria-hidden />
        {heading}
      </h2>
      <div className="mb-3 flex items-center gap-3">
        <div className="h-9 w-9 overflow-hidden rounded-full border border-base-300/60">
          <img
            src={pick.curator.avatar.url}
            alt={pick.curator.avatar.alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-base-content">{curator.name}</p>
          <p className="text-xs text-base-content/60">{subtitle}</p>
        </div>
        <span className="rating-indicator rating-indicator--strong">
          <Icon token="{icon.object.star}" aria-hidden className="h-4 w-4" />
          {formatRating(pick.rating)}
        </span>
      </div>
      <h3 className="text-base font-semibold text-base-content">{localization.name}</h3>
      <p className="mt-2 text-sm text-base-content/70">{localization.description}</p>
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
