// Tallies and the markdown report for scripts/coverage.ts, kept free of I/O so
// they can be tested.

import type { ProgramPage } from "../src/program.ts";
import type { ProgramKind, ProgramLink } from "../src/programs-index.ts";

/** planGrid: the page has a four-year plan table (table.sc_plangrid), as the engineering majors do instead of course lists. */
export type PageResult = { program: ProgramLink; page?: ProgramPage; planGrid?: boolean; error?: string };

export type Phrasing = { phrase: string; count: number; example: string };

export type CoverageSummary = {
  byKind: Record<ProgramKind, number>;
  withTables: number;
  /** No requirement table and no plan grid: requirements in prose only. */
  withoutTables: ProgramLink[];
  /** No requirement table, but a four-year plan grid. */
  planGridOnly: ProgramLink[];
  rows: { course: number; text: number; header: number };
  /** Text rows grouped by normalized wording, most common first. */
  phrasings: Phrasing[];
  /** Text rows that name a course pattern ("HIST4xx") rather than a rule. */
  coursePatterns: Phrasing[];
  /** Row footnote markers with no entry in their list's footnotes. */
  danglingMarkers: { program: string; marker: string }[];
  errors: { program: string; error: string }[];
};

/** Course codes become COURSE and numbers N, so "Select 2 from HIST300" groups with "Select 3 from ARTT400". */
export function normalizePhrase(s: string): string {
  return s
    .replace(/\b[A-Z]{4}\s?\d{3}[A-Z]?\b/g, "COURSE")
    .replace(/\d+(\.\d+)?/g, "N")
    .replace(/\s+/g, " ")
    .trim();
}

const isCoursePattern = (s: string) => /^[A-Z]{4}\s?\d?[\dxX]{1,2}[xX]\b/.test(s.trim());

function rank(counts: Map<string, Phrasing>): Phrasing[] {
  return [...counts.values()].sort((a, b) => b.count - a.count || (a.phrase < b.phrase ? -1 : a.phrase > b.phrase ? 1 : 0));
}

function tally(counts: Map<string, Phrasing>, phrase: string, example: string) {
  const entry = counts.get(phrase);
  if (entry) entry.count++;
  else counts.set(phrase, { phrase, count: 1, example });
}

export function summarize(results: PageResult[]): CoverageSummary {
  const byKind: Record<ProgramKind, number> = { major: 0, minor: 0, certificate: 0, other: 0 };
  const withoutTables: ProgramLink[] = [];
  const planGridOnly: ProgramLink[] = [];
  const rows = { course: 0, text: 0, header: 0 };
  const phrasings = new Map<string, Phrasing>();
  const coursePatterns = new Map<string, Phrasing>();
  const danglingMarkers: CoverageSummary["danglingMarkers"] = [];
  const errors: CoverageSummary["errors"] = [];
  let withTables = 0;

  for (const { program, page, planGrid, error } of results) {
    byKind[program.kind]++;
    if (error !== undefined || !page) {
      errors.push({ program: program.name, error: error ?? "no page" });
      continue;
    }
    if (page.lists.length === 0) (planGrid ? planGridOnly : withoutTables).push(program);
    else withTables++;
    for (const list of page.lists) {
      const dangling = new Set<string>();
      for (const row of list.rows) {
        rows[row.kind]++;
        for (const m of row.footnotes) if (!(m in list.footnotes)) dangling.add(m);
        if (row.kind !== "text") continue;
        if (isCoursePattern(row.text)) tally(coursePatterns, row.text.trim(), row.text);
        else tally(phrasings, normalizePhrase(row.text), row.text);
      }
      for (const marker of dangling) danglingMarkers.push({ program: program.name, marker });
    }
  }

  return {
    byKind,
    withTables,
    withoutTables,
    planGridOnly,
    rows,
    phrasings: rank(phrasings),
    coursePatterns: rank(coursePatterns),
    danglingMarkers,
    errors,
  };
}

const cell = (s: string) => s.replace(/\|/g, "\\|");

export function renderReport(s: CoverageSummary, opts: { generated: string; top?: number }): string {
  const top = opts.top ?? 25;
  const total = Object.values(s.byKind).reduce((a, b) => a + b, 0);
  const out: string[] = [];
  out.push("# Catalog coverage report", "");
  out.push(
    `Generated ${opts.generated} by \`packages/catalog/scripts/coverage.ts\` from the UMD Academic Catalog program index`,
    "(https://academiccatalog.umd.edu/undergraduate/programs/) and every program page it links to.",
    "",
  );

  out.push("## Programs", "", "| Kind | Programs |", "| --- | --- |");
  for (const [kind, n] of Object.entries(s.byKind)) out.push(`| ${kind} | ${n} |`);
  out.push(`| **total** | **${total}** |`, "");
  out.push(
    `- With at least one requirement table: **${s.withTables}**`,
    `- With no requirement table, only a four-year plan grid: **${s.planGridOnly.length}**`,
    `- With neither (requirements in prose only): **${s.withoutTables.length}**`,
    `- Failed to fetch or parse: **${s.errors.length}**`,
    "",
  );

  out.push("## Rows", "", "| Row kind | Count |", "| --- | --- |");
  out.push(`| course | ${s.rows.course} |`, `| text | ${s.rows.text} |`, `| header | ${s.rows.header} |`, "");

  out.push(
    `## Top ${top} text-row phrasings`,
    "",
    "Course codes are replaced by COURSE and numbers by N before grouping. These are the rule shapes the audit engine has to understand.",
    "",
    "| Count | Phrasing | Example |",
    "| --- | --- | --- |",
  );
  for (const p of s.phrasings.slice(0, top)) out.push(`| ${p.count} | ${cell(p.phrase)} | ${cell(p.example)} |`);
  out.push("", `${s.phrasings.length} distinct phrasings in all.`, "");

  out.push("## Course-pattern text rows", "", "Rows like `STAT4xx` that stand for any course matching a pattern.", "");
  out.push("| Count | Pattern |", "| --- | --- |");
  for (const p of s.coursePatterns.slice(0, top)) out.push(`| ${p.count} | ${cell(p.phrase)} |`);
  out.push("", `${s.coursePatterns.length} distinct patterns, ${s.coursePatterns.reduce((a, p) => a + p.count, 0)} rows.`, "");

  out.push(
    "## Programs with only a four-year plan grid",
    "",
    "No course-list table; the requirements are laid out semester by semester in a table.sc_plangrid, which the parser does not read yet.",
    "",
  );
  if (s.planGridOnly.length === 0) out.push("None.");
  for (const p of s.planGridOnly) out.push(`- [${p.name}](${p.url}) (${p.kind})`);
  out.push("");

  out.push("## Programs with requirements in prose only", "");
  if (s.withoutTables.length === 0) out.push("None.");
  for (const p of s.withoutTables) out.push(`- [${p.name}](${p.url}) (${p.kind})`);
  out.push("");

  out.push(
    "## Footnote markers with no footnote",
    "",
    "A row cites a footnote its list's footnote block doesn't define. This checks that footnotes are attached to the right table;",
    "the pages spot-checked (Biological Sciences at Shady Grove, Chemistry, Economics) cite markers the catalog never defines after that table.",
    "",
  );
  if (s.danglingMarkers.length === 0) out.push("None.");
  for (const d of s.danglingMarkers) out.push(`- ${d.program}: marker ${d.marker}`);
  out.push("");

  out.push("## Errors", "");
  if (s.errors.length === 0) out.push("None.");
  for (const e of s.errors) out.push(`- ${e.program}: ${e.error}`);
  out.push("");
  return out.join("\n");
}
