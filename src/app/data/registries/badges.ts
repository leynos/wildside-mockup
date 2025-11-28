/** @file Badge descriptor registry for reusable route/theme badges. */

import type {
  EntityLocalizations,
  LocaleCode,
  LocalizedStringSet,
} from "../../domain/entities/localization";
import { defaultFallbackLocales, pickLocalization } from "../../domain/entities/localization";

export interface BadgeDescriptor {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly accentClass?: string;
}

export type BadgeId = BadgeDescriptor["id"];

export type ResolvedBadgeDescriptor = BadgeDescriptor & {
  readonly localization: LocalizedStringSet;
};

export const badgeDescriptors: ReadonlyArray<BadgeDescriptor> = [
  {
    id: "sunset-pick",
    accentClass: "bg-amber-400/20 text-amber-300",
    localizations: {
      "en-GB": { name: "Sunset pick", shortLabel: "Sunset" },
      es: { name: "Selección atardecer", shortLabel: "Atardecer" },
    },
  },
  {
    id: "teal-line",
    accentClass: "bg-accent/20 text-accent",
    localizations: {
      "en-GB": { name: "Teal line", shortLabel: "Teal" },
      es: { name: "Línea turquesa", shortLabel: "Turquesa" },
    },
  },
  {
    id: "community-favourite",
    accentClass: "bg-pink-400/20 text-pink-200",
    localizations: {
      "en-GB": { name: "Community favourite", shortLabel: "Community" },
      es: { name: "Favorito de la comunidad", shortLabel: "Comunidad" },
    },
  },
];

export const getBadgeDescriptor = (
  id: BadgeId,
  locale: LocaleCode,
  fallbackLocales: readonly LocaleCode[] = defaultFallbackLocales,
): ResolvedBadgeDescriptor | undefined => {
  const descriptor = badgeDescriptors.find((entry) => entry.id === id);
  if (!descriptor) return undefined;
  return {
    ...descriptor,
    localization: pickLocalization(descriptor.localizations, locale, fallbackLocales),
  };
};
