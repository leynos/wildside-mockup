/** @file Header component for offline screen. */

import * as Dialog from "@radix-ui/react-dialog";
import type { JSX } from "react";

import { Icon } from "../../../components/icon";
import { AppHeader } from "../../../layout/app-header";

type OfflineHeaderProps = {
  readonly headerTitle: string;
  readonly headerSubtitle: string;
  readonly backLabel: string;
  readonly addAreaLabel: string;
  readonly onBack: () => void;
};

export function OfflineHeader({
  headerTitle,
  headerSubtitle,
  backLabel,
  addAreaLabel,
  onBack,
}: OfflineHeaderProps): JSX.Element {
  return (
    <AppHeader
      title={headerTitle}
      subtitle={headerSubtitle}
      leading={
        <button type="button" aria-label={backLabel} className="header-nav-button" onClick={onBack}>
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
  );
}
