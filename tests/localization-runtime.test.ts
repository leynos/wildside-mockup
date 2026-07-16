/** @file Tests for localization runtime helpers and fallbacks. */
import { describe, expect, it } from "bun:test";
import { SUPPORTED_LOCALES } from "../src/app/i18n/supported-locales";
import {
  coerceLocaleCode,
  fallbackLocalization,
  resolveLocalization,
} from "../src/app/lib/localization-runtime";

const localizations = {
  "en-GB": { name: "Harbour Loop", description: "Evening stroll" },
  fr: { name: "Boucle du port", description: "Promenade du soir" },
};

describe("localization runtime helpers", () => {
  it("coerces undefined or unknown locales to the default", () => {
    expect(coerceLocaleCode(undefined)).toBe("en-GB");
    expect(coerceLocaleCode("xx-YY")).toBe("en-GB");
  });

  it("prefers exact and language-only matches when coercing", () => {
    expect(coerceLocaleCode("fr" as string)).toBe("fr");
    expect(coerceLocaleCode("fr-CA" as string)).toBe("fr");
    expect(coerceLocaleCode("en" as string)).toBe("en-GB");
    expect(coerceLocaleCode("EN-gb" as string)).toBe("en-GB");
  });

  it("normalizes case for every configured locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(coerceLocaleCode(locale.code.toUpperCase())).toBe(locale.code);
      expect(coerceLocaleCode(locale.code.toLowerCase())).toBe(locale.code);
    }
  });

  it("returns the first available localization when none match", () => {
    const fallback = fallbackLocalization({}, "Fallback");
    expect(fallback.name).toBe("Fallback");
  });

  it("resolves a localization for the requested locale", () => {
    const resolved = resolveLocalization(localizations, "fr", "Harbour Loop");
    expect(resolved.name).toBe("Boucle du port");
  });

  it("falls back safely when pickLocalization throws", () => {
    const warn = console.warn;
    console.warn = () => {};
    try {
      const resolved = resolveLocalization({}, "es", "Harbour Loop");
      expect(resolved.name).toBe("Harbour Loop");
    } finally {
      console.warn = warn;
    }
  });
});
