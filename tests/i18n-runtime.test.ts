import { afterEach, beforeAll, describe, expect, it } from "bun:test";

import i18n, { applyDocumentLocale, i18nReady } from "../src/i18n";

const readBodyDirection = () =>
  (document.body.dataset as DOMStringMap & { direction?: string }).direction ?? undefined;

describe("i18n runtime configuration", () => {
  beforeAll(async () => {
    await i18nReady;
  });

  afterEach(async () => {
    await i18n.changeLanguage("en-GB");
  });

  it("sets document language and direction once the runtime is ready", async () => {
    expect(document.documentElement.lang).toBe("en-GB");
    expect(document.documentElement.dir).toBe("ltr");
    expect(readBodyDirection()).toBe("ltr");
  });

  it("updates direction metadata when switching to an RTL locale", async () => {
    await i18n.changeLanguage("ar");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(readBodyDirection()).toBe("rtl");
  });

  it("falls back to default metadata when a locale is missing", () => {
    document.documentElement.lang = "zz";
    document.documentElement.dir = "rtl";
    document.body.dir = "rtl";
    applyDocumentLocale(undefined);

    expect(document.documentElement.lang).toBe("en-GB");
    expect(document.documentElement.dir).toBe("ltr");
    expect(readBodyDirection()).toBe("ltr");
  });
});

/**@example
 * ```ts
 * import i18n from "../src/i18n";
 *
 * await i18n.changeLanguage("ar");
 * // document.dir === "rtl"
 * ```
 */
