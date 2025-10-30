# Wildside Front‑End Semantic Linting — Implementation Guide (BiomeJS + GritQL first)

**Audience:** Implementers working on `wildside-mockup` (and later `wildside`).  
**Goal:** Enforce semantic, accessible HTML with clean, token‑driven Tailwind/DaisyUI usage. Prefer **BiomeJS + GritQL** rules; fall back to **Semgrep**/**Stylelint** when they express rules better.  
**Outcome:** Readable, queryable markup; reusable semantic classes via `@apply`; consistent DaisyUI/Radix‑aligned naming; single CLI for local + CI.

---

## 0) Scope & Philosophy

- **Files:** `.tsx`, `.html`, `.css` (Tailwind v4 + DaisyUI v5).
- **Primary tool:** **BiomeJS** linter with **GritQL** rules (diagnostics only).  
- **Fallbacks:**
  - **Stylelint** — design‑token enforcement, CSS `@apply` hygiene, units/specificity.
  - **Semgrep** — simple cross‑language regex/AST patterns (HTML/JSX) where easier than GritQL.
- **Design doctrine:**
  1. **Semantics first** — native elements/landmarks; ARIA fills gaps.
  2. **Tokens over literals** — DaisyUI/Tailwind tokens, not raw hex.
  3. **Compose w/ DaisyUI components** — refine with utilities.
  4. **Readable HTML** — extract repeated utility strings into **semantic classes** via `@apply` and sensible cascades.
  5. **Configurable thresholds** — warn on repetition beyond agreed limits.

---

## 1) Repository Layout (suggested)

```
wildside-mockup/
├─ src/
│  ├─ app/...                 # TSX
│  └─ styles/
│     ├─ app.css             # @import "tailwindcss" + @plugin "daisyui"
│     ├─ tokens.css          # (generated or hand-written tokens)
│     ├─ semantic.css        # project semantic classes using @apply
│     └─ utilities.css       # optional @utility shorthands (Tailwind v4)
├─ tools/
│  ├─ grit/
│  │  ├─ rule-a11y.grit
│  │  ├─ rule-daisyui.grit
│  │  ├─ rule-repetition.grit
│  │  └─ rule-allowlist.grit
│  ├─ semgrep-semantic.yml
│  ├─ stylelint.config.cjs
│  └─ semantic-lint.config.json   # thresholds & allowlists
├─ biome.json
├─ package.json
└─ .github/workflows/lint.yml
```

`semantic.css` is where you add reusable classes via `@apply`. Use Tailwind v4 CSS‑first configuration in `app.css`.

---

## 2) Tailwind v4 + DaisyUI v5 baseline (CSS‑first)

**`src/styles/app.css`**
```css
@import "tailwindcss";

/* DaisyUI themes */
@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
}

