/** @file Explore catalogue screen presenting discovery content. */

import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, type ReactNode, useId } from "react";
import { useTranslation } from "react-i18next";

import { AppBottomNavigation } from "../../components/app-bottom-navigation";
import { Icon } from "../../components/icon";
import { bottomNavigation } from "../../data/customize";
import {
  communityPick,
  curatedCollections,
  exploreCategories,
  featuredWalk,
  formatRating,
  popularThemes,
  trendingRoutes,
} from "../../data/explore";
import { AppHeader } from "../../layout/app-header";
import { MobileShell } from "../../layout/mobile-shell";

type RouteMetricProps = {
  readonly iconToken: string;
  readonly children: ReactNode;
};

function RouteMetric({ iconToken, children }: RouteMetricProps): JSX.Element {
  return (
    <span className="route-metric">
      <Icon token={iconToken} aria-hidden className="h-4 w-4" />
      {children}
    </span>
  );
}

type CategoryScrollerProps = {
  ariaLabel: string;
};

type FeaturedWalkCardProps = {
  heading: string;
};

type PopularThemesGridProps = {
  heading: string;
};

type CuratedCollectionsListProps = {
  heading: string;
  formatRouteCount: (count: number) => string;
};

type TrendingRoutesListProps = {
  heading: string;
};

type CommunityPickPanelProps = {
  heading: string;
  subtitle: string;
  formatSaveCount: (count: number) => string;
};

