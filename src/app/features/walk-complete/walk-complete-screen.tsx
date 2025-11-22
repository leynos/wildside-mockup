/** @file Walk completion summary with celebratory toast and recap details. */

import * as Dialog from "@radix-ui/react-dialog";
import * as Toast from "@radix-ui/react-toast";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, type ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import { SectionHeading } from "../../components/section-heading";
import { SectionHero } from "../../components/section-hero";
import {
  type WalkCompletionStat,
  walkCompletionMapImage,
  walkCompletionMoments,
  walkCompletionPrimaryStats,
  walkCompletionSecondaryStats,
  walkCompletionShareOptions,
} from "../../data/stage-four";
import { MobileShell } from "../../layout/mobile-shell";
import { useUnitPreferences } from "../../units/unit-preferences-provider";
import { formatDistance, formatDuration, formatStops } from "../../units/unit-format";

const secondaryStatIconTone: Record<string, string> = {
  calories: "text-orange-400",
  stops: "text-amber-300",
  starred: "text-pink-400",
};

type WalkCompleteSectionProps = {
  readonly spacing?: "default" | "tight" | "spacious";
  readonly className?: string;
  readonly children: ReactNode;
};

function WalkCompleteSection({
  spacing = "default",
  className,
  children,
}: WalkCompleteSectionProps): JSX.Element {
  const spacingClasses: Record<NonNullable<WalkCompleteSectionProps["spacing"]>, string> = {
    default: "walk-complete__section",
    tight: "walk-complete__section walk-complete__section--tight",
    spacious: "walk-complete__section walk-complete__section--spacious",
  };

  const composedClassName = className
    ? `${spacingClasses[spacing]} ${className}`
    : spacingClasses[spacing];

  return <section className={composedClassName}>{children}</section>;
}

