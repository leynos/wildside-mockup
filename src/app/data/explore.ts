/** @file Entity-shaped fixtures for the Explore catalogue experience. */

import heroAfterDark from "../../assets/explore/after_dark.jpg";
import heroCoffeeCulture from "../../assets/explore/coffee_culture.jpg";
import heroCoffeeCultureAlt from "../../assets/explore/coffee_culture2.jpg";
import heroHarborSunset from "../../assets/explore/harbor_sunset.jpg";
import heroHiddenGarden from "../../assets/explore/hidden_garden.jpg";
import heroMarket from "../../assets/explore/market.jpg";
import heroStreetArt from "../../assets/explore/street_art2.jpg";
import walkRouteMap2 from "../../assets/walks/walk-route-map-2.png";
import walkRouteMap3 from "../../assets/walks/walk-route-map-3.png";
import type { ImageAsset } from "../domain/entities/localization";
import { metresFromKilometres, secondsFromMinutes } from "../units/unit-format";
import type {
  CommunityPick,
  CommunityPickId,
  Route,
  RouteCategory,
  RouteCategoryId,
  RouteCollection,
  RouteCollectionId,
  RouteId,
  Theme,
  ThemeId,
  TrendingRouteHighlight,
} from "./explore.models";
import type { BadgeId } from "./registries/badges";

const image = (url: string, alt: string): ImageAsset => ({ url, alt });

const routeId = (value: string): RouteId => value as RouteId;
const routeCategoryId = (value: string): RouteCategoryId => value as RouteCategoryId;
const themeId = (value: string): ThemeId => value as ThemeId;
const routeCollectionId = (value: string): RouteCollectionId => value as RouteCollectionId;
const badgeId = (value: string): BadgeId => value as BadgeId;
const communityPickId = (value: string): CommunityPickId => value as CommunityPickId;

