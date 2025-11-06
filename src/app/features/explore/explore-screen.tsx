/** @file Explore catalogue screen presenting discovery content. */

import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useNavigate } from "@tanstack/react-router";
import type { JSX, ReactNode } from "react";

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

function CategoryScroller(): JSX.Element {
  return (
    <ScrollArea.Root className="w-full pt-2" type="scroll">
      <ScrollArea.Viewport className="w-full">
        <div className="flex gap-3 pb-2 pr-6">
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
  );
}

function FeaturedWalkCard(): JSX.Element {
  return (
    <section className="explore-featured__panel">
      <h2 className="section-heading text-base-content">
        <Icon token="{icon.object.crown}" className="text-amber-400" aria-hidden />
        Walk of the Week
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
          <div className="flex flex-col items-end text-sm text-base-content/60">
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
          <span className="flex items-center gap-1 text-amber-400">
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

function PopularThemesGrid(): JSX.Element {
  return (
    <section>
      <h2 className="section-title">Popular Themes</h2>
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
              <span className="flex items-center gap-1 text-amber-400">
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

function CuratedCollectionsList(): JSX.Element {
  return (
    <section>
      <h2 className="section-title">Curated Collections</h2>
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
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-base-content/60">
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
              <div className="flex flex-col items-end text-right text-sm text-base-content/60">
                <span className="text-lg font-bold text-base-content">{collection.routes}</span>
                <span>routes</span>
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

function TrendingRoutesList(): JSX.Element {
  return (
    <section>
      <h2 className="section-title">Trending Now</h2>
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

function CommunityPickPanel(): JSX.Element {
  return (
    <section className="explore-info__panel">
      <h2 className="section-heading mb-4 text-base-content">
        <Icon token="{icon.object.family}" className="text-accent" aria-hidden />
        Community Favourite
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
          <p className="text-xs text-base-content/60">Most shared this week</p>
        </div>
        <span className="flex items-center gap-1 text-sm font-semibold text-amber-400">
          <Icon token="{icon.object.star}" aria-hidden className="h-4 w-4" />
          {formatRating(communityPick.rating)}
        </span>
      </div>
      <h3 className="text-base font-semibold text-base-content">{communityPick.title}</h3>
      <p className="mt-2 text-sm text-base-content/70">{communityPick.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-base-content/60">
        <RouteMetric iconToken="{icon.object.route}">{communityPick.distance}</RouteMetric>
        <RouteMetric iconToken="{icon.object.duration}">{communityPick.duration}</RouteMetric>
        <RouteMetric iconToken="{icon.action.save}">{communityPick.saves} saves</RouteMetric>
      </div>
    </section>
  );
}

export function ExploreScreen(): JSX.Element {
  const navigate = useNavigate();

  return (
    <MobileShell>
      <div className="screen-stack">
        <AppHeader
          title="Discover"
          subtitle="Explore curated walks & hidden gems"
          trailing={
            <button
              type="button"
              onClick={() => navigate({ to: "/discover" })}
              className="header-icon-button"
              aria-label="Filter walks"
            >
              <Icon token="{icon.action.filter}" aria-hidden className="h-5 w-5" />
            </button>
          }
        >
          <div className="relative">
            <Icon
              token="{icon.action.search}"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search walks, places, themes..."
              className="explore-search__input"
            />
          </div>
        </AppHeader>
        <main className="flex-1 overflow-y-auto px-6 pb-28">
          <div className="space-y-8">
            <CategoryScroller />
            <FeaturedWalkCard />
            <PopularThemesGrid />
            <CuratedCollectionsList />
            <TrendingRoutesList />
            <CommunityPickPanel />
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
