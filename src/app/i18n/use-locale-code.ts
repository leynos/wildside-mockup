/** @file React hook for resolving a supported LocaleCode from i18n language. */

import { useTranslation } from "react-i18next";

import type { LocaleCode } from "../domain/entities/localization";
import { coerceLocaleCode } from "../lib/localization-runtime";

export const useLocaleCode = (): LocaleCode => {
  const { i18n } = useTranslation();
  return coerceLocaleCode(i18n.language);
};
