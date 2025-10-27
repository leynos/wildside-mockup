/** @file Saved walk detail page derived from the Stage 2 mockup. */

import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { FontAwesomeIcon } from "../../../components/font-awesome-icon";
import { MapBottomNavigation } from "../../../components/map-bottom-navigation";
import { savedRoutes } from "../../../data/map";
import { MobileShell } from "../../../layout/mobile-shell";

const [savedRoute] = savedRoutes;

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-semibold text-base-content">{value}</p>
      <p className="text-xs text-base-content/60">{label}</p>
    </div>
  );
}

export function SavedScreen(): JSX.Element {
  const navigate = useNavigate();
  const [isFavourite, setIsFavourite] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <MobileShell tone="dark">
      <div className="relative flex-1 overflow-y-auto">
        <header className="relative h-64 overflow-hidden">
          <img
            src={savedRoute.coverImageUrl}
            alt={`${savedRoute.title} hero`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-900 via-base-900/10 to-transparent" />
          <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4">
            <button
              type="button"
              onClick={() => navigate({ to: "/map/quick" })}
              aria-label="Back"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-base-900/60 text-base-100"
            >
              <FontAwesomeIcon name="fa-solid fa-arrow-left" />
            </button>
            <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  aria-label="Share"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-base-900/60 text-base-100"
                >
                  <FontAwesomeIcon name="fa-solid fa-share" />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60" />
                <Dialog.Content className="fixed inset-0 m-auto flex h-fit w-80 flex-col gap-4 rounded-2xl border border-base-300/60 bg-base-100 p-6 shadow-2xl">
                  <Dialog.Title className="text-lg font-semibold text-base-content">
                    Share saved walk
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-base-content/70">
                    Sharing is not wired up yet, but this is where the integration will live.
                  </Dialog.Description>
                  <div className="rounded-xl border border-base-300/60 bg-base-200/80 p-3 text-xs text-base-content/70">
                    https://wildside.app/routes/{savedRoute.id}
                  </div>
                  <Dialog.Close asChild>
                    <button type="button" className="btn btn-accent btn-sm self-end">
                      Close
                    </button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
          <div className="absolute bottom-6 left-6 right-6 text-base-100">
            <h1 className="text-2xl font-semibold">{savedRoute.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-base-100/80">
              <span className="flex items-center gap-1">
                <FontAwesomeIcon name="fa-solid fa-route" className="text-accent" />
                {savedRoute.distance}
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon name="fa-regular fa-clock" className="text-accent" />
                {savedRoute.duration}
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon name="fa-solid fa-location-dot" className="text-accent" />
                {savedRoute.stopsCount} stops
              </span>
            </div>
          </div>
        </header>

        <section className="space-y-6 bg-base-100 px-6 pb-28 pt-6 text-base-content">
          <div className="grid grid-cols-4 gap-4">
            <Metric label="Rating" value={savedRoute.rating.toFixed(1)} />
            <Metric label="Saves" value={savedRoute.saves.toString()} />
            <Metric label="Difficulty" value={savedRoute.difficulty} />
            <Metric label="Updated" value={savedRoute.updatedAgo} />
          </div>

          <div className="flex flex-wrap gap-2">
            {savedRoute.highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-accent/40 bg-base-200/80 px-3 py-1 text-xs font-medium text-accent"
              >
                {highlight}
              </span>
            ))}
          </div>

          <p className="text-sm text-base-content/70">{savedRoute.description}</p>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Route stops</h2>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm font-semibold text-base-900"
              >
                <FontAwesomeIcon name="fa-solid fa-play" />
                Start walk
              </button>
            </div>
            {savedRoute.pointsOfInterest.map((poi) => (
              <article
                key={poi.id}
                className="rounded-2xl border border-base-300/60 bg-base-200/70 p-4"
              >
                <header className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-base-content">{poi.name}</h3>
                  {poi.rating ? (
                    <span className="flex items-center gap-1 text-sm font-semibold text-amber-400">
                      <FontAwesomeIcon name="fa-solid fa-star" />
                      {poi.rating.toFixed(1)}
                    </span>
                  ) : null}
                </header>
                <p className="mt-2 text-sm text-base-content/70">{poi.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {poi.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-base-300/60 bg-base-100 px-2 py-0.5 text-xs text-base-content/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {poi.openHours ? (
                  <p className="mt-3 flex items-center gap-2 text-xs text-base-content/60">
                    <FontAwesomeIcon name="fa-regular fa-clock" />
                    {poi.openHours}
                  </p>
                ) : null}
              </article>
            ))}
          </section>
        </section>
      </div>

      <div className="absolute bottom-28 right-6 z-30">
        <button
          type="button"
          className={`flex h-16 w-16 items-center justify-center rounded-full border border-base-300/60 text-base-100 shadow-xl transition ${
            isFavourite ? "bg-accent text-base-900" : "bg-base-900/80"
          }`}
          aria-pressed={isFavourite}
          onClick={() => setIsFavourite((prev) => !prev)}
        >
          <FontAwesomeIcon name={isFavourite ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"} />
        </button>
      </div>

      <MapBottomNavigation activeId="saved" />
    </MobileShell>
  );
}
