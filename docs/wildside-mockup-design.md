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

## Palette inventory

- Base surfaces referenced across the mockups:
  - `#0D1A26` (primary background), `#152433` (elevated background), `#203445`
    (card surface), and `#2A4157` (desaturated overlay in wizard/map screens).
- Accent colours:
  - `#4AF0D5` (teal highlight), `#3CCAB4` (hover/pressed), and `#8998A8`
    (muted text + iconography).
- A single warm accent appears as `#FEA` (`#FFEEAA` in RGB) within
  `explore.html`; treat this as a contextual badge/warning rather than a core
  brand tone.
- Typography defaults to white (`#FFFFFF`) for the dark theme and shades of the
  neutral stack for secondary labels.

Mapping guidance:

- Assign the four dark neutrals to `color.neutral.{900,850,800,700}` so we can
  drive DaisyUI `base-100` through `base-300` directly from tokens.
- Map `#4AF0D5` to `color.accent.500` and `#3CCAB4` to `color.accent.600` to
  preserve hover contrast. Keep `color.primary` reserved for future brand
  highlights (orange) but consider introducing a `brand` semantic token that
  points to accent teal for now.
- Capture `#8998A8` as `color.neutral.400` to inform muted text, icon strokes,
  and borders.
- Light mode will reuse the same teal accent values but invert the neutral stack
  (introduce lighter surface tones in the `color.neutral.0-200` range while
  mapping darker greys back onto text tokens).

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
- Define a deterministic light theme by inverting the neutral ladder:
  - Base backgrounds: new values around `#F6FBFF`, `#E9F1F7`, and `#D5DEE8`.
  - Foreground text: reuse `#0D1A26` and `#203445` as `fg.default`/`fg.muted`.
  - Maintain `accent` teal unchanged to avoid perceptual colour drift between
    themes.
- Extend semantic tokens to include utility hues (`success`, `warning`,
  `error`, `info`). Derive them from accessible palette pairs (target >=4.5:1
  contrast). Add placeholders now and refine once we build concrete UI states.
- Track the feedback palette directly in `tokens.json` (`color.info`,
  `color.success`, `color.warning`, `color.error`) so Style Dictionary can emit
  consistent values for both themes. Current picks mirror Tailwind Sky, Emerald,
  Amber, and Rose scales tuned for ≥4.5:1 contrast on the chosen foregrounds.

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
- Implementation checklist:
  1. Extend the Style Dictionary build to output:
     - `tokens/dist/tailwind.theme.cjs` exporting `theme.extend` fragments and
       DaisyUI theme objects.
     - `tokens/dist/tokens.css` containing CSS custom properties (for Radix and
       raw CSS consumers) plus an `@theme` block Tailwind can pick up.
  2. Import `tokens/dist/tokens.css` at the top of `src/index.css` before the
     Tailwind `@import`.
  3. Add `@config "./tailwind.config.cjs";` to `src/index.css` so Tailwind v4
     reads the JS config.
  4. Update `tailwind.config.cjs` to consume the generated JS exports:
     - Spread `theme.extend` with spacing, radius, and colour tokens.
     - Register DaisyUI themes so `wildsideNight` is the default and
     `wildsideDay` is marked with `--preferslight`.
  5. Include `@tailwindcss/vite` in `vite.config.ts` to ensure HMR picks up
     token rebuilds, and wire watch paths to `tokens/dist`.
  6. Ensure the GitHub Pages workflow runs `bun run tokens:build` before
     `bun run build` so compiled CSS/JS are fresh.
- Tokens CSS now contains both the DaisyUI `@plugin` configuration and the
  theme definitions, letting the app import a single file for runtime tokens,
  Tailwind `@theme`, and DaisyUI setup.

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

### Proposed module layout

- `src/app/providers`
  - `theme-provider.tsx`: wraps children, reads generated DaisyUI themes, and
    exposes helpers for toggling `data-theme` (reusing `applyTheme` + context).
  - `query-client.tsx`: initialises TanStack Query for future data wiring, even
    if mock data is static today.
- `src/app/layout`
  - `mobile-shell.tsx`: renders the 390 x 844 device frame, optional background
    gradients, safe-area padding, and a slot for page content.
  - `app-header.tsx`: shared top bar with configurable actions (back, share,
    help).
