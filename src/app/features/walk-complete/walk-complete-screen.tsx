/** @file Walk completion summary with celebratory toast and recap details. */

import * as Dialog from "@radix-ui/react-dialog";
import * as Toast from "@radix-ui/react-toast";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, useState } from "react";

import { Icon } from "../../components/icon";
import { SectionHero } from "../../components/section-hero";
import {
  walkCompletionMapImage,
  walkCompletionMoments,
  walkCompletionPrimaryStats,
  walkCompletionSecondaryStats,
  walkCompletionShareOptions,
} from "../../data/stage-four";
import { MobileShell } from "../../layout/mobile-shell";

export function WalkCompleteScreen(): JSX.Element {
  const navigate = useNavigate();
  const [toastOpen, setToastOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <Toast.Provider swipeDirection="right">
      <MobileShell tone="dark">
        <div className="relative flex h-full flex-col">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(74,240,213,0.12),_transparent_55%)]" />
          <main className="relative z-10 flex-1 overflow-y-auto pb-28">
            <div className="px-6 pt-16 pb-8">
              <SectionHero
                iconToken="{icon.object.trophy}"
                iconClassName="animate-pulse"
                title="Walk complete!"
                description="Amazing adventure through the city · Hidden Gems Loop"
                badgeTone="celebration"
              />
            </div>

            <section className="px-6">
              <div className="walk-complete__hero-card">
                <div className="relative h-44 overflow-hidden rounded-2xl border border-base-300/60">
                  <img
                    src={walkCompletionMapImage}
                    alt="Overview of the completed route"
                    className="h-full w-full object-cover"
                  />
                  <span className="walk-complete__badge">Route completed</span>
                  <div className="absolute bottom-4 right-4 flex -space-x-2">
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

            <section className="walk-complete__section">
              <div className="grid gap-4 sm:grid-cols-2">
                {walkCompletionPrimaryStats.map((stat) => (
                  <article key={stat.id} className="walk-complete__stat-card text-base-content">
                    <div className="mb-2 flex items-center gap-3 text-base-content/70">
                      <Icon token={stat.iconToken} className="text-accent" aria-hidden />
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="walk-complete__section walk-complete__section--compact">
              <div className="grid grid-cols-3 gap-3">
                {walkCompletionSecondaryStats.map((stat) => (
                  <article
                    key={stat.id}
                    className="rounded-2xl border border-base-300/60 bg-base-200/30 p-4 text-center"
                  >
                    <Icon token={stat.iconToken} className="mb-2 text-lg text-accent" aria-hidden />
                    <p className="text-lg font-semibold text-base-content">{stat.value}</p>
                    <p className="text-xs text-base-content/70">{stat.label}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="walk-complete__section">
              <h2 className="section-heading section-heading--spacious mb-4 text-base-content">
                <Icon token="{icon.action.like}" className="text-pink-400" aria-hidden />
                Favourite moments
              </h2>
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
                    <div className="flex-1 text-left text-base-content">
                      <p className="font-semibold">{moment.name}</p>
                      <p className="text-sm text-base-content/70">{moment.description}</p>
                    </div>
                    <Icon token="{icon.object.star}" className="text-amber-300" aria-hidden />
                  </article>
                ))}
              </div>
            </section>

            <section className="walk-complete__section">
              <div className="space-y-3">
                <button
                  type="button"
                  className="btn btn-accent btn-lg w-full justify-center gap-3 text-base-900"
                  onClick={() => setToastOpen(true)}
                >
                  <Icon token="{icon.object.star}" aria-hidden />
                  Rate this walk
                </button>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    className="btn btn-outline w-full justify-center gap-2"
                    onClick={() => setShareOpen(true)}
                  >
                    <Icon token="{icon.action.share}" aria-hidden />
                    Share
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline w-full justify-center gap-2"
                    onClick={() => navigate({ to: "/saved" })}
                  >
                    <Icon token="{icon.action.save}" aria-hidden />
                    Save route
                  </button>
                </div>
              </div>
            </section>

            <section className="walk-complete__section">
              <div className="rounded-2xl border border-purple-400/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 text-base-content">
                <div className="mb-3 flex items-center gap-3">
                  <Icon token="{icon.object.magic}" className="text-purple-300" aria-hidden />
                  <h3 className="text-base font-semibold">Try a remix?</h3>
                </div>
                <p className="text-sm text-base-content/70">
                  Generate a new route keeping your favourite spots but discovering new hidden gems.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm mt-4"
                  onClick={() => navigate({ to: "/wizard/step-1" })}
                >
                  Remix this walk
                </button>
              </div>
            </section>

            <section className="walk-complete__section walk-complete__section--spacious pb-12">
              <h3 className="mb-4 text-center text-base font-semibold text-base-content">
                Share your adventure
              </h3>
              <div className="flex justify-center gap-4">
                {walkCompletionShareOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-label={option.label}
                    className={`walk-share__icon ${option.accentClass}`}
                  >
                    <Icon token={option.iconToken} aria-hidden />
                  </button>
                ))}
              </div>
            </section>
          </main>
        </div>
      </MobileShell>

      <Dialog.Root open={shareOpen} onOpenChange={setShareOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60" />
          <Dialog.Content className="dialog-surface">
            <Dialog.Title className="text-lg font-semibold text-base-content">
              Share highlights
            </Dialog.Title>
            <Dialog.Description className="text-sm text-base-content/70">
              Export a highlight reel with your favourite stops and stats.
            </Dialog.Description>
            <div className="flex flex-wrap gap-2 text-sm text-base-content/80">
              {walkCompletionShareOptions.map((option) => (
                <span key={option.id} className="walk-share__option">
                  <Icon token={option.iconToken} aria-hidden />
                  {option.label}
                </span>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <button type="button" className="btn btn-ghost btn-sm">
                  Cancel
                </button>
              </Dialog.Close>
              <button type="button" className="btn btn-accent btn-sm">
                Generate reel
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
          <span className="font-semibold">Thanks! Rating saved for future suggestions.</span>
        </div>
      </Toast.Root>
      <Toast.Viewport className="pointer-events-none fixed inset-x-0 bottom-4 flex flex-col gap-3 px-4 sm:items-end" />
    </Toast.Provider>
  );
}
