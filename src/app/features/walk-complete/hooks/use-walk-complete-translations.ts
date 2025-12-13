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

  const translations = useMemo(
    () => ({
      locale: i18n.language,
      heroTitle: t("walk-complete-hero-title", { defaultValue: "Walk complete!" }),
      heroDescription: t("walk-complete-hero-description", {
        defaultValue: "Amazing adventure through the city · Hidden Gems Loop",
      }),
      mapAlt: t("walk-complete-map-alt", { defaultValue: "Overview of the completed route" }),
      routeBadgeLabel: t("walk-complete-badge-route", { defaultValue: "Route completed" }),
      rateActionLabel: t("walk-complete-actions-rate", { defaultValue: "Rate this walk" }),
      shareActionLabel: t("walk-complete-actions-share", { defaultValue: "Share" }),
      saveActionLabel: t("walk-complete-actions-save", { defaultValue: "Save route" }),
      favouriteHeading: t("walk-complete-favourite-heading", {
        defaultValue: "Favourite moments",
      }),
      remixTitle: t("walk-complete-remix-title", { defaultValue: "Try a remix?" }),
      remixDescription: t("walk-complete-remix-description", {
        defaultValue:
          "Generate a new route keeping your favourite spots but discovering new hidden gems.",
      }),
      remixButtonLabel: t("walk-complete-remix-button", { defaultValue: "Remix this walk" }),
      shareSectionHeading: t("walk-complete-share-section", {
        defaultValue: "Share your adventure",
      }),
      shareDialogTitle: t("walk-complete-share-dialog-title", {
        defaultValue: "Share highlights",
      }),
      shareDialogDescription: t("walk-complete-share-dialog-description", {
        defaultValue: "Export a highlight reel with your favourite stops and stats.",
      }),
      shareDialogCancel: t("walk-complete-share-dialog-cancel", { defaultValue: "Cancel" }),
      shareDialogGenerate: t("walk-complete-share-dialog-generate", {
        defaultValue: "Generate reel",
      }),
      ratingSavedLabel: t("walk-complete-toast-rating-saved", {
        defaultValue: "Thanks! Rating saved for future suggestions.",
      }),
    }),
    [i18n.language, t],
  );

  const shareChannelLabels = useMemo(() => {
    const entries = walkCompletionShareOptions.map((option) => [
      option.id,
      pickLocalization(option.localizations, translations.locale).name,
    ]);

    return Object.fromEntries(entries) as Readonly<Record<string, string>>;
  }, [translations.locale]);

  return { ...translations, shareChannelLabels };
}
