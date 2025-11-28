/** @file Community pick panel for the Explore screen. */

import { type JSX, useId } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import type { CommunityPick } from "../../data/explore.models";
import { pickLocalization } from "../../domain/entities/localization";
import { RouteMetric } from "./explore-sections";

type CommunityPickPanelProps = {
  pick: CommunityPick;
  formatDistanceLabel: (metres: number) => string;
  formatDurationLabel: (seconds: number) => string;
  formatSaveCount: (count: number) => string;
};

export function CommunityPickPanel({
  pick,
  formatDistanceLabel,
  formatDurationLabel,
  formatSaveCount,
}: CommunityPickPanelProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const heading = t("explore-community-heading", { defaultValue: "Community Favourite" });
  const subtitle = t("explore-community-subtitle", { defaultValue: "Most shared this week" });
  const headingId = useId();
  const localization = pickLocalization(pick.localizations, locale);
  const curator = pickLocalization(pick.curator.localizations, locale);
  return (
    <section className="explore-info__panel" aria-labelledby={headingId}>
      <h2 id={headingId} className="section-heading mb-4 text-base-content">
        <Icon token="{icon.object.family}" className="text-accent" aria-hidden />
        {heading}
      </h2>
      <div className="mb-3 flex items-center gap-3">
        <div className="h-9 w-9 overflow-hidden rounded-full border border-base-300/60">
          <img
            src={pick.curator.avatar.url}
            alt={pick.curator.avatar.alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-base-content">{curator.name}</p>
          <p className="text-xs text-base-content/60">{subtitle}</p>
        </div>
        <span className="rating-indicator rating-indicator--strong">
          <Icon token="{icon.object.star}" aria-hidden className="h-4 w-4" />
          {pick.rating.toFixed(1)}
        </span>
      </div>
      <h3 className="text-base font-semibold text-base-content">{localization.name}</h3>
      <p className="mt-2 text-sm text-base-content/70">{localization.description}</p>
      <div className="mt-3 explore-meta-list">
        <RouteMetric iconToken="{icon.object.route}">
          {formatDistanceLabel(pick.distanceMetres)}
        </RouteMetric>
        <RouteMetric iconToken="{icon.object.duration}">
          {formatDurationLabel(pick.durationSeconds)}
        </RouteMetric>
        <RouteMetric iconToken="{icon.action.save}">{formatSaveCount(pick.saves)}</RouteMetric>
      </div>
    </section>
  );
}

export type { CommunityPickPanelProps };
