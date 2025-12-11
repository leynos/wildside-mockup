/** @file Auto-management settings list for offline downloads. */

import type { TFunction } from "i18next";
import type { JSX } from "react";

import { Icon } from "../../../components/icon";
import { PreferenceToggleCard } from "../../../components/preference-toggle-card";
import type { AutoManagementOption } from "../../../data/stage-four";
import { pickLocalization } from "../../../domain/entities/localization";

type OfflineAutoManagementProps = {
  readonly autoHeading: string;
  readonly autoManagementOptions: AutoManagementOption[];
  readonly autoSettings: Record<string, boolean>;
  readonly onToggle: (id: string, next: boolean) => void;
  readonly integerFormatter: Intl.NumberFormat;
  readonly i18nLanguage: string;
  readonly t: TFunction;
};

export function OfflineAutoManagement({
  autoHeading,
  autoManagementOptions,
  autoSettings,
  onToggle,
  integerFormatter,
  i18nLanguage,
  t,
}: OfflineAutoManagementProps): JSX.Element {
  return (
    <section className="space-y-4">
      <header className="flex items-center gap-3">
        <Icon token="{icon.action.settings}" className="text-accent" aria-hidden />
        <h2 className="text-base font-semibold text-base-content">{autoHeading}</h2>
      </header>
      <div className="space-y-4">
        {autoManagementOptions.map((option) => {
          const checked = autoSettings[option.id] ?? option.defaultEnabled;
          const optionLocalization = pickLocalization(option.localizations, i18nLanguage);
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
              : t("offline-auto-option-generic-description", {
                  name: optionLocalization.name,
                  defaultValue: `Enable ${optionLocalization.name}`,
                }));
          return (
            <PreferenceToggleCard
              key={option.id}
              id={`auto-management-${option.id}`}
              iconToken={option.iconToken}
              iconClassName={option.iconClassName}
              title={optionLocalization.name}
              description={optionDescription}
              isChecked={Boolean(checked)}
              onCheckedChange={(value) => onToggle(option.id, value)}
            />
          );
        })}
      </div>
    </section>
  );
}
