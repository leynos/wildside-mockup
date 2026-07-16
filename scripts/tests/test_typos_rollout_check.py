"""Test exact phrase-policy enforcement."""

import importlib
from pathlib import Path
import subprocess
import types

import pytest

SCRIPTS = Path(__file__).resolve().parents[1]
PROHIBITED = "hand" + "-written"
TITLE_PROHIBITED = "Hand" + "-written"


@pytest.fixture
def checker(monkeypatch: pytest.MonkeyPatch) -> types.ModuleType:
    """Import the standalone phrase checker from the scripts directory."""
    monkeypatch.syspath_prepend(str(SCRIPTS))
    importlib.invalidate_caches()
    return importlib.import_module("typos_rollout_check")


def initialize(path: Path, files: dict[str, str]) -> None:
    """Create and stage a small tracked-file fixture."""
    for relative, content in files.items():
        target = path / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")
    subprocess.run(["git", "init", "--quiet"], cwd=path, check=True)
    subprocess.run(["git", "add", "."], cwd=path, check=True)


def policy_files(*, local_phrase: str = "") -> dict[str, str]:
    """Return minimal generated, shared, and local policy documents."""
    return {
        "typos.toml": (
            f"# Policy for {PROHIBITED} corrections.\n"
            '[files]\nextend-exclude = ["*.md", "!README.md"]\n\n'
            '[default]\nextend-ignore-re = ["`[^`\\\\n]+`"]\n'
        ),
        ".typos-oxendict-base.toml": (
            f'[phrases.corrections]\n"{PROHIBITED}" = "handwritten"\n'
        ),
        "typos.local.toml": local_phrase,
    }


