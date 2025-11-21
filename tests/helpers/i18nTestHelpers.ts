import { act } from "react";

import i18n, { i18nReady } from "../../src/i18n";

export const escapeRegExp = (raw: string): string => raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const changeLanguage = async (language: string): Promise<void> => {
  await i18nReady;
  await act(async () => {
    await i18n.changeLanguage(language);
  });
};

export const resetLanguage = async (): Promise<void> => {
  await changeLanguage("en-GB");
};

export const withI18nLanguage = async (
  language: string,
  callback: () => Promise<void> | void,
): Promise<void> => {
  const previous = i18n.language ?? "en-GB";
  await changeLanguage(language);
  try {
    await callback();
  } finally {
    await changeLanguage(previous);
  }
};

export { i18n, i18nReady };
