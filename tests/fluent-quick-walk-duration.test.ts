import { describe, expect, it } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { FluentBundle, FluentResource } from "@fluent/bundle";

const loadMessage = (minutes: number, locale = "en-US") => {
  const ftlPath = path.join("public", "locales", locale, "common.ftl");
  const source = fs.readFileSync(ftlPath, "utf-8");
  const bundle = new FluentBundle(locale);
  bundle.addResource(new FluentResource(source));

  const message = bundle.getMessage("quick-walk-duration-format");
  if (!message?.value) throw new Error("missing message");

  const formatted = bundle.formatPattern(message.value, { count: minutes });
  return formatted.replace(/\u2068|\u2069/g, "");
};

describe("quick walk duration Fluent message", () => {
  it("pluralises minutes using the term with count", () => {
    expect(loadMessage(1)).toBe("1 minute");
    expect(loadMessage(2)).toBe("2 minutes");
  });
});
