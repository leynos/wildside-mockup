/** @file Non-route fixtures for the Explore catalogue. */

import heroAfterDark from "../../assets/explore/after_dark.jpg";
import heroCoffeeCultureAlt from "../../assets/explore/coffee_culture2.jpg";
import heroHiddenGarden from "../../assets/explore/hidden_garden.jpg";
import heroMarket from "../../assets/explore/market.jpg";
import heroStreetArt from "../../assets/explore/street_art2.jpg";
import { metresFromKilometres, secondsFromMinutes } from "../units/unit-format";
import type {
  CommunityPick,
  Route,
  RouteCategory,
  RouteCollection,
  Theme,
  TrendingRouteHighlight,
} from "./explore.models";
import { curatedRouteMaps, type ExploreRouteBadgeId, exploreRoutes } from "./explore.routes";
import {
  fillLocalizations,
  image,
  localizeAcrossLocales,
  unsafeCommunityPickId,
  unsafeRouteCategoryId,
  unsafeRouteCollectionId,
  unsafeRouteId,
  unsafeThemeId,
} from "./explore-fixture-helpers";

const requireCuratedRouteMap = (key: string): string => {
  const mapPreview = curatedRouteMaps[key];
  if (!mapPreview) {
    throw new Error(`Missing map preview asset for ${key}`);
  }
  return mapPreview;
};

export const exploreCategories: RouteCategory[] = [
  {
    id: unsafeRouteCategoryId("nature"),
    localizations: fillLocalizations(
      localizeAcrossLocales({ name: "Nature Walks" }, { es: { name: "Paseos en la naturaleza" } }),
      "en-GB",
      "category: nature",
    ),
    routeCount: 23,
    iconToken: "{icon.category.nature}",
    gradientClass: "bg-gradient-to-r from-emerald-500 to-teal-500",
  },
  {
    id: unsafeRouteCategoryId("street-art"),
    localizations: fillLocalizations(
      localizeAcrossLocales({ name: "Street Art" }, { es: { name: "Arte urbano" } }),
      "en-GB",
      "category: street-art",
    ),
    routeCount: 18,
    iconToken: "{icon.category.art}",
    gradientClass: "bg-gradient-to-r from-orange-500 to-rose-500",
  },
  {
    id: unsafeRouteCategoryId("historic"),
    localizations: fillLocalizations(
      localizeAcrossLocales({ name: "Historic" }, { es: { name: "Histórico" } }),
      "en-GB",
      "category: historic",
    ),
    routeCount: 15,
    iconToken: "{icon.category.landmarks}",
    gradientClass: "bg-gradient-to-r from-sky-500 to-indigo-500",
  },
  {
    id: unsafeRouteCategoryId("family"),
    localizations: fillLocalizations(
      localizeAcrossLocales({ name: "Family Friendly" }, { es: { name: "Para familias" } }),
      "en-GB",
      "category: family",
    ),
    routeCount: 12,
    iconToken: "{icon.category.wildlife}",
    gradientClass: "bg-gradient-to-r from-fuchsia-500 to-purple-500",
  },
];

const featuredFallbackRoute = exploreRoutes[0];
if (!featuredFallbackRoute) {
  throw new Error("Explore catalogue requires at least one seeded route");
}
const featuredRouteId = unsafeRouteId("harbour-lights");
export const featuredRoute: Route =
  exploreRoutes.find((route) => route.id === featuredRouteId) ?? featuredFallbackRoute;

export const popularThemes: Theme[] = [
  {
    id: unsafeThemeId("coffee-culture"),
    localizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "Coffee Culture", description: "Best cafés & roasters" },
        { es: { name: "Cultura del café", description: "Mejores cafés y tostadores" } },
      ),
      "en-GB",
      "theme: coffee-culture",
    ),
    image: image(heroCoffeeCultureAlt, "Flat white poured in a ceramic cup beside beans."),
    walkCount: 12,
    distanceRangeMetres: [1500, 3000],
    rating: 4.7,
  },
  {
    id: unsafeThemeId("secret-gardens"),
    localizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "Hidden Gardens", description: "Secret green spaces" },
        { es: { name: "Jardines secretos", description: "Espacios verdes escondidos" } },
      ),
      "en-GB",
      "theme: secret-gardens",
    ),
    image: image(heroHiddenGarden, "Sun-dappled courtyard garden behind tall walls."),
    walkCount: 8,
    distanceRangeMetres: [2000, 4000],
    rating: 4.8,
  },
  {
    id: unsafeThemeId("street-art"),
    localizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "Street Art Hunt", description: "Murals & installations" },
        { es: { name: "Caza de arte urbano", description: "Murales e instalaciones" } },
      ),
      "en-GB",
      "theme: street-art",
    ),
    image: image(heroStreetArt, "Colourful mural wall in an alleyway."),
    walkCount: 15,
    distanceRangeMetres: [1000, 5000],
    rating: 4.6,
  },
  {
    id: unsafeThemeId("market-hop"),
    localizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "Market Hopping", description: "Local food & crafts" },
        { es: { name: "Ruta de mercados", description: "Comida y artesanía local" } },
      ),
      "en-GB",
      "theme: market-hop",
    ),
    image: image(heroMarket, "Market stalls selling food and crafts under string lights."),
    walkCount: 9,
    distanceRangeMetres: [2000, 3000],
    rating: 4.5,
  },
];