export const exploreRoutes: Route[] = [
  {
    id: routeId("harbour-lights"),
    localizations: {
      "en-GB": {
        name: "Harbour Lights Promenade",
        description:
          "Golden hour stroll weaving past skyline overlooks, coffee pit stops, and art installations.",
      },
      es: {
        name: "Paseo Luces del Puerto",
        description: "Paseo al atardecer con miradores, cafés acogedores y arte público.",
      },
    },
    heroImage: image(
      heroHarborSunset,
      "Sunset across the harbour viewed from a waterfront promenade.",
    ),
    distanceMetres: metresFromKilometres(3.6),
    durationSeconds: secondsFromMinutes(65),
    rating: 4.9,
    badges: [badgeId("sunset-pick"), badgeId("teal-line")],
    difficultyId: "moderate",
    interests: ["waterfront", "coffee", "street-art"],
  },
  {
    id: routeId("coffee-culture-loop"),
    localizations: {
      "en-GB": {
        name: "Coffee Culture Circuit",
        description: "Roasters, latte art labs, and leafy courtyards to linger in.",
      },
      es: {
        name: "Circuito Cultura del Café",
        description: "Tostadores, barras de latte art y patios verdes para disfrutar.",
      },
    },
    heroImage: image(heroCoffeeCulture, "Barista pouring latte art inside a warm café interior."),
    distanceMetres: metresFromKilometres(2.4),
    durationSeconds: secondsFromMinutes(45),
    rating: 4.7,
    badges: [badgeId("community-favourite")],
    difficultyId: "easy",
    interests: ["coffee", "markets"],
  },
  {
    id: routeId("hidden-garden-lanes"),
    localizations: {
      "en-GB": {
        name: "Hidden Garden Lanes",
        description: "Secret courtyards, vertical gardens, and quiet cloisters.",
      },
      es: {
        name: "Pasajes de Jardines Secretos",
        description: "Patios ocultos, jardines verticales y claustros tranquilos.",
      },
    },
    heroImage: image(
      heroHiddenGarden,
      "Secret courtyard garden with brick walls and dense spring greenery.",
    ),
    distanceMetres: metresFromKilometres(3),
    durationSeconds: secondsFromMinutes(55),
    rating: 4.8,
    badges: [badgeId("teal-line")],
    difficultyId: "easy",
    interests: ["parks", "historic"],
  },
  {
    id: routeId("street-art-sprint"),
    localizations: {
      "en-GB": {
        name: "Street Art Sprint",
        description: "Mural-lined backstreets with rotating installations.",
      },
      es: {
        name: "Sprint de Arte Urbano",
        description: "Calles llenas de murales e instalaciones cambiantes.",
      },
    },
    heroImage: image(heroStreetArt, "Bright street art mural with abstract shapes and characters."),
    distanceMetres: metresFromKilometres(4.2),
    durationSeconds: secondsFromMinutes(70),
    rating: 4.6,
    badges: [badgeId("teal-line")],
    difficultyId: "moderate",
    interests: ["street-art", "coffee"],
  },
  {
    id: routeId("market-hop-classic"),
    localizations: {
      "en-GB": {
        name: "Market Hop Classic",
        description: "Laneway markets with local makers and late-night bites.",
      },
      es: {
        name: "Clásico de Mercados",
        description: "Mercados de callejones con artesanos locales y bocados nocturnos.",
      },
    },
    heroImage: image(heroMarket, "Bustling indoor market with food stalls and hanging lights."),
    distanceMetres: metresFromKilometres(2.8),
    durationSeconds: secondsFromMinutes(50),
    rating: 4.5,
    badges: [badgeId("community-favourite")],
    difficultyId: "easy",
    interests: ["markets", "coffee"],
  },
  {
    id: routeId("cherry-blossom-trail"),
    localizations: {
      "en-GB": {
        name: "Cherry Blossom Trail",
        description: "Limited time bloom corridor with picnic lawns.",
      },
      es: {
        name: "Ruta de los Cerezos en Flor",
        description: "Corredor de floración temporal con zonas de picnic.",
      },
    },
    heroImage: image(
      heroHiddenGarden,
      "Lush hidden garden tucked between historic brick buildings.",
    ),
    distanceMetres: metresFromKilometres(3),
    durationSeconds: secondsFromMinutes(60),
    rating: 4.8,
    badges: [badgeId("sunset-pick")],
    difficultyId: "easy",
    interests: ["parks", "waterfront"],
  },
  {
    id: routeId("food-truck-friday"),
    localizations: {
      "en-GB": {
        name: "Food Truck Friday",
        description: "Weekly street food crawl with live music breaks.",
      },
      es: {
        name: "Viernes de Food Trucks",
        description: "Recorrido gastronómico semanal con música en vivo.",
      },
    },
    heroImage: image(heroMarket, "Street food trucks lined up at dusk."),
    distanceMetres: metresFromKilometres(2.2),
    durationSeconds: secondsFromMinutes(40),
    rating: 4.5,
    badges: [badgeId("community-favourite")],
    difficultyId: "easy",
    interests: ["markets", "food"],
  },
  {
    id: routeId("rooftop-views-circuit"),
    localizations: {
      "en-GB": {
        name: "Rooftop Views Circuit",
        description: "Skyline terraces, glass skybridges, and elevator hops.",
      },
      es: {
        name: "Circuito de Azoteas con Vistas",
        description: "Terrazas panorámicas y pasarelas de cristal entre torres.",
      },
    },
    heroImage: image(heroHarborSunset, "City skyline from a rooftop bar at golden hour."),
    distanceMetres: metresFromKilometres(4.5),
    durationSeconds: secondsFromMinutes(80),
    rating: 4.7,
    badges: [badgeId("sunset-pick")],
    difficultyId: "moderate",
    interests: ["historic", "street-art", "waterfront"],
  },
];
export const exploreCategories: RouteCategory[] = [
  {
    id: routeCategoryId("nature"),
    localizations: {
      "en-GB": { name: "Nature Walks" },
      es: { name: "Paseos en la naturaleza" },
    },
    routeCount: 23,
    iconToken: "{icon.category.nature}",
    gradientClass: "bg-gradient-to-r from-emerald-500 to-teal-500",
  },
  {
    id: routeCategoryId("street-art"),
    localizations: {
      "en-GB": { name: "Street Art" },
      es: { name: "Arte urbano" },
    },
    routeCount: 18,
    iconToken: "{icon.category.art}",
    gradientClass: "bg-gradient-to-r from-orange-500 to-rose-500",
  },
  {
    id: routeCategoryId("historic"),
    localizations: {
      "en-GB": { name: "Historic" },
      es: { name: "Histórico" },
    },
    routeCount: 15,
    iconToken: "{icon.category.landmarks}",
    gradientClass: "bg-gradient-to-r from-sky-500 to-indigo-500",
  },
  {
    id: routeCategoryId("family"),
    localizations: {
      "en-GB": { name: "Family Friendly" },
      es: { name: "Para familias" },
    },
    routeCount: 12,
    iconToken: "{icon.category.wildlife}",
    gradientClass: "bg-gradient-to-r from-fuchsia-500 to-purple-500",
  },
];
const featuredFallbackRoute = exploreRoutes[0];
if (!featuredFallbackRoute) {
  throw new Error("Explore catalogue requires at least one seeded route");
}
const featuredRouteId = routeId("harbour-lights");
export const featuredRoute: Route =
  exploreRoutes.find((route) => route.id === featuredRouteId) ?? featuredFallbackRoute;
