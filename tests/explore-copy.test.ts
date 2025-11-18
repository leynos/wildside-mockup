import { describe, expect, it } from "bun:test";
import { buildExploreCopy } from "../src/app/features/explore/explore-screen";
import { createStubT } from "./i18n-stub";

describe("buildExploreCopy", () => {
  it("surfaces translated headings and formatters with defaults", () => {
    const { t: stubT, calls } = createStubT();

    const copy = buildExploreCopy(stubT);

    expect(copy.headerTitle).toBe("translated:explore-header-title");
    expect(copy.headerSubtitle).toBe("translated:explore-header-subtitle");
    expect(copy.filterLabel).toBe("translated:explore-filter-aria-label");
    expect(copy.searchPlaceholder).toBe("translated:explore-search-placeholder");
    expect(copy.categoriesLabel).toBe("translated:explore-categories-aria-label");
    expect(copy.featuredHeading).toBe("translated:explore-featured-heading");
    expect(copy.popularHeading).toBe("translated:explore-popular-heading");
    expect(copy.curatedHeading).toBe("translated:explore-curated-heading");
    expect(copy.trendingHeading).toBe("translated:explore-trending-heading");
    expect(copy.communityHeading).toBe("translated:explore-community-heading");
    expect(copy.communitySubtitle).toBe("translated:explore-community-subtitle");
    expect(copy.bottomNavAriaLabel).toBe("translated:nav-primary-aria-label");

    expect(copy.formatRouteCount(5)).toBe("explore-curated-route-count:5");
    const routeCall = calls.find((call) => call.key === "explore-curated-route-count");
    expect(routeCall?.options?.defaultValue).toBe("{{count}} routes");

    expect(copy.formatSaveCount(1)).toBe("explore-community-saves:1");
    const saveCall = calls.find((call) => call.key === "explore-community-saves");
    expect(saveCall?.options?.defaultValue).toBe("{{count}} saves");
  });
});
