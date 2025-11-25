import { describe, expect, it } from "bun:test";

import { getBadgeDescriptor } from "../src/app/data/registries/badges";
import { getTagDescriptor } from "../src/app/data/registries/tags";

describe("descriptor lookup helpers", () => {
  describe("getTagDescriptor", () => {
    it("returns a resolved descriptor with localisation applied", () => {
      const resolved = getTagDescriptor("coffee", "es-MX");
      expect(resolved).toBeDefined();
      expect(resolved?.localization.name).toBe("Café");
    });

    it("returns undefined for unknown ids", () => {
      expect(getTagDescriptor("unknown", "en-GB")).toBeUndefined();
    });
  });

  describe("getBadgeDescriptor", () => {
    it("returns a resolved descriptor with localisation applied", () => {
      const resolved = getBadgeDescriptor("sunset-pick", "en-GB");
      expect(resolved?.localization.shortLabel).toBe("Sunset");
    });

    it("respects fallback locales when the requested locale is missing", () => {
      const resolved = getBadgeDescriptor("teal-line", "fr-CA");
      expect(resolved?.localization.name).toBe("Teal line");
    });

    it("returns undefined for unknown ids", () => {
      expect(getBadgeDescriptor("unknown", "en-GB")).toBeUndefined();
    });
  });
});
