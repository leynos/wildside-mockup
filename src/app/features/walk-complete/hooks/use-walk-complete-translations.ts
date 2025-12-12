/** @file Provides walk completion translations and share channel labels. */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { walkCompletionShareOptions } from "../../../data/stage-four";
import { pickLocalization } from "../../../domain/entities/localization";

export type WalkCompleteTranslations = {
  readonly locale: string;
  readonly heroTitle: string;
  readonly heroDescription: string;
  readonly mapAlt: string;
  readonly routeBadgeLabel: string;
  readonly rateActionLabel: string;
  readonly shareActionLabel: string;
  readonly saveActionLabel: string;
  readonly favouriteHeading: string;
  readonly remixTitle: string;
  readonly remixDescription: string;
  readonly remixButtonLabel: string;
  readonly shareSectionHeading: string;
  readonly shareDialogTitle: string;
  readonly shareDialogDescription: string;
  readonly shareDialogCancel: string;
  readonly shareDialogGenerate: string;
  readonly ratingSavedLabel: string;
  readonly shareChannelLabels: Readonly<Record<string, string>>;
};

export function useWalkCompleteTranslations(): WalkCompleteTranslations {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const heroTitle = t("walk-complete-hero-title", { defaultValue: "Walk complete!" });
  const heroDescription = t("walk-complete-hero-description", {
    defaultValue: "Amazing adventure through the city · Hidden Gems Loop",
  });
  const mapAlt = t("walk-complete-map-alt", { defaultValue: "Overview of the completed route" });
  const routeBadgeLabel = t("walk-complete-badge-route", { defaultValue: "Route completed" });
  const rateActionLabel = t("walk-complete-actions-rate", { defaultValue: "Rate this walk" });
  const shareActionLabel = t("walk-complete-actions-share", { defaultValue: "Share" });
  const saveActionLabel = t("walk-complete-actions-save", { defaultValue: "Save route" });
  const favouriteHeading = t("walk-complete-favourite-heading", {
    defaultValue: "Favourite moments",
  });
  const remixTitle = t("walk-complete-remix-title", { defaultValue: "Try a remix?" });
  const remixDescription = t("walk-complete-remix-description", {
    defaultValue:
      "Generate a new route keeping your favourite spots but discovering new hidden gems.",
  });
  const remixButtonLabel = t("walk-complete-remix-button", { defaultValue: "Remix this walk" });
  const shareSectionHeading = t("walk-complete-share-section", {
    defaultValue: "Share your adventure",
  });
  const shareDialogTitle = t("walk-complete-share-dialog-title", {
    defaultValue: "Share highlights",
  });
  const shareDialogDescription = t("walk-complete-share-dialog-description", {
    defaultValue: "Export a highlight reel with your favourite stops and stats.",
  });
  const shareDialogCancel = t("walk-complete-share-dialog-cancel", { defaultValue: "Cancel" });
  const shareDialogGenerate = t("walk-complete-share-dialog-generate", {
    defaultValue: "Generate reel",
  });
  const ratingSavedLabel = t("walk-complete-toast-rating-saved", {
    defaultValue: "Thanks! Rating saved for future suggestions.",
  });

  const shareChannelLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    for (const option of walkCompletionShareOptions) {
      labels[option.id] = pickLocalization(option.localizations, locale).name;
    }
    return labels;
  }, [locale]);

  return {
    locale,
    heroTitle,
    heroDescription,
    mapAlt,
    routeBadgeLabel,
    rateActionLabel,
    shareActionLabel,
    saveActionLabel,
    favouriteHeading,
    remixTitle,
    remixDescription,
    remixButtonLabel,
    shareSectionHeading,
    shareDialogTitle,
    shareDialogDescription,
    shareDialogCancel,
    shareDialogGenerate,
    ratingSavedLabel,
    shareChannelLabels,
  };
}
