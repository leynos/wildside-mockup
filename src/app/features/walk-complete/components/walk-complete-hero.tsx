/** @file Walk completion hero title and map preview card. */

import type { JSX } from "react";

import { SectionHero } from "../../../components/section-hero";
import { walkCompletionMapImage, walkCompletionMoments } from "../../../data/stage-four";
import { pickLocalization } from "../../../domain/entities/localization";

type WalkCompleteHeroProps = {
  readonly heroTitle: string;
  readonly heroDescription: string;
  readonly mapAlt: string;
  readonly routeBadgeLabel: string;
  readonly locale: string;
};

export function WalkCompleteHero({
  heroTitle,
  heroDescription,
  mapAlt,
  routeBadgeLabel,
  locale,
}: WalkCompleteHeroProps): JSX.Element {
  return (
    <>
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
            <img src={walkCompletionMapImage} alt={mapAlt} className="h-full w-full object-cover" />
            <span className="walk-complete__badge">{routeBadgeLabel}</span>
            <div className="walk-complete__avatar-stack">
              {walkCompletionMoments.slice(0, 3).map((moment) => (
                <img
                  key={moment.id}
                  src={moment.imageUrl}
                  alt={pickLocalization(moment.localizations, locale).name}
                  className="h-9 w-9 rounded-full border-2 border-accent object-cover shadow"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