- `src/app/features`
  - `discover`: onboarding carousel, interest chips (`Radix ToggleGroup`),
    progress indicator.
  - `map`: map view shell with Radix `Tabs` for switching stops/map/notes and a
    sheet component for point-of-interest details.
  - `wizard`: multi-step flow leveraging `Stepper` built from Radix
    `Tabs`/`Progress`/`Slider`.
  - `safety`, `offline`, `auth`: standalone pages with shared layout tokens.
- `src/app/routes`
  - Static routes powered by TanStack Router (e.g., `/discover`, `/map/quick`,
    `/wizard/advanced`). Each route composes the relevant feature module.
- `src/app/data`
  - JSON/TS modules representing the mock content (walk cards, interests,
    stats) to keep JSX clean and enable future API wiring.

### Radix primitive mapping

- `Dialog`/`Sheet`: saved walk share modal, offline download prompt, wizard
  confirmation.
- `Tabs`: map/stops/notes switches, onboarding stepper controls.
- `Accordion`: safety checklist sections.
- `Progress`: wizard step indicator and completion stats.
- `Slider`: duration control, pace selectors.
- `Checkbox`/`ToggleGroup`: interest chips and accessibility filters.
- `Toast`: feedback when saving walks or completing actions.
- `Popover`/`Tooltip`: inline help icons, map annotations.

## Migration workflow

- Stage 0 – Foundations:
  1. Implement token build pipeline and DaisyUI theme plumbing.
  2. Ship shared layout components and global providers.
  3. Load mock data fixtures (walk metadata, interests, safety tips).
- Stage 1 – Onboarding and discovery:
  - `discover`, `explore`, `customize`.
  - Focus on Radix `Tabs`/`Carousel` patterns, interest chips, CTA buttons.
- Stage 2 – Map experiences:
  - `map-quick-walk`, `map-itiniary`, `saved`.
  - Introduce map canvas placeholder, Radix `Tabs` for stops/map/notes, and
    sheet/dialog overlays for POI detail.
- Stage 3 – Wizard flow:
  - `walk-wizard-1/2/3`.
  - Build shared wizard stepper, slider, and Radix `Dialog` for confirmations.
- Stage 4 – Completion and offline support:
  - `walk-complete`, `offline`, `safety-accessibility`.
  - Emphasise `Accordion` for safety lists and celebratory toasts/modals.
- Stage 5 – Account handling:
  - `sign-in`.
  - Wire Radix `Dialog`/`Popover` patterns for tooltips and integrate form
    validation scaffolding.
- For each page implementation:
  1. Catalogue UI states from the mockup and confirm data dependencies.
  2. Map UI elements to reusable components defined in the architecture plan.
  3. Implement route component and supporting feature pieces (hooks, fixtures).
  4. Cover interactive logic with Vitest + Testing Library (tabs, dialog open,
     slider updates, toasts).
  5. Manually validate in Vite preview, capture notes in this design log, and
     update documentation where behaviour diverges.
- Reassess the backlog after each stage to identify refinements or newly shared
  components worth extracting.

## Verification plan

- Local automation:
  - `bun run fmt` (Biome write mode) before staging to keep Markdown and TS in
    sync with formatting rules.
  - `bun run lint` (Biome CI). Address existing rule violations incrementally;
    track outstanding suppressions in this log.
  - `bun run check:types` to ensure TS stays strict as components are migrated.
  - `bun run test` to execute Vitest suites. Add coverage thresholds once the
    component set stabilises.
  - `bun run tokens:build` (to be added) ahead of `bun run dev`/`bun run build`
    so generated CSS/JS reflect current token definitions.
- Visual QA:
  - Capture Storybook-style reference states using Vite preview + Playwright
    screenshots once key flows exist.
  - Run `bunx playwright test --project=chromium --grep @a11y` for targeted Axe
    scans (tests to be authored) and document deltas here.
- Documentation checks:
  - `bunx markdownlint 'docs/**/*.md'` until a dedicated `make markdownlint`
    target exists.
  - Update this file and relevant docs after every significant decision or
    deviation from mockups.
- CI alignment:
  - Ensure the GitHub Pages workflow runs the same commands (`fmt`, `lint`,
    `check:types`, `test`, `tokens:build`, `build`) and fails fast on token or
    lint regressions.

## Open questions

- Determine timeline and success criteria for evaluating alternative icon sets.
- Define local developer ergonomics for token rebuilds (for example, `bun run
  tokens:build`) and ensure documentation reflects the expected workflow.
