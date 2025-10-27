/** @file Map itinerary route with route summary and stop details. */

import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { FontAwesomeIcon } from "../../../components/font-awesome-icon";
import { MapBottomNavigation } from "../../../components/map-bottom-navigation";
import { MapViewport } from "../../../components/map-viewport";
import { waterfrontDiscoveryRoute } from "../../../data/map";
import { MobileShell } from "../../../layout/mobile-shell";

function TagPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-accent/40 bg-base-200/60 px-2 py-0.5 text-xs font-medium text-accent">
      {label}
    </span>
  );
}

function StopCard({
  categoryColorClass,
  categoryIcon,
  description,
  name,
  openHours,
  rating,
  tags,
}: (typeof waterfrontDiscoveryRoute.pointsOfInterest)[number]) {
  return (
    <article className="rounded-2xl border border-base-300/50 bg-base-200/80 p-4 shadow-sm shadow-base-300/20">
      <header className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-base-content">{name}</h3>
          <p className="text-sm text-base-content/70">{description}</p>
        </div>
        {rating ? (
          <span className="flex items-center gap-1 text-sm font-semibold text-amber-400">
            <FontAwesomeIcon name="fa-solid fa-star" />
            {rating.toFixed(1)}
          </span>
        ) : null}
      </header>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-2 rounded-full bg-base-300/50 px-3 py-1 text-xs font-semibold text-base-content/80">
          <FontAwesomeIcon name={categoryIcon} className={categoryColorClass} />
          Spotlight
        </span>
        {tags.map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
      </div>
      {openHours ? (
        <p className="mt-3 flex items-center gap-2 text-xs text-base-content/60">
          <FontAwesomeIcon name="fa-regular fa-clock" />
          {openHours}
        </p>
      ) : null}
    </article>
  );
}

export function ItineraryScreen(): JSX.Element {
  const navigate = useNavigate();
  const [isFavourite, setIsFavourite] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <MobileShell
      tone="dark"
      background={
        <MapViewport
          backgroundImageUrl={waterfrontDiscoveryRoute.mapBackgroundUrl}
          backgroundAlt={waterfrontDiscoveryRoute.mapAlt}
          gradientClassName="bg-gradient-to-t from-base-900/80 via-base-900/40 to-transparent"
        >
          <div className="absolute inset-x-0 top-16 flex justify-center">
            <div className="flex w-[80%] items-center justify-between rounded-2xl border border-base-300/60 bg-base-200/80 px-4 py-3 shadow-xl shadow-base-300/30 backdrop-blur">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/70 bg-base-200/70 text-base-content"
                aria-label="Back"
                onClick={() => navigate({ to: "/map/quick" })}
              >
                <FontAwesomeIcon name="fa-solid fa-arrow-left" />
              </button>
              <div className="flex items-center gap-4 text-sm text-base-content/70">
                <div className="text-center">
                  <p className="text-lg font-semibold text-accent">
                    {waterfrontDiscoveryRoute.distance}
                  </p>
                  <p>Distance</p>
                </div>
                <div className="h-12 w-px bg-base-300/60" role="presentation" />
                <div className="text-center">
                  <p className="text-lg font-semibold text-accent">
                    {waterfrontDiscoveryRoute.duration}
                  </p>
                  <p>Walking</p>
                </div>
                <div className="h-12 w-px bg-base-300/60" role="presentation" />
                <div className="text-center">
                  <p className="text-lg font-semibold text-accent">
                    {waterfrontDiscoveryRoute.stopsCount}
                  </p>
                  <p>Stops</p>
                </div>
              </div>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/70 bg-base-200/70 text-base-content"
                aria-label="Locate"
              >
                <FontAwesomeIcon name="fa-solid fa-location-arrow" />
              </button>
            </div>
          </div>
          <div className="absolute right-6 top-36 flex flex-col gap-3">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/70 bg-base-200/70 text-base-content"
              aria-label="Zoom in"
            >
              <FontAwesomeIcon name="fa-solid fa-plus" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/70 bg-base-200/70 text-base-content"
              aria-label="Zoom out"
            >
              <FontAwesomeIcon name="fa-solid fa-minus" />
            </button>
          </div>
        </MapViewport>
      }
    >
      <section className="relative z-20 mt-auto rounded-t-3xl border-t border-base-300/60 bg-base-100/90 px-6 pb-6 pt-8 shadow-inner shadow-base-300/40 backdrop-blur">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-base-content/60">Suggested route</p>
            <h1 className="text-2xl font-semibold text-base-content">
              {waterfrontDiscoveryRoute.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-base-content/60">
              <span className="flex items-center gap-1">
                <FontAwesomeIcon name="fa-solid fa-route" className="text-accent" />
                {waterfrontDiscoveryRoute.distance}
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon name="fa-regular fa-clock" className="text-accent" />
                {waterfrontDiscoveryRoute.duration}
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon name="fa-solid fa-location-dot" className="text-accent" />
                {waterfrontDiscoveryRoute.stopsCount} stops
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <button
              type="button"
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-base-300/60 transition ${
                isFavourite ? "bg-accent text-base-900" : "bg-base-200/70 text-base-content"
              }`}
              aria-pressed={isFavourite}
              onClick={() => setIsFavourite((prev) => !prev)}
            >
              <FontAwesomeIcon name={isFavourite ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
            </button>
            <Dialog.Root open={isDialogOpen} onOpenChange={setDialogOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-base-300/60 bg-base-200/70 px-4 py-2 text-sm font-medium text-base-content"
                >
                  <FontAwesomeIcon name="fa-solid fa-share" />
                  Share
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60" />
                <Dialog.Content className="fixed inset-0 m-auto flex h-fit w-80 flex-col gap-4 rounded-2xl border border-base-300/60 bg-base-100 p-6 shadow-2xl">
                  <Dialog.Title className="text-lg font-semibold text-base-content">
                    Share this walk
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-base-content/70">
                    Copy the preview link or send it to friends once real sharing is hooked up.
                  </Dialog.Description>
                  <div className="rounded-xl border border-base-300/60 bg-base-200/80 p-3 text-xs text-base-content/70">
                    https://wildside.app/routes/{waterfrontDiscoveryRoute.id}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Dialog.Close asChild>
                      <button type="button" className="btn btn-ghost btn-sm">
                        Close
                      </button>
                    </Dialog.Close>
                    <button type="button" className="btn btn-accent btn-sm" disabled>
                      Coming soon
                    </button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </header>
        <section className="space-y-3">
          <p className="text-sm text-base-content/70">{waterfrontDiscoveryRoute.description}</p>
          <div className="flex flex-wrap gap-2">
            {waterfrontDiscoveryRoute.highlights.map((highlight) => (
              <TagPill key={highlight} label={highlight} />
            ))}
          </div>
        </section>
        <section className="mt-6 space-y-4">
          {waterfrontDiscoveryRoute.pointsOfInterest.map((poi) => (
            <StopCard key={poi.id} {...poi} />
          ))}
        </section>
      </section>
      <MapBottomNavigation activeId="map" />
    </MobileShell>
  );
}
