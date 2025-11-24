import { describe, expect, it } from "bun:test";

import { buildFluentLoadPath, normaliseBasePath } from "../src/i18n";

describe("i18n load path", () => {
  it("prefixes Fluent bundle path with BASE_URL when provided", () => {
    const loadPath = buildFluentLoadPath("/wildside-mockup/");
    expect(loadPath).toBe("/wildside-mockup/locales/{{lng}}/{{ns}}.ftl");
  });

  it("normalises missing slashes on base paths", () => {
    expect(normaliseBasePath("wildside")).toBe("/wildside/");
    expect(normaliseBasePath("/wildside")).toBe("/wildside/");
    expect(normaliseBasePath(undefined)).toBe("/");
  });
});
