import { describe, expect, it } from "bun:test";

import { buildUnitLabelFormatters } from "../src/app/units/use-unit-labels";
import { createStubT } from "./i18n-stub";

describe("unit label formatters", () => {
  it("builds distance and duration labels with defaults", () => {
    const { t } = createStubT();
    const formatter = buildUnitLabelFormatters(t, "en-GB", "metric");

    expect(
      formatter.formatDistanceLabel(1_609.344, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    ).toBe("1.6 km");
    expect(formatter.formatDurationLabel(120)).toBe("2 minutes");
  });

  it("exposes raw value formatting for callers needing structured parts", () => {
    const { t } = createStubT();
    const formatter = buildUnitLabelFormatters(t, "en-US", "imperial");

    const duration = formatter.formatDurationValue(90, { maximumFractionDigits: 0 });
    expect(duration.value).toBe("2");
    expect(duration.unitLabel).toBe("minutes");
  });
});
