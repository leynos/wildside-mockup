/** @file Fixture data for the Explore catalogue experience. */

export interface ExploreCategory {
  id: string;
  title: string;
  summary: string;
  icon: string;
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

export const exploreCategories: ExploreCategory[] = [
  {
    id: "nature",
    title: "Nature Walks",
    summary: "23 routes",
    icon: "fa-solid fa-leaf",
    gradientClass: "bg-gradient-to-r from-emerald-500 to-teal-500",
  },
  {
    id: "street-art",
    title: "Street Art",
    summary: "18 routes",
    icon: "fa-solid fa-palette",
    gradientClass: "bg-gradient-to-r from-orange-500 to-rose-500",
  },
  {
    id: "historic",
    title: "Historic",
    summary: "15 routes",
    icon: "fa-solid fa-landmark",
    gradientClass: "bg-gradient-to-r from-sky-500 to-indigo-500",
  },
  {
    id: "family",
    title: "Family Friendly",
    summary: "12 routes",
    icon: "fa-solid fa-otter",
    gradientClass: "bg-gradient-to-r from-fuchsia-500 to-purple-500",
  },
];

export const featuredWalk: FeaturedWalk = {
  id: "waterfront",
  title: "Harbour Lights Promenade",
  description:
    "Golden hour stroll weaving past skyline overlooks, coffee pit stops, and art installations.",
  heroImageUrl:
    "https://storage.googleapis.com/uxpilot-auth.appspot.com/12c98d9a27-c8889b97b2657bea9387.png",
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
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/00379b3179-9aa4b61c93b325ad197e.png",
    walkCount: 12,
    distanceRange: "1.5–3 km",
    rating: 4.7,
  },
  {
    id: "secret-gardens",
    title: "Hidden Gardens",
    description: "Secret green spaces",
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/6df0dd40dc-a40fec4f0e9c9bed5678.png",
    walkCount: 8,
    distanceRange: "2–4 km",
    rating: 4.8,
  },
  {
    id: "street-art",
    title: "Street Art Hunt",
    description: "Murals & installations",
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/c44d8c772e-7afb24af76ebfb5be904.png",
    walkCount: 15,
    distanceRange: "1–5 km",
    rating: 4.6,
  },
  {
    id: "market-hop",
    title: "Market Hopping",
    description: "Local food & crafts",
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/2a09d665ca-58719661a5f50e054983.png",
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
    leadImageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/6600a8c74e-dc95247accf0466ded6d.png",
    mapImageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/823299ea0b-e0264157719b86f8a6e0.png",
    distanceRange: "1–2 km",
    durationRange: "30–45 min",
    difficulty: "Easy",
    routes: 6,
  },
  {
    id: "after-dark",
    title: "After Dark Adventures",
    description: "Safe, well-lit evening routes",
    leadImageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/9f5e934e59-0662115197edd15386a0.png",
    mapImageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/36f8a6ec1c-df14d979ebb4e5f90474.png",
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
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/8f476fd8b0-1c71988587d5fc3a9c90.png",
    trendDelta: "+127%",
  },
  {
    id: "food-truck",
    title: "Food Truck Friday",
    subtitle: "Weekly event route",
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/aad2e58ec5-0f3a7244c99ac5d8bde3.png",
    trendDelta: "+89%",
  },
  {
    id: "rooftop-views",
    title: "Rooftop Views Circuit",
    subtitle: "Best skyline spots",
    imageUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/a0da2ab4e8-181906e7c1316884df60.png",
    trendDelta: "+56%",
  },
];

export const communityPick: CommunityPick = {
  id: "bookstore-bistro",
  curator: "Sarah's Pick",
  curatorAvatarUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg",
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