export const curatedCollections: RouteCollection[] = [
  {
    id: unsafeRouteCollectionId("coffee-loops"),
    localizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "Sunday Coffee Loops", description: "Perfect lazy morning routes" },
        { es: { name: "Circuitos cafeteros", description: "Rutas relajadas para la mañana" } },
      ),
      "en-GB",
      "collection: coffee-loops",
    ),
    leadImage: image(
      heroCoffeeCultureAlt,
      "Outdoor café table with pastries and pour-over coffee.",
    ),
    mapPreview: image(requireCuratedRouteMap("coffee-loops"), "Map preview of the coffee loop routes."),
    distanceRangeMetres: [1000, 2000],
    durationRangeSeconds: [1800, 2700],
    difficultyId: "easy",
    routeIds: [
      unsafeRouteId("coffee-culture-loop"),
      unsafeRouteId("market-hop-classic"),
      unsafeRouteId("harbour-lights"),
      unsafeRouteId("food-truck-friday"),
      unsafeRouteId("street-art-sprint"),
      unsafeRouteId("hidden-garden-lanes"),
    ],
  },
  {
    id: unsafeRouteCollectionId("after-dark"),
    localizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "After Dark Adventures", description: "Safe, well-lit evening routes" },
        { es: { name: "Aventuras nocturnas", description: "Rutas nocturnas bien iluminadas" } },
      ),
      "en-GB",
      "collection: after-dark",
    ),
    leadImage: image(heroAfterDark, "City lights reflecting on wet pavement after dusk."),
    mapPreview: image(
      requireCuratedRouteMap("after-dark"),
      "Route map preview for evening walks.",
    ),
    distanceRangeMetres: [2000, 4000],
    durationRangeSeconds: [2700, 4200],
    difficultyId: "moderate",
    routeIds: [
      unsafeRouteId("harbour-lights"),
      unsafeRouteId("rooftop-views-circuit"),
      unsafeRouteId("street-art-sprint"),
      unsafeRouteId("cherry-blossom-trail"),
    ],
  },
];

export const trendingRoutes: TrendingRouteHighlight[] = [
  {
    routeId: unsafeRouteId("cherry-blossom-trail"),
    trendDelta: "+127%",
    subtitleLocalizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "Limited time — Spring only" },
        { es: { name: "Tiempo limitado — solo primavera" } },
      ),
      "en-GB",
      "trending: cherry-blossom-trail",
    ),
  },
  {
    routeId: unsafeRouteId("food-truck-friday"),
    trendDelta: "+89%",
    subtitleLocalizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "Weekly event route" },
        { es: { name: "Ruta semanal de eventos" } },
      ),
      "en-GB",
      "trending: food-truck-friday",
    ),
  },
  {
    routeId: unsafeRouteId("rooftop-views-circuit"),
    trendDelta: "+56%",
    subtitleLocalizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "Best skyline spots" },
        { es: { name: "Mejores vistas del skyline" } },
      ),
      "en-GB",
      "trending: rooftop-views-circuit",
    ),
  },
];

export const communityPick: CommunityPick = {
  id: unsafeCommunityPickId("bookstore-bistro"),
  localizations: fillLocalizations(
    localizeAcrossLocales(
      {
        name: "Bookstore & Bistro Crawl",
        description: "A blend of literary gems and cosy eateries in the cultural district.",
      },
      {
        es: {
          name: "Ruta de librerías y bistrós",
          description: "Mezcla de joyas literarias y bistrós acogedores en el distrito cultural.",
        },
      },
    ),
    "en-GB",
    "community-pick: bookstore-bistro",
  ),
  curator: {
    localizations: fillLocalizations(
      localizeAcrossLocales({ name: "Sarah's pick" }, { es: { name: "Selección de Sarah" } }),
      "en-GB",
      "curator: sarah",
    ),
    avatar: image(heroAfterDark, "Portrait of Sarah smiling at dusk."),
  },
  rating: 4.9,
  distanceMetres: metresFromKilometres(2.8),
  durationSeconds: secondsFromMinutes(75),
  saves: 428,
};

/**
 * Format rating to one decimal place for display copy.
 *
 * @example
 *   formatRating(4.456); // "4.5"
 */
export function formatRating(input: number): string {
  return input.toFixed(1);
}

export type { ExploreRouteBadgeId };
