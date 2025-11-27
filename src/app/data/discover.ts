/** @file Static fixtures supporting the Discover onboarding flow. */

import { defaultFallbackLocales, type LocaleCode } from "../domain/entities/localization";

import {
  getInterestDescriptor,
  type InterestDescriptor,
  interestDescriptors,
  type ResolvedInterestDescriptor,
  resolveInterestDescriptors,
} from "./registries/interests";

export type DiscoverInterest = ResolvedInterestDescriptor;

/** The interests highlighted in the mockup when the screen first loads. */
export const defaultSelectedInterests = ["street-art", "waterfront"] as const;

export type DiscoverInterestId = InterestDescriptor["id"];

export const discoverInterestDescriptors = interestDescriptors;

export function resolveDiscoverInterests(
  locale: string,
  fallbackLocales: readonly LocaleCode[] = defaultFallbackLocales,
): DiscoverInterest[] {
  return resolveInterestDescriptors(locale, fallbackLocales);
}

export function getDiscoverInterest(
  id: DiscoverInterestId,
  locale: string,
  fallbackLocales: readonly LocaleCode[] = defaultFallbackLocales,
): DiscoverInterest | undefined {
  return getInterestDescriptor(id, locale, fallbackLocales);
}
