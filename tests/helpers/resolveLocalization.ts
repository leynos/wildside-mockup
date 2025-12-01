import { pickLocalization } from "../../src/app/domain/entities/localization";

export const resolveLocalizationForTest = (
  localizations: Parameters<typeof pickLocalization>[0] | undefined,
  fallback: string,
  locale: string,
): string => {
  if (!localizations) return fallback;
  try {
    return pickLocalization(localizations, locale).name;
  } catch (error) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("Using fallback localization in test", { fallback, error });
    }
    return fallback;
  }
};
