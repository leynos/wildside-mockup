function loadGeneratedTokens() {
  try {
    return require("./tokens/dist/tailwind.theme.cjs");
  } catch (error) {
    console.warn(
      "⚠️  Missing design token build output. Run `bun run tokens:build` before compiling Tailwind.",
    );
    return { tailwind: { extend: {} }, daisyThemes: [], themeNames: [] };
  }
}

const generated = loadGeneratedTokens();
const themeExtend = generated.tailwind?.extend ?? {};
const generatedThemeNames =
  (Array.isArray(generated.themeNames) && generated.themeNames.length > 0
    ? generated.themeNames
    : Array.isArray(generated.daisyThemes)
      ? generated.daisyThemes.map((theme) => theme.name)
      : []) ?? [];

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}", "./tokens/dist/tokens.css"],
  theme: {
    extend: themeExtend,
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: generatedThemeNames.length > 0 ? generatedThemeNames : ["light", "dark"],
  },
};
