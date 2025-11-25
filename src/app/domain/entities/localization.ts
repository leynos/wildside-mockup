/** @file Shared localisation primitives and helpers for entity-driven cards. */

export type LocaleCode = "en-GB" | "en-US" | "fr" | "de" | "es" | "fi" | "da" | "el" | "cy" | "ar";

export type LocalizedStringSet = {
  readonly name: string;
  readonly description?: string;
  readonly shortLabel?: string;
};

export type EntityLocalizations = Partial<Record<LocaleCode, LocalizedStringSet>>;

const defaultFallbackChain: readonly LocaleCode[] = ["en-GB", "en-US"];

const normaliseLocale = (input: string): string => input.trim().toLowerCase();

const buildCandidateLocales = (requested: string): string[] => {
  const trimmed = normaliseLocale(requested);
  const parts = trimmed.split("-");
  if (parts.length > 1) {
    return [parts.join("-"), parts[0] ?? trimmed];
  }
  return [trimmed];
};

/**
 * Pick the best available localisation, falling back predictably.
 *
 * @throws {Error} when no localisation entries are present.
 */
export function pickLocalization(
  localizations: EntityLocalizations | undefined,
  locale: string,
  fallbackLocales: readonly LocaleCode[] = defaultFallbackChain,
): LocalizedStringSet {
  if (!localizations || Object.keys(localizations).length === 0) {
    throw new Error("No localizations available for entity");
  }

  const candidateOrder = [
    ...buildCandidateLocales(locale),
    ...fallbackLocales.map(normaliseLocale),
    ...Object.keys(localizations).map(normaliseLocale),
  ];

  for (const candidate of candidateOrder) {
    const entry = Object.entries(localizations).find(([key]) => normaliseLocale(key) === candidate);
    const localisation = entry?.[1];
    if (localisation) {
      return localisation;
    }
  }

  throw new Error("Failed to resolve localisation for entity");
}

export const defaultFallbackLocales = defaultFallbackChain;