export function WalkCompleteScreen(): JSX.Element {
  const navigate = useNavigate();
  const [toastOpen, setToastOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { unitSystem } = useUnitPreferences();

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
      labels[option.id] = t(`walk-complete-share-channel-${option.id}`, {
        defaultValue: option.label,
      });
    }
    return labels;
  }, [t]);

  const unitOptions = useMemo(
    () => ({ t, locale: i18n.language, unitSystem }),
    [i18n.language, t, unitSystem],
  );

  const formatStatValue = useCallback(
    (value: WalkCompletionStat["value"]): string => {
      switch (value.kind) {
        case "distance": {
          const { value: formatted, unitLabel } = formatDistance(value.metres, unitOptions);
          return `${formatted} ${unitLabel}`;
        }
        case "duration": {
          const { value: formatted, unitLabel } = formatDuration(value.seconds, {
            ...unitOptions,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
          return `${formatted} ${unitLabel}`;
        }
        case "count": {
          if (value.unitToken === "count-stop") {
            const { value: formatted, unitLabel } = formatStops(value.value, {
              ...unitOptions,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
            return `${formatted} ${unitLabel}`;
          }
          return new Intl.NumberFormat(unitOptions.locale).format(value.value);
        }
        default:
          return "";
      }
    },
    [unitOptions],
  );

  return (
    <Toast.Provider swipeDirection="right">
      <MobileShell tone="dark">
        <div className="relative screen-stack">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(74,240,213,0.12),_transparent_55%)]" />
          <main className="relative z-10 flex-1 overflow-y-auto pb-28">
            <div className="px-6 pt-16 pb-8">
              <SectionHero
                iconToken="{icon.object.trophy}"
                iconClassName="animate-pulse"
                title={heroTitle}
                description={heroDescription}
                badgeTone="celebration"
              />
            </div>

            <section className="px-6">
              <div className="walk-complete__hero-card">
                <div className="relative h-44 overflow-hidden rounded-2xl border border-base-300/60">
                  <img
                    src={walkCompletionMapImage}
                    alt={mapAlt}
                    className="h-full w-full object-cover"
                  />
                  <span className="walk-complete__badge">{routeBadgeLabel}</span>
                  <div className="walk-complete__avatar-stack">
                    {walkCompletionMoments.slice(0, 3).map((moment) => (
                      <img
                        key={moment.id}
                        src={moment.imageUrl}
                        alt={moment.name}
                        className="h-9 w-9 rounded-full border-2 border-accent object-cover shadow"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <WalkCompleteSection>
              <div className="grid gap-4 sm:grid-cols-2">
                {walkCompletionPrimaryStats.map((stat) => (
                  <article key={stat.id} className="walk-complete__stat-card text-base-content">
                    <div className="mb-2 flex items-center gap-3 text-base-content/70">
                      <Icon token={stat.iconToken} className="text-accent" aria-hidden />
                      <span className="text-sm font-medium">
                        {t(`walk-complete-primary-${stat.id}-label`, {
                          defaultValue: stat.label,
                        })}
                      </span>
                    </div>
                    <p className="text-2xl font-semibold">{formatStatValue(stat.value)}</p>
                  </article>
                ))}
              </div>
            </WalkCompleteSection>

            <WalkCompleteSection spacing="tight">
              <div className="grid grid-cols-3 gap-3">
                {walkCompletionSecondaryStats.map((stat) => (
                  <article
                    key={stat.id}
                    className="rounded-2xl border border-base-300/60 bg-base-200/30 p-4 text-center"
                  >
                    <Icon
                      token={stat.iconToken}
                      className={`walk-complete__secondary-icon ${secondaryStatIconTone[stat.id] ?? "text-accent"}`}
                      aria-hidden
                    />
                    <p className="text-lg font-semibold text-base-content">
                      {formatStatValue(stat.value)}
                    </p>
                    <p className="text-xs text-base-content/70">
                      {t(`walk-complete-secondary-${stat.id}-label`, {
                        defaultValue: stat.label,
                      })}
                    </p>
                  </article>
                ))}
              </div>
            </WalkCompleteSection>

            <WalkCompleteSection>
              <SectionHeading iconToken="{icon.action.like}" iconClassName="text-pink-400">
                {favouriteHeading}
              </SectionHeading>
              <div className="space-y-3">
                {walkCompletionMoments.map((moment) => (
                  <article
                    key={moment.id}
                    className="flex items-center gap-4 rounded-2xl border border-base-300/60 bg-base-200/30 p-4"
                  >
                    <img
                      src={moment.imageUrl}
                      alt={moment.name}
                      className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex-1 text-start text-base-content">
                      <p className="font-semibold">{moment.name}</p>
                      <p className="text-sm text-base-content/70">{moment.description}</p>
                    </div>
                    <Icon token="{icon.object.star}" className="text-amber-300" aria-hidden />
                  </article>
                ))}
              </div>
            </WalkCompleteSection>

            <WalkCompleteSection>
              <div className="space-y-3">
                <button
                  type="button"
                  className="btn btn-accent btn-lg w-full justify-center gap-3 text-base-900"
                  onClick={() => setToastOpen(true)}
                >
                  <Icon token="{icon.object.star}" aria-hidden />
                  {rateActionLabel}
                </button>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    className="btn-outline--fill"
                    onClick={() => setShareOpen(true)}
                  >
                    <Icon token="{icon.action.share}" aria-hidden />
                    {shareActionLabel}
                  </button>
                  <button
                    type="button"
                    className="btn-outline--fill"
                    onClick={() => navigate({ to: "/saved" })}
                  >
                    <Icon token="{icon.action.save}" aria-hidden />
                    {saveActionLabel}
                  </button>
                </div>
              </div>
            </WalkCompleteSection>

            <WalkCompleteSection>
              <div className="walk-complete__remix">
                <div className="inline-action-cluster mb-3 items-start">
                  <Icon token="{icon.object.magic}" className="text-purple-300" aria-hidden />
                  <div>
                    <h3 className="text-base font-semibold">{remixTitle}</h3>
                    <p className="text-sm text-base-content/70">{remixDescription}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate({ to: "/wizard/step-1" })}
                >
                  {remixButtonLabel}
                </button>
              </div>
            </WalkCompleteSection>

            <WalkCompleteSection spacing="spacious" className="pb-12">
              <h3 className="mb-4 text-center text-base font-semibold text-base-content">
                {shareSectionHeading}
              </h3>
              <div className="flex justify-center gap-4">
                {walkCompletionShareOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-label={shareChannelLabels[option.id] ?? option.label}
                    className={`walk-share__icon ${option.accentClass}`}
                  >
                    <Icon token={option.iconToken} aria-hidden />
                  </button>
                ))}
              </div>
            </WalkCompleteSection>
          </main>
        </div>
      </MobileShell>

      <Dialog.Root open={shareOpen} onOpenChange={setShareOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60" />
          <Dialog.Content className="dialog-surface">
            <Dialog.Title className="text-lg font-semibold text-base-content">
              {shareDialogTitle}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-base-content/70">
              {shareDialogDescription}
            </Dialog.Description>
            <div className="flex flex-wrap gap-2 text-sm text-base-content/80">
              {walkCompletionShareOptions.map((option) => (
                <span key={option.id} className="walk-share__option">
                  <Icon token={option.iconToken} aria-hidden />
                  {shareChannelLabels[option.id] ?? option.label}
                </span>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <button type="button" className="btn btn-ghost btn-sm">
                  {shareDialogCancel}
                </button>
              </Dialog.Close>
              <button type="button" className="btn btn-accent btn-sm">
                {shareDialogGenerate}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Toast.Root
        open={toastOpen}
        onOpenChange={setToastOpen}
        className="toast toast-end pointer-events-auto"
        duration={4000}
      >
        <div className="alert alert-success shadow-lg">
          <Icon token="{icon.object.star}" aria-hidden />
          <span className="font-semibold">{ratingSavedLabel}</span>
        </div>
      </Toast.Root>
      <Toast.Viewport className="pointer-events-none fixed inset-x-0 bottom-4 flex flex-col gap-3 px-4 sm:items-end" />
    </Toast.Provider>
  );
}
