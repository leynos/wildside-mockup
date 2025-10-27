/** @file Explore catalogue screen presenting discovery content. */

import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useNavigate } from "@tanstack/react-router";

import { AppBottomNavigation } from "../../components/app-bottom-navigation";
import { FontAwesomeIcon } from "../../components/font-awesome-icon";
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
import { MobileShell } from "../../layout/mobile-shell";

function CategoryScroller(): JSX.Element {
  return (
    <ScrollArea.Root className="w-full" type="scroll">
      <ScrollArea.Viewport className="w-full">
        <div className="flex gap-3 pb-2">
          {exploreCategories.map((category) => (
            <article
              key={category.id}
              className={`flex min-w-[150px] flex-col gap-1 rounded-xl p-4 text-white shadow-lg shadow-base-300/20 ${category.gradientClass}`}
            >
              <FontAwesomeIcon name={category.icon} className="text-lg" />
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
    <section className="space-y-4 rounded-2xl border border-base-300/70 bg-base-200/60 p-4 shadow-inner shadow-base-300/30">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-base-content">
        <FontAwesomeIcon name="fa-solid fa-crown" className="text-amber-400" />
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
              <FontAwesomeIcon name="fa-solid fa-route" />
              {featuredWalk.distance}
            </span>
            <span className="mt-1 flex items-center gap-1">
              <FontAwesomeIcon name="fa-regular fa-clock" />
              {featuredWalk.duration}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-base-content/80">
          <span className="flex items-center gap-1 text-amber-400">
            <FontAwesomeIcon name="fa-solid fa-star" />
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
      <h2 className="mb-4 text-lg font-semibold text-base-content">Popular Themes</h2>
      <div className="grid grid-cols-2 gap-4">
        {popularThemes.map((theme) => (
          <article
            key={theme.id}
            className="rounded-xl border border-base-300/60 bg-base-200/70 p-4 shadow-sm shadow-base-300/20"
          >
            <div className="relative mb-3 h-24 overflow-hidden rounded-lg">
              <img
                src={theme.imageUrl}
                alt={theme.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/25" />
              <span className="absolute right-2 top-2 rounded-full bg-accent px-2 py-1 text-xs font-semibold text-base-100">
                {theme.walkCount}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-base-content">{theme.title}</h3>
            <p className="mt-1 text-xs text-base-content/60">{theme.description}</p>
            <div className="mt-2 flex items-center justify-between text-xs text-base-content/60">
              <span className="flex items-center gap-1">
                <FontAwesomeIcon name="fa-solid fa-route" />
                {theme.distanceRange}
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <FontAwesomeIcon name="fa-solid fa-star" />
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
      <h2 className="mb-4 text-lg font-semibold text-base-content">Curated Collections</h2>
      <div className="space-y-4">
        {curatedCollections.map((collection) => (
          <article
            key={collection.id}
            className="rounded-xl border border-base-300/60 bg-base-200/70 p-4 shadow-sm shadow-base-300/20"
          >
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
                    <FontAwesomeIcon name="fa-solid fa-route" />
                    {collection.distanceRange}
                  </span>
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon name="fa-regular fa-clock" />
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
      <h2 className="mb-4 text-lg font-semibold text-base-content">Trending Now</h2>
      <div className="space-y-3">
        {trendingRoutes.map((route) => (
          <article
            key={route.id}
            className="flex items-center gap-4 rounded-xl border border-base-300/60 bg-base-200/70 p-4 shadow-sm shadow-base-300/20"
          >
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
              <FontAwesomeIcon name="fa-solid fa-chart-line" />
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
    <section className="rounded-2xl border border-base-300/60 bg-base-200/70 p-4 shadow-inner shadow-base-300/20">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-base-content">
        <FontAwesomeIcon name="fa-solid fa-users" className="text-accent" />
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
          <FontAwesomeIcon name="fa-solid fa-star" />
          {formatRating(communityPick.rating)}
        </span>
      </div>
      <h3 className="text-base font-semibold text-base-content">{communityPick.title}</h3>
      <p className="mt-2 text-sm text-base-content/70">{communityPick.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-base-content/60">
        <span className="flex items-center gap-1">
          <FontAwesomeIcon name="fa-solid fa-route" />
          {communityPick.distance}
        </span>
        <span className="flex items-center gap-1">
          <FontAwesomeIcon name="fa-regular fa-clock" />
          {communityPick.duration}
        </span>
        <span className="flex items-center gap-1">
          <FontAwesomeIcon name="fa-solid fa-bookmark" />
          {communityPick.saves} saves
        </span>
      </div>
    </section>
  );
}

export function ExploreScreen(): JSX.Element {
  const navigate = useNavigate();

  return (
    <MobileShell>
      <div className="flex h-full flex-col">
        <header className="px-6 pb-4 pt-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-base-content">Discover</h1>
              <p className="text-sm text-base-content/60">Explore curated walks & hidden gems</p>
            </div>
            <button
              type="button"
              onClick={() => navigate({ to: "/customize" })}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-base-300/70 bg-base-200/70 text-accent shadow-sm shadow-base-300/30"
              aria-label="Filter walks"
            >
              <FontAwesomeIcon name="fa-solid fa-filter" />
            </button>
          </div>
          <div className="relative mt-4">
            <FontAwesomeIcon
              name="fa-solid fa-magnifying-glass"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50"
            />
            <input
              type="search"
              placeholder="Search walks, places, themes..."
              className="w-full rounded-xl border border-base-300/70 bg-base-200/60 py-3 pl-11 pr-4 text-sm text-base-content shadow-inner shadow-base-300/30 placeholder:text-base-content/50 focus:border-accent focus:outline-none"
            />
          </div>
        </header>
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
          }))}
        />
      </div>
    </MobileShell>
  );
}
