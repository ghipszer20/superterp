// Turns Testudo prerequisite text into a requirement tree the audit can check.

export type Requirement =
  | { kind: "course"; course: string; minGrade?: string; concurrentOk?: boolean }
  | { kind: "all"; of: Requirement[] }
  | { kind: "any"; of: Requirement[] }
  /** Something a student confirms themselves: permission, placement, program, … */
  | { kind: "manual"; text: string };

const MIN_GRADE = /minimum grade of (?:an? )?([A-D][+-]?)/i;

type Token = { type: "course"; value: string } | { type: "and" | "or" | "comma" | "open" | "close" };

const TOKEN = /\b([A-Z]{4})\s?(\d{3}[A-Z]?)\b|\b(and|or)\b|(,)|([([])|([)\]])/gi;

function tokenize(text: string): Token[] {
  const raw: Token[] = [...text.matchAll(TOKEN)].map((m) => {
    if (m[1]) return { type: "course", value: `${m[1].toUpperCase()}${m[2]}` };
    if (m[4]) return { type: "comma" };
    if (m[5]) return { type: "open" };
    if (m[6]) return { type: "close" };
    return { type: m[3]!.toLowerCase() as "and" | "or" };
  });
  // "A, B, or C": a list's commas take the connector that ends the list
  // at the same nesting level.
  return raw.flatMap((t, i): Token[] => {
    if (t.type !== "comma") return [t];
    const next = raw[i + 1];
    if (next?.type === "and" || next?.type === "or") return []; // Oxford comma
    let depth = 0;
    for (const x of raw.slice(i + 1)) {
      if (x.type === "open") depth++;
      else if (x.type === "close" && depth-- === 0) break;
      else if (depth === 0 && (x.type === "and" || x.type === "or")) return [{ type: x.type }];
    }
    return [{ type: "and" }];
  });
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

export function parsePrerequisite(text: string | null): Requirement | null {
  if (!text) return null;
  const grade = MIN_GRADE.exec(text)?.[1];
  return parseExpression(tokenize(text), (course) => ({ kind: "course", course, ...(grade ? { minGrade: grade } : {}) }));
}
