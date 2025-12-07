/** @file Favourite toggle and share dialog for a route. */

import * as Dialog from "@radix-ui/react-dialog";
import { type JSX, useState } from "react";

import { Icon } from "../../../../components/icon";

export type RouteActionButtonsProps = {
  readonly routeId: string;
};

export function RouteActionButtons({ routeId }: RouteActionButtonsProps): JSX.Element {
  const [isFavourite, setIsFavourite] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-base-300/60 transition ${
          isFavourite ? "bg-accent text-base-900" : "bg-base-200/70 text-base-content"
        }`}
        aria-label={isFavourite ? "Remove saved itinerary" : "Save this itinerary"}
        aria-pressed={isFavourite}
        onClick={() => setIsFavourite((prev) => !prev)}
      >
        <Icon token={isFavourite ? "{icon.action.like}" : "{icon.action.unlike}"} aria-hidden />
      </button>
      <Dialog.Root open={shareOpen} onOpenChange={setShareOpen}>
        <Dialog.Trigger asChild>
          <button type="button" className="route-share__trigger">
            <Icon token="{icon.action.share}" aria-hidden />
            Share
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60" />
          <Dialog.Content className="dialog-surface">
            <Dialog.Title className="text-lg font-semibold text-base-content">
              Share this walk
            </Dialog.Title>
            <Dialog.Description className="text-sm text-base-content/70">
              Copy the preview link or send it to friends once real sharing is wired up.
            </Dialog.Description>
            <div className="route-share__preview">https://wildside.app/routes/{routeId}</div>
            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <button type="button" className="btn btn-ghost btn-sm">
                  Close
                </button>
              </Dialog.Close>
              <button type="button" className="btn btn-accent btn-sm" disabled>
                Coming soon
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
