/** @file Walk completion favourite moments list. */

import type { JSX } from "react";

import { Icon } from "../../../components/icon";
import { SectionHeading } from "../../../components/section-heading";
import { walkCompletionMoments } from "../../../data/stage-four";
import { pickLocalization } from "../../../domain/entities/localization";

type WalkCompleteMomentsProps = {
  readonly heading: string;
  readonly locale: string;
};

export function WalkCompleteMoments({ heading, locale }: WalkCompleteMomentsProps): JSX.Element {
  return (
    <>
      <SectionHeading iconToken="{icon.action.like}" iconClassName="text-pink-400">
        {heading}
      </SectionHeading>
      <div className="space-y-3">
        {walkCompletionMoments.map((moment) => {
          const localized = pickLocalization(moment.localizations, locale);
          return (
            <article
              key={moment.id}
              className="flex items-center gap-4 rounded-2xl border border-base-300/60 bg-base-200/30 p-4"
            >
              <img
                src={moment.imageUrl}
                alt={localized.name}
                className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
              />
              <div className="flex-1 text-start text-base-content">
                <p className="font-semibold">{localized.name}</p>
                <p className="text-sm text-base-content/70">{localized.description}</p>
              </div>
              <Icon token="{icon.object.star}" className="text-amber-300" aria-hidden />
            </article>
          );
        })}
      </div>
    </>
  );
}
