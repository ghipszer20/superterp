// Tallies and the markdown report for scripts/draft-all.ts, kept free of I/O so
// they can be tested.

import { ENGINE_GAPS, type Draft, type ReviewReason } from "../src/draft.ts";
import type { ProgramLink } from "../src/programs-index.ts";
import { normalizePhrase } from "./coverage-report.ts";

/** drafts is empty for a page with no requirement table. */
export type DraftPageResult = { program: ProgramLink; drafts: Draft[]; error?: string };

export type ReasonTally = { reason: ReviewReason; items: number; rows: number; manual: number; check: number; engineGap: boolean };

export type TableLine = {
  name: string;
  kind: ProgramLink["kind"];
  requirements: number;
  manual: number;
  check: number;
  converted: number;
  review: number;
};

export type DraftsSummary = {
  programs: { total: number; withTables: number; withoutTables: string[]; errors: { name: string; error: string }[] };
  rows: { converted: number; review: number; structural: number };
  requirements: Record<string, number>;
  reasons: ReasonTally[];
  engineGaps: { reason: ReviewReason; description: string; items: number; rows: number; programs: string[] }[];
  tables: TableLine[];
  /** Lead rows of unrecognized-rule items, grouped like the coverage report's phrasings. */
  unrecognized: { phrase: string; count: number }[];
};

const LEAD_ROW = /^Row "(.*?)"(?: \([^)]*credits\))? was not converted/;

export function summarizeDrafts(results: DraftPageResult[]): DraftsSummary {
  const rows = { converted: 0, review: 0, structural: 0 };
  const requirements: Record<string, number> = {};
  const reasons = new Map<ReviewReason, ReasonTally>();
  const gapPrograms = new Map<ReviewReason, Set<string>>();
  const unrecognized = new Map<string, number>();
  const tables: TableLine[] = [];
  const withoutTables: string[] = [];
  const errors: { name: string; error: string }[] = [];

  for (const { program, drafts, error } of results) {
    if (error !== undefined) errors.push({ name: program.name, error });
    else if (drafts.length === 0) withoutTables.push(program.name);
    for (const d of drafts) {
      rows.converted += d.rows.converted;
      rows.review += d.rows.review;
      rows.structural += d.rows.structural;
      for (const r of d.program.requirements) requirements[r.kind] = (requirements[r.kind] ?? 0) + 1;
      for (const item of d.review) {
        const tally = reasons.get(item.reason) ?? { reason: item.reason, items: 0, rows: 0, manual: 0, check: 0, engineGap: item.reason in ENGINE_GAPS };
        tally.items++;
        tally.rows += item.rows;
        tally[item.confidence]++;
        reasons.set(item.reason, tally);
        if (tally.engineGap) gapPrograms.set(item.reason, (gapPrograms.get(item.reason) ?? new Set()).add(program.name));
        const lead = item.reason === "unrecognized-rule" ? LEAD_ROW.exec(item.text) : null;
        if (lead) unrecognized.set(normalizePhrase(lead[1]!), (unrecognized.get(normalizePhrase(lead[1]!)) ?? 0) + 1);
      }
      tables.push({
        name: d.program.name,
        kind: program.kind,
        requirements: d.program.requirements.length,
        manual: d.review.filter((r) => r.confidence === "manual").length,
        check: d.review.filter((r) => r.confidence === "check").length,
        converted: d.rows.converted,
        review: d.rows.review,
      });
    }
  }

  const ranked = [...reasons.values()].sort((a, b) => b.rows - a.rows || b.items - a.items || (a.reason < b.reason ? -1 : 1));
  return {
    programs: { total: results.length, withTables: results.length - withoutTables.length - errors.length, withoutTables, errors },
    rows,
    requirements,
    reasons: ranked,
    engineGaps: ranked
      .filter((r) => r.engineGap)
      .map((r) => ({ reason: r.reason, description: ENGINE_GAPS[r.reason]!, items: r.items, rows: r.rows, programs: [...gapPrograms.get(r.reason)!] })),
    tables,
    unrecognized: [...unrecognized]
      .map(([phrase, count]) => ({ phrase, count }))
      .sort((a, b) => b.count - a.count || (a.phrase < b.phrase ? -1 : 1)),
  };
}

const pct = (n: number, d: number, digits = 1) => (d === 0 ? "n/a" : `${((100 * n) / d).toFixed(digits)}%`);
const cell = (s: string) => s.replace(/\|/g, "\\|");