function CategoryScroller({ ariaLabel }: CategoryScrollerProps): JSX.Element {
  return (
    <section className="w-full pt-2" aria-label={ariaLabel} role="region">
      <ScrollArea.Root className="w-full" type="scroll">
        <ScrollArea.Viewport className="w-full">
          <div className="flex gap-3 pb-2" style={{ paddingInlineEnd: "1.5rem" }}>
            {exploreCategories.map((category) => (
              <article
                key={category.id}
                className={`flex min-w-[150px] flex-col gap-1 rounded-xl p-4 text-white shadow-lg shadow-base-300/20 ${category.gradientClass}`}
              >
                <Icon token={category.iconToken} className="text-lg" aria-hidden />
                <p className="text-sm font-semibold">{category.title}</p>
                <p className="text-xs text-white/70">{category.summary}</p>
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

function FeaturedWalkCard({ heading }: FeaturedWalkCardProps): JSX.Element {
  const headingId = useId();
  return (
    <section className="explore-featured__panel" aria-labelledby={headingId} role="region">
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
              {featuredWalk.distance}
            </span>
            <span className="mt-1 flex items-center gap-1">
              <Icon token="{icon.object.duration}" aria-hidden className="h-4 w-4" />
              {featuredWalk.duration}
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

function PopularThemesGrid({ heading }: PopularThemesGridProps): JSX.Element {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} role="region">
      <h2 id={headingId} className="section-title">
        {heading}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {popularThemes.map((theme) => (
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
                {theme.distanceRange}
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

function CuratedCollectionsList({
  heading,
  formatRouteCount,
}: CuratedCollectionsListProps): JSX.Element {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} role="region">
      <h2 id={headingId} className="section-title">
        {heading}
      </h2>
      <div className="space-y-4">
        {curatedCollections.map((collection) => (
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
                    {collection.distanceRange}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon token="{icon.object.duration}" aria-hidden className="h-4 w-4" />
                    {collection.durationRange}
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-300">
                    {collection.difficulty}
                  </span>
                </div>
              </div>
              <div className="explore-stat-group explore-stat-group--right">
                <span className="text-lg font-bold text-base-content">{collection.routes}</span>
                <span>{formatRouteCount(collection.routes)}</span>
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

function TrendingRoutesList({ heading }: TrendingRoutesListProps): JSX.Element {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} role="region">
      <h2 id={headingId} className="section-title">
        {heading}
      </h2>
      <div className="space-y-3">
        {trendingRoutes.map((route) => (
          <article key={route.id} className="explore-compact__card flex items-center gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-lg border border-base-300/50">
              <img
                src={route.imageUrl}
                alt={route.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-base-content">{route.title}</h3>
              <p className="text-xs text-base-content/60">{route.subtitle}</p>
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-orange-300">
              <Icon token="{icon.object.trend}" aria-hidden className="h-4 w-4" />
              {route.trendDelta}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function CommunityPickPanel({
  heading,
  subtitle,
  formatSaveCount,
}: CommunityPickPanelProps): JSX.Element {
  const headingId = useId();
  return (
    <section className="explore-info__panel" aria-labelledby={headingId} role="region">
      <h2 id={headingId} className="section-heading mb-4 text-base-content">
        <Icon token="{icon.object.family}" className="text-accent" aria-hidden />
        {heading}
      </h2>
      <div className="mb-3 flex items-center gap-3">
        <div className="h-9 w-9 overflow-hidden rounded-full border border-base-300/60">
          <img
            src={communityPick.curatorAvatarUrl}
            alt={communityPick.curator}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-base-content">{communityPick.curator}</p>
          <p className="text-xs text-base-content/60">{subtitle}</p>
        </div>
        <span className="rating-indicator rating-indicator--strong">
          <Icon token="{icon.object.star}" aria-hidden className="h-4 w-4" />
          {formatRating(communityPick.rating)}
        </span>
      </div>
      <h3 className="text-base font-semibold text-base-content">{communityPick.title}</h3>
      <p className="mt-2 text-sm text-base-content/70">{communityPick.description}</p>
      <div className="mt-3 explore-meta-list">
        <RouteMetric iconToken="{icon.object.route}">{communityPick.distance}</RouteMetric>
        <RouteMetric iconToken="{icon.object.duration}">{communityPick.duration}</RouteMetric>
        <RouteMetric iconToken="{icon.action.save}">
          {formatSaveCount(communityPick.saves)}
        </RouteMetric>
      </div>
    </section>
  );
}

export function ExploreScreen(): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const headerTitle = t("explore-header-title", { defaultValue: "Discover" });
  const headerSubtitle = t("explore-header-subtitle", {
    defaultValue: "Explore curated walks & hidden gems",
  });
  const filterLabel = t("explore-filter-aria-label", { defaultValue: "Filter walks" });
  const searchPlaceholder = t("explore-search-placeholder", {
    defaultValue: "Search walks, places, themes...",
  });
  const categoriesLabel = t("explore-categories-aria-label", {
    defaultValue: "Popular categories",
  });
  const featuredHeading = t("explore-featured-heading", { defaultValue: "Walk of the Week" });
  const popularHeading = t("explore-popular-heading", { defaultValue: "Popular Themes" });
  const curatedHeading = t("explore-curated-heading", { defaultValue: "Curated Collections" });
  const trendingHeading = t("explore-trending-heading", { defaultValue: "Trending Now" });
  const communityHeading = t("explore-community-heading", { defaultValue: "Community Favourite" });
  const communitySubtitle = t("explore-community-subtitle", {
    defaultValue: "Most shared this week",
  });

  const formatRouteCount = (count: number): string =>
    t("explore-curated-route-count", {
      count,
      defaultValue: count === 1 ? "route" : "routes",
    });

  const formatSaveCount = (count: number): string =>
    t("explore-community-saves", {
      count,
      defaultValue: count === 1 ? `${count} save` : `${count} saves`,
    });

  return (
    <MobileShell>
      <div className="screen-stack">
        <AppHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          trailing={
            <button
              type="button"
              onClick={() => navigate({ to: "/discover" })}
              className="header-icon-button"
              aria-label={filterLabel}
            >
              <Icon token="{icon.action.filter}" aria-hidden className="h-5 w-5" />
            </button>
          }
        >
          <div className="relative">
            <Icon token="{icon.action.search}" className="explore-search__icon" aria-hidden />
            <input
              type="search"
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="explore-search__input"
            />
          </div>
        </AppHeader>
        <main className="screen-scroll">
          <div className="space-y-8">
            <CategoryScroller ariaLabel={categoriesLabel} />
            <FeaturedWalkCard heading={featuredHeading} />
            <PopularThemesGrid heading={popularHeading} />
            <CuratedCollectionsList heading={curatedHeading} formatRouteCount={formatRouteCount} />
            <TrendingRoutesList heading={trendingHeading} />
            <CommunityPickPanel
              heading={communityHeading}
              subtitle={communitySubtitle}
              formatSaveCount={formatSaveCount}
            />
          </div>
        </main>
        <AppBottomNavigation
          items={bottomNavigation.map((item) => ({
            ...item,
            isActive: item.id === "discover",
            ...(item.id === "discover" ? {} : { href: item.href }),
          }))}
        />
      </div>
    </MobileShell>
  );
}
