/** @file Walk completion primary actions (rate, share, save). */

import type { JSX } from "react";

import { Icon } from "../../../components/icon";

type WalkCompleteActionsProps = {
  readonly rateActionLabel: string;
  readonly shareActionLabel: string;
  readonly saveActionLabel: string;
  readonly onRate: () => void;
  readonly onShare: () => void;
  readonly onSave: () => void;
};

export function WalkCompleteActions({
  rateActionLabel,
  shareActionLabel,
  saveActionLabel,
  onRate,
  onShare,
  onSave,
}: WalkCompleteActionsProps): JSX.Element {
  return (
    <div className="space-y-3">
      <button
        type="button"
        className="btn btn-accent btn-lg w-full justify-center gap-3 text-base-900"
        onClick={onRate}
      >
        <Icon token="{icon.object.star}" aria-hidden />
        {rateActionLabel}
      </button>
      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" className="btn-outline--fill" onClick={onShare}>
          <Icon token="{icon.action.share}" aria-hidden />
          {shareActionLabel}
        </button>
        <button type="button" className="btn-outline--fill" onClick={onSave}>
          <Icon token="{icon.action.save}" aria-hidden />
          {saveActionLabel}
        </button>
      </div>
    </div>
  );
}
