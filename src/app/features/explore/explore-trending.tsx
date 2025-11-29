/** @file Trending routes list for the Explore screen. */

import { type JSX, useId } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "../../components/icon";
import type { Route, TrendingRouteHighlight } from "../../data/explore.models";
import { pickLocalization } from "../../domain/entities/localization";

export type TrendingRouteCard = {
  readonly route: Route;
  readonly highlight: TrendingRouteHighlight;
};

type TrendingRouteViewModel = {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly trendDelta: string;
};

const toTrendingRouteViewModel = (
  card: TrendingRouteCard,
  locale: string,
): TrendingRouteViewModel => {
  const { route, highlight } = card;
  const routeLocalization = pickLocalization(route.localizations, locale);
  const subtitle = pickLocalization(highlight.subtitleLocalizations, locale).name;

  return {
    id: route.id,
    title: routeLocalization.name,
    subtitle,
    imageUrl: route.heroImage.url,
    imageAlt: route.heroImage.alt,
    trendDelta: highlight.trendDelta,
  };
};

type TrendingRoutesListProps = {
  readonly cards: readonly TrendingRouteCard[];
};

export function TrendingRoutesList({ cards }: TrendingRoutesListProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const heading = t("explore-trending-heading", { defaultValue: "Trending Now" });
  const headingId = useId();
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="section-title">
        {heading}
      </h2>
      <div className="space-y-3">
        {cards.map((card) => {
          const viewModel = toTrendingRouteViewModel(card, locale);
          return (
            <article key={viewModel.id} className="explore-trending__card">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-lg">
                  <img
                    src={viewModel.imageUrl}
                    alt={viewModel.imageAlt}
                    className="h-full w-full"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-base-content">{viewModel.title}</p>
                  <p className="text-xs text-base-content/60">{viewModel.subtitle}</p>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-orange-300">
                  <Icon token="{icon.object.trend}" aria-hidden className="h-4 w-4" />
                  {viewModel.trendDelta}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export type { TrendingRoutesListProps };
