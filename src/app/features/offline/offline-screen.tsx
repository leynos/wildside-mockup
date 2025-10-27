/** @file Offline download management screen with storage overview. */

import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AppBottomNavigation } from "../../components/app-bottom-navigation";
import { Button } from "../../components/button";
import { FontAwesomeIcon } from "../../components/font-awesome-icon";
import { bottomNavigation } from "../../data/customize";
import { autoManagementOptions, offlineDownloads, offlineSuggestions } from "../../data/stage-four";
import { AppHeader } from "../../layout/app-header";
import { MobileShell } from "../../layout/mobile-shell";

export function OfflineScreen(): JSX.Element {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState(offlineSuggestions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [downloads, setDownloads] = useState(offlineDownloads);
  const [isManaging, setIsManaging] = useState(false);
  const [autoSettings, setAutoSettings] = useState<Record<string, boolean>>(() =>
    autoManagementOptions.reduce<Record<string, boolean>>((acc, option) => {
      acc[option.id] = option.defaultEnabled;
      return acc;
    }, {}),
  );

  const handleDeleteDownload = (downloadId: string) => {
    setDownloads((current) => current.filter((entry) => entry.id !== downloadId));
  };

  const handleToggleAutoSetting = (id: string, next: boolean) => {
    setAutoSettings((current) => ({ ...current, [id]: next }));
  };

  return (
    <MobileShell>
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <div className="flex h-full flex-col">
          <AppHeader
            title="Offline Maps"
            subtitle="Manage downloads and smart updates"
            leading={
              <button
                type="button"
                aria-label="Back to saved routes"
                className="flex h-full w-full items-center justify-center"
                onClick={() => navigate({ to: "/saved" })}
              >
                <FontAwesomeIcon name="fa-solid fa-arrow-left" />
              </button>
            }
            trailing={
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  aria-label="Add offline area"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/60 bg-base-200/30 text-accent transition hover:border-accent/60 hover:text-accent"
                >
                  <FontAwesomeIcon name="fa-solid fa-plus" />
                </button>
              </Dialog.Trigger>
            }
          />

          <main className="flex-1 space-y-6 overflow-y-auto px-6 pb-28 pt-6">
            <section className="rounded-2xl border border-base-300/60 bg-base-200/70 p-4 text-base-content shadow-sm shadow-base-300/20">
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
                        <h3 className="text-base font-semibold text-base-100">
                          {suggestion.title}
                        </h3>
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
            <section className="space-y-4">
              <header className="flex items-center gap-3">
                <FontAwesomeIcon name="fa-solid fa-cog" className="text-accent" />
                <h2 className="text-base font-semibold text-base-content">Auto-Management</h2>
              </header>
              <div className="space-y-4">
                {autoManagementOptions.map((option) => {
                  const checked = autoSettings[option.id];
                  return (
                    <article
                      key={option.id}
                      className="rounded-2xl border border-base-300/60 bg-base-200/70 p-4 shadow-sm shadow-base-300/20"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-1 items-start gap-3">
                          <FontAwesomeIcon
                            name={option.icon}
                            className={`${option.iconClassName} text-lg`}
                          />
                          <div>
                            <h3 className="text-sm font-semibold text-base-content">
                              {option.title}
                            </h3>
                            <p className="mt-1 text-sm text-base-content/70">
                              {option.description}
                            </p>
                          </div>
                        </div>
                        <Switch.Root
                          checked={checked}
                          onCheckedChange={(value) => handleToggleAutoSetting(option.id, value)}
                          className="relative inline-flex h-6 w-11 items-center rounded-full border border-base-300/60 bg-base-200/60 transition data-[state=checked]:bg-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
                          data-testid={`auto-management-switch-${option.id}`}
                        >
                          <Switch.Thumb className="block h-5 w-5 translate-x-[2px] rounded-full bg-base-100 shadow transition-transform duration-200 data-[state=checked]:translate-x-[22px]" />
                        </Switch.Root>
                      </div>
                    </article>
                  );
                })}
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
    </MobileShell>
  );
}
