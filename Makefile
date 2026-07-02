.PHONY: check-fmt lint typecheck test

check-fmt:
	bunx biome format --write src tests tools package.json biome.jsonc bunfig.toml

lint:
	bun lint
	actionlint .github/workflows/semantic-lint.yml

typecheck:
	bun check:types

test:
	bun test
