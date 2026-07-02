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
