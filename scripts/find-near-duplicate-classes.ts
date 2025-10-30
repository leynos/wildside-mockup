import { readFileSync } from "fs";
import { join, relative } from "path";
import ts from "typescript";

type Location = { line: number; column: number };

type NormalisedClass = {
  filePath: string;
  location: Location;
  raw: string;
  tokens: string[];
  tokenSet: Set<string>;
};

type NearDuplicateConfig = {
  minTokenCount: number;
  maxJaccardDistance: number;
  minOccurrences: number;
  tokenIndexSample: number;
  suppressPrefixes: string[];
  failOnViolation: boolean;
};

type SemanticConfig = {
  nearDuplicateClasses?: Partial<NearDuplicateConfig>;
};

const PROJECT_ROOT = process.cwd();
const CONFIG_PATH = "tools/semantic-lint.config.json";
const DEFAULT_CONFIG: NearDuplicateConfig = {
  minTokenCount: 4,
  maxJaccardDistance: 0.25,
  minOccurrences: 2,
  tokenIndexSample: 5,
  suppressPrefixes: [],
  failOnViolation: false,
};

function loadConfig(): NearDuplicateConfig {
  const raw = readFileSync(CONFIG_PATH, "utf8");
  const parsed = JSON.parse(raw) as SemanticConfig;
  return {
    ...DEFAULT_CONFIG,
    ...(parsed.nearDuplicateClasses ?? {}),
  };
}

function globPaths(pattern: string): string[] {
  const glob = new Bun.Glob(pattern);
  return Array.from(glob.scanSync(PROJECT_ROOT));
}

function shouldSuppress(tokens: string[], prefixes: string[]): boolean {
  if (prefixes.length === 0) return false;
  return tokens.every((token) => prefixes.some((prefix) => token.startsWith(prefix)));
}

function normaliseToken(token: string): string {
  return token.trim().toLowerCase();
}

function normaliseClassString(raw: string, filePath: string, loc: Location, suppressPrefixes: string[]): NormalisedClass | null {
  const tokens = raw
    .split(/\s+/)
    .map(normaliseToken)
    .filter(Boolean);
  if (tokens.length === 0) return null;
  const uniqueTokens = Array.from(new Set(tokens)).sort((a, b) => a.localeCompare(b));
  if (shouldSuppress(uniqueTokens, suppressPrefixes)) {
    return null;
  }
  return {
    filePath,
    location: loc,
    raw,
    tokens: uniqueTokens,
    tokenSet: new Set(uniqueTokens),
  };
}

function extractStringLiteral(initialiser: ts.JsxAttributeValue): string | null {
  if (ts.isStringLiteral(initialiser)) {
    return initialiser.text;
  }
  if (ts.isJsxExpression(initialiser) && initialiser.expression) {
    const expr = initialiser.expression;
    if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) {
      return expr.text;
    }

    if (ts.isTemplateExpression(expr)) {
      const head = expr.head.text;
      const spans = expr.templateSpans;
      const reconstructed: string[] = [head];
      for (const span of spans) {
        if (ts.isStringLiteral(span.expression) || ts.isNoSubstitutionTemplateLiteral(span.expression)) {
          reconstructed.push(span.expression.text, span.literal.text);
          continue;
        }
        return null;
      }
      return reconstructed.join("");
    }

    if (ts.isCallExpression(expr) && ts.isIdentifier(expr.expression)) {
      const callee = expr.expression.text;
      if (callee === "clsx" || callee === "classnames" || callee === "cn") {
        const literals: string[] = [];
        for (const arg of expr.arguments) {
          if (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg)) {
            literals.push(arg.text);
          } else if (ts.isArrayLiteralExpression(arg)) {
            for (const el of arg.elements) {
              if (ts.isStringLiteral(el)) literals.push(el.text);
            }
          } else if (ts.isObjectLiteralExpression(arg)) {
            for (const prop of arg.properties) {
              if (ts.isPropertyAssignment(prop) && (ts.isStringLiteral(prop.name) || ts.isIdentifier(prop.name))) {
                if (ts.isStringLiteral(prop.initializer) || ts.isNoSubstitutionTemplateLiteral(prop.initializer)) {
                  literals.push(prop.name.text ?? prop.name.getText());
                }
              }
            }
          } else {
            return null;
          }
        }
        return literals.join(" ").trim();
      }
    }
  }
  return null;
}

function extractClassesFromTsx(filePath: string, suppressPrefixes: string[]): NormalisedClass[] {
  const sourceText = readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const results: NormalisedClass[] = [];

  const visit = (node: ts.Node) => {
    if (ts.isJsxAttribute(node) && node.name.text === "className" && node.initializer) {
      const raw = extractStringLiteral(node.initializer);
      if (raw) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        const norm = normaliseClassString(raw, filePath, { line: line + 1, column: character + 1 }, suppressPrefixes);
        if (norm) results.push(norm);
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return results;
}

function extractClassesFromHtml(filePath: string, suppressPrefixes: string[]): NormalisedClass[] {
  const text = readFileSync(filePath, "utf8");
  const results: NormalisedClass[] = [];
  const classRegex = /class\s*=\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = classRegex.exec(text)) !== null) {
    const raw = match[1];
    const index = match.index;
    const upToMatch = text.slice(0, index);
    const line = upToMatch.split(/\n/).length;
    const column = index - upToMatch.lastIndexOf("\n");
    const norm = normaliseClassString(raw, filePath, { line, column }, suppressPrefixes);
    if (norm) results.push(norm);
  }
  return results;
}

