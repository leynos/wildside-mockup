# Wildside mockup migration notes

Last updated: 26 October 2025

## Goals

- Replace the static `public/*.html` mockups with Radix UI driven React
  components styled via Tailwind CSS v4 and DaisyUI v5.
- Derive colour palettes and design tokens from the existing mockups and build
  them via the scripts under `tokens/`, ensuring tokens flow into Tailwind and
  DaisyUI.
- Maintain a living record of architectural decisions, open questions, and
  follow-up tasks discovered during the migration.

## Decisions (26 October 2025)

- Support both dark and light DaisyUI themes; ship dark as the default
  experience. Ensure generated tokens cover both variants.
- Retain Font Awesome during the migration. Evaluate Tabler Fill and Remix Fill
  icon sets as potential replacements in a follow-up spike before switching.
- Exclude generated token artefacts from version control. Produce them during
  CI/CD (GitHub Pages deploy pipeline) and allow developers to build locally as
  needed.

## Current assets

- `public/` contains 12 HTML screens. They hand-roll Tailwind config through
  inline `<script>` blocks and rely on Font Awesome. Each file hints at the
  intended palette for its flow (for example, `discover.html` uses the dark
  teal gradient).
- `src/index.tsx` demonstrates Radix UI primitives already wired to DaisyUI,
  confirming the dependency set and basic theme switching functions.
- `tailwind.config.cjs` is minimal: it scans `./index.html` and `./src/**` and
  registers DaisyUI. No custom theme or token linkage is in place yet.
- `tokens/` is a Style Dictionary project. `tokens/src/tokens.json` exposes a
  neutral palette plus primary/secondary accents, fonts, radii, and spacing.
  No theme variants exist yet.
- `df12-www/` provides an example Tailwind v4 theme implementation that can
  serve as reference for advanced theming patterns (custom theme config, DaisyUI
  theme exports).
- `docs/` includes guidance on Tailwind v4 migration and DaisyUI v5 usage,
  which we must observe when shaping new configuration and documentation.

## Design token strategy

- Extract colour samples from each mockup screen, grouping them into candidate
  theme roles (base, neutral, primary, accent, feedback). Prioritise the shared
  dark teal palette as the initial default theme; capture wizard-specific
  highlights as secondary accents or contextual layers. Mirror these decisions
  in a light variant to support theme switching.
- Encode the palette in `tokens/src/themes/<theme>.json`, referencing semantic
  token names from `tokens/src/tokens.json`. Ensure Style Dictionary outputs CSS
  custom properties targeting both DaisyUI v5 token names (for example,
  `--color-primary`) and legacy aliases (`--p`) to preserve compatibility.
- Enhance the token build to emit a Tailwind consumable file (likely under
  `tokens/dist/`), exporting a JS object with colour aliases and spacing scales.
  Plan to import that object inside `tailwind.config.cjs`.
- Keep the repository free of generated assets. Document the GitHub Action step
  responsible for building and publishing tokens alongside the site bundle.

## Tailwind and DaisyUI integration

- Update `tailwind.config.cjs` to load generated token exports and feed them
  into both `theme.extend` and `daisyui.themes`. Ensure content paths include
  the forthcoming component directories.
- Validate whether PostCSS needs additional plugins (for example,
  `@tailwindcss/typography`). If so, record rationale and update `postcss.config.cjs`
  accordingly.
- Align DaisyUI theme names with token files (for example, `"wildside-night"`),
  ensuring Radix UI theme switching utilities (`applyTheme`) can target them.
- Confirm that Tailwind v4 JIT features (colour functions, arbitrary values)
  work with our generated CSS variables; document any quirks discovered during
  implementation.

## Component architecture direction

- Define a shared layout shell component providing the mobile frame, status bar
  spacers, and background gradients. This prevents duplication across the 12
  screens.
- Identify Radix primitives needed per flow:
  - Dialog/Sheet for overlays and modals.
  - Tabs or Accordion for multi-step sections.
  - Slider and Checkbox controls for custom filters.
  - Progress for the walk wizard step indicator.
- Create composable components (`InterestChip`, `ProgressHeader`, `WalkCard`)
  that encapsulate repeated styling patterns observed in the HTML mockups.
- Keep each module under 400 lines by dividing large flows into route-level
  containers and child components. Place feature-specific hooks and fixtures
  alongside their components.

## Migration workflow

- Sequence the conversion by user journey: onboarding (`discover`, `explore`),
  walk discovery (`map-*`, `saved`), customisation (`customize`, wizard pages),
  safety/offline flows (`offline`, `safety-accessibility`, `walk-complete`),
  and authentication (`sign-in`).
- For each page:
  1. Catalogue existing UI states and interactions from the HTML mockup.
  2. Map static elements to Radix components and DaisyUI classes.
  3. Implement React components with Tailwind classes referencing token-driven
     variables.
  4. Write Vitest + Testing Library snapshots or interaction tests where Radix
     behaviour matters (for example, wizard progression).
  5. Verify styling parity manually via local Vite preview.
- Update documentation in `docs/` and this design log when decisions affect the
  wider team (for example, new token naming conventions).

## Verification plan

- Run `make fmt`, `make lint`, `make test`, `make check-fmt`, and
  `make markdownlint` before any commits leave the branch.
- Consider adding visual regression tooling (for example, Playwright + Axe) if
  manual QA proves insufficient. Record findings in this document.

## Open questions

- Determine timeline and success criteria for evaluating alternative icon sets.
- Define local developer ergonomics for token rebuilds (for example, `bun run
  tokens:build`) and ensure documentation reflects the expected workflow.
