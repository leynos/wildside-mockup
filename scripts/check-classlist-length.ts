import { readFileSync } from "node:fs";
import { relative } from "node:path";
import ts from "typescript";

interface SemanticConfig {
  maxClasslistLength?: number;
}

const CONFIG_PATH = "tools/semantic-lint.config.json";
const PROJECT_ROOT = process.cwd();

function loadThreshold(): number {
  const raw = readFileSync(CONFIG_PATH, "utf8");
  const config = JSON.parse(raw) as SemanticConfig;
  const value = config.maxClasslistLength;
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }
  return 12;
}

function getTsxFiles(): string[] {
  const glob = new Bun.Glob("src/**/*.tsx");
  return Array.from(glob.scanSync(PROJECT_ROOT));
}

interface Violation {
  file: string;
  line: number;
  column: number;
  length: number;
  value: string;
}

function analyseFile(filePath: string, maxLength: number, results: Violation[]): void {
  const content = readFileSync(filePath, "utf8");
  const source = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const visit = (node: ts.Node) => {
    if (ts.isJsxAttribute(node) && node.name.text === "className" && node.initializer) {
      const literal = extractStringLiteral(node.initializer);
      if (literal) {
        const tokens = literal.trim().split(/\s+/).filter(Boolean);
        if (tokens.length > maxLength) {
          const { line, character } = source.getLineAndCharacterOfPosition(node.getStart());
          results.push({
            file: filePath,
            line: line + 1,
            column: character + 1,
            length: tokens.length,
            value: literal,
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
}

function extractStringLiteral(initializer: ts.JsxAttributeValue): string | null {
  if (ts.isStringLiteral(initializer)) {
    return initializer.text;
  }
  if (ts.isJsxExpression(initializer) && initializer.expression) {
    const expr = initializer.expression;
    if (ts.isStringLiteral(expr)) {
      return expr.text;
    }
    if (ts.isNoSubstitutionTemplateLiteral(expr)) {
      return expr.text;
    }
  }
  return null;
}

function main() {
  const maxLength = loadThreshold();
  const violations: Violation[] = [];
  for (const absolute of getTsxFiles()) {
    analyseFile(absolute, maxLength, violations);
  }

  if (violations.length === 0) {
    return;
  }

  for (const violation of violations) {
    const displayPath = relative(PROJECT_ROOT, violation.file);
    console.error(
      `${displayPath}:${violation.line}:${violation.column} className has ${violation.length} utilities (max ${maxLength}).`,
    );
  }

  process.exitCode = 1;
}

main();