export const popularThemes: Theme[] = [
  {
    id: themeId("coffee-culture"),
    localizations: {
      "en-GB": { name: "Coffee Culture", description: "Best cafés & roasters" },
      es: { name: "Cultura del café", description: "Mejores cafés y tostadores" },
    },
    image: image(heroCoffeeCulture, "Flat white poured in a ceramic cup beside beans."),
    walkCount: 12,
    distanceRangeMetres: [metresFromKilometres(1.5), metresFromKilometres(3)],
    rating: 4.7,
  },
  {
    id: themeId("secret-gardens"),
    localizations: {
      "en-GB": { name: "Hidden Gardens", description: "Secret green spaces" },
      es: { name: "Jardines secretos", description: "Espacios verdes escondidos" },
    },
    image: image(heroHiddenGarden, "Sun-dappled courtyard garden behind tall walls."),
    walkCount: 8,
    distanceRangeMetres: [metresFromKilometres(2), metresFromKilometres(4)],
    rating: 4.8,
  },
  {
    id: themeId("street-art"),
    localizations: {
      "en-GB": { name: "Street Art Hunt", description: "Murals & installations" },
      es: { name: "Caza de arte urbano", description: "Murales e instalaciones" },
    },
    image: image(heroStreetArt, "Colourful mural wall in an alleyway."),
    walkCount: 15,
    distanceRangeMetres: [metresFromKilometres(1), metresFromKilometres(5)],
    rating: 4.6,
  },
  {
    id: themeId("market-hop"),
    localizations: {
      "en-GB": { name: "Market Hopping", description: "Local food & crafts" },
      es: { name: "Ruta de mercados", description: "Comida y artesanía local" },
    },
    image: image(heroMarket, "Market stalls selling food and crafts under string lights."),
    walkCount: 9,
    distanceRangeMetres: [metresFromKilometres(2), metresFromKilometres(3)],
    rating: 4.5,
  },
];

export const curatedCollections: RouteCollection[] = [
  {
    id: routeCollectionId("coffee-loops"),
    localizations: {
      "en-GB": { name: "Sunday Coffee Loops", description: "Perfect lazy morning routes" },
      es: { name: "Circuitos cafeteros", description: "Rutas relajadas para la mañana" },
    },
    leadImage: image(
      heroCoffeeCultureAlt,
      "Outdoor café table with pastries and pour-over coffee.",
    ),
    mapPreview: image(walkRouteMap2, "Map preview of the coffee loop routes."),
    distanceRangeMetres: [metresFromKilometres(1), metresFromKilometres(2)],
    durationRangeSeconds: [secondsFromMinutes(30), secondsFromMinutes(45)],
    difficultyId: "easy",
    routeIds: [
      routeId("coffee-culture-loop"),
      routeId("market-hop-classic"),
      routeId("harbour-lights"),
      routeId("food-truck-friday"),
      routeId("street-art-sprint"),
      routeId("hidden-garden-lanes"),
    ],
  },
  {
    id: routeCollectionId("after-dark"),
    localizations: {
      "en-GB": { name: "After Dark Adventures", description: "Safe, well-lit evening routes" },
      es: { name: "Aventuras nocturnas", description: "Rutas nocturnas bien iluminadas" },
    },
    leadImage: image(heroAfterDark, "City lights reflecting on wet pavement after dusk."),
    mapPreview: image(walkRouteMap3, "Route map preview for evening walks."),
    distanceRangeMetres: [metresFromKilometres(2), metresFromKilometres(4)],
    durationRangeSeconds: [secondsFromMinutes(45), secondsFromMinutes(70)],
    difficultyId: "moderate",
    routeIds: [
      routeId("harbour-lights"),
      routeId("rooftop-views-circuit"),
      routeId("street-art-sprint"),
      routeId("cherry-blossom-trail"),
    ],
  },
];

export const trendingRoutes: TrendingRouteHighlight[] = [
  {
    routeId: routeId("cherry-blossom-trail"),
    trendDelta: "+127%",
    subtitleLocalizations: {
      "en-GB": { name: "Limited time — Spring only" },
      es: { name: "Tiempo limitado — solo primavera" },
    },
  },
  {
    routeId: routeId("food-truck-friday"),
    trendDelta: "+89%",
    subtitleLocalizations: {
      "en-GB": { name: "Weekly event route" },
      es: { name: "Ruta semanal de eventos" },
    },
  },
  {
    routeId: routeId("rooftop-views-circuit"),
    trendDelta: "+56%",
    subtitleLocalizations: {
      "en-GB": { name: "Best skyline spots" },
      es: { name: "Mejores vistas del skyline" },
    },
  },
];

export const communityPick: CommunityPick = {
  id: communityPickId("bookstore-bistro"),
  localizations: {
    "en-GB": {
      name: "Bookstore & Bistro Crawl",
      description: "A blend of literary gems and cosy eateries in the cultural district.",
    },
    es: {
      name: "Ruta de librerías y bistrós",
      description: "Mezcla de joyas literarias y bistrós acogedores en el distrito cultural.",
    },
  },
  curator: {
    localizations: {
      "en-GB": { name: "Sarah's pick" },
      es: { name: "Selección de Sarah" },
    },
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
