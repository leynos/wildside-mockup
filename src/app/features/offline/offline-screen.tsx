/** @file Offline download management screen with storage overview. */
import { useNavigate } from "@tanstack/react-router";
import { type JSX, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { OFFLINE_STORAGE_PLACEHOLDERS } from "../../config/offline-metrics";
import {
  autoManagementOptions,
  type OfflineMapArea,
  offlineMapAreas,
  offlineSuggestions,
} from "../../data/stage-four";
import { MobileShell } from "../../layout/mobile-shell";
import type * as OfflineDownloadCard from "./components/offline-download-card";
import { OfflineScreenContent } from "./components/offline-screen-content";
import { useOfflineDialogCopy } from "./hooks/use-offline-dialog-copy";
import { useOfflineDownloadsCopy } from "./hooks/use-offline-downloads-copy";
import { useOfflineDownloadsState } from "./hooks/use-offline-downloads-state";
import { useOfflineNavigationCopy } from "./hooks/use-offline-navigation-copy";
import { useOfflineStorageCopy } from "./hooks/use-offline-storage-copy";
import { useOfflineSuggestionsCopy } from "./hooks/use-offline-suggestions-copy";

// biome-ignore format: compact status map to keep file concise.
const statusBadgeByStatus = { complete: { className: "badge badge-success badge-sm", labelKey: "statusCompleteLabel" }, updating: { className: "badge badge-warning badge-sm", labelKey: "statusUpdatingLabel" }, downloading: { className: "badge badge-info badge-sm", labelKey: "statusDownloadingLabel" } } as const;

const isDownloadStatus = (
  status: OfflineMapArea["status"],
): status is keyof typeof statusBadgeByStatus =>
  typeof status === "string" && status in statusBadgeByStatus;

const renderStatusBadge = (
  status: OfflineMapArea["status"],
  labels: OfflineDownloadCard.DownloadStatusLabels,
): JSX.Element | null => {
  if (!isDownloadStatus(status)) return null;
  const config = statusBadgeByStatus[status];
  return <span className={config.className}>{labels[config.labelKey]}</span>;
};
const OfflineDownloadMeta = ({
  as = "p",
  className,
  children,
}: OfflineDownloadCard.OfflineDownloadMetaProps): JSX.Element => {
  const Tag = as;
  const composedClassName = className
    ? `offline-download__meta ${className}`
    : "offline-download__meta";
  return <Tag className={composedClassName}>{children}</Tag>;
};

export function OfflineScreen(): JSX.Element {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [suggestions, setSuggestions] = useState(offlineSuggestions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [autoSettings, setAutoSettings] = useState<Record<string, boolean>>(() =>
    autoManagementOptions.reduce<Record<string, boolean>>((acc, option) => {
      acc[option.id] = option.defaultEnabled;
      return acc;
    }, {}),
  );
  const { downloads, isManaging, handleDeleteDownload, handleUndoDownload, toggleManaging } =
    useOfflineDownloadsState(offlineMapAreas);

  const percentFormatter = useMemo(
    () => new Intl.NumberFormat(i18n.language, { style: "percent", maximumFractionDigits: 0 }),
    [i18n.language],
  );
  const integerFormatter = useMemo(
    () => new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }),
    [i18n.language],
  );
  const navigationCopy = useOfflineNavigationCopy();
  const storageCopy = useOfflineStorageCopy(
    OFFLINE_STORAGE_PLACEHOLDERS.usedLabel,
    OFFLINE_STORAGE_PLACEHOLDERS.totalLabel,
    OFFLINE_STORAGE_PLACEHOLDERS.autoDeleteDays,
  );
  const { copy: downloadsCopy, undoDescriptionDefault } = useOfflineDownloadsCopy();
  const suggestionsCopy = useOfflineSuggestionsCopy(suggestions.length);
  const dialogCopy = useOfflineDialogCopy(dialogOpen);
  const statusLabels: OfflineDownloadCard.DownloadStatusLabels = {
    statusCompleteLabel: downloadsCopy.statusCompleteLabel,
    statusUpdatingLabel: downloadsCopy.statusUpdatingLabel,
    statusDownloadingLabel: downloadsCopy.statusDownloadingLabel,
  };

  const onToggleAuto = useCallback(
    (id: string, next: boolean) => setAutoSettings((current) => ({ ...current, [id]: next })),
    [],
  );

  const onBack = useCallback(() => navigate({ to: "/map/quick" }), [navigate]);

  return (
    <MobileShell>
      <OfflineScreenContent
        navigationCopy={navigationCopy}
        storageCopy={storageCopy}
        suggestions={suggestions}
        suggestionsCopy={suggestionsCopy}
        setSuggestions={setSuggestions}
        downloads={downloads}
        isManaging={isManaging}
        statusLabels={statusLabels}
        percentFormatter={percentFormatter}
        downloadsCopy={downloadsCopy}
        undoDescriptionDefault={undoDescriptionDefault}
        MetaComponent={OfflineDownloadMeta}
        renderStatusBadge={renderStatusBadge}
        t={t}
        i18nLanguage={i18n.language}
        onDelete={handleDeleteDownload}
        onUndo={handleUndoDownload}
        toggleManaging={toggleManaging}
        autoSettings={autoSettings}
        onToggleAuto={onToggleAuto}
        integerFormatter={integerFormatter}
        dialogCopy={dialogCopy}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        onBack={onBack}
      />
    </MobileShell>
  );
}