/* Tailwind v4: optionally hint sources if needed */
@source "../**/*.{ts,tsx,js,jsx,html}";
```

**Where to put semantic classes** — `src/styles/semantic.css` (import it from your entry) and build with:
```css
/* Example semantic classes built from utilities */
.btn-primary {
  @apply btn btn-primary;  /* DaisyUI base + role */
}
.form-section-title {
  @apply text-lg font-semibold text-base-content;
}
.nav__link {
  @apply inline-flex items-center gap-2 text-sm font-medium text-base-content hover:text-primary;
}
.nav__link--active {
  @apply text-primary;
}
```
> Use semantic classes for **repeated patterns**; keep one‑offs directly in markup.

---

## 3) Configure BiomeJS + GritQL

**Install** (example):
```bash
pnpm add -D @biomejs/biome
```

**`biome.jsonc`** (excerpt from the repository today)
```jsonc
{
  "$schema": "https://biomejs.dev/schemas/stable/schema.json",
  "plugins": [
    "./tools/grit/rule-a11y.grit",
    "./tools/grit/rule-a11y-trailing.grit",
    "./tools/grit/rule-a11y-leading.grit",
    "./tools/grit/rule-a11y-span.grit",
    "./tools/grit/rule-a11y-span-trailing.grit",
    "./tools/grit/rule-a11y-span-leading.grit",
    "./tools/grit/rule-daisyui-btn-div.grit",
    "./tools/grit/rule-daisyui-btn-span.grit",
    "./tools/grit/rule-daisyui-btn-section.grit",
    "./tools/grit/rule-daisyui-btn-article.grit",
    "./tools/grit/rule-daisyui-btn-li.grit",
    "./tools/grit/rule-daisyui-btn-p.grit",
    "./tools/grit/rule-daisyui-input-div.grit",
    "./tools/grit/rule-daisyui-input-span.grit",
    "./tools/grit/rule-daisyui-input-section.grit",
    "./tools/grit/rule-daisyui-input-article.grit",
    "./tools/grit/rule-daisyui-input-li.grit",
    "./tools/grit/rule-daisyui-input-p.grit",
    "./tools/grit/rule-repetition-length.grit"
  ],
  "linter": { "enabled": true, "rules": { "recommended": true } }
}
```

> Biome’s current Grit integration accepts one pattern per file. The repository therefore keeps the rules granular (for example, separate files for `<div>` and `<span>` button misuse). If the plugin grows support for multi‑pattern files we can collapse this list back into fewer modules.

> If your Biome build doesn’t natively load GritQL, invoke a small Node wrapper that executes Grit rules and prints Biome‑style diagnostics. Keep the same paths/thresholds.

**`tools/semantic-lint.config.json`** (thresholds & policy)
```json
{
  "repeatMinClasses": 4,             // count of utilities constituting a "chunk"
  "repeatMinOccurrences": 2,         // instances before warning triggers
  "maxClasslistLength": 12,          // soft ceiling; notify above this
  "allowProjectPrefixes": ["btn", "card", "nav__", "form-", "ws-"],
  "disallowRawHex": true
}
```

---

## 4) GritQL rules (practical starters)

> Syntax below illustrates intent; adapt to your Grit adapter’s exact grammar. Keep messages **actionable**.

### A) Semantic interactivity (no clickable `<div>` / `<span>`)
Files:

- `tools/grit/rule-a11y.grit`
- `tools/grit/rule-a11y-trailing.grit`
- `tools/grit/rule-a11y-leading.grit`
- `tools/grit/rule-a11y-span.grit`
- `tools/grit/rule-a11y-span-trailing.grit`
- `tools/grit/rule-a11y-span-leading.grit`

Each file targets a common attribute ordering, for example:

```grit
`<div ... onClick={$CALL}>$body</div>` where {
  register_diagnostic(
    span = $CALL,
    message = "Replace this clickable <div> with a semantic <button> or <a>."
  )
}
```

### B) Landmarks & labels (gentle suggestions)
```grit
language tsx

// Div used as nav
`<div role="navigation" $attrs>$body</div>` => diag("Prefer <nav> for primary navigation.")

