/**
 * @file Suggestions section for the offline screen.
 *
 * Renders a titled list of offline suggestions as cards, or null when empty.
 * Localization is delegated to OfflineSuggestionCard; this component wires
 * user actions (onAction/onDismiss) by suggestion ID. Extracted to reduce
 * OfflineScreen complexity.
 */

import type { JSX } from "react";

import type { OfflineSuggestion } from "../../../data/stage-four";
import { OfflineSuggestionCard } from "./offline-suggestion-card";

export type OfflineSuggestionsSectionProps = {
  readonly suggestions: readonly OfflineSuggestion[];
  readonly heading: string;
  readonly dismissLabel: string;
  readonly i18nLanguage: string;
  readonly onAction: (id: string) => void;
  readonly onDismiss: (id: string) => void;
};

export function OfflineSuggestionsSection({
  suggestions,
  heading,
  dismissLabel,
  i18nLanguage,
  onAction,
  onDismiss,
}: OfflineSuggestionsSectionProps): JSX.Element | null {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3" aria-labelledby="offline-suggestions-heading">
      <h2 id="offline-suggestions-heading" className="text-base font-semibold text-base-content">
        {heading}
      </h2>
      {suggestions.map((suggestion) => (
        <OfflineSuggestionCard
          key={suggestion.id}
          suggestion={suggestion}
          dismissLabel={dismissLabel}
          i18nLanguage={i18nLanguage}
          onAction={() => onAction(suggestion.id)}
          onDismiss={() => onDismiss(suggestion.id)}
        />
      ))}
    </section>
  );
}
