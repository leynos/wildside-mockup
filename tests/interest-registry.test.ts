import { describe, expect, it } from "bun:test";

import {
  buildInterestLookup,
  getInterestDescriptor,
  interestDescriptors,
  resolveInterestDescriptors,
} from "../src/app/data/registries/interests";

describe("interest registry", () => {
  it("resolves descriptors for a locale and preserves visual metadata", () => {
    const descriptor = getInterestDescriptor("waterfront", "es");

    expect(descriptor).toBeDefined();
    expect(descriptor?.localization.name).toBe("Frente marítimo");
    expect(descriptor?.iconToken).toBe("{icon.category.water}");
  });

  it("falls back to default locales when the requested locale is missing", () => {
    const descriptor = getInterestDescriptor("parks", "fr-CA");

    expect(descriptor).toBeDefined();
    expect(descriptor?.localization.name).toBe("Parks & Nature");
  });

  it("buildInterestLookup returns a stable map of all descriptors", () => {
    const lookup = buildInterestLookup("en-GB");

    expect(lookup.size).toBe(interestDescriptors.length);
    expect(lookup.get("food")?.localization.name).toBe("Street Food");
  });

  it("resolveInterestDescriptors returns the same descriptors as the lookup values", () => {
    const viaLookup = Array.from(buildInterestLookup("es").values());
    const viaResolve = resolveInterestDescriptors("es");

    expect(viaResolve).toEqual(viaLookup);
  });
});
