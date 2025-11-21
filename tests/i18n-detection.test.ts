import { afterEach, beforeEach, expect, test } from "bun:test";
import i18next, { type InitOptions } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { DEFAULT_LOCALE, DETECTION_ORDER } from "../src/app/i18n/supported-locales";

const originalLocationDescriptor = Object.getOwnPropertyDescriptor(window, "location");
const originalNavigatorLanguageDescriptor = Object.getOwnPropertyDescriptor(
  window.navigator,
  "language",
);

const LOCAL_STORAGE_KEY = "i18nextLng";

const replaceNavigatorLanguage = (language: string) => {
  if (!originalNavigatorLanguageDescriptor?.configurable) {
    return;
  }
  Object.defineProperty(window.navigator, "language", {
    value: language,
    configurable: true,
    enumerable: originalNavigatorLanguageDescriptor.enumerable ?? true,
    writable: true,
  });
};

const buildInstance = async (overrides: Partial<InitOptions> = {}) => {
  const instance = i18next.createInstance();
  await instance.use(LanguageDetector).init({
    detection: {
      order: [...DETECTION_ORDER],
      lookupQuerystring: "lng",
      lookupLocalStorage: LOCAL_STORAGE_KEY,
      caches: ["localStorage"],
    },
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: [DEFAULT_LOCALE, "es", "fr"],
    defaultNS: "common",
    resources: {
      [DEFAULT_LOCALE]: { common: {} },
      es: { common: {} },
      fr: { common: {} },
    },
    ...overrides,
  });
  return instance;
};

beforeEach(() => {
  if (originalLocationDescriptor?.configurable) {
    Object.defineProperty(window, "location", {
      value: new URL("http://localhost/"),
      configurable: true,
      enumerable: originalLocationDescriptor.enumerable ?? true,
      writable: true,
    });
  }
  replaceNavigatorLanguage("en-GB");
  window.localStorage.clear();
});

afterEach(() => {
  if (originalLocationDescriptor?.configurable) {
    Object.defineProperty(window, "location", originalLocationDescriptor);
  }
  if (originalNavigatorLanguageDescriptor?.configurable) {
    Object.defineProperty(window.navigator, "language", originalNavigatorLanguageDescriptor);
  }
});

test("uses the configured detection order", () => {
  expect(DETECTION_ORDER).toEqual(["querystring", "localStorage"]);
});

test("prefers querystring language when present", async () => {
  window.location.search = "?lng=es";
  const instance = await buildInstance();
  expect(instance.language).toBe("es");
});

test("falls back to localStorage when querystring missing", async () => {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, "fr");
  const instance = await buildInstance();
  expect(instance.language).toBe("fr");
});

test("defaults to app locale when neither query nor storage set", async () => {
  replaceNavigatorLanguage("es-ES");
  const instance = await buildInstance();
  expect(instance.language).toBe(DEFAULT_LOCALE);
});
