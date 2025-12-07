/** @file Offline download management screen with storage overview. */

import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, type ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppBottomNavigation } from "../../components/app-bottom-navigation";
import { Button } from "../../components/button";
import { Icon } from "../../components/icon";
import { PreferenceToggleCard } from "../../components/preference-toggle-card";
import { formatStorageLabel, OFFLINE_STORAGE_PLACEHOLDERS } from "../../config/offline-metrics";
import { bottomNavigation } from "../../data/customize";
import {
  autoManagementOptions,
  type OfflineMapArea,
  offlineMapAreas,
  offlineSuggestions,
} from "../../data/stage-four";
import { pickLocalization } from "../../domain/entities/localization";
import { AppHeader } from "../../layout/app-header";
import { MobileShell } from "../../layout/mobile-shell";
import { formatRelativeTime } from "../../lib/relative-time";

type DownloadStatus = OfflineMapArea["status"];

type DownloadStatusLabels = {
  statusCompleteLabel: string;
  statusUpdatingLabel: string;
  statusDownloadingLabel: string;
};

type StatusBadgeConfig = { className: string; labelKey: keyof DownloadStatusLabels };

const statusBadgeByStatus = {
  complete: {
    className: "badge badge-success badge-sm",
    labelKey: "statusCompleteLabel",
  },
  updating: {
    className: "badge badge-warning badge-sm",
    labelKey: "statusUpdatingLabel",
  },
  downloading: {
    className: "badge badge-info badge-sm",
    labelKey: "statusDownloadingLabel",
  },
} satisfies Record<DownloadStatus, StatusBadgeConfig>;

const isDownloadStatus = (status: OfflineMapArea["status"]): status is DownloadStatus => {
  return typeof status === "string" && status in statusBadgeByStatus;
};

