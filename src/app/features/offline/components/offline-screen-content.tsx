/** @file Presentational layout for the offline screen. */

import * as Dialog from "@radix-ui/react-dialog";
import type { TFunction } from "i18next";
import type { Dispatch, JSX, SetStateAction } from "react";

import { AppBottomNavigation } from "../../../components/app-bottom-navigation";
import { bottomNavigation } from "../../../data/customize";
import {
  autoManagementOptions,
  type OfflineMapArea,
  type OfflineSuggestion,
} from "../../../data/stage-four";
import type { OfflineDialogCopy } from "../hooks/use-offline-dialog-copy";
import type { OfflineDownloadsCopy } from "../hooks/use-offline-downloads-copy";
import type { OfflineStorageCopy } from "../hooks/use-offline-storage-copy";
import type { OfflineSuggestionsCopy } from "../hooks/use-offline-suggestions-copy";
import { OfflineAutoManagement } from "./offline-auto-management";
import type {
  DownloadEntry,
  DownloadStatusLabels,
  OfflineDownloadMetaProps,
} from "./offline-download-card";
import { OfflineDownloadDialog } from "./offline-download-dialog";
import { OfflineDownloadsSection } from "./offline-downloads-section";
import { OfflineHeader } from "./offline-header";
import { OfflineStorageOverview } from "./offline-storage-overview";
import { OfflineSuggestionsSection } from "./offline-suggestions-section";

type OfflineScreenContentProps = {
  readonly navigationCopy: {
    readonly headerTitle: string;
    readonly headerSubtitle: string;
    readonly backLabel: string;
    readonly addAreaLabel: string;
    readonly bottomNavAriaLabel: string;
  };
  readonly storageCopy: OfflineStorageCopy;
  readonly suggestions: OfflineSuggestion[];
  readonly suggestionsCopy: OfflineSuggestionsCopy;
  readonly setSuggestions: Dispatch<SetStateAction<OfflineSuggestion[]>>;
  readonly downloads: DownloadEntry[];
  readonly isManaging: boolean;
  readonly statusLabels: DownloadStatusLabels;
  readonly percentFormatter: Intl.NumberFormat;
  readonly downloadsCopy: OfflineDownloadsCopy;
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
  readonly autoSettings: Record<string, boolean>;
  readonly onToggleAuto: (id: string, next: boolean) => void;
  readonly integerFormatter: Intl.NumberFormat;
  readonly dialogCopy: OfflineDialogCopy;
  readonly dialogOpen: boolean;
  readonly setDialogOpen: (next: boolean) => void;
  readonly onBack: () => void;
  readonly activeNavId: string;
};

export function OfflineScreenContent({
  navigationCopy,
  storageCopy,
  suggestions,
  suggestionsCopy,
  setSuggestions,
  downloads,
  isManaging,
  statusLabels,
  percentFormatter,
  downloadsCopy,
  undoDescriptionDefault,
  MetaComponent,
  renderStatusBadge,
  t,
  i18nLanguage,
  onDelete,
  onUndo,
  toggleManaging,
  autoSettings,
  onToggleAuto,
  integerFormatter,
  dialogCopy,
  dialogOpen,
  setDialogOpen,
  onBack,
  activeNavId,
}: OfflineScreenContentProps): JSX.Element {
  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="screen-stack">
        <OfflineHeader
          headerTitle={navigationCopy.headerTitle}
          headerSubtitle={navigationCopy.headerSubtitle}
          backLabel={navigationCopy.backLabel}
          addAreaLabel={navigationCopy.addAreaLabel}
          onBack={onBack}
        />

        <main className="screen-scroll space-y-6 pt-6">
          <OfflineStorageOverview
            storageHeading={storageCopy.heading}
            storageSubtitle={storageCopy.subtitle}
            storageUsedLabel={storageCopy.usedLabel}
            storageUsedDescription={storageCopy.usedDescription}
            storageMapsLabel={storageCopy.mapsLabel}
            storageAvailableLabel={storageCopy.availableLabel}
            MetaComponent={MetaComponent}
          />

          {suggestionsCopy ? (
            <OfflineSuggestionsSection
              suggestions={suggestions}
              heading={suggestionsCopy.heading}
              dismissLabel={suggestionsCopy.dismissLabel}
              i18nLanguage={i18nLanguage}
              onDismiss={(id) => setSuggestions((prev) => prev.filter((item) => item.id !== id))}
            />
          ) : null}

          <OfflineDownloadsSection
            downloads={downloads}
            isManaging={isManaging}
            statusLabels={statusLabels}
            percentFormatter={percentFormatter}
            copy={downloadsCopy}
            undoDescriptionDefault={undoDescriptionDefault}
            MetaComponent={MetaComponent}
            renderStatusBadge={renderStatusBadge}
            t={t}
            i18nLanguage={i18nLanguage}
            onDelete={onDelete}
            onUndo={onUndo}
            toggleManaging={toggleManaging}
          />

          <OfflineAutoManagement
            autoHeading={downloadsCopy.autoHeading}
            autoManagementOptions={autoManagementOptions}
            autoSettings={autoSettings}
            onToggle={onToggleAuto}
            integerFormatter={integerFormatter}
            i18nLanguage={i18nLanguage}
            t={t}
          />
        </main>

        <AppBottomNavigation
          aria-label={navigationCopy.bottomNavAriaLabel}
          items={bottomNavigation.map((item) => ({
            ...item,
            label: t(`nav-${item.id}-label`, { defaultValue: item.label }),
            isActive: item.id === activeNavId,
          }))}
        />
      </div>

      <OfflineDownloadDialog dialogCopy={dialogCopy} />
    </Dialog.Root>
  );
}
