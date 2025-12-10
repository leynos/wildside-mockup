/** @file Storage overview panel for offline downloads. */

import type { JSX, ReactNode } from "react";

import { Icon } from "../../../components/icon";

type OfflineDownloadMetaComponent = (props: {
  readonly as?: "p" | "span" | "div";
  readonly className?: string;
  readonly children: ReactNode;
}) => JSX.Element;

export type OfflineStorageOverviewProps = {
  readonly storageHeading: string;
  readonly storageSubtitle: string;
  readonly storageUsedLabel: string;
  readonly storageUsedDescription: string;
  readonly storageMapsLabel: string;
  readonly storageAvailableLabel: string;
  readonly MetaComponent: OfflineDownloadMetaComponent;
};

export function OfflineStorageOverview({
  storageHeading,
  storageSubtitle,
  storageUsedLabel,
  storageUsedDescription,
  storageMapsLabel,
  storageAvailableLabel,
  MetaComponent,
}: OfflineStorageOverviewProps): JSX.Element {
  return (
    <section className="offline-overview__panel">
      <div className="mb-4 flex items-center gap-3">
        <Icon token="{icon.action.download}" className="text-accent" aria-hidden />
        <div>
          <p className="text-sm font-medium text-base-content">{storageHeading}</p>
          <MetaComponent>{storageSubtitle}</MetaComponent>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <div className="split-row">
            <MetaComponent as="span">{storageUsedLabel}</MetaComponent>
            <MetaComponent as="span" className="font-semibold text-base-content">
              {storageUsedDescription}
            </MetaComponent>
          </div>
          <div className="h-2 w-full rounded-full bg-base-300/60">
            {/* Placeholder: 35% progress until real storage API is wired */}
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
  );
}
