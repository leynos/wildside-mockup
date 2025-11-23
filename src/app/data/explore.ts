/** @file Fixture data for the Explore catalogue experience. */

import { metresFromKilometres, secondsFromMinutes } from "../units/unit-format";

export interface ExploreCategory {
  id: string;
  title: string;
  routes: number;
  iconToken: string;
  /** Tailwind gradient utilities applied to the chip background. */
  gradientClass: string;
}

export interface FeaturedWalk {
  id: string;
  title: string;
  description: string;
  heroImageUrl: string;
  distanceMetres: number;
  durationSeconds: number;
  rating: number;
  badges: string[];
}

export interface PopularTheme {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  walkCount: number;
  distanceRangeMetres: readonly [number, number];
  rating: number;
}

export interface CuratedCollection {
  id: string;
  title: string;
  description: string;
  leadImageUrl: string;
  mapImageUrl: string;
  distanceRangeMetres: readonly [number, number];
  durationRangeSeconds: readonly [number, number];
  difficultyId: DifficultyId;
  routes: number;
}

export interface TrendingRoute {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  trendDelta: string;
}

export interface CommunityPick {
  id: string;
  curator: string;
  curatorAvatarUrl: string;
  rating: number;
  title: string;
  description: string;
  distanceMetres: number;
  durationSeconds: number;
  saves: number;
}

import heroAfterDark from "../../assets/explore/after_dark.jpg";
import heroCoffeeCulture from "../../assets/explore/coffee_culture.jpg";
import heroCoffeeCultureAlt from "../../assets/explore/coffee_culture2.jpg";
import heroHarborSunset from "../../assets/explore/harbor_sunset.jpg";
import heroHiddenGarden from "../../assets/explore/hidden_garden.jpg";
import heroMarket from "../../assets/explore/market.jpg";
import heroStreetArt from "../../assets/explore/street_art2.jpg";
import walkRouteMap2 from "../../assets/walks/walk-route-map-2.png";
import walkRouteMap3 from "../../assets/walks/walk-route-map-3.png";
import type { DifficultyId } from "./registries/difficulties";

export const exploreCategories: ExploreCategory[] = [
  {
    id: "nature",
    title: "Nature Walks",
    routes: 23,
    iconToken: "{icon.category.nature}",
    gradientClass: "bg-gradient-to-r from-emerald-500 to-teal-500",
  },
  {
    id: "street-art",
    title: "Street Art",
    routes: 18,
    iconToken: "{icon.category.art}",
    gradientClass: "bg-gradient-to-r from-orange-500 to-rose-500",
  },
  {
    id: "historic",
    title: "Historic",
    routes: 15,
    iconToken: "{icon.category.landmarks}",
    gradientClass: "bg-gradient-to-r from-sky-500 to-indigo-500",
  },
  {
    id: "family",
    title: "Family Friendly",
    routes: 12,
    iconToken: "{icon.category.wildlife}",
    gradientClass: "bg-gradient-to-r from-fuchsia-500 to-purple-500",
  },
];

export const featuredWalk: FeaturedWalk = {
  id: "waterfront",
  title: "Harbour Lights Promenade",
  description:
    "Golden hour stroll weaving past skyline overlooks, coffee pit stops, and art installations.",
  heroImageUrl: heroHarborSunset,
  distanceMetres: metresFromKilometres(3.6),
  durationSeconds: secondsFromMinutes(65),
  rating: 4.9,
  badges: ["Sunset pick", "Teal line"],
};

export const popularThemes: PopularTheme[] = [
  {
    id: "coffee-culture",
    title: "Coffee Culture",
    description: "Best cafés & roasters",
    imageUrl: heroCoffeeCulture,
    walkCount: 12,
    distanceRangeMetres: [metresFromKilometres(1.5), metresFromKilometres(3)],
    rating: 4.7,
  },
  {
    id: "secret-gardens",
    title: "Hidden Gardens",
    description: "Secret green spaces",
    imageUrl: heroHiddenGarden,
    walkCount: 8,
    distanceRangeMetres: [metresFromKilometres(2), metresFromKilometres(4)],
    rating: 4.8,
  },
  {
    id: "street-art",
    title: "Street Art Hunt",
    description: "Murals & installations",
    imageUrl: heroStreetArt,
    walkCount: 15,
    distanceRangeMetres: [metresFromKilometres(1), metresFromKilometres(5)],
    rating: 4.6,
  },
  {
    id: "market-hop",
    title: "Market Hopping",
    description: "Local food & crafts",
    imageUrl: heroMarket,
    walkCount: 9,
    distanceRangeMetres: [metresFromKilometres(2), metresFromKilometres(3)],
    rating: 4.5,
  },
];

export const curatedCollections: CuratedCollection[] = [
  {
    id: "coffee-loops",
    title: "Sunday Coffee Loops",
    description: "Perfect lazy morning routes",
    leadImageUrl: heroCoffeeCultureAlt,
    mapImageUrl: walkRouteMap2,
    distanceRangeMetres: [metresFromKilometres(1), metresFromKilometres(2)],
    durationRangeSeconds: [secondsFromMinutes(30), secondsFromMinutes(45)],
    difficultyId: "easy",
    routes: 6,
  },
  {
    id: "after-dark",
    title: "After Dark Adventures",
    description: "Safe, well-lit evening routes",
    leadImageUrl: heroAfterDark,
    mapImageUrl: walkRouteMap3,
    distanceRangeMetres: [metresFromKilometres(2), metresFromKilometres(4)],
    durationRangeSeconds: [secondsFromMinutes(45), secondsFromMinutes(70)],
    difficultyId: "moderate",
    routes: 4,
  },
];

export const trendingRoutes: TrendingRoute[] = [
  {
    id: "cherry-blossom",
    title: "Cherry Blossom Trail",
    subtitle: "Limited time — Spring only",
    imageUrl: heroHiddenGarden,
    trendDelta: "+127%",
  },
  {
    id: "food-truck",
    title: "Food Truck Friday",
    subtitle: "Weekly event route",
    imageUrl: heroMarket,
    trendDelta: "+89%",
  },
  {
    id: "rooftop-views",
    title: "Rooftop Views Circuit",
    subtitle: "Best skyline spots",
    imageUrl: heroHarborSunset,
    trendDelta: "+56%",
  },
];

export const communityPick: CommunityPick = {
  id: "bookstore-bistro",
  curator: "Sarah's Pick",
  curatorAvatarUrl: heroAfterDark,
  rating: 4.9,
  title: "Bookstore & Bistro Crawl",
  description: "A perfect blend of literary gems and cosy eateries through the cultural district.",
  distanceMetres: metresFromKilometres(2.8),
  durationSeconds: secondsFromMinutes(75),
  saves: 428,
};

/**
 * Simple helper returning a formatted rating label for display copy.
 *
 * @example
 * ```ts
 * const label = formatRating(4.87);
 * console.log(label); // "4.9"
 * ```
 */
export function formatRating(input: number): string {
  return input.toFixed(1);
}
