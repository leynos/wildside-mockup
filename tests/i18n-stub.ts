/** @file Shared Fluent/i18n stub for unit tests. */

import type { TFunction } from "i18next";

export type TranslationOptions = {
  count?: number;
  defaultValue?: string;
};

export type TranslationCall = {
  key: string;
  options?: TranslationOptions;
};

export type StubT = {
  readonly t: TFunction;
  readonly calls: TranslationCall[];
};

export const createStubT = (): StubT => {
  const calls: TranslationCall[] = [];
  const t = ((key: string, options?: TranslationOptions) => {
    if (options) {
      calls.push({ key, options });
    } else {
      calls.push({ key });
    }
    if (typeof options?.defaultValue === "string") {
      return options.defaultValue;
    }
    const count = options?.count;
    if (typeof count === "number") {
      return `${key}:${count}`;
    }
    return `translated:${key}`;
  }) as TFunction;

  return { t, calls };
};