const renderStatusBadge = (
  status: OfflineMapArea["status"],
  labels: DownloadStatusLabels,
): JSX.Element | null => {
  if (!isDownloadStatus(status)) {
    return null;
  }

  const config = statusBadgeByStatus[status];
  return <span className={config.className}>{labels[config.labelKey]}</span>;
};

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
  const { t, i18n } = useTranslation();
  const [suggestions, setSuggestions] = useState(offlineSuggestions);
  const [dialogOpen, setDialogOpen] = useState(false);
  type DownloadEntry =
    | { kind: "download"; area: OfflineMapArea }
    | { kind: "undo"; area: OfflineMapArea };

  const [downloads, setDownloads] = useState<DownloadEntry[]>(() =>
    offlineMapAreas.map((area) => ({ kind: "download", area })),
  );
  const [isManaging, setIsManaging] = useState(false);
  const [autoSettings, setAutoSettings] = useState<Record<string, boolean>>(() =>
    autoManagementOptions.reduce<Record<string, boolean>>((acc, option) => {
      acc[option.id] = option.defaultEnabled;
      return acc;
    }, {}),
  );
  const storageUsedFormatted = OFFLINE_STORAGE_PLACEHOLDERS.usedLabel;
  const storageTotalFormatted = OFFLINE_STORAGE_PLACEHOLDERS.totalLabel;
  const storageAutoDeleteDays = OFFLINE_STORAGE_PLACEHOLDERS.autoDeleteDays;

  const navigationCopy = useMemo(
    () => ({
      bottomNavAriaLabel: t("nav-primary-aria-label", {
        defaultValue: "Primary navigation",
      }),
      headerTitle: t("offline-header-title", { defaultValue: "Offline Maps" }),
      headerSubtitle: t("offline-header-subtitle", {
        defaultValue: "Manage downloads and smart updates",
      }),
      backLabel: t("offline-header-back-label", {
        defaultValue: "Back to map",
      }),
      addAreaLabel: t("offline-header-add-area-label", {
        defaultValue: "Add offline area",
      }),
    }),
    [t],
  );

  const storageCopy = useMemo(
    () => ({
      heading: t("offline-storage-heading", {
        defaultValue: "Storage overview",
      }),
      subtitle: t("offline-storage-subtitle", {
        days: storageAutoDeleteDays,
        defaultValue: `Auto-delete unused maps after ${storageAutoDeleteDays} days`,
      }),
      usedLabel: t("offline-storage-used-label", { defaultValue: "Used" }),
      usedDescription: t("offline-storage-used-description", {
        used: storageUsedFormatted,
        total: storageTotalFormatted,
        defaultValue: `${storageUsedFormatted} of ${storageTotalFormatted}`,
      }),
      mapsLabel: t("offline-storage-legend-maps", { defaultValue: "Maps" }),
      availableLabel: t("offline-storage-legend-available", {
        defaultValue: "Available space",
      }),
    }),
    [storageAutoDeleteDays, storageTotalFormatted, storageUsedFormatted, t],
  );

  const undoDescriptionDefault = "Tap undo to restore this map.";

  const downloadsCopy = useMemo(
    () => ({
      downloadsHeading: t("offline-downloads-heading", {
        defaultValue: "Downloaded areas",
      }),
      downloadsDescription: t("offline-downloads-description", {
        defaultValue: "Manage maps for offline navigation",
      }),
      manageLabel: t("offline-downloads-manage", { defaultValue: "Manage" }),
      doneLabel: t("offline-downloads-done", { defaultValue: "Done" }),
      statusCompleteLabel: t("offline-downloads-status-complete", {
        defaultValue: "Complete",
      }),
      statusUpdatingLabel: t("offline-downloads-status-updating", {
        defaultValue: "Update available",
      }),
      statusDownloadingLabel: t("offline-downloads-status-downloading", {
        defaultValue: "Downloading",
      }),
      undoDescription: t("offline-downloads-undo-description", {
        defaultValue: undoDescriptionDefault,
      }),
      undoButtonLabel: t("offline-downloads-undo-button", {
        defaultValue: "Undo",
      }),
      autoHeading: t("offline-auto-heading", {
        defaultValue: "Auto-Management",
      }),
    }),
    [t],
  );

  const suggestionsCopy = useMemo(() => {
    if (suggestions.length === 0) {
      return null;
    }
    return {
      heading: t("offline-suggestions-heading", {
        defaultValue: "Smart travel hints",
      }),
      dismissLabel: t("offline-suggestion-dismiss", {
        defaultValue: "Dismiss",
      }),
    } as const;
  }, [suggestions.length, t]);

  const dialogCopy = useMemo(() => {
    if (!dialogOpen) {
      return null;
    }
    return {
      title: t("offline-dialog-title", { defaultValue: "Download new area" }),
      description: t("offline-dialog-description", {
        defaultValue:
          "Sync maps for offline access. Search for a city or drop a pin to select a custom region.",
      }),
      searchPlaceholder: t("offline-dialog-search-placeholder", {
        defaultValue: "Search cities or regions",
      }),
      cancelLabel: t("offline-dialog-cancel", { defaultValue: "Cancel" }),
      previewLabel: t("offline-dialog-preview", {
        defaultValue: "Preview download",
      }),
    } as const;
  }, [dialogOpen, t]);

  const { bottomNavAriaLabel, headerTitle, headerSubtitle, backLabel, addAreaLabel } =
    navigationCopy;
  const {
    heading: storageHeading,
    subtitle: storageSubtitle,
    usedLabel: storageUsedLabel,
    usedDescription: storageUsedDescription,
    mapsLabel: storageMapsLabel,
    availableLabel: storageAvailableLabel,
  } = storageCopy;
  const {
    downloadsHeading,
    downloadsDescription,
    manageLabel,
    doneLabel,
    statusCompleteLabel,
    statusUpdatingLabel,
    statusDownloadingLabel,
    undoDescription,
    undoButtonLabel,
    autoHeading,
  } = downloadsCopy;

  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        style: "percent",
        maximumFractionDigits: 0,
      }),
    [i18n.language],
  );

  const integerFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        maximumFractionDigits: 0,
      }),
    [i18n.language],
  );

  const formatAreaCopy = (area: OfflineMapArea) => {
    const localization = pickLocalization(area.localizations, i18n.language);
    const sizeLabel = formatStorageLabel(area.sizeBytes);
    const relativeUpdated = formatRelativeTime(area.lastUpdatedAt, i18n.language);
    const updatedLabel = t("offline-downloads-updated", {
      updated: relativeUpdated,
      defaultValue: `Updated ${relativeUpdated}`,
    });
    return { localization, sizeLabel, updatedLabel };
  };

  const statusLabels: DownloadStatusLabels = {
    statusCompleteLabel,
    statusUpdatingLabel,
    statusDownloadingLabel,
  };

  const handleDeleteDownload = (downloadId: string) => {
    if (!isManaging) return;
    setDownloads((current) =>
      current.map((entry) =>
        entry.area.id === downloadId ? { kind: "undo", area: entry.area } : entry,
      ),
    );
  };

  const handleUndoDownload = (downloadId: string) => {
    setDownloads((current) =>
      current.map((entry) =>
        entry.area.id === downloadId ? { kind: "download", area: entry.area } : entry,
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

            {suggestions.length > 0 && suggestionsCopy ? (
              <section className="space-y-3">
                <h2 className="text-base font-semibold text-base-content">
                  {suggestionsCopy.heading}
                </h2>
                {suggestions.map((suggestion) => {
                  const suggestionCopy = pickLocalization(suggestion.localizations, i18n.language);
                  const ctaCopy = pickLocalization(suggestion.ctaLocalizations, i18n.language);
                  return (
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
                            {suggestionCopy.name}
                          </h3>
                          <p className="mt-1 text-sm text-base-100/80">
                            {suggestionCopy.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button size="sm">{ctaCopy.name}</Button>
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
                              {suggestionsCopy.dismissLabel}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
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
                {downloads.map((entry) => {
                  const area = entry.area;
                  const { localization, sizeLabel, updatedLabel } = formatAreaCopy(area);
                  const progressPercent = percentFormatter.format(area.progress);

                  return entry.kind === "download" ? (
                    <article
                      key={area.id}
                      data-testid="offline-download-card"
                      className="offline-download__card"
                      aria-labelledby={`${area.id}-title`}
                    >
                      {isManaging ? (
                        <button
                          type="button"
                          data-testid="offline-delete-button"
                          aria-label={t("offline-downloads-delete-aria", {
                            title: localization.name,
                            defaultValue: `Delete ${localization.name}`,
                          })}
                          className="offline-download__dismiss"
                          onClick={() => handleDeleteDownload(area.id)}
                        >
                          <Icon token="{icon.action.remove}" className="text-lg" aria-hidden />
                        </button>
                      ) : null}
                      <img
                        src={area.image.url}
                        alt={area.image.alt}
                        className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="split-row">
                          <div>
                            <h3 id={`${area.id}-title`} className="font-semibold text-base-content">
                              {localization.name}
                            </h3>
                            <OfflineDownloadMeta>
                              {updatedLabel} • {sizeLabel}
                            </OfflineDownloadMeta>
                          </div>
                          {renderStatusBadge(area.status, statusLabels)}
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="h-1.5 flex-1 rounded-full bg-base-300/60">
                            <div
                              className={`h-1.5 rounded-full ${area.status === "downloading" ? "bg-amber-400" : "bg-accent"}`}
                              style={{
                                width: `${Math.round(area.progress * 100)}%`,
                              }}
                            />
                          </div>
                          <OfflineDownloadMeta as="span">{progressPercent}</OfflineDownloadMeta>
                        </div>
                      </div>
                    </article>
                  ) : (
                    <article
                      key={`${area.id}-undo`}
                      data-testid="offline-undo-card"
                      className="offline-download__undo"
                      aria-label={t("offline-downloads-undo-aria", {
                        title: localization.name,
                        description: undoDescriptionDefault,
                        defaultValue: "{{title}} deleted. {{description}}",
                      })}
                    >
                      <div>
                        <p className="font-semibold">
                          {t("offline-downloads-undo-title", {
                            title: localization.name,
                            defaultValue: `${localization.name} deleted`,
                          })}
                        </p>
                        <OfflineDownloadMeta>{undoDescription}</OfflineDownloadMeta>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={() => handleUndoDownload(area.id)}
                        data-testid="offline-undo-button"
                      >
                        {undoButtonLabel}
                      </button>
                    </article>
                  );
                })}
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
                  const optionLocalization = pickLocalization(option.localizations, i18n.language);
                  const retentionLabel =
                    option.retentionDays != null
                      ? t("offline-auto-option-retention", {
                          count: option.retentionDays,
                          days: integerFormatter.format(option.retentionDays),
                          defaultValue: `${integerFormatter.format(option.retentionDays)} days`,
                        })
                      : null;
                  const optionDescription =
                    optionLocalization.description ??
                    (retentionLabel
                      ? t("offline-auto-option-auto-delete-description", {
                          days: retentionLabel,
                          defaultValue: `Remove maps after ${retentionLabel}`,
                        })
                      : "");
                  return (
                    <PreferenceToggleCard
                      key={option.id}
                      id={`auto-management-${option.id}`}
                      iconToken={option.iconToken}
                      iconClassName={option.iconClassName}
                      title={optionLocalization.name}
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
              {dialogCopy?.title ?? "Download new area"}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-base-content/70">
              {dialogCopy?.description ??
                "Sync maps for offline access. Search for a city or drop a pin to select a custom region."}
            </Dialog.Description>
            <input
              type="search"
              placeholder={dialogCopy?.searchPlaceholder ?? "Search cities or regions"}
              className="offline-search__input"
            />
            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button size="sm" variant="ghost">
                  {dialogCopy?.cancelLabel ?? "Cancel"}
                </Button>
              </Dialog.Close>
              <Button size="sm">{dialogCopy?.previewLabel ?? "Preview download"}</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </MobileShell>
  );
}
