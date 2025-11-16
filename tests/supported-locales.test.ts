import { describe, expect, it } from "bun:test";

import {
  DEFAULT_LOCALE,
  getLocaleDirection,
  getLocaleMetadata,
  isRtlLocale,
  SUPPORTED_LOCALES,
} from "../src/app/i18n/supported-locales";

describe("supported locale metadata", () => {
  it("exposes a default locale present in the supported list", () => {
    const firstLocale = SUPPORTED_LOCALES[0];
    expect(DEFAULT_LOCALE).toBe(firstLocale.code);
  });

  it("returns default locale metadata when no code is provided", () => {
    const metadata = getLocaleMetadata(undefined);
    expect(metadata.code).toBe(DEFAULT_LOCALE);
    expect(metadata.label).toBe(SUPPORTED_LOCALES[0]?.label);
  });

  it("matches locales in a case-insensitive manner", () => {
    const metadata = getLocaleMetadata("ES");
    expect(metadata.code).toBe("es");
  });

  it("falls back to language-only matches when the region is unsupported", () => {
    const metadata = getLocaleMetadata("fr-CA");
    expect(metadata.code).toBe("fr");
  });

  it("returns the default locale when no match can be made", () => {
    const metadata = getLocaleMetadata("xx");
    expect(metadata.code).toBe(DEFAULT_LOCALE);
  });
});

describe("locale direction helpers", () => {
  it("surfaces RTL direction metadata when languages require it", () => {
    expect(getLocaleDirection("ar")).toBe("rtl");
    expect(isRtlLocale("he" as const)).toBe(true);
  });

  it("defaults to ltr when a locale is undefined or unsupported", () => {
    expect(getLocaleDirection(undefined)).toBe("ltr");
    expect(isRtlLocale("xx" as const)).toBe(false);
  });
});

/**@example
 * ```ts
 * import { getLocaleMetadata } from "../src/app/i18n/supported-locales";
 *
 * const locale = getLocaleMetadata("es-MX");
 * console.info(locale.label);
 * ```
 */
