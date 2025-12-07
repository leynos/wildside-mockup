/** @file Offline download management screen with storage overview. */

import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, type ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppBottomNavigation } from "../../components/app-bottom-navigation";
import { Button } from "../../components/button";
import { Icon } from "../../components/icon";
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
import { OfflineAutoManagement } from "./components/offline-auto-management";
import {
  type DownloadEntry,
  type DownloadStatusLabels,
  OfflineDownloadCard,
} from "./components/offline-download-card";
import { OfflineDownloadDialog } from "./components/offline-download-dialog";
import { OfflineStorageOverview } from "./components/offline-storage-overview";
import { OfflineSuggestionCard } from "./components/offline-suggestion-card";
import { useOfflineLocalisations } from "./hooks/use-offline-localizations";

type DownloadStatus = OfflineMapArea["status"];

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

export type OfflineDownloadMetaProps = {
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

  const localisation = useOfflineLocalisations({
    storageUsedFormatted,
    storageTotalFormatted,
    storageAutoDeleteDays,
    suggestionsLength: suggestions.length,
    dialogOpen,
  });

  const {
    navigationCopy,
    storageCopy,
    downloadsCopy,
    suggestionsCopy,
    dialogCopy,
    undoDescriptionDefault,
  } = localisation;

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
    statusCompleteLabel: downloadsCopy.statusCompleteLabel,
    statusUpdatingLabel: downloadsCopy.statusUpdatingLabel,
    statusDownloadingLabel: downloadsCopy.statusDownloadingLabel,
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
            title={navigationCopy.headerTitle}
            subtitle={navigationCopy.headerSubtitle}
            leading={
              <button
                type="button"
                aria-label={navigationCopy.backLabel}
                className="header-nav-button"
                onClick={() => navigate({ to: "/map/quick" })}
              >
                <Icon token="{icon.navigation.back}" aria-hidden className="h-5 w-5" />
              </button>
            }
            trailing={
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  aria-label={navigationCopy.addAreaLabel}
                  className="header-icon-button"
                >
                  <Icon token="{icon.action.add}" aria-hidden className="h-5 w-5" />
                </button>
              </Dialog.Trigger>
            }
          />

          <main className="screen-scroll space-y-6 pt-6">
            <OfflineStorageOverview
              storageHeading={storageCopy.heading}
              storageSubtitle={storageCopy.subtitle}
              storageUsedLabel={storageCopy.usedLabel}
              storageUsedDescription={storageCopy.usedDescription}
              storageMapsLabel={storageCopy.mapsLabel}
              storageAvailableLabel={storageCopy.availableLabel}
              MetaComponent={OfflineDownloadMeta}
            />

            {suggestionsCopy ? (
              <section className="space-y-3">
                <h2 className="text-base font-semibold text-base-content">
                  {suggestionsCopy.heading}
                </h2>
                {suggestions.map((suggestion) => (
                  <OfflineSuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    dismissLabel={suggestionsCopy.dismissLabel}
                    i18nLanguage={i18n.language}
                    onDismiss={() =>
                      setSuggestions((prev) => prev.filter((item) => item.id !== suggestion.id))
                    }
                  />
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
                    {downloadsCopy.downloadsHeading}
                  </h2>
                  <OfflineDownloadMeta>{downloadsCopy.downloadsDescription}</OfflineDownloadMeta>
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
                  {isManaging ? downloadsCopy.doneLabel : downloadsCopy.manageLabel}
                </Button>
              </header>

              <div className="space-y-3">
                {downloads.map((entry) => (
                  <OfflineDownloadCard
                    key={entry.kind === "undo" ? `${entry.area.id}-undo` : entry.area.id}
                    entry={entry}
                    isManaging={isManaging}
                    statusLabels={statusLabels}
                    formatAreaCopy={formatAreaCopy}
                    percentFormatter={percentFormatter}
                    undoDescription={downloadsCopy.undoDescription}
                    undoDescriptionDefault={undoDescriptionDefault}
                    undoButtonLabel={downloadsCopy.undoButtonLabel}
                    MetaComponent={OfflineDownloadMeta}
                    renderStatusBadge={renderStatusBadge}
                    onDelete={handleDeleteDownload}
                    onUndo={handleUndoDownload}
                    t={t}
                  />
                ))}
              </div>
            </section>

            <OfflineAutoManagement
              autoHeading={downloadsCopy.autoHeading}
              autoManagementOptions={autoManagementOptions}
              autoSettings={autoSettings}
              onToggle={handleToggleAutoSetting}
              integerFormatter={integerFormatter}
              i18nLanguage={i18n.language}
              t={t}
            />
          </main>

          <AppBottomNavigation
            aria-label={navigationCopy.bottomNavAriaLabel}
            items={bottomNavigation.map((item) => ({
              ...item,
              label: t(`nav-${item.id}-label`, { defaultValue: item.label }),
              isActive: item.id === "profile",
            }))}
          />
        </div>

        <OfflineDownloadDialog dialogCopy={dialogCopy} />
      </Dialog.Root>
    </MobileShell>
  );
}
