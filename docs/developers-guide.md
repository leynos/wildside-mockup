# Developers guide

This guide records the local development commands and Continuous Integration
(CI) tooling that contributors should have available before working on the
application.

## Local prerequisites

Install the standard project toolchain before running gates locally:

- [Bun](https://bun.sh/) for package installation, scripts, tests, and Vite
  tooling.
- [uv](https://docs.astral.sh/uv/) for `uvx`, which runs Semgrep inside the
  semantic lint suite.
- [actionlint](https://github.com/rhysd/actionlint) for validating GitHub
  Actions workflow syntax.
- [mbake](https://github.com/jeluard/mbake) for validating Makefile syntax
  when Makefile targets change.

After cloning, install JavaScript dependencies with:

```bash
bun install --frozen-lockfile
```

## Makefile gates

The repository exposes the review and CI-adjacent checks through Makefile
targets. Prefer these targets over invoking the underlying commands directly
when validating a change.

- `make check-fmt` formats source, tests, tools, root config, and this
  developer guide with Biome.
- `make lint` runs `bun lint` and validates
  `.github/workflows/semantic-lint.yml` with `actionlint`.
- `make typecheck` runs the TypeScript compiler with `bun check:types`.
- `make test` runs the Bun unit and behavioural test suite.
- `make markdownlint` validates Markdown and enforces spelling.
- `make nixie` validates Mermaid diagrams.

When changing the Makefile itself, validate it with:

```bash
mbake validate Makefile
```

## Semantic lint tooling

The semantic lint gate is run locally with:

```bash
bun semantic
```

This command executes the semantic suite: Biome checks, class-list length and
near-duplicate checks, Semgrep semantic rules through `uvx`, and Stylelint for
CSS. Because Semgrep is invoked through `uvx`, local development environments
and CI runners must provide `uv`.

The GitHub Actions workflow that runs this gate installs Bun and uv before
running `bun semantic`. Keep third-party workflow actions pinned to immutable
commit SHAs, and run `make lint` after workflow changes so `actionlint`
validates the edited YAML.

## Spelling policy

The `make spelling` gate enforces en-GB-oxendict spelling across tracked text.
It runs Typos 1.48.0 and a phrase checker that rejects the hyphenated form in
favour of `handwritten`. `make markdownlint` depends on the same spelling gate.

The tracked `typos.toml` is generated from the shared Oxford dictionary and the
repository-specific `typos.local.toml` overlay. The generator is the focused
`typos-config-builder` command pinned to commit
`b604f198797fdd36a567dd0f8f07b13f9539b241`. It refreshes the untracked
`.typos-oxendict-base.toml` cache only when the authority is newer than the
local copy; `.typos-oxendict-base.json` records refresh metadata.

Use `make spelling-config-write` after changing `typos.local.toml`, and use
`make spelling-config` to check deterministic output. Never edit `typos.toml`
directly. Keep repository exceptions narrow: preserve external APIs, formal
names, wire values and immutable fixtures without adding ordinary bare-word
exceptions.

The standalone phrase helper and its tests use Python 3.14 at runtime,
Pathspec 1.1.1 and a Python 3.13 Ruff compatibility target. Continuous
integration installs Nixie 1.1.0 and Merman CLI 0.7.0 before validating the
repository's Mermaid diagrams with `make nixie`.