const REASON_TEXT: Record<ReviewReason, string> = {
  footnote: "A footnote on a drafted row or section (check it doesn't change the rule)",
  "unrecognized-rule": "A text or header rule the drafter doesn't parse (prose), with the course rows under it",
  "course-pattern": "An unlinked course pattern such as STAT4xx (a filter is suggested)",
  "must-include": "An umbrella count over the rows after it ('eight courses … must include:'), an overlay",
  "empty-group": "A 'Select …' rule followed by labelled groups rather than courses (options, tracks)",
  "group-boundary": "A 'Select …' group whose end is unclear (member credits differ)",
  "sets-with-alternatives": "More than one of several 'A and B' sets with 'or' between sets, or credits over sets",
  "sequence-with-rule": "A sequence with a nested rule, left out of an otherwise drafted sets requirement",
  "sequence-filter": "A sequence's nested rule converted into a course-count filter part of its set (confirm the count and range)",
  "alternatives-flattened": "'or' alternatives inside a distribution area listed separately",
  "ambiguous-code": "A code like PLSC110/111 (cross-listing or pair?)",
  "stray-or": "An 'or' with nothing above it to attach to",
  "multiple-lists": "Several tables on one page: tracks, specializations or parts of one program?",
};

export function renderDraftsReport(s: DraftsSummary, opts: { generated: string; top?: number }): string {
  const top = opts.top ?? 30;
  const ruleRows = s.rows.converted + s.rows.review;
  const out: string[] = [];
  out.push("# Draft programs report", "");
  out.push(
    `Generated ${opts.generated} by \`packages/catalog/scripts/draft-all.ts\`, which drafts every cached program page`,
    "(see `coverage.ts`) into audit Programs with `draftProgram` (`src/draft.ts`). Drafts are never verified;",
    "they are not committed. This report is what the deterministic drafter converts and what it leaves to the owner.",
    "",
  );

  out.push("## Overall", "");
  out.push(
    `- Programs: **${s.programs.total}**, with at least one requirement table: **${s.programs.withTables}**; drafted tables: **${s.tables.length}**`,
    `- Converted automatically: **${s.rows.converted} of ${ruleRows}** rule rows (**${pct(s.rows.converted, ruleRows)}**); sent to review: ${s.rows.review}. Plain section headers (${s.rows.structural}) are not counted.`,
    `- Requirements drafted: **${Object.values(s.requirements).reduce((a, b) => a + b, 0)}** (${Object.entries(s.requirements)
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `${k} ${n}`)
      .join(", ")})`,
    `- Review items: **${s.reasons.reduce((a, r) => a + r.manual, 0)}** manual (not drafted), **${s.reasons.reduce((a, r) => a + r.check, 0)}** check (drafted, confirm)`,
    "",
  );

  out.push("## Why rows went to review", "", "Ranked by rows sent to review. Check items send no rows; they flag drafted requirements.", "");
  out.push("| Reason | Meaning | Items | Rows to review | Engine gap |", "| --- | --- | --- | --- | --- |");
  for (const r of s.reasons) out.push(`| ${r.reason} | ${cell(REASON_TEXT[r.reason])} | ${r.items} | ${r.rows} | ${r.engineGap ? "yes" : ""} |`);
  out.push("");

  out.push(
    "## Engine gaps",
    "",
    "Rule shapes the audit engine (`packages/audit/src/audit.ts`) can't express even by hand. Everything else sent to review can be",
    "encoded with the existing requirement kinds once someone reads the prose.",
    "",
    "| Reason | Shape | Items | Rows | Programs |",
    "| --- | --- | --- | --- | --- |",
  );
  if (s.engineGaps.length === 0) out.push("| none | | | | |");
  for (const g of s.engineGaps) out.push(`| ${g.reason} | ${cell(g.description)} | ${g.items} | ${g.rows} | ${cell(g.programs.join(", "))} |`);
  out.push("");

  out.push(`## Top ${top} unrecognized phrasings`, "", "Lead rows of unrecognized-rule items; course codes become COURSE and numbers N.", "");
  out.push("| Count | Phrasing |", "| --- | --- |");
  for (const u of s.unrecognized.slice(0, top)) out.push(`| ${u.count} | ${cell(u.phrase)} |`);
  out.push("", `${s.unrecognized.length} distinct phrasings in all.`, "");

  out.push("## Per program", "", "One line per requirement table. Converted: rule rows drafted automatically, of all rule rows.", "");
  out.push("| Program | Kind | Requirements | Manual | Check | Converted |", "| --- | --- | --- | --- | --- | --- |");
  for (const t of s.tables) {
    const rule = t.converted + t.review;
    out.push(`| ${cell(t.name)} | ${t.kind} | ${t.requirements} | ${t.manual} | ${t.check} | ${t.converted}/${rule} (${pct(t.converted, rule, 0)}) |`);
  }
  out.push("");

  out.push("## Programs with no requirement table", "", "Nothing to draft (plan grid or prose only; see coverage-report.md).", "");
  if (s.programs.withoutTables.length === 0) out.push("None.");
  for (const p of s.programs.withoutTables) out.push(`- ${p}`);
  out.push("");

  out.push("## Errors", "");
  if (s.programs.errors.length === 0) out.push("None.");
  for (const e of s.programs.errors) out.push(`- ${e.name}: ${e.error}`);
  out.push("");
  return out.join("\n");
}
