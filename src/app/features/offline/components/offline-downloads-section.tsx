/** @file Downloads list section for offline screen. */

import type { TFunction } from "i18next";
import { type JSX, useCallback } from "react";

import { Button } from "../../../components/button";
import { formatStorageLabel } from "../../../config/offline-metrics";
import type { OfflineMapArea } from "../../../data/stage-four";
import { pickLocalization } from "../../../domain/entities/localization";
import { formatRelativeTime } from "../../../lib/relative-time";
import { getNow } from "../../../lib/time";
import type {
  DownloadEntry,
  DownloadStatusLabels,
  OfflineDownloadMetaProps,
} from "./offline-download-card";
import { OfflineDownloadCard } from "./offline-download-card";

export type OfflineDownloadsSectionProps = {
  readonly downloads: DownloadEntry[];
  readonly isManaging: boolean;
  readonly statusLabels: DownloadStatusLabels;
  readonly percentFormatter: Intl.NumberFormat;
  readonly copy: {
    readonly downloadsHeading: string;
    readonly downloadsDescription: string;
    readonly manageLabel: string;
    readonly doneLabel: string;
    readonly undoDescription: string;
    readonly undoButtonLabel: string;
  };
  readonly undoDescriptionDefault: string;
  readonly MetaComponent: (props: OfflineDownloadMetaProps) => JSX.Element;
  readonly renderStatusBadge: (
    status: OfflineMapArea["status"],
    labels: DownloadStatusLabels,
  ) => JSX.Element | null;
  readonly t: TFunction;
  readonly i18nLanguage: string;
  readonly onDelete: (id: string) => void;
  readonly onUndo: (id: string) => void;
  readonly toggleManaging: () => void;
};

export function OfflineDownloadsSection({
  downloads,
  isManaging,
  statusLabels,
  percentFormatter,
  copy,
  undoDescriptionDefault,
  MetaComponent,
  renderStatusBadge,
  t,
  i18nLanguage,
  onDelete,
  onUndo,
  toggleManaging,
}: OfflineDownloadsSectionProps): JSX.Element {
  const formatAreaCopy = useCallback(
    (area: OfflineMapArea) => {
      const localization = pickLocalization(area.localizations, i18nLanguage);
      const sizeLabel = formatStorageLabel(area.sizeBytes);
      const relativeUpdated = formatRelativeTime(area.lastUpdatedAt, i18nLanguage, getNow());
      const updatedLabel = t("offline-downloads-updated", {
        updated: relativeUpdated,
        defaultValue: `Updated ${relativeUpdated}`,
      });
      return { localization, sizeLabel, updatedLabel };
    },
    [i18nLanguage, t],
  );

  return (
    <section className="space-y-4" aria-labelledby="downloaded-areas-heading">
      <header className="flex items-center justify-between">
        <div>
          <h2 id="downloaded-areas-heading" className="text-base font-semibold text-base-content">
            {copy.downloadsHeading}
          </h2>
          <MetaComponent>{copy.downloadsDescription}</MetaComponent>
        </div>
        <Button size="sm" variant="ghost" aria-pressed={isManaging} onClick={toggleManaging}>
          {isManaging ? copy.doneLabel : copy.manageLabel}
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
            undoDescription={copy.undoDescription}
            undoDescriptionDefault={undoDescriptionDefault}
            undoButtonLabel={copy.undoButtonLabel}
            MetaComponent={MetaComponent}
            renderStatusBadge={renderStatusBadge}
            onDelete={onDelete}
            onUndo={onUndo}
            t={t}
          />
        ))}
      </div>
    </section>
  );
}
