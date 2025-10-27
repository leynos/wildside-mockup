/** @file Offline download management screen with storage overview. */

import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { FontAwesomeIcon } from "../../components/font-awesome-icon";
import { offlineDownloads, offlineSuggestions } from "../../data/stage-four";
import { MobileShell } from "../../layout/mobile-shell";

export function OfflineScreen(): JSX.Element {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState(offlineSuggestions);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <MobileShell tone="dark">
      <div className="flex h-full flex-col">
        <header className="px-6 pt-16 pb-6">
          <div className="mb-5 flex items-center justify-between text-base-100">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/60 bg-base-200/30"
              aria-label="Back"
              onClick={() => navigate({ to: "/saved" })}
            >
              <FontAwesomeIcon name="fa-solid fa-arrow-left" />
            </button>
            <h1 className="text-xl font-semibold">Offline maps</h1>
            <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/60 bg-base-200/30 text-accent"
                  aria-label="Add offline area"
                >
                  <FontAwesomeIcon name="fa-solid fa-plus" />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60" />
                <Dialog.Content className="fixed inset-0 m-auto flex h-fit w-80 flex-col gap-4 rounded-2xl border border-base-300/60 bg-base-100 p-6 shadow-2xl">
                  <Dialog.Title className="text-lg font-semibold text-base-content">
                    Download new area
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-base-content/70">
                    Sync maps for offline access. Search for a city or drop a pin to select a custom
                    region.
                  </Dialog.Description>
                  <input
                    type="search"
                    placeholder="Search cities or regions"
                    className="input input-bordered w-full"
                  />
                  <div className="flex justify-end gap-2">
                    <Dialog.Close asChild>
                      <button type="button" className="btn btn-ghost btn-sm">
                        Cancel
                      </button>
                    </Dialog.Close>
                    <button type="button" className="btn btn-accent btn-sm">
                      Preview download
                    </button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          <section className="rounded-2xl border border-base-300/60 bg-base-200/30 p-4 text-base-content">
            <div className="mb-4 flex items-center gap-3">
              <FontAwesomeIcon name="fa-solid fa-download" className="text-accent" />
              <div>
                <p className="text-sm font-medium text-base-200">Storage overview</p>
                <p className="text-xs text-base-300">Auto-delete unused maps after 30 days</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-base-300">
                  <span>Used</span>
                  <span className="font-semibold text-base-100">2.8 GB of 8 GB</span>
                </div>
                <div className="h-2 w-full rounded-full bg-base-300/60">
                  <div className="h-2 w-[35%] rounded-full bg-accent" />
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-base-300">
                <span className="flex items-center gap-1">
                  <span className="block h-2 w-2 rounded-full bg-accent" />
                  Maps
                </span>
                <span className="flex items-center gap-1">
                  <span className="block h-2 w-2 rounded-full bg-base-300/80" />
                  Available space
                </span>
              </div>
            </div>
          </section>
        </header>

        <main className="flex-1 overflow-y-auto px-6 pb-28 space-y-6">
          {suggestions.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-base-100">Smart travel hints</h2>
              {suggestions.map((suggestion) => (
                <article
                  key={suggestion.id}
                  className={`rounded-2xl border border-base-300/60 bg-gradient-to-r ${suggestion.accentClass} p-4 shadow-lg`}
                >
                  <div className="flex items-start gap-3 text-base-100">
                    <FontAwesomeIcon name={suggestion.icon} className="text-xl" />
                    <div className="flex-1">
                      <h3 className="text-base font-semibold">{suggestion.title}</h3>
                      <p className="mt-1 text-sm text-base-200">{suggestion.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={`${suggestion.accentButtonClass} btn btn-sm`}
                        >
                          {suggestion.callToAction}
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm text-base-200"
                          onClick={() =>
                            setSuggestions((prev) =>
                              prev.filter((item) => item.id !== suggestion.id),
                            )
                          }
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          ) : null}

          <section className="space-y-4">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-base-100">Downloaded areas</h2>
                <p className="text-xs text-base-300">Manage maps for offline navigation</p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() => setDialogOpen(true)}
              >
                Manage
              </button>
            </header>

            <div className="space-y-3">
              {offlineDownloads.map((download) => (
                <article
                  key={download.id}
                  className="flex gap-4 rounded-2xl border border-base-300/60 bg-base-200/20 p-4 shadow-inner shadow-base-300/30"
                >
                  <img
                    src={download.imageUrl}
                    alt={download.title}
                    className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-base-100">{download.title}</h3>
                        <p className="text-xs text-base-300">
                          {download.subtitle} • {download.size}
                        </p>
                      </div>
                      {download.status === "complete" ? (
                        <span className="badge badge-success badge-sm">Complete</span>
                      ) : download.status === "updating" ? (
                        <span className="badge badge-warning badge-sm">Update available</span>
                      ) : download.status === "downloading" ? (
                        <span className="badge badge-info badge-sm">Downloading</span>
                      ) : null}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-1.5 flex-1 rounded-full bg-base-300/60">
                        <div
                          className={`h-1.5 rounded-full ${download.status === "downloading" ? "bg-amber-400" : "bg-accent"}`}
                          style={{ width: `${Math.round(download.progress * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-base-300">
                        {Math.round(download.progress * 100)}%
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </MobileShell>
  );
}
