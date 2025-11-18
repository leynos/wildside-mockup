/** @file Localised interest descriptor registry consumed across flows. */

import type { TFunction } from "i18next";

import {
  buildDescriptorLookup,
  type LocalizedDescriptor,
  type ResolvedDescriptor,
} from "../../i18n/descriptors";

type InterestVisualMetadata = {
  readonly iconToken: string;
  readonly iconBackgroundClass: string;
  readonly iconColorClass: string;
};

export type InterestDescriptor = LocalizedDescriptor<InterestVisualMetadata>;
export type ResolvedInterestDescriptor = ResolvedDescriptor<InterestVisualMetadata>;

export const interestDescriptors = [
  {
    id: "parks",
    labelKey: "interest-parks-label",
    defaultLabel: "Parks & Nature",
    iconToken: "{icon.category.trails}",
    iconBackgroundClass: "bg-green-500/20",
    iconColorClass: "text-green-400",
  },
  {
    id: "coffee",
    labelKey: "interest-coffee-label",
    defaultLabel: "Coffee Spots",
    iconToken: "{icon.category.food}",
    iconBackgroundClass: "bg-amber-500/20",
    iconColorClass: "text-amber-400",
  },
  {
    id: "street-art",
    labelKey: "interest-street-art-label",
    defaultLabel: "Street Art",
    iconToken: "{icon.category.art}",
    iconBackgroundClass: "bg-accent/20",
    iconColorClass: "text-accent",
  },
  {
    id: "historic",
    labelKey: "interest-historic-label",
    defaultLabel: "Historic Sites",
    iconToken: "{icon.category.landmarks}",
    iconBackgroundClass: "bg-purple-500/20",
    iconColorClass: "text-purple-400",
  },
  {
    id: "waterfront",
    labelKey: "interest-waterfront-label",
    defaultLabel: "Waterfront",
    iconToken: "{icon.category.water}",
    iconBackgroundClass: "bg-accent/20",
    iconColorClass: "text-accent",
  },
  {
    id: "markets",
    labelKey: "interest-markets-label",
    defaultLabel: "Markets",
    iconToken: "{icon.category.shops}",
    iconBackgroundClass: "bg-orange-500/20",
    iconColorClass: "text-orange-400",
  },
] as const satisfies ReadonlyArray<InterestDescriptor>;

export type InterestId = (typeof interestDescriptors)[number]["id"];

export const buildInterestLookup = (t: TFunction): Map<InterestId, ResolvedInterestDescriptor> =>
  buildDescriptorLookup<InterestVisualMetadata, typeof interestDescriptors>(interestDescriptors, t);