// Input without associated label (simple heuristic)
`<input $attrs />`
where { not(match($attrs, /aria-label=|id=/)) }
=> diag("Inputs need a label: use <label for=...> or aria-label.")
```

### C) DaisyUI usage sanity
Files:

- `tools/grit/rule-daisyui-btn-div.grit`
- `tools/grit/rule-daisyui-btn-span.grit`
- `tools/grit/rule-daisyui-btn-section.grit`
- `tools/grit/rule-daisyui-btn-article.grit`
- `tools/grit/rule-daisyui-btn-li.grit`
- `tools/grit/rule-daisyui-btn-p.grit`
- `tools/grit/rule-daisyui-input-div.grit`
- `tools/grit/rule-daisyui-input-span.grit`
- `tools/grit/rule-daisyui-input-section.grit`
- `tools/grit/rule-daisyui-input-article.grit`
- `tools/grit/rule-daisyui-input-li.grit`
- `tools/grit/rule-daisyui-input-p.grit`

Each file inverts a common misuse, e.g.

```grit
`<div ... className="... btn ..."` ...`>$body</div>` where {
  register_diagnostic(
    span = $body,
    message = "DaisyUI `btn` belongs on interactive elements (<button>, <a>, or submit <input>)."
  )
}
```

The duplication keeps messages targeted whilst Biome’s current Grit plugin limits us to one pattern per file.

### D) Repetition → extract with `@apply`
- `scripts/check-classlist-length.ts`
- `scripts/find-near-duplicate-classes.ts`

We rely on lightweight TypeScript checkers (run as part of `bun run semantic`) to flag class strings that exceed the configured threshold **and** to warn about near-duplicate utility sets. The scripts read thresholds from `tools/semantic-lint.config.json`, normalise whitespace, and report literals that violate the agreed limits.

> Adjust `maxClasslistLength` **and** the `nearDuplicateClasses` block and re-run `bun run semantic` to enforce different ceilings.

### E) Near duplicate detection

The near-duplicate checker tokenises each literal, deduplicates utilities, and compares token sets using Jaccard similarity. Any pair (or group) whose similarity exceeds the configured threshold produces a single diagnostic summarising the overlap and paths. Suggested defaults are bundled in `tools/semantic-lint.config.json`:

```jsonc
"nearDuplicateClasses": {
  "minTokenCount": 4,
  "maxJaccardDistance": 0.25,
  "minOccurrences": 2,
  "tokenIndexSample": 5,
  "suppressPrefixes": ["prose-", "wysiwyg-"]
}
```

Adjust these knobs to tune the signal. When the checker fires, extract a semantic `@apply` class (for example inside `semantic.css`) and reuse it instead of cloning similar utility lists.

---

## Proposed meaning-first semantic checks (roadmap)

These heuristics focus on **structural intent** rather than raw class similarity. Each item describes what to detect, why it matters, and the preferred fix we will recommend in future lint passes.

### 1) “Div/span soup” (utility-only wrapper chains)
- **Signal**: Two or more nested `<div>`/`<span>` nodes whose only attribute is a utility-heavy `className` (no `role`, `aria-*`, `id`, `data-*`, event handlers).
- **Meaning**: The wrapper is expressing a *layout concept* (stack, cluster, surface) without naming it.
- **Action**: Warn and suggest extracting a named container class (e.g. `.stack`, `.cluster`, `.card__body`) via `@apply`.
- **Implementation notes**: GritQL rule that walks parent/child utility-only nodes and fires when depth ≥ 2; fallback AST walker if needed.

### 2) Landmarks and slot semantics
- **Signal**: Utility-only child elements inside semantic regions such as `<nav>`, `<header>`, `<ul>`, `<form>`.
- **Meaning**: These are *slots* (navigation links, menu items, form controls) that deserve a named semantic class.
- **Action**: Suggest contextual names like `.nav__link`, `.nav__link--active`, `.menu__item`, `.form__label`.
- **Implementation notes**: GritQL ancestor constraint rules that tailor the suggestion to the enclosing landmark.

### 3) Repeated sibling pattern (loop intent)
- **Signal**: Identical or near-identical class lists applied to siblings, especially those produced by `.map()` in TSX.
- **Meaning**: Indicates a row/tile/card abstraction that should become a shared class.
- **Action**: Recommend extracting both a container class (e.g. `.card-grid`) and an item class (e.g. `.card`).
- **Implementation notes**: Extend the existing near-duplicate script to consider siblings grouped by parent, or add a dedicated GritQL rule for `.map()` return values.

### 4) Token-to-concept mapping
- **Signal**: Utility combinations that scream a known component (button, chip, badge, toolbar, tabs trigger).
- **Meaning**: The element already behaves like a component but lacks a semantic name.
- **Action**: Issue prescriptive suggestions derived from a concept dictionary (e.g. `.chip`, `.toolbar`, `.tabs__trigger`).
- **Implementation notes**: Dictionary-driven matcher in the companion script or GritQL predicates that match presence/absence token sets.

### 5) Stateful slots (Radix/DaisyUI attributes)
- **Signal**: Elements with `data-state`, `aria-selected`, `aria-current`, `role="tab"` and long utility lists.
- **Meaning**: State-driven UI pieces should expose a semantic class for styling the base and active states.
- **Action**: Recommend classes like `.tabs__trigger` plus state modifiers in CSS.
- **Implementation notes**: GritQL rule watching for state attributes plus utility load.

### 6) Anonymous layout wrappers
- **Signal**: Elements using only layout utilities (flex/grid/gap/justify/space) without semantics.
- **Meaning**: These are layout patterns (stack/cluster/switcher) that deserve named abstractions.
- **Action**: Suggest layout semantics (e.g. `.stack`, `.cluster`, `.sidebar`).
- **Implementation notes**: Token classifier that recognises layout-only sets; fire in GritQL or the script.

### 7) Heading/title repetition
- **Signal**: The same utility bundle repeated across multiple headings (`<h1>`-`<h4>`) or section titles.
- **Meaning**: Editorial roles should be expressed via `.section-title`, `.card__title`, etc.
- **Action**: Recommend extracted title classes with `@apply`.
- **Implementation notes**: GritQL rule that tracks heading class repetition counts.

### 8) Utility load vs. semantic signal score
- **Signal**: Elements with heavy utility usage but little semantic metadata (no role/id/aria/data).
- **Meaning**: Frequent offender list for “this should have a name”.
- **Action**: Soft warning nudging authors to introduce a semantic class summarising intent.
- **Implementation notes**: Extend the companion script to compute a heuristic score `(tokenCount - semanticSignals)` and warn above a configurable threshold.

Each proposal will ship with a concrete class name suggestion and will reference `src/styles/semantic.css` (or `@utility` helpers) so fixes are straightforward.

### E) Class allowlist (Tailwind, DaisyUI, project semantics)

The current Biome plugin does not yet expose helpers such as `split_classes`. Until it does, the repository enforces the allowlist via **Semgrep** (`tools/semgrep-semantic.yml`, rule `class-token-uppercase`) which catches camelCase tokens and other non‑Tailwind/DaisyUI class names. When the Grit integration grows richer predicates we can migrate this rule back into Grit.

---

## 5) Stylelint (focused rules only)

**Install**
```bash
pnpm add -D stylelint stylelint-declaration-strict-value
```

**`tools/stylelint.config.cjs`**
```js
export default {
  plugins: ["stylelint-declaration-strict-value"],
  rules: {
    // Disallow hex/named colors; require tokens or Tailwind classes
    "color-no-hex": true,
    "color-named": "never",

    // Enforce tokens for key props (allow CSS variables + keywords)
    "scale-unlimited/declaration-strict-value": [[
      ["/^color$/", "^background(-color)?$", "^border(-.*)?-color$", "fill", "stroke", "outline-color"],
    ], { ignoreValues: ["transparent", "currentColor", "/^var\\(--/" ] }],

    // Discourage !important; keep specificity sane
    "declaration-no-important": true,

    // Optional unit policy (px allowed in borders etc.)
    "declaration-property-unit-disallowed-list": {
      "/^(margin|padding|gap|inset|top|right|bottom|left)$/": ["px"]
    }
  }
}
```

> We’re **not** using Stylelint for general formatting; only token enforcement and a few hygiene rules.

---

## 6) Semgrep (targeted HTML/JSX checks)

**Install & config**
```bash
pnpm add -D semgrep
```

**`tools/semgrep-semantic.yml`**
```yaml
rules:
  # Raw Tailwind color utilities instead of semantic roles
  - id: tailwind-raw-color-class
    patterns:
      - pattern-regex: "\b(text|bg|border)-(red|blue|green|gray|slate|zinc|stone|amber|rose)-[0-9]{2,3}\b"
    message: "Prefer DaisyUI role classes (e.g., bg-primary, text-base-content) over raw Tailwind color scale."
    languages: [javascript, typescript, jsx, tsx, html]
    severity: WARNING

  # Dynamic daisyUI token in template literal (build-time discovery issue)
  - id: daisyui-dynamic-token
    pattern-regex: "`[^`]*\\b(btn|badge|alert|tab)-\${[^}]+}[^`]*`"
    message: "Avoid dynamic DaisyUI token names (e.g. `btn-${color}`) — Tailwind cannot statically include them."
    languages: [javascript, typescript, jsx, tsx]
    severity: WARNING

  # Overly long class attribute (coarse backstop)
  - id: classlist-too-long
    pattern-regex: "class(Name)?=\\{?['\"][^'\"]{120,}['\"]\\}?"
    message: "Long class list — extract into a semantic class with @apply."
    languages: [javascript, typescript, jsx, tsx, html]
    severity: WARNING