function jaccardDistance(a: Set<string>, b: Set<string>): number {
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  if (union === 0) return 0;
  return 1 - intersection / union;
}

function buildIndex(entries: NormalisedClass[], sample: number): Map<string, number[]> {
  const map = new Map<string, number[]>();
  entries.forEach((entry, index) => {
    const baseTokens = entry.tokens.slice(0, sample);
    for (const token of baseTokens) {
      const key = token;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(index);
    }
  });
  return map;
}

function uniqueCandidates(index: Map<string, number[]>, entry: NormalisedClass, sample: number, selfIndex: number): number[] {
  const candidateSet = new Set<number>();
  const tokens = entry.tokens.slice(0, sample);
  for (const token of tokens) {
    const bucket = index.get(token);
    if (!bucket) continue;
    for (const idx of bucket) {
      if (idx === selfIndex) continue;
      candidateSet.add(idx);
    }
  }
  return Array.from(candidateSet);
}

function main(): void {
  const config = loadConfig();
  const tsxFiles = globPaths("src/**/*.tsx");
  const entries: NormalisedClass[] = [];
  for (const file of tsxFiles) {
    entries.push(...extractClassesFromTsx(file, config.suppressPrefixes));
  }

  const filtered = entries.filter((entry) => entry.tokens.length >= config.minTokenCount);
  if (filtered.length === 0) return;

  const index = buildIndex(filtered, config.tokenIndexSample);
  const seenPairs = new Set<string>();
  const unions = new UnionFind(filtered.length);
  const pairDistances = new Map<string, number>();
  const pairMembers = new Map<string, [number, number]>();

  filtered.forEach((entry, idx) => {
    const candidates = uniqueCandidates(index, entry, config.tokenIndexSample, idx);
    for (const candidateIdx of candidates) {
      if (candidateIdx <= idx) continue;
      const other = filtered[candidateIdx];
      const key = `${idx}:${candidateIdx}`;
      if (seenPairs.has(key)) continue;
      const distance = jaccardDistance(entry.tokenSet, other.tokenSet);
      if (distance <= config.maxJaccardDistance) {
        seenPairs.add(key);
        unions.union(idx, candidateIdx);
        pairDistances.set(key, distance);
        pairMembers.set(key, [idx, candidateIdx]);
      }
    }
  });

  const groups = new Map<number, { members: number[]; distances: number[] }>();
  pairDistances.forEach((distance, key) => {
    const members = pairMembers.get(key)!;
    const root = unions.find(members[0]);
    if (!groups.has(root)) groups.set(root, { members: [], distances: [] });
    const group = groups.get(root)!;
    group.distances.push(distance);
    group.members.push(...members);
  });

  const results: { score: number; message: string }[] = [];
  groups.forEach((group, root) => {
    const uniqueIndices = Array.from(new Set(group.members));
    if (uniqueIndices.length < config.minOccurrences) return;
    const bestIndex = uniqueIndices.reduce((current, candidate) => {
      const currentEntry = filtered[current];
      const candidateEntry = filtered[candidate];
      if (candidateEntry.filePath < currentEntry.filePath) return candidate;
      if (candidateEntry.filePath > currentEntry.filePath) return current;
      if (candidateEntry.location.line < currentEntry.location.line) return candidate;
      if (candidateEntry.location.line > currentEntry.location.line) return current;
      if (candidateEntry.location.column < currentEntry.location.column) return candidate;
      return current;
    }, uniqueIndices[0]);

    const anchor = filtered[bestIndex];
    const similarity = 1 - average(group.distances);
    const percentage = (similarity * 100).toFixed(0);
    const header = `${relative(PROJECT_ROOT, anchor.filePath)}:${anchor.location.line}:${anchor.location.column} near-duplicate class strings (~${percentage}% overlap)`;
    const bulletLines = uniqueIndices
      .slice(0, 5)
      .map((idx) => {
        const entry = filtered[idx];
        const file = relative(PROJECT_ROOT, entry.filePath);
        return `  • ${file}:${entry.location.line}:${entry.location.column} → ${entry.raw}`;
      })
      .join("\n");
    const suffix = uniqueIndices.length > 5 ? `\n  • …and ${uniqueIndices.length - 5} more` : "";
    const score = Math.pow(similarity, 2) * uniqueIndices.length;
    results.push({
      score,
      message: `${header}\n${bulletLines}${suffix}\nConsider extracting a shared semantic class (e.g. add an @apply definition in semantic.css).`,
    });
  });

  results
    .sort((a, b) => b.score - a.score)
    .forEach((result) => console.error(result.message));

  if (results.length > 0 && config.failOnViolation) {
    process.exitCode = 1;
  }
}

class UnionFind {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, index) => index);
    this.rank = Array(size).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x: number, y: number): void {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return;
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX] += 1;
    }
  }
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

main();
