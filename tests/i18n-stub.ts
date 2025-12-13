/** @file Shared Fluent/i18n stub for unit tests. */

import type { TFunction } from "i18next";

export type TranslationOptions = {
  count?: number;
  defaultValue?: string;
} & Record<string, unknown>;

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
  const interpolateDefaultValue = (template: string, options: TranslationOptions): string => {
    let output = template;
    for (const [key, value] of Object.entries(options)) {
      if (key === "defaultValue" || key === "count") {
        continue;
      }
      const asString = value == null ? "" : String(value);
      output = output.replaceAll(`{{${key}}}`, asString).replaceAll(`{$${key}}`, asString);
    }
    return output;
  };
  const t = (
    key: string,
    optionsOrDefault?: string | TranslationOptions,
    maybeOptions?: TranslationOptions,
  ) => {
    const options: TranslationOptions | undefined =
      typeof optionsOrDefault === "string"
        ? { ...maybeOptions, defaultValue: optionsOrDefault }
        : optionsOrDefault;

    if (options) {
      calls.push({ key, options });
    } else {
      calls.push({ key });
    }

    if (typeof options?.defaultValue === "string") {
      return interpolateDefaultValue(options.defaultValue, options);
    }

    const count = options?.count;
    if (typeof count === "number") {
      return `${key}:${count}`;
    }

    return `translated:${key}`;
  };

  const typedT = t as unknown as TFunction;

  return { t: typedT, calls };
};