```

---

## 7) Unified CLI & Dev Workflow

**`package.json`**
```json
{
  "scripts": {
    "lint:semantic": "pnpm biome lint && pnpm semgrep --config tools/semgrep-semantic.yml && pnpm stylelint 'src/**/*.css'"
  }
}
```

- **Local dev:** run `pnpm lint:semantic` before commit.  
- **Pre-commit (optional):** add Husky hook to run the script and block on errors/warnings.
- **CI (GitHub Actions)** — **`.github/workflows/lint.yml`**
```yaml
name: semantic-lint
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint:semantic
```

> If you prefer warnings locally but failures in CI, add `--error` flags or set Biome to warn and gate on Semgrep/Stylelint only.

---

## 8) How to refactor into `@apply` (+ cascades)

1. **Spot repetition:** linter warns that a class chunk is repeated (e.g., `inline-flex items-center gap-2 text-sm font-medium text-base-content`).
2. **Name the concept:** choose a **semantic** name that reflects purpose, not appearance: e.g., `.nav__link`.
3. **Define once:** in `src/styles/semantic.css`:
   ```css
   .nav__link { @apply inline-flex items-center gap-2 text-sm font-medium text-base-content hover:text-primary; }
   .nav__link--active { @apply text-primary; }
   ```
4. **Replace usages:** change `className` to the new class (keep any **unique** one-off utilities alongside if needed: `className="nav__link md:pl-3"`).
5. **Use cascades where logical:** if a set of children share typography/spacing, apply a parent class and let children inherit or use low‑specificity selectors:
   ```css
   .form-section { @apply space-y-3; }
   .form-section .form-section-title { @apply text-lg font-semibold; }
   ```

**Naming guidance:**
- Mirror DaisyUI where it fits: `.btn`, `.btn-primary`, `.card`, `.card-title`.
- For bespoke patterns: BEM‑ish and role‑based, e.g. `.walk-card`, `.walk-card__title`; or `.nav__link--active`.
- Prefer **role tokens** (`primary`, `secondary`, `accent`, `success`, `error`) to color words.

---

## 9) Quick rule checklists (what the lints enforce)

- **Semantic & a11y**
  - No clickable `div/span` without role+keyboard; prefer `<button>/<a>`.
  - Use `<nav>/<main>/<header>/<footer>` over `div[role=...]`.
  - Inputs must be labeled (`<label for=...>` or `aria-label`).

- **DaisyUI composition**
  - `btn` belongs on interactive elements.
  - `input`/`select`/`textarea` use matching DaisyUI classes.

- **Design tokens**
  - No hex/named colors in CSS.
  - Prefer role utilities (`bg-primary`, `text-base-content`) over raw Tailwind color scales.

- **Repetition & readability**
  - Warn on long/repeated class chunks → extract with `@apply` into `semantic.css`.
  - Unknown class tokens flagged (must be Tailwind, DaisyUI, or project semantic class prefix).

---

## 10) IDE tips

- Enable Tailwind IntelliSense for class hints and token names.
- Configure Biome to format on save; run `pnpm lint:semantic` before commits.
- Consider an editor task to open `semantic.css` quickly when a repetition warning appears.

---

## 11) Future extensions

- **Cross‑file repetition index** (cache normalized chunks to detect repeats across the whole repo).
- **Contrast checks** (static heuristics on text/background utility pairs).
- **Autofix codemods** (Grit rewrite scripts that scaffold a new class and replace duplicates in a file).

---

## 12) FAQ

**Q: Will `@apply` bloat CSS?**  
A: We extract only repeated patterns. Tailwind still tree‑shakes class‑based styles; the few semantic classes you add are minimal and intentionally reused.

**Q: When is it *okay* to keep utilities inline?**  
A: One‑offs, quick prototypes, and tiny adjustments local to a component. Once the same chunk appears twice, prefer extracting it.

**Q: How strict are thresholds?**  
A: Configurable. Start with `repeatMinClasses=4`, `repeatMinOccurrences=2`. Tighten as the design system matures.

---

### Ready-to-run checklist

1) Add files: `tools/grit/*.grit`, `tools/semantic-lint.config.json`, `tools/stylelint.config.cjs`, `tools/semgrep-semantic.yml`.  
2) Wire **Biome** plugin or wrapper to execute Grit rules (paths above).  
3) Add **`semantic.css`** and begin extracting repeated patterns with `@apply`.  
4) Add **`lint:semantic`** script and the CI workflow.  
5) Iterate on thresholds, allowlist prefixes, and rule messages as the team gains patterns.
