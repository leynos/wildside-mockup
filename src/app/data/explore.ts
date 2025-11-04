/** @file Fixture data for the Explore catalogue experience. */

export interface ExploreCategory {
  id: string;
  title: string;
  summary: string;
  iconToken: string;
  /** Tailwind gradient utilities applied to the chip background. */
  gradientClass: string;
}

export interface FeaturedWalk {
  id: string;
  title: string;
  description: string;
  heroImageUrl: string;
  distance: string;
  duration: string;
  rating: number;
  badges: string[];
}

export interface PopularTheme {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  walkCount: number;
  distanceRange: string;
  rating: number;
}

export interface CuratedCollection {
  id: string;
  title: string;
  description: string;
  leadImageUrl: string;
  mapImageUrl: string;
  distanceRange: string;
  durationRange: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
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
  distance: string;
  duration: string;
  saves: number;
}

import heroAfterDark from "../../assets/explore/after_dark.jpg";
import heroCoffeeCulture from "../../assets/explore/coffee_culture.jpg";
import heroCoffeeCultureAlt from "../../assets/explore/coffee_culture2.jpg";
import heroHarborSunset from "../../assets/explore/harbor_sunset.jpg";
import heroHiddenGarden from "../../assets/explore/hidden_garden.jpg";
import heroMapPreview from "../../assets/explore/map_preview.jpg";
import heroMarket from "../../assets/explore/market.jpg";
import heroStreetArt from "../../assets/explore/street_art2.jpg";

export const exploreCategories: ExploreCategory[] = [
  {
    id: "nature",
    title: "Nature Walks",
    summary: "23 routes",
    iconToken: "{icon.category.nature}",
    gradientClass: "bg-gradient-to-r from-emerald-500 to-teal-500",
  },
  {
    id: "street-art",
    title: "Street Art",
    summary: "18 routes",
    iconToken: "{icon.category.art}",
    gradientClass: "bg-gradient-to-r from-orange-500 to-rose-500",
  },
  {
    id: "historic",
    title: "Historic",
    summary: "15 routes",
    iconToken: "{icon.category.landmarks}",
    gradientClass: "bg-gradient-to-r from-sky-500 to-indigo-500",
  },
  {
    id: "family",
    title: "Family Friendly",
    summary: "12 routes",
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
  distance: "3.6 km",
  duration: "65 min",
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
    distanceRange: "1.5–3 km",
    rating: 4.7,
  },
  {
    id: "secret-gardens",
    title: "Hidden Gardens",
    description: "Secret green spaces",
    imageUrl: heroHiddenGarden,
    walkCount: 8,
    distanceRange: "2–4 km",
    rating: 4.8,
  },
  {
    id: "street-art",
    title: "Street Art Hunt",
    description: "Murals & installations",
    imageUrl: heroStreetArt,
    walkCount: 15,
    distanceRange: "1–5 km",
    rating: 4.6,
  },
  {
    id: "market-hop",
    title: "Market Hopping",
    description: "Local food & crafts",
    imageUrl: heroMarket,
    walkCount: 9,
    distanceRange: "2–3 km",
    rating: 4.5,
  },
];

export const curatedCollections: CuratedCollection[] = [
  {
    id: "coffee-loops",
    title: "Sunday Coffee Loops",
    description: "Perfect lazy morning routes",
    leadImageUrl: heroCoffeeCultureAlt,
    mapImageUrl: heroMapPreview,
    distanceRange: "1–2 km",
    durationRange: "30–45 min",
    difficulty: "Easy",
    routes: 6,
  },
  {
    id: "after-dark",
    title: "After Dark Adventures",
    description: "Safe, well-lit evening routes",
    leadImageUrl: heroAfterDark,
    mapImageUrl: heroMapPreview,
    distanceRange: "2–4 km",
    durationRange: "45–70 min",
    difficulty: "Moderate",
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
  distance: "2.8 km",
  duration: "75 min",
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
