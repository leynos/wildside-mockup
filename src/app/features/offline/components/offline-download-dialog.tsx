/** @file Dialog portal for selecting new offline downloads. */

import * as Dialog from "@radix-ui/react-dialog";
import type { JSX } from "react";

import { Button } from "../../../components/button";

export type OfflineDownloadDialogCopy = {
  readonly title: string;
  readonly description: string;
  readonly searchPlaceholder: string;
  readonly cancelLabel: string;
  readonly previewLabel: string;
};

type OfflineDownloadDialogProps = {
  readonly dialogCopy: OfflineDownloadDialogCopy | null;
};

export function OfflineDownloadDialog({ dialogCopy }: OfflineDownloadDialogProps): JSX.Element {
  return (
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
  );
}
