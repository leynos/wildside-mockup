/** @file Static fixtures supporting the Discover onboarding flow. */

import type { TFunction } from "i18next";

import { resolveDescriptor } from "../i18n/descriptors";
import {
  type InterestDescriptor,
  interestDescriptors,
  type ResolvedInterestDescriptor,
} from "./registries/interests";

export type DiscoverInterest = ResolvedInterestDescriptor;

/** The interests highlighted in the mockup when the screen first loads. */
export const defaultSelectedInterests = ["street-art", "waterfront"] as const;

export type DiscoverInterestId = InterestDescriptor["id"];

export const discoverInterestDescriptors = interestDescriptors;

export function resolveDiscoverInterests(t: TFunction): DiscoverInterest[] {
  return interestDescriptors.map((descriptor) => resolveDescriptor(descriptor, t));
}

export function getDiscoverInterest(
  id: DiscoverInterestId,
  t: TFunction,
): DiscoverInterest | undefined {
  const match = interestDescriptors.find((interest) => interest.id === id);
  if (!match) {
    return undefined;
  }
  return resolveDescriptor(match, t);
}
