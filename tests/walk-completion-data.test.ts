import { describe, expect, it } from "bun:test";

import {
  walkCompletionMoments,
  walkCompletionPrimaryStats,
  walkCompletionSecondaryStats,
  walkCompletionShareOptions,
} from "../src/app/data/stage-four";
import { pickLocalization } from "../src/app/domain/entities/localization";

describe("walkCompletionPrimaryStats localizations", () => {
  const testLocales = ["en-GB", "es", "de", "ja", "ar"] as const;

  it("Distance stat has localized names across multiple locales", () => {
    const distanceStat = walkCompletionPrimaryStats.find((s) => s.id === "distance");
    expect(distanceStat).toBeDefined();
    if (!distanceStat) return;

    // Verify each locale has a name
    testLocales.forEach((locale) => {
      const localized = pickLocalization(distanceStat.localizations, locale);
      expect(localized.name).toBeTruthy();
    });

    // Verify locales have different names (not all defaulting to English)
    const spanishName = pickLocalization(distanceStat.localizations, "es").name;
    const germanName = pickLocalization(distanceStat.localizations, "de").name;
    const japaneseName = pickLocalization(distanceStat.localizations, "ja").name;

    expect(spanishName).toBe("Distancia");
    expect(germanName).toBe("Distanz");
    expect(japaneseName).toBe("距離");
  });

  it("Duration stat has localized names across multiple locales", () => {
    const durationStat = walkCompletionPrimaryStats.find((s) => s.id === "duration");
    expect(durationStat).toBeDefined();
    if (!durationStat) return;

    testLocales.forEach((locale) => {
      const localized = pickLocalization(durationStat.localizations, locale);
      expect(localized.name).toBeTruthy();
    });

    const spanishName = pickLocalization(durationStat.localizations, "es").name;
    const germanName = pickLocalization(durationStat.localizations, "de").name;
    const japaneseName = pickLocalization(durationStat.localizations, "ja").name;

    expect(spanishName).toBe("Duración");
    expect(germanName).toBe("Dauer");
    expect(japaneseName).toBe("所要時間");
  });
});

describe("walkCompletionSecondaryStats localizations", () => {
  const testLocales = ["en-GB", "es", "fr", "ko", "he"] as const;

  it("Energy stat has localized names across multiple locales", () => {
    const energyStat = walkCompletionSecondaryStats.find((s) => s.id === "energy");
    expect(energyStat).toBeDefined();
    if (!energyStat) return;

    testLocales.forEach((locale) => {
      const localized = pickLocalization(energyStat.localizations, locale);
      expect(localized.name).toBeTruthy();
    });

    const spanishName = pickLocalization(energyStat.localizations, "es").name;
    const frenchName = pickLocalization(energyStat.localizations, "fr").name;
    const koreanName = pickLocalization(energyStat.localizations, "ko").name;

    expect(spanishName).toBe("Energía");
    expect(frenchName).toBe("Énergie");
    expect(koreanName).toBe("에너지");
  });

  it("Stops stat has localized names across multiple locales", () => {
    const stopsStat = walkCompletionSecondaryStats.find((s) => s.id === "stops");
    expect(stopsStat).toBeDefined();
    if (!stopsStat) return;

    testLocales.forEach((locale) => {
      const localized = pickLocalization(stopsStat.localizations, locale);
      expect(localized.name).toBeTruthy();
    });
  });

  it("Starred stat has localized names across multiple locales", () => {
    const starredStat = walkCompletionSecondaryStats.find((s) => s.id === "starred");
    expect(starredStat).toBeDefined();
    if (!starredStat) return;

    testLocales.forEach((locale) => {
      const localized = pickLocalization(starredStat.localizations, locale);
      expect(localized.name).toBeTruthy();
    });
  });
});

describe("walkCompletionMoments localizations", () => {
  it("all moments have name and description localizations", () => {
    expect(walkCompletionMoments.length).toBeGreaterThan(0);

    walkCompletionMoments.forEach((moment) => {
      const localized = pickLocalization(moment.localizations, "en-GB");
      expect(localized.name).toBeTruthy();
      expect(localized.description).toBeTruthy();
    });
  });

  it("coffee moment has correct English localization", () => {
    const coffeeMoment = walkCompletionMoments.find((m) => m.id === "coffee");
    expect(coffeeMoment).toBeDefined();
    if (!coffeeMoment) return;

    const localized = pickLocalization(coffeeMoment.localizations, "en-GB");
    expect(localized.name).toBe("Blue Bottle Coffee");
    expect(localized.description).toBe("Perfect cortado & friendly barista");
  });

  it("mural moment has correct English localization", () => {
    const muralMoment = walkCompletionMoments.find((m) => m.id === "mural");
    expect(muralMoment).toBeDefined();
    if (!muralMoment) return;

    const localized = pickLocalization(muralMoment.localizations, "en-GB");
    expect(localized.name).toBe("Hidden Mural");
    expect(localized.description).toBe("Amazing street art in quiet alley");
  });

  it("moments have image URLs", () => {
    walkCompletionMoments.forEach((moment) => {
      expect(moment.imageUrl).toMatch(/^https?:\/\//);
    });
  });
});

describe("walkCompletionShareOptions localizations", () => {
  it("Facebook has localized names for non-Latin scripts", () => {
    const facebookOption = walkCompletionShareOptions.find((o) => o.id === "facebook");
    expect(facebookOption).toBeDefined();
    if (!facebookOption) return;

    // Latin scripts should use "Facebook"
    expect(pickLocalization(facebookOption.localizations, "en-GB").name).toBe("Facebook");
    expect(pickLocalization(facebookOption.localizations, "es").name).toBe("Facebook");

    // Non-Latin scripts should have transliterated names
    expect(pickLocalization(facebookOption.localizations, "ar").name).toBe("فيسبوك");
    expect(pickLocalization(facebookOption.localizations, "he").name).toBe("פייסבוק");
    expect(pickLocalization(facebookOption.localizations, "ko").name).toBe("페이스북");
    expect(pickLocalization(facebookOption.localizations, "ta").name).toBe("பேஸ்புக்");
  });

  it("Instagram has localized names for non-Latin scripts", () => {
    const instagramOption = walkCompletionShareOptions.find((o) => o.id === "instagram");
    expect(instagramOption).toBeDefined();
    if (!instagramOption) return;

    // Latin scripts should use "Instagram"
    expect(pickLocalization(instagramOption.localizations, "en-GB").name).toBe("Instagram");

    // Non-Latin scripts should have transliterated names
    expect(pickLocalization(instagramOption.localizations, "ar").name).toBe("إنستغرام");
    expect(pickLocalization(instagramOption.localizations, "ko").name).toBe("인스타그램");
  });

  it("all share options have icon tokens and accent classes", () => {
    walkCompletionShareOptions.forEach((option) => {
      expect(option.iconToken).toBeTruthy();
      expect(option.accentClass).toMatch(/^bg-/);
    });
  });
});
