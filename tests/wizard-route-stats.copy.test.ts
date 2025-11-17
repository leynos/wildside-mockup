import { describe, expect, it } from "bun:test";
import type { TFunction } from "i18next";

import { buildWizardRouteStats } from "../src/app/features/wizard/step-three/build-wizard-route-stats";

type TranslationOptions = {
  defaultValue?: string;
};

type TranslationCall = {
  key: string;
  options?: TranslationOptions;
};

describe("buildWizardRouteStats", () => {
  it("localises wizard route stat units", () => {
    const calls: TranslationCall[] = [];
    const stubT = ((key: string, options?: TranslationOptions) => {
      if (options) {
        calls.push({ key, options });
      } else {
        calls.push({ key });
      }
      return `translated:${key}`;
    }) as TFunction;

    const stats = buildWizardRouteStats(stubT);

    expect(stats).toHaveLength(3);

    const distanceStat = stats.find((stat) => stat.id === "distance");
    expect(distanceStat?.value).toBe("3.7");
    expect(distanceStat?.unitLabel).toBe("translated:wizard-step-three-route-distance-unit");

    const durationStat = stats.find((stat) => stat.id === "duration");
    expect(durationStat?.unitLabel).toBe("translated:wizard-step-three-route-duration-unit");

    const stopsStat = stats.find((stat) => stat.id === "stops");
    expect(stopsStat?.unitLabel).toBe("translated:wizard-step-three-route-stops-unit");

    const distanceCall = calls.find((call) => call.key === "wizard-step-three-route-distance-unit");
    expect(distanceCall?.options?.defaultValue).toBe("km");
  });
});
