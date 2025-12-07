/** @file Card component for recommended offline map downloads. */

import type { JSX } from "react";

import { Button } from "../../../components/button";
import { Icon } from "../../../components/icon";
import type { OfflineSuggestion } from "../../../data/stage-four";
import { pickLocalization } from "../../../domain/entities/localization";

type OfflineSuggestionCardProps = {
  readonly suggestion: OfflineSuggestion;
  readonly dismissLabel: string;
  readonly i18nLanguage: string;
  readonly onDismiss: () => void;
};

export function OfflineSuggestionCard({
  suggestion,
  dismissLabel,
  i18nLanguage,
  onDismiss,
}: OfflineSuggestionCardProps): JSX.Element {
  const suggestionCopy = pickLocalization(suggestion.localizations, i18nLanguage);
  const ctaCopy = pickLocalization(suggestion.ctaLocalizations, i18nLanguage);

  return (
    <article
      className={`rounded-2xl border border-base-300/60 bg-gradient-to-r ${suggestion.accentClass} p-4 shadow-lg`}
    >
      <div className="flex items-start gap-3 text-base-100">
        <Icon
          token={suggestion.iconToken}
          className={`text-xl ${suggestion.iconClassName ?? ""}`.trim()}
          aria-hidden
        />
        <div className="flex-1">
          <h3 className="text-base font-semibold text-base-100">{suggestionCopy.name}</h3>
          <p className="mt-1 text-sm text-base-100/80">{suggestionCopy.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm">{ctaCopy.name}</Button>
            <Button
              size="sm"
              variant="ghost"
              className="border-white/40 text-base-100 hover:bg-white/10"
              onClick={onDismiss}
            >
              {dismissLabel}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
