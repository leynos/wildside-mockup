/** @file Helpers for converting SI measurements into locale-aware display copy. */

import type { TFunction } from "i18next";

import {
  celsiusToFahrenheit,
  KILOJOULES_PER_KILOCALORIE,
  METRES_PER_KILOMETRE,
  METRES_PER_MILE,
  metresToKilometres,
  metresToMiles,
  secondsToMinutes,
  type UnitSystem,
} from "./unit-system";

export type UnitToken =
  | "distance-kilometre"
  | "distance-mile"
  | "duration-minute"
  | "temperature-celsius"
  | "temperature-fahrenheit"
  | "count-stop"
  | "energy-calorie"
  | "energy-joule"
  | "energy-kilojoule"
  | "energy-btu"
  | "weight-kilogram"
  | "weight-pound";

export type LocalisedUnitValue = {
  readonly value: string;
  readonly numericValue: number;
  readonly unitLabel: string;
  readonly unitToken: UnitToken;
};

export type UnitFormatOptions = {
  readonly locale: string;
  readonly unitSystem: UnitSystem;
  readonly t: TFunction;
  readonly minimumFractionDigits?: number;
  readonly maximumFractionDigits?: number;
};

type NumberFormatOptions = {
  readonly minimumFractionDigits?: number;
  readonly maximumFractionDigits?: number;
};

const DEFAULT_UNIT_LABELS: Record<UnitToken, string> = {
  "distance-kilometre": "km",
  "distance-mile": "miles",
  "duration-minute": "minutes",
  "temperature-celsius": "°C",
  "temperature-fahrenheit": "°F",
  "count-stop": "stops",
  "energy-joule": "J",
  "energy-calorie": "kcal",
  "energy-kilojoule": "kJ",
  "energy-btu": "BTU",
  "weight-kilogram": "kg",
  "weight-pound": "lb",
};

const formatNumber = (
  locale: string,
  value: number,
  { minimumFractionDigits, maximumFractionDigits }: NumberFormatOptions,
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
};

export const getUnitLabel = (t: TFunction, unitToken: UnitToken, count?: number): string => {
  if (count == null) {
    return t(`unit-${unitToken}`, DEFAULT_UNIT_LABELS[unitToken]);
  }

  return t(`unit-${unitToken}`, DEFAULT_UNIT_LABELS[unitToken], { count });
};

export const formatDistance = (
  metres: number,
  {
    locale,
    t,
    unitSystem,
    minimumFractionDigits = 1,
    maximumFractionDigits = 1,
  }: UnitFormatOptions,
): LocalisedUnitValue => {
  const useImperial = unitSystem === "imperial";
  const numericValue = useImperial ? metresToMiles(metres) : metresToKilometres(metres);
  const unitToken: UnitToken = useImperial ? "distance-mile" : "distance-kilometre";
  const value = formatNumber(locale, numericValue, {
    minimumFractionDigits,
    maximumFractionDigits,
  });
  const unitLabel = getUnitLabel(t, unitToken);

  return { value, numericValue, unitLabel, unitToken };
};

export const formatDistanceRange = (
  [minMetres, maxMetres]: readonly [number, number],
  options: UnitFormatOptions,
): LocalisedUnitValue & { readonly maxValue: string } => {
  const start = formatDistance(minMetres, options);
  const end = formatDistance(maxMetres, options);

  return {
    ...start,
    maxValue: end.value,
  };
};

export const formatDuration = (
  seconds: number,
  {
    locale,
    t,
    unitSystem: _unitSystem,
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  }: UnitFormatOptions,
): LocalisedUnitValue => {
  const minutes = secondsToMinutes(seconds);
  const unitToken: UnitToken = "duration-minute";
  const unitLabel = getUnitLabel(t, unitToken, minutes);
  const value = formatNumber(locale, minutes, { minimumFractionDigits, maximumFractionDigits });

  return { value, numericValue: minutes, unitLabel, unitToken }; // duration units do not vary by system today
};

export const formatTemperature = (
  celsius: number,
  {
    locale,
    t,
    unitSystem,
    minimumFractionDigits = 1,
    maximumFractionDigits = 1,
  }: UnitFormatOptions,
): LocalisedUnitValue => {
  const useImperial = unitSystem === "imperial";
  const numericValue = useImperial ? celsiusToFahrenheit(celsius) : celsius;
  const unitToken: UnitToken = useImperial ? "temperature-fahrenheit" : "temperature-celsius";
  const unitLabel = getUnitLabel(t, unitToken);
  const value = formatNumber(locale, numericValue, {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return { value, numericValue, unitLabel, unitToken };
};

export const formatStops = (
  stops: number,
  { locale, t, minimumFractionDigits = 0, maximumFractionDigits = 0 }: UnitFormatOptions,
): LocalisedUnitValue => {
  const unitToken: UnitToken = "count-stop";
  const unitLabel = getUnitLabel(t, unitToken, stops);
  const value = formatNumber(locale, stops, { minimumFractionDigits, maximumFractionDigits });

  return { value, numericValue: stops, unitLabel, unitToken };
};

export const formatEnergy = (
  kilocalories: number,
  {
    locale,
    t,
    unitSystem,
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  }: UnitFormatOptions,
): LocalisedUnitValue => {
  const useImperial = unitSystem === "imperial";
  const unitToken: UnitToken = useImperial ? "energy-calorie" : "energy-kilojoule";
  const numericValue = useImperial ? kilocalories : kilocalories * KILOJOULES_PER_KILOCALORIE;
  const unitLabel = getUnitLabel(t, unitToken, numericValue);
  const value = formatNumber(locale, numericValue, {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return { value, numericValue, unitLabel, unitToken };
};

export const formatWeight = (
  kilograms: number,
  {
    locale,
    t,
    unitSystem,
    minimumFractionDigits = 0,
    maximumFractionDigits = 1,
  }: UnitFormatOptions,
): LocalisedUnitValue => {
  const useImperial = unitSystem === "imperial";
  const numericValue = useImperial ? kilograms * 2.20462 : kilograms;
  const unitToken: UnitToken = useImperial ? "weight-pound" : "weight-kilogram";
  const unitLabel = getUnitLabel(t, unitToken, numericValue);
  const value = formatNumber(locale, numericValue, {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return { value, numericValue, unitLabel, unitToken };
};

export const metresFromKilometres = (kilometres: number): number =>
  kilometres * METRES_PER_KILOMETRE;

export const metresFromMiles = (miles: number): number => miles * METRES_PER_MILE;

export const secondsFromMinutes = (minutes: number): number => minutes * 60;
