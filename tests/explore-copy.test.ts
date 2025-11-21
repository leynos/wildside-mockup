import { describe, expect, it } from "bun:test";
import { buildExploreCopy } from "../src/app/features/explore/explore-screen";
import { createStubT } from "./i18n-stub";

describe("buildExploreCopy", () => {
  it("surfaces translated headings and formatters with defaults", () => {
    const { t: stubT, calls } = createStubT();

    const copy = buildExploreCopy(stubT);

    expect(copy.headerTitle).toBe("Discover");
    expect(copy.headerSubtitle).toBe("Explore curated walks & hidden gems");
    expect(copy.filterLabel).toBe("Filter walks");
    expect(copy.searchPlaceholder).toBe("Search walks, places, themes…");
    expect(copy.bottomNavAriaLabel).toBe("Primary navigation");

    const keys = calls.map((call) => call.key);
    expect(keys).toEqual(
      expect.arrayContaining([
        "explore-header-title",
        "explore-header-subtitle",
        "explore-filter-aria-label",
        "explore-search-placeholder",
        "nav-primary-aria-label",
      ]),
    );
  });
});
