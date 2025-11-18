/** @file Offline download management screen with storage overview. */

import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppBottomNavigation } from "../../components/app-bottom-navigation";
import { Button } from "../../components/button";
import { Icon } from "../../components/icon";
import { PreferenceToggleCard } from "../../components/preference-toggle-card";
import { OFFLINE_STORAGE_DEFAULTS } from "../../config/offline-metrics";
import { bottomNavigation } from "../../data/customize";
import {
  autoManagementOptions,
  type OfflineDownload,
  offlineDownloads,
  offlineSuggestions,
} from "../../data/stage-four";
import { AppHeader } from "../../layout/app-header";
import { MobileShell } from "../../layout/mobile-shell";

type OfflineDownloadMetaProps = {
  readonly as?: "p" | "span" | "div";
  readonly className?: string;
  readonly children: ReactNode;
};

function OfflineDownloadMeta({
  as = "p",
  className,
  children,
}: OfflineDownloadMetaProps): JSX.Element {
  const Tag = as;
  const composedClassName = className
    ? `offline-download__meta ${className}`
    : "offline-download__meta";

  return <Tag className={composedClassName}>{children}</Tag>;
}

export function OfflineScreen(): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState(offlineSuggestions);
  const [dialogOpen, setDialogOpen] = useState(false);
  type DownloadEntry =
    | { kind: "download"; download: OfflineDownload }
    | { kind: "undo"; download: OfflineDownload };

  const [downloads, setDownloads] = useState<DownloadEntry[]>(() =>
    offlineDownloads.map((download) => ({ kind: "download", download })),
  );
  const [isManaging, setIsManaging] = useState(false);
  const [autoSettings, setAutoSettings] = useState<Record<string, boolean>>(() =>
    autoManagementOptions.reduce<Record<string, boolean>>((acc, option) => {
      acc[option.id] = option.defaultEnabled;
      return acc;
    }, {}),
  );
  const storageUsedFormatted = OFFLINE_STORAGE_DEFAULTS.usedLabel;
  const storageTotalFormatted = OFFLINE_STORAGE_DEFAULTS.totalLabel;
  const storageAutoDeleteDays = OFFLINE_STORAGE_DEFAULTS.autoDeleteDays;
  const bottomNavAriaLabel = t("nav-primary-aria-label", { defaultValue: "Primary navigation" });

  const headerTitle = t("offline-header-title", { defaultValue: "Offline Maps" });
  const headerSubtitle = t("offline-header-subtitle", {
    defaultValue: "Manage downloads and smart updates",
  });
  const backLabel = t("offline-header-back-label", { defaultValue: "Back to map" });
  const addAreaLabel = t("offline-header-add-area-label", { defaultValue: "Add offline area" });
  const storageHeading = t("offline-storage-heading", { defaultValue: "Storage overview" });
  const storageSubtitle = t("offline-storage-subtitle", {
    days: storageAutoDeleteDays,
    defaultValue: `Auto-delete unused maps after ${storageAutoDeleteDays} days`,
  });
  const storageUsedLabel = t("offline-storage-used-label", { defaultValue: "Used" });
  const storageUsedDescription = t("offline-storage-used-description", {
    used: storageUsedFormatted,
    total: storageTotalFormatted,
    defaultValue: `${storageUsedFormatted} of ${storageTotalFormatted}`,
  });
  const storageMapsLabel = t("offline-storage-legend-maps", { defaultValue: "Maps" });
  const storageAvailableLabel = t("offline-storage-legend-available", {
    defaultValue: "Available space",
  });
  const suggestionsHeading = t("offline-suggestions-heading", {
    defaultValue: "Smart travel hints",
  });
  const suggestionsDismiss = t("offline-suggestion-dismiss", { defaultValue: "Dismiss" });
  const downloadsHeading = t("offline-downloads-heading", { defaultValue: "Downloaded areas" });
  const downloadsDescription = t("offline-downloads-description", {
    defaultValue: "Manage maps for offline navigation",
  });
  const manageLabel = t("offline-downloads-manage", { defaultValue: "Manage" });
  const doneLabel = t("offline-downloads-done", { defaultValue: "Done" });
  const statusCompleteLabel = t("offline-downloads-status-complete", { defaultValue: "Complete" });
  const statusUpdatingLabel = t("offline-downloads-status-updating", {
    defaultValue: "Update available",
  });
  const statusDownloadingLabel = t("offline-downloads-status-downloading", {
    defaultValue: "Downloading",
  });
  const undoDescription = t("offline-downloads-undo-description", {
    defaultValue: "Tap undo to restore this map.",
  });
  const undoButtonLabel = t("offline-downloads-undo-button", { defaultValue: "Undo" });
  const autoHeading = t("offline-auto-heading", { defaultValue: "Auto-Management" });
  const dialogTitle = t("offline-dialog-title", { defaultValue: "Download new area" });
  const dialogDescription = t("offline-dialog-description", {
    defaultValue:
      "Sync maps for offline access. Search for a city or drop a pin to select a custom region.",
  });
  const dialogSearchPlaceholder = t("offline-dialog-search-placeholder", {
    defaultValue: "Search cities or regions",
  });
  const dialogCancel = t("offline-dialog-cancel", { defaultValue: "Cancel" });
  const dialogPreview = t("offline-dialog-preview", { defaultValue: "Preview download" });

  type DownloadStatus = NonNullable<OfflineDownload["status"]>;

  const statusBadgeByStatus = {
    complete: {
      className: "badge badge-success badge-sm",
      label: statusCompleteLabel,
    },
    updating: {
      className: "badge badge-warning badge-sm",
      label: statusUpdatingLabel,
    },
    downloading: {
      className: "badge badge-info badge-sm",
      label: statusDownloadingLabel,
    },
  } satisfies Record<DownloadStatus, { className: string; label: string }>;

  const isDownloadStatus = (status: OfflineDownload["status"]): status is DownloadStatus => {
    return typeof status === "string" && status in statusBadgeByStatus;
  };

  const renderStatusBadge = (status: OfflineDownload["status"]): JSX.Element | null => {
    if (!isDownloadStatus(status)) {
      return null;
    }

    const config = statusBadgeByStatus[status];
    return <span className={config.className}>{config.label}</span>;
  };

  const handleDeleteDownload = (downloadId: string) => {
    if (!isManaging) return;
    setDownloads((current) =>
      current.map((entry) =>
        entry.download.id === downloadId ? { kind: "undo", download: entry.download } : entry,
      ),
    );
  };

  const handleUndoDownload = (downloadId: string) => {
    setDownloads((current) =>
      current.map((entry) =>
        entry.download.id === downloadId ? { kind: "download", download: entry.download } : entry,
      ),
    );
  };

  const handleToggleAutoSetting = (id: string, next: boolean) => {
    setAutoSettings((current) => ({ ...current, [id]: next }));
  };

  return (
    <MobileShell>
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <div className="screen-stack">
          <AppHeader
            title={headerTitle}
            subtitle={headerSubtitle}
            leading={
              <button
                type="button"
                aria-label={backLabel}
                className="header-nav-button"
                onClick={() => navigate({ to: "/map/quick" })}
              >
                <Icon token="{icon.navigation.back}" aria-hidden className="h-5 w-5" />
              </button>
            }
            trailing={
              <Dialog.Trigger asChild>
                <button type="button" aria-label={addAreaLabel} className="header-icon-button">
                  <Icon token="{icon.action.add}" aria-hidden className="h-5 w-5" />
                </button>
              </Dialog.Trigger>
            }
          />

          <main className="screen-scroll space-y-6 pt-6">
            <section className="offline-overview__panel">
              <div className="mb-4 flex items-center gap-3">
                <Icon token="{icon.action.download}" className="text-accent" aria-hidden />
                <div>
                  <p className="text-sm font-medium text-base-content">{storageHeading}</p>
                  <OfflineDownloadMeta>{storageSubtitle}</OfflineDownloadMeta>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="split-row">
                    <OfflineDownloadMeta as="span">{storageUsedLabel}</OfflineDownloadMeta>
                    <OfflineDownloadMeta as="span" className="font-semibold text-base-content">
                      {storageUsedDescription}
                    </OfflineDownloadMeta>
                  </div>
                  <div className="h-2 w-full rounded-full bg-base-300/60">
                    <div className="h-2 w-[35%] rounded-full bg-accent" />
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-base-content/60">
                  <span className="flex items-center gap-1">
                    <span className="block h-2 w-2 rounded-full bg-accent" />
                    {storageMapsLabel}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="block h-2 w-2 rounded-full bg-base-300/80" />
                    {storageAvailableLabel}
                  </span>
                </div>
              </div>
            </section>

            {suggestions.length > 0 ? (
              <section className="space-y-3">
                <h2 className="text-base font-semibold text-base-content">{suggestionsHeading}</h2>
                {suggestions.map((suggestion) => (
                  <article
                    key={suggestion.id}
                    className={`rounded-2xl border border-base-300/60 bg-gradient-to-r ${suggestion.accentClass} p-4 shadow-lg`}
                  >
                    <div className="flex items-start gap-3 text-base-100">
                      <Icon
                        token={suggestion.iconToken}
                        className={`text-xl ${suggestion.iconClassName ?? ""}`.trim()}
                        aria-hidden
                      />
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-base-100">
                          {t(`offline-suggestion-${suggestion.id}-title`, {
                            defaultValue: suggestion.title,
                          })}
                        </h3>
                        <p className="mt-1 text-sm text-base-100/80">
                          {t(`offline-suggestion-${suggestion.id}-description`, {
                            defaultValue: suggestion.description,
                          })}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button size="sm">
                            {t(`offline-suggestion-${suggestion.id}-cta`, {
                              defaultValue: suggestion.callToAction,
                            })}
                          </Button>
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
                            {suggestionsDismiss}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            ) : null}

            <section className="space-y-4" aria-labelledby="downloaded-areas-heading">
              <header className="flex items-center justify-between">
                <div>
                  <h2
                    id="downloaded-areas-heading"
                    className="text-base font-semibold text-base-content"
                  >
                    {downloadsHeading}
                  </h2>
                  <OfflineDownloadMeta>{downloadsDescription}</OfflineDownloadMeta>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-pressed={isManaging}
                  onClick={() =>
                    setIsManaging((prev) => {
                      if (prev) {
                        setDownloads((current) =>
                          current.filter((entry) => entry.kind === "download"),
                        );
                      }
                      return !prev;
                    })
                  }
                >
                  {isManaging ? doneLabel : manageLabel}
                </Button>
              </header>

              <div className="space-y-3">
                {downloads.map((entry) =>
                  entry.kind === "download" ? (
                    <article
                      key={entry.download.id}
                      data-testid="offline-download-card"
                      className="offline-download__card"
                      aria-labelledby={`${entry.download.id}-title`}
                    >
                      {isManaging ? (
                        <button
                          type="button"
                          data-testid="offline-delete-button"
                          aria-label={t("offline-downloads-delete-aria", {
                            title: entry.download.title,
                            defaultValue: `Delete ${entry.download.title}`,
                          })}
                          className="offline-download__dismiss"
                          onClick={() => handleDeleteDownload(entry.download.id)}
                        >
                          <Icon token="{icon.action.remove}" className="text-lg" aria-hidden />
                        </button>
                      ) : null}
                      <img
                        src={entry.download.imageUrl}
                        alt={entry.download.title}
                        className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="split-row">
                          <div>
                            <h3
                              id={`${entry.download.id}-title`}
                              className="font-semibold text-base-content"
                            >
                              {entry.download.title}
                            </h3>
                            <OfflineDownloadMeta>
                              {entry.download.subtitle} • {entry.download.size}
                            </OfflineDownloadMeta>
                          </div>
                          {renderStatusBadge(entry.download.status)}
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="h-1.5 flex-1 rounded-full bg-base-300/60">
                            <div
                              className={`h-1.5 rounded-full ${entry.download.status === "downloading" ? "bg-amber-400" : "bg-accent"}`}
                              style={{ width: `${Math.round(entry.download.progress * 100)}%` }}
                            />
                          </div>
                          <OfflineDownloadMeta as="span">
                            {Math.round(entry.download.progress * 100)}%
                          </OfflineDownloadMeta>
                        </div>
                      </div>
                    </article>
                  ) : (
                    <article
                      key={`${entry.download.id}-undo`}
                      data-testid="offline-undo-card"
                      className="offline-download__undo"
                      aria-label={t("offline-downloads-undo-aria", {
                        title: entry.download.title,
                        defaultValue: `${entry.download.title} deleted. ${undoDescription}`,
                      })}
                    >
                      <div>
                        <p className="font-semibold">
                          {t("offline-downloads-undo-title", {
                            title: entry.download.title,
                            defaultValue: `${entry.download.title} deleted`,
                          })}
                        </p>
                        <OfflineDownloadMeta>{undoDescription}</OfflineDownloadMeta>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={() => handleUndoDownload(entry.download.id)}
                        data-testid="offline-undo-button"
                      >
                        {undoButtonLabel}
                      </button>
                    </article>
                  ),
                )}
              </div>
            </section>
            <section className="space-y-4">
              <header className="flex items-center gap-3">
                <Icon token="{icon.action.settings}" className="text-accent" aria-hidden />
                <h2 className="text-base font-semibold text-base-content">{autoHeading}</h2>
              </header>
              <div className="space-y-4">
                {autoManagementOptions.map((option) => {
                  const checked = autoSettings[option.id] ?? option.defaultEnabled;
                  const optionParams =
                    option.id === "auto-delete" ? { days: storageAutoDeleteDays } : {};
                  const optionTitle = t(`offline-auto-option-${option.id}-title`, {
                    defaultValue: option.title,
                  });
                  const optionDescription = t(`offline-auto-option-${option.id}-description`, {
                    ...optionParams,
                    defaultValue: option.description,
                  });
                  return (
                    <PreferenceToggleCard
                      key={option.id}
                      id={`auto-management-${option.id}`}
                      iconToken={option.iconToken}
                      iconClassName={option.iconClassName}
                      title={optionTitle}
                      description={optionDescription}
                      isChecked={Boolean(checked)}
                      onCheckedChange={(value) => handleToggleAutoSetting(option.id, value)}
                    />
                  );
                })}
              </div>
            </section>
          </main>

          <AppBottomNavigation
            aria-label={bottomNavAriaLabel}
            items={bottomNavigation.map((item) => ({
              ...item,
              label: t(`nav-${item.id}-label`, { defaultValue: item.label }),
              isActive: item.id === "profile",
            }))}
          />
        </div>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60" />
          <Dialog.Content className="dialog-surface">
            <Dialog.Title className="text-lg font-semibold text-base-content">
              {dialogTitle}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-base-content/70">
              {dialogDescription}
            </Dialog.Description>
            <input
              type="search"
              placeholder={dialogSearchPlaceholder}
              className="offline-search__input"
            />
            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button size="sm" variant="ghost">
                  {dialogCancel}
                </Button>
              </Dialog.Close>
              <Button size="sm">{dialogPreview}</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </MobileShell>
  );
}
