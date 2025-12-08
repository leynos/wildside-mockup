/** @file Shared list rendering points of interest with Radix dialog sheets. */

import * as Dialog from "@radix-ui/react-dialog";
import { type JSX, useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { WalkPointOfInterest } from "../data/map";
import { getTagDescriptor } from "../data/registries/tags";
import { pickLocalization } from "../domain/entities/localization";
import { useOptionalMapStore } from "../features/map/map-state";
import { Icon } from "./icon";

interface POIPresentation {
  localization: ReturnType<typeof pickLocalization>;
  categoryDescriptor?: ReturnType<typeof getTagDescriptor>;
  categoryLabel: string;
  tagDescriptors: NonNullable<ReturnType<typeof getTagDescriptor>>[];
  formattedRating?: string | undefined;
  openHoursCopy: string | null;
}

interface PointOfInterestItemProps {
  poi: WalkPointOfInterest;
  presentation: POIPresentation;
  highlightPois?: ((poiIds: readonly string[]) => void) | undefined;
  highlightBadgeLabel: string;
  t: ReturnType<typeof useTranslation>["t"];
}

const preparePOIPresentation = (
  poi: WalkPointOfInterest,
  language: string,
  t: ReturnType<typeof useTranslation>["t"],
  ratingFormatter: Intl.NumberFormat,
): POIPresentation => {
  const localization = pickLocalization(poi.localizations, language);
  const categoryDescriptor = getTagDescriptor(poi.categoryId, language);
  const categoryLabel = categoryDescriptor?.localization.name ?? localization.name;
  const tagDescriptors =
    poi.tagIds
      .map((tagId) => getTagDescriptor(tagId, language))
      .filter((descriptor): descriptor is NonNullable<typeof descriptor> => Boolean(descriptor)) ??
    [];
  const formattedRating =
    typeof poi.rating === "number" ? ratingFormatter.format(poi.rating) : undefined;
  const openHoursCopy = poi.openHours
    ? t("poi-open-hours", {
        opensAt: poi.openHours.opensAt,
        closesAt: poi.openHours.closesAt,
        defaultValue: `${poi.openHours.opensAt}–${poi.openHours.closesAt}`,
      })
    : null;

  return {
    localization,
    categoryDescriptor,
    categoryLabel,
    tagDescriptors,
    formattedRating,
    openHoursCopy,
  };
};

const PointOfInterestItem = ({
  poi,
  presentation,
  highlightPois,
  highlightBadgeLabel,
  t,
}: PointOfInterestItemProps): JSX.Element => {
  const {
    localization,
    categoryDescriptor,
    categoryLabel,
    tagDescriptors,
    formattedRating,
    openHoursCopy,
  } = presentation;

  const handleHighlight = (ids: string[]) => highlightPois?.(ids);

  return (
    <Dialog.Root key={poi.id}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="poi-list__item"
          onMouseEnter={() => handleHighlight([poi.id])}
          onFocus={() => handleHighlight([poi.id])}
          onMouseLeave={() => handleHighlight([])}
          onBlur={() => handleHighlight([])}
        >
          <div className="poi-list__summary">
            <div>
              <h3 className="text-base font-semibold text-base-content">{localization.name}</h3>
              <p className="mt-1 text-sm text-base-content/70">{localization.description}</p>
            </div>
            {formattedRating ? (
              <span className="rating-indicator rating-indicator--strong">
                <Icon token="{icon.object.star}" aria-hidden className="h-4 w-4" />
                {formattedRating}
              </span>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-accent">
            <span className="poi-highlight">
              <Icon
                token={categoryDescriptor?.iconToken ?? "{icon.object.marker}"}
                className={`h-4 w-4 ${categoryDescriptor?.accentClass ?? ""}`.trim()}
                label={categoryLabel}
              />
              <span aria-hidden>{highlightBadgeLabel}</span>
            </span>
            {tagDescriptors.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-base-300/60 bg-base-100 px-2 py-0.5 text-base-content/70"
              >
                {tag.localization.name}
              </span>
            ))}
          </div>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="poi-sheet">
            <div className="poi-list__summary">
              <div>
                <Dialog.Title className="text-lg font-semibold text-base-content">
                  {localization.name}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-base-content/70">
                  {localization.description}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" className="btn btn-ghost btn-sm">
                  {t("action-close", { defaultValue: "Close" })}
                </button>
              </Dialog.Close>
            </div>
            <div className="mt-4 space-y-2 text-sm text-base-content/70">
              {tagDescriptors.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tagDescriptors.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full border border-base-300/60 bg-base-200/70 px-3 py-1 text-xs"
                    >
                      {tag.localization.name}
                    </span>
                  ))}
                </div>
              ) : null}
              {openHoursCopy ? (
                <p className="flex items-center gap-2 text-xs text-base-content/60">
                  <Icon token="{icon.object.duration}" aria-hidden className="h-4 w-4" />
                  {openHoursCopy}
                </p>
              ) : null}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export interface PointOfInterestListProps {
  points: WalkPointOfInterest[];
}

export function PointOfInterestList({ points }: PointOfInterestListProps): JSX.Element {
  const mapStore = useOptionalMapStore();
  const highlightPois = mapStore?.actions.highlightPois;
  const { t, i18n } = useTranslation();
  const highlightBadgeLabel = t("poi-highlight-label", { defaultValue: "Highlight" });
  const ratingFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    [i18n.language],
  );

  return (
    <div className="space-y-3">
      {points.map((poi) => {
        const presentation = preparePOIPresentation(poi, i18n.language, t, ratingFormatter);
        return (
          <PointOfInterestItem
            key={poi.id}
            poi={poi}
            presentation={presentation}
            highlightPois={highlightPois}
            highlightBadgeLabel={highlightBadgeLabel}
            t={t}
          />
        );
      })}
    </div>
  );
}
