/** @file Badge descriptor registry for reusable route/theme badges. */

import type { EntityLocalizations } from "../../domain/entities/localization";

export interface BadgeDescriptor {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly accentClass?: string;
}

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
