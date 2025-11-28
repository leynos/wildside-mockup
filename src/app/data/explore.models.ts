/** @file Shared entity models for Explore fixtures. */

import type { EntityLocalizations, ImageAsset } from "../domain/entities/localization";
import type { BadgeId } from "./registries/badges";
import type { DifficultyId } from "./registries/difficulties";
import type { InterestId } from "./registries/interests";

export type RouteId = string & { readonly __brand: "RouteId" };
export type RouteCategoryId = string & { readonly __brand: "RouteCategoryId" };
export type ThemeId = string & { readonly __brand: "ThemeId" };
export type RouteCollectionId = string & { readonly __brand: "RouteCollectionId" };

export interface Route {
  readonly id: RouteId;
  readonly localizations: EntityLocalizations;
  readonly heroImage: ImageAsset;
  readonly distanceMetres: number;
  readonly durationSeconds: number;
  readonly rating: number;
  readonly badges: BadgeId[];
  readonly difficultyId?: DifficultyId;
  readonly interests?: InterestId[];
}

export interface RouteCategory {
  readonly id: RouteCategoryId;
  readonly localizations: EntityLocalizations;
  readonly routeCount: number;
  readonly iconToken: string;
  /** Tailwind gradient utilities applied to the chip background. */
  readonly gradientClass: string;
}

export interface Theme {
  readonly id: ThemeId;
  readonly localizations: EntityLocalizations;
  readonly image: ImageAsset;
  readonly walkCount: number;
  readonly distanceRangeMetres: readonly [number, number];
  readonly rating: number;
}

export interface RouteCollection {
  readonly id: RouteCollectionId;
  readonly localizations: EntityLocalizations;
  readonly leadImage: ImageAsset;
  readonly mapPreview: ImageAsset;
  readonly distanceRangeMetres: readonly [number, number];
  readonly durationRangeSeconds: readonly [number, number];
  readonly difficultyId: DifficultyId;
  readonly routeIds: RouteId[];
}

export interface TrendingRouteHighlight {
  readonly routeId: RouteId;
  readonly trendDelta: string;
  readonly subtitleLocalizations: EntityLocalizations;
}

export interface CommunityPick {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly curator: {
    readonly localizations: EntityLocalizations;
    readonly avatar: ImageAsset;
  };
  readonly rating: number;
  readonly distanceMetres: number;
  readonly durationSeconds: number;
  readonly saves: number;
}
