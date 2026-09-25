// Turns Testudo prerequisite text into a requirement tree the audit can check.

export type Requirement =
  | { kind: "course"; course: string; minGrade?: string; concurrentOk?: boolean }
  | { kind: "all"; of: Requirement[] }
  | { kind: "any"; of: Requirement[] }
  /** Something a student confirms themselves: permission, placement, program, … */
  | { kind: "manual"; text: string };

const MIN_GRADE = /minimum grade of (?:an? )?([A-D][+-]?)/i;

type Token = { type: "course"; value: string } | { type: "and" | "or" | "comma" | "open" | "close" | "one" };

// Case-sensitive on purpose: department codes are uppercase, so "than 300"
// never reads as a course. Connectors are matched in either case.
const TOKEN =
  /\b([A-Z]{4})\s?(\d{3}[A-Z]?)\b|\b([Aa][Nn][Dd]|[Oo][Rr])\b|(,)|([([])|([)\]])|\b((?:1|[Oo]ne)\s+(?:courses?\b|of the following))/g;

function tokenize(text: string): Token[] {
  const raw: Token[] = [...text.matchAll(TOKEN)].map((m) => {
    if (m[1]) return { type: "course", value: `${m[1].toUpperCase()}${m[2]}` };
    if (m[4]) return { type: "comma" };
    if (m[5]) return { type: "open" };
    if (m[6]) return { type: "close" };
    if (m[7]) return { type: "one" };
    return { type: m[3]!.toLowerCase() as "and" | "or" };
  });

  // "A, B, or C": a list's commas take the connector that ends the list at
  // the same nesting level. With no connector, commas mean "and", except in a
  // "1 course from (…)" list, where they mean "or".
  const out: Token[] = [];
  const groupDefaults: ("and" | "or")[] = ["and"];
  let pickOne = false;
  raw.forEach((t, i) => {
    if (t.type === "one") {
      pickOne = true;
      return;
    }
    if (t.type === "open") {
      groupDefaults.push(pickOne ? "or" : "and");
      pickOne = false;
    } else if (t.type === "close" && groupDefaults.length > 1) {
      groupDefaults.pop();
    }
    if (t.type !== "comma") {
      out.push(t);
      return;
    }
    const next = raw[i + 1];
    if (next?.type === "and" || next?.type === "or") return; // Oxford comma
    let depth = 0;
    for (const x of raw.slice(i + 1)) {
      if (x.type === "open") depth++;
      else if (x.type === "close" && depth-- === 0) break;
      else if (depth === 0 && (x.type === "and" || x.type === "or")) {
        out.push({ type: x.type });
        return;
      }
    }
    out.push({ type: groupDefaults.at(-1)! });
  });
  return out;
}

/** Recursive descent: or-expression of and-expressions of courses or (groups). */
function parseExpression(tokens: Token[], leaf: (course: string) => Requirement): Requirement | null {
  let pos = 0;
  const combine = (kind: "all" | "any", parts: Requirement[]): Requirement | null =>
    parts.length === 0 ? null : parts.length === 1 ? parts[0]! : { kind, of: parts };

  function atom(): Requirement | null {
    const t = tokens[pos];
    if (!t) return null;
    if (t.type === "course") {
      pos++;
      return leaf(t.value);
    }
    if (t.type === "open") {
      pos++;
      const inner = orExpr();
      if (tokens[pos]?.type === "close") pos++;
      return inner;
    }
    return null;
  }
  function andExpr(): Requirement | null {
    const parts: Requirement[] = [];
    for (;;) {
      const a = atom();
      if (a) parts.push(a);
      if (tokens[pos]?.type === "and") pos++;
      else if (!a) break;
      else if (tokens[pos]?.type !== "course" && tokens[pos]?.type !== "open") break;
    }
    return combine("all", parts);
  }
  function orExpr(): Requirement | null {
    const parts: Requirement[] = [];
    for (;;) {
      const a = andExpr();
      if (a) parts.push(a);
      if (tokens[pos]?.type === "or") pos++;
      else break;
    }
    return combine("any", parts);
  }

  return orExpr();
}

const clean = (s: string) => s.replace(/\s+/g, " ").replace(/[\s.;,]+$/, "").trim();

/** One clause: a course expression, or a manual requirement if it names no course. */
const CONCURRENT = /concurrent(ly)? enroll/i;

// Clauses that mention a course code but aren't about having taken it.
const MANUAL_WITH_COURSE = /\beligibility\b|\bplacement\b/i;

// "… MATH340 and permission of …": a trailing non-course requirement inside a clause.
const TRAILING_MANUAL =
  /\s+(and|or)\s+((?:permission|must\b|familiarity|approval|junior|senior|sophomore|students?\b)[\s\S]*)$/i;

function parseClause(text: string): Requirement | null {
  const trailing = TRAILING_MANUAL.exec(text);
  if (trailing && tokenize(text.slice(0, trailing.index)).some((t) => t.type === "course")) {
    const head = parseClause(text.slice(0, trailing.index));
    const tail = clean(trailing[2]!);
    return combine(trailing[1]!.toLowerCase() === "or" ? "any" : "all", head, tail ? { kind: "manual", text: tail } : null);
  }
  if (MANUAL_WITH_COURSE.test(text)) {
    const rest = clean(text);
    return rest ? { kind: "manual", text: rest } : null;
  }
  const grade = MIN_GRADE.exec(text)?.[1];
  const concurrent = CONCURRENT.test(text);
  const parsed = parseExpression(tokenize(text), (course) => ({
    kind: "course",
    course,
    ...(grade ? { minGrade: grade } : {}),
    ...(concurrent ? { concurrentOk: true } : {}),
  }));
  if (parsed) return parsed;
  const rest = clean(text);
  return rest ? { kind: "manual", text: rest } : null;
}

const LEADING_CONNECTOR = /^\s*(and\/or|and|or)\b\s*/i;

const combine = (kind: "all" | "any", left: Requirement | null, right: Requirement | null): Requirement | null => {
  if (!left) return right;
  if (!right) return left;
  return { kind, of: [left, right] };
};

export function parsePrerequisite(text: string | null): Requirement | null {
  if (!text) return null;
  // Sentences: "… . Or must be in …" is an alternative to everything before
  // it; "… . And …" adds to it.
  let result: Requirement | null = null;
  for (const sentence of text.split(/\.\s+(?=(?:or|and)\b)/i)) {
    const m = /^(or|and)\b\s*/i.exec(sentence);
    const joined = parseSemicolonClauses(sentence.slice(m?.[0].length ?? 0));
    result = combine(m?.[1]?.toLowerCase() === "or" ? "any" : "all", result, joined);
  }
  return result;
}

function parseSemicolonClauses(text: string): Requirement | null {
  // Semicolon clauses: "X; or Y; and Z". "and" binds tighter than "or";
  // "and/or" reads as "or"; no connector reads as "and".
  const groups: Requirement[][] = [[]];
  text.split(";").forEach((raw, i) => {
    const connector = i === 0 ? "and" : (LEADING_CONNECTOR.exec(raw)?.[1]?.toLowerCase() ?? "and");
    const clause = parseClause(raw.replace(LEADING_CONNECTOR, ""));
    if (!clause) return;
    if (connector !== "and" && groups.at(-1)!.length > 0) groups.push([]);
    groups.at(-1)!.push(clause);
  });

  const terms = groups
    .filter((g) => g.length > 0)
    .map((g): Requirement => (g.length === 1 ? g[0]! : { kind: "all", of: g }));
  if (terms.length === 0) return null;
  return terms.length === 1 ? terms[0]! : { kind: "any", of: terms };
}
