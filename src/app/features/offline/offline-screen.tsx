/** @file Offline download management screen with storage overview. */

import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AppBottomNavigation } from "../../components/app-bottom-navigation";
import { Button } from "../../components/button";
import { FontAwesomeIcon } from "../../components/font-awesome-icon";
import { bottomNavigation } from "../../data/customize";
import { offlineDownloads, offlineSuggestions } from "../../data/stage-four";
import { MobileShell } from "../../layout/mobile-shell";

export function OfflineScreen(): JSX.Element {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState(offlineSuggestions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [downloads, setDownloads] = useState(offlineDownloads);
  const [isManaging, setIsManaging] = useState(false);

  const handleDeleteDownload = (downloadId: string) => {
    setDownloads((current) => current.filter((entry) => entry.id !== downloadId));
  };

  return (
    <MobileShell>
      <div className="flex h-full flex-col">
        <header className="px-6 pt-16 pb-6">
          <div className="mb-5 flex items-center justify-between text-base-content">
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
                    className="w-full rounded-xl border border-base-300/60 bg-base-200/60 px-4 py-3 text-sm text-base-content shadow-inner shadow-base-300/20 placeholder:text-base-content/50 focus:border-accent focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <Dialog.Close asChild>
                      <Button size="sm" variant="ghost">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button size="sm">Preview download</Button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          <section className="rounded-2xl border border-base-300/60 bg-base-200/70 p-4 text-base-content">
            <div className="mb-4 flex items-center gap-3">
              <FontAwesomeIcon name="fa-solid fa-download" className="text-accent" />
              <div>
                <p className="text-sm font-medium text-base-content">Storage overview</p>
                <p className="text-xs text-base-content/70">
                  Auto-delete unused maps after 30 days
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-base-content/70">
                  <span>Used</span>
                  <span className="font-semibold text-base-content">2.8 GB of 8 GB</span>
                </div>
                <div className="h-2 w-full rounded-full bg-base-300/60">
                  <div className="h-2 w-[35%] rounded-full bg-accent" />
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-base-content/60">
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

        <main className="flex-1 space-y-6 overflow-y-auto px-6 pb-28">
          {suggestions.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-base-content">Smart travel hints</h2>
              {suggestions.map((suggestion) => (
                <article
                  key={suggestion.id}
                  className={`rounded-2xl border border-base-300/60 bg-gradient-to-r ${suggestion.accentClass} p-4 shadow-lg`}
                >
                  <div className="flex items-start gap-3 text-base-100">
                    <FontAwesomeIcon
                      name={suggestion.icon}
                      className={`text-xl ${suggestion.iconClassName ?? ""}`.trim()}
                    />
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-base-100">{suggestion.title}</h3>
                      <p className="mt-1 text-sm text-base-100/80">{suggestion.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm">{suggestion.callToAction}</Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="border-white/40 text-base-100 hover:bg-white/10"
                          onClick={() =>
                            setSuggestions((prev) =>
                              prev.filter((item) => item.id !== suggestion.id),
                            )
                          }
                        >
                          Dismiss
                        </Button>
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
                <h2 className="text-base font-semibold text-base-content">Downloaded areas</h2>
                <p className="text-xs text-base-content/70">Manage maps for offline navigation</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                aria-pressed={isManaging}
                onClick={() => setIsManaging((prev) => !prev)}
              >
                {isManaging ? "Done" : "Manage"}
              </Button>
            </header>

            <div className="space-y-3">
              {downloads.map((download) => (
                <article
                  key={download.id}
                  data-testid="offline-download-card"
                  className="relative flex gap-4 rounded-2xl border border-base-300/60 bg-base-100 p-4 shadow-inner shadow-base-300/30"
                >
                  {isManaging ? (
                    <button
                      type="button"
                      data-testid="offline-delete-button"
                      aria-label={`Delete ${download.title}`}
                      className="absolute right-2 top-2 text-base-content/60 transition hover:text-error"
                      onClick={() => handleDeleteDownload(download.id)}
                    >
                      <FontAwesomeIcon name="fa-solid fa-remove" className="text-lg" />
                    </button>
                  ) : null}
                  <img
                    src={download.imageUrl}
                    alt={download.title}
                    className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-base-content">{download.title}</h3>
                        <p className="text-xs text-base-content/70">
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
                      <span className="text-xs text-base-content/70">
                        {Math.round(download.progress * 100)}%
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
        <AppBottomNavigation
          items={bottomNavigation.map((item) => ({
            ...item,
            isActive: item.id === "profile",
          }))}
        />
      </div>
    </MobileShell>
  );
}
