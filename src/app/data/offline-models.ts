/** @file Offline flow types shared across fixtures and screens. */

import type { EntityLocalizations } from "../domain/entities/localization";

export interface OfflineSuggestion {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly ctaLocalizations: EntityLocalizations;
  readonly iconToken: string;
  readonly accentClass: string;
  readonly iconClassName?: string;
}
