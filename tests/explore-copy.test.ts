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
    expect(copy.categoriesLabel).toBe("Popular categories");
    expect(copy.featuredHeading).toBe("Walk of the Week");
    expect(copy.popularHeading).toBe("Popular Themes");
    expect(copy.curatedHeading).toBe("Curated Collections");
    expect(copy.trendingHeading).toBe("Trending Now");
    expect(copy.communityHeading).toBe("Community Favourite");
    expect(copy.communitySubtitle).toBe("Most shared this week");
    expect(copy.bottomNavAriaLabel).toBe("Primary navigation");

    expect(copy.formatRouteCount(5)).toBe("5 routes");
    const routeCall = calls.find((call) => call.key === "explore-curated-route-count");
    expect(routeCall?.options?.defaultValue).toBe("5 routes");

    expect(copy.formatSaveCount(1)).toBe("1 save");
    const saveCall = calls.find((call) => call.key === "explore-community-saves");
    expect(saveCall?.options?.defaultValue).toBe("1 save");
  });
});
