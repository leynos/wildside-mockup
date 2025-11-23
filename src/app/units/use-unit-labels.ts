/** @file Shared helpers for building human-readable unit labels. */

import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { formatDistance, formatDuration, type LocalisedUnitValue } from "./unit-format";
import type { UnitSystem } from "./unit-system";
import { useUnitFormatters } from "./use-unit-formatters";

export interface UnitLabelFormatOptions {
  readonly minimumFractionDigits?: number;
  readonly maximumFractionDigits?: number;
}

export interface UnitLabelFormatters {
  readonly formatDistanceValue: (
    metres: number,
    options?: UnitLabelFormatOptions,
  ) => LocalisedUnitValue;
  readonly formatDurationValue: (
    seconds: number,
    options?: UnitLabelFormatOptions,
  ) => LocalisedUnitValue;
  readonly formatDistanceLabel: (metres: number, options?: UnitLabelFormatOptions) => string;
  readonly formatDurationLabel: (seconds: number, options?: UnitLabelFormatOptions) => string;
}

export const buildUnitLabelFormatters = (
  t: TFunction,
  locale: string,
  unitSystem: UnitSystem,
): UnitLabelFormatters => {
  const sharedOptions = { t, locale, unitSystem };

  const formatDistanceValue = (
    metres: number,
    options?: UnitLabelFormatOptions,
  ): LocalisedUnitValue =>
    formatDistance(metres, {
      ...sharedOptions,
      ...options,
    });

  const formatDistanceLabel = (metres: number, options?: UnitLabelFormatOptions): string => {
    const { value, unitLabel } = formatDistanceValue(metres, options);
    return `${value} ${unitLabel}`;
  };

  const formatDurationValue = (
    seconds: number,
    options?: UnitLabelFormatOptions,
  ): LocalisedUnitValue =>
    formatDuration(seconds, {
      ...sharedOptions,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      ...options,
    });

  const formatDurationLabel = (seconds: number, options?: UnitLabelFormatOptions): string => {
    const { value, unitLabel } = formatDurationValue(seconds, options);
    return `${value} ${unitLabel}`;
  };

  return {
    formatDistanceValue,
    formatDurationValue,
    formatDistanceLabel,
    formatDurationLabel,
  };
};

export const useUnitLabelFormatters = (): UnitLabelFormatters => {
  const { t, i18n } = useTranslation();
  const { unitSystem } = useUnitFormatters();

  return buildUnitLabelFormatters(t, i18n.language, unitSystem);
};