class TestPhrasePolicyChecker:
    """Exercise the phrase checker's policy, scanning, and CLI boundaries."""

    def test_load_policy_combines_phrase_and_generated_scan_policy(
        self, checker: types.ModuleType, tmp_path: Path
    ) -> None:
        """Load shared phrases and generated scan settings."""
        files = policy_files(
            local_phrase='[phrases.corrections]\n"fit-for-purpose" = "suitable"\n'
        )
        initialize(tmp_path, files)

        policy = checker.load_policy(tmp_path)

        assert policy.phrase_corrections == (
            ("fit-for-purpose", "suitable"),
            (PROHIBITED, "handwritten"),
        ), "shared and local phrase corrections were not combined"
        assert policy.ignore_patterns == (r"`[^`\n]+`",), (
            "generated ignore patterns were not loaded"
        )
        assert policy.excluded_files == ("*.md", "!README.md"), (
            "generated file exclusions were not loaded"
        )

        (tmp_path / ".typos-oxendict-base.toml").unlink()
        with pytest.raises(FileNotFoundError, match=r"docs/developers-guide\.md"):
            checker.load_policy(tmp_path)

    @pytest.mark.parametrize(
        ("invalid_policy", "message"),
        [
            pytest.param(
                (
                    ".typos-oxendict-base.toml",
                    "phrases = []\n",
                ),
                "'phrases' must be a table",
                id="shared-phrases-table",
            ),
            pytest.param(
                (
                    ".typos-oxendict-base.toml",
                    "[phrases]\ncorrections = []\n",
                ),
                "'corrections' must be a table",
                id="shared-corrections-table",
            ),
            pytest.param(
                (
                    "typos.local.toml",
                    "phrases = []\n",
                ),
                "'phrases' must be a table",
                id="local-phrases-table",
            ),
            pytest.param(
                (
                    "typos.local.toml",
                    "[phrases.corrections]\ninvalid = 1\n",
                ),
                "phrase corrections must map strings to strings",
                id="local-correction-value",
            ),
            pytest.param(
                (
                    "typos.toml",
                    "[files]\nextend-exclude = [1]\n[default]\nextend-ignore-re = []\n",
                ),
                "'extend-exclude' must be a list of strings",
                id="generated-exclusions-list",
            ),
        ],
    )
    def test_load_policy_rejects_malformed_shapes(
        self,
        checker: types.ModuleType,
        tmp_path: Path,
        invalid_policy: tuple[str, str],
        message: str,
    ) -> None:
        """Reject malformed shared, local, and generated policy values."""
        relative, malformed = invalid_policy
        files = policy_files()
        files[relative] = malformed
        initialize(tmp_path, files)

        with pytest.raises(TypeError, match=message):
            checker.load_policy(tmp_path)

    def test_checker_preserves_boundaries_masking_and_exclusions(
        self, checker: types.ModuleType, tmp_path: Path
    ) -> None:
        """Report phrases only when boundaries and policy allow them."""
        initialize(
            tmp_path,
            {
                "README.md": (
                    f"{PROHIBITED}\n{TITLE_PROHIBITED} prose\n"
                    + "pre-hand"
                    + "-written\n"
                    + f"`{PROHIBITED}`\n"
                ),
                "skip.md": f"{PROHIBITED}\n",
                **policy_files(),
            },
        )

        findings = checker.check_phrase_corrections(
            tmp_path, checker.load_policy(tmp_path)
        )

        assert [(item.line, item.phrase) for item in findings] == [
            (1, PROHIBITED),
            (2, TITLE_PROHIBITED),
        ], "phrase boundaries, masking, or exclusions changed"

    @pytest.mark.parametrize(
        ("text", "patterns"),
        [
            pytest.param("plain text", (), id="unmasked"),
            pytest.param("before `masked` after", (r"`[^`]+`",), id="single-line"),
            pytest.param(
                "before\n<!-- masked\nspan -->\nafter",
                (r"(?s)<!--.*?-->",),
                id="multiline",
            ),
        ],
    )
    def test_masking_preserves_offsets(
        self,
        checker: types.ModuleType,
        text: str,
        patterns: tuple[str, ...],
    ) -> None:
        """Masking preserves every source offset and newline position."""
        masked = checker._masked(text, patterns)

        assert len(masked) == len(text), "masking changed source length"
        assert [index for index, value in enumerate(masked) if value == "\n"] == [
            index for index, value in enumerate(text) if value == "\n"
        ], "masking changed newline positions"

    @pytest.mark.parametrize(
        "content",
        [
            pytest.param(b"\xff", id="invalid-leading-byte"),
            pytest.param(b"text\n\x80", id="invalid-continuation-byte"),
        ],
    )
    def test_checker_surfaces_decode_errors(
        self,
        checker: types.ModuleType,
        tmp_path: Path,
        content: bytes,
    ) -> None:
        """Invalid UTF-8 in an eligible tracked file fails the query."""
        initialize(tmp_path, {"README.md": "placeholder\n", **policy_files()})
        (tmp_path / "README.md").write_bytes(content)

        with pytest.raises(UnicodeDecodeError):
            checker.check_phrase_corrections(tmp_path, checker.load_policy(tmp_path))

    def test_checker_surfaces_read_errors(
        self,
        checker: types.ModuleType,
        monkeypatch: pytest.MonkeyPatch,
        tmp_path: Path,
    ) -> None:
        """An unreadable eligible tracked file fails the query."""
        initialize(tmp_path, {"README.md": "allowed prose\n", **policy_files()})
        original_read_text = checker.Path.read_text
        failure = PermissionError("read denied")

        def fail_read(path: Path, *args: object, **kwargs: object) -> str:
            """Raise the selected read failure for the tracked fixture."""
            if path.name == "README.md":
                raise failure
            return original_read_text(path, *args, **kwargs)

        monkeypatch.setattr(checker.Path, "read_text", fail_read)

        with pytest.raises(PermissionError) as raised:
            checker.check_phrase_corrections(tmp_path, checker.load_policy(tmp_path))

        assert raised.value is failure, "the checker replaced the file read failure"

    def test_main_reports_location_and_exit_two(
        self,
        checker: types.ModuleType,
        tmp_path: Path,
        capsys: pytest.CaptureFixture[str],
    ) -> None:
        """Return two and preserve the established path diagnostic."""
        initialize(
            tmp_path,
            {"README.md": f"Prefer {PROHIBITED}.\n", **policy_files()},
        )

        assert checker.main(["--repository", str(tmp_path)]) == 2, (
            "the command accepted a prohibited phrase"
        )
        assert capsys.readouterr().out == (
            f"README.md:1:8: {PROHIBITED} -> handwritten\n"
        ), "the diagnostic omitted its source location or correction"

    def test_main_accepts_clean_repository_without_output(
        self,
        checker: types.ModuleType,
        tmp_path: Path,
        capsys: pytest.CaptureFixture[str],
    ) -> None:
        """Return zero without output when no prohibited phrase is present."""
        initialize(tmp_path, {"README.md": "Allowed prose.\n", **policy_files()})

        assert checker.main(["--repository", str(tmp_path)]) == 0, (
            "the command rejected a clean repository"
        )
        captured = capsys.readouterr()
        assert captured.out == "", "the successful command wrote to stdout"
        assert captured.err == "", "the successful command wrote to stderr"
