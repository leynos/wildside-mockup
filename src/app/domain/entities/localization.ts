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

const toNormalizedLocalizationMap = (
  localizations: EntityLocalizations,
): Record<string, LocalizedStringSet> => {
  const map: Record<string, LocalizedStringSet> = {};
  for (const [key, value] of Object.entries(localizations)) {
    if (value) {
      map[normaliseLocale(key)] = value;
    }
  }
  return map;
};

/**
 * Pick the best available localisation, falling back predictably.
 *
 * @example
 * const localizations = {
 *   "en-GB": { name: "Harbour Loop" },
 *   fr: { name: "Boucle du port" },
 * };
 * const resolved = pickLocalization(localizations, "es-MX", ["en-US", "fr"]);
 * // resolved.name === "Boucle du port"
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

  const normalizedMap = toNormalizedLocalizationMap(localizations);

  const candidateOrder = [
    ...buildCandidateLocales(locale),
    ...fallbackLocales.map(normaliseLocale),
    ...Object.keys(normalizedMap),
  ];

  for (const candidate of candidateOrder) {
    const localisation = normalizedMap[normaliseLocale(candidate)];
    if (localisation) return localisation;
  }

  throw new Error("Failed to resolve localisation for entity");
}

export const defaultFallbackLocales = defaultFallbackChain;
