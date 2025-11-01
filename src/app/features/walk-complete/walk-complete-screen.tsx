/** @file Walk completion summary with celebratory toast and recap details. */

import * as Dialog from "@radix-ui/react-dialog";
import * as Toast from "@radix-ui/react-toast";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, useState } from "react";

import { Icon } from "../../components/icon";
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
            <header className="px-6 pt-16 pb-8 text-center text-base-100">
              <div className="mb-6 flex justify-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/20 text-5xl text-amber-300 shadow-inner shadow-amber-400/40">
                  <Icon token="{icon.object.trophy}" className="animate-pulse" aria-hidden />
                </span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">Walk complete!</h1>
              <p className="mt-2 text-base text-base-200">
                Amazing adventure through the city · Hidden Gems Loop
              </p>
            </header>

            <section className="px-6">
              <div className="rounded-3xl border border-base-300/60 bg-base-200/20 p-4 shadow-2xl backdrop-blur">
                <div className="relative h-44 overflow-hidden rounded-2xl border border-base-300/60">
                  <img
                    src={walkCompletionMapImage}
                    alt="Overview of the completed route"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-base-900 shadow">
                    Route completed
                  </span>
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

            <section className="mt-6 px-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {walkCompletionPrimaryStats.map((stat) => (
                  <article
                    key={stat.id}
                    className="rounded-2xl border border-base-300/60 bg-base-200/30 p-4 shadow-inner shadow-base-300/30"
                  >
                    <div className="mb-2 flex items-center gap-3 text-base-300">
                      <Icon token={stat.iconToken} className="text-accent" aria-hidden />
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-semibold text-base-100">{stat.value}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-4 px-6">
              <div className="grid grid-cols-3 gap-3">
                {walkCompletionSecondaryStats.map((stat) => (
                  <article
                    key={stat.id}
                    className="rounded-2xl border border-base-300/60 bg-base-200/30 p-4 text-center"
                  >
                    <Icon token={stat.iconToken} className="mb-2 text-lg text-accent" aria-hidden />
                    <p className="text-lg font-semibold text-base-100">{stat.value}</p>
                    <p className="text-xs text-base-300">{stat.label}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-6 px-6">
              <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-base-100">
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
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-base-100">{moment.name}</p>
                      <p className="text-sm text-base-300">{moment.description}</p>
                    </div>
                    <Icon token="{icon.object.star}" className="text-amber-300" aria-hidden />
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-6 px-6">
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

            <section className="mt-6 px-6">
              <div className="rounded-2xl border border-purple-400/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <Icon token="{icon.object.magic}" className="text-purple-300" aria-hidden />
                  <h3 className="text-base font-semibold text-base-100">Try a remix?</h3>
                </div>
                <p className="text-sm text-base-300">
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

            <section className="mt-8 px-6 pb-12">
              <h3 className="mb-4 text-center text-base font-semibold text-base-100">
                Share your adventure
              </h3>
              <div className="flex justify-center gap-4">
                {walkCompletionShareOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-label={option.label}
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${option.accentClass} text-white shadow`}
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
                <span
                  key={option.id}
                  className="flex items-center gap-2 rounded-full border border-base-300/60 px-3 py-1"
                >
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
