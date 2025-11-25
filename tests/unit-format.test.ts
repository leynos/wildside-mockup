import { describe, expect, it } from "bun:test";

import {
  formatDistance,
  formatEnergy,
  formatTemperature,
  formatWeight,
} from "../src/app/units/unit-format";
import { createStubT } from "./i18n-stub";

describe("unit format helpers", () => {
  it("formats SI distances into metric and imperial output", () => {
    const { t } = createStubT();

    const metric = formatDistance(1_609.344, {
      t,
      locale: "en-GB",
      unitSystem: "metric",
    });
    expect(metric.value).toBe("1.6");
    expect(metric.unitLabel).toBe("km");

    const imperial = formatDistance(1_609.344, {
      t,
      locale: "en-US",
      unitSystem: "imperial",
    });
    expect(imperial.value).toBe("1.0");
    expect(imperial.unitLabel).toBe("miles");
  });

  it("formats Celsius into Fahrenheit when preferred", () => {
    const { t } = createStubT();

    const fahrenheit = formatTemperature(0, {
      t,
      locale: "en-US",
      unitSystem: "imperial",
    });

    expect(fahrenheit.value).toBe("32.0");
    expect(fahrenheit.unitLabel).toBe("°F");
  });

  it("keeps Celsius output for metric preference", () => {
    const { t } = createStubT();

    const celsius = formatTemperature(0, {
      t,
      locale: "en-US",
      unitSystem: "metric",
    });

    expect(celsius.value).toBe("0.0");
    expect(celsius.unitLabel).toBe("°C");
  });

  it("formats energy in metric as kilojoules and imperial as kilocalories", () => {
    const { t } = createStubT();

    const metric = formatEnergy(250, {
      t,
      locale: "en-GB",
      unitSystem: "metric",
    });

    expect(metric.value).toBe("1,046");
    expect(metric.unitLabel).toBe("kJ");

    const imperial = formatEnergy(250, {
      t,
      locale: "en-US",
      unitSystem: "imperial",
    });

    expect(imperial.value).toBe("250");
    expect(imperial.unitLabel).toBe("kcal");
  });

  it("formats weight respecting the preferred unit system", () => {
    const { t } = createStubT();

    const metric = formatWeight(70, {
      t,
      locale: "en-GB",
      unitSystem: "metric",
    });

    expect(metric.value).toBe("70");
    expect(metric.unitLabel).toBe("kg");

    const imperial = formatWeight(70, {
      t,
      locale: "en-US",
      unitSystem: "imperial",
    });

    expect(imperial.value).toBe("154.3");
    expect(imperial.unitLabel).toBe("lb");
  });
});
