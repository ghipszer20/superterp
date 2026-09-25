import { describe, expect, it } from "vitest";
import { renderDraftsReport, summarizeDrafts, type DraftPageResult } from "../scripts/drafts-report.ts";
import { draftPrograms } from "../src/draft.ts";
import type { CatalogRow, ProgramPage } from "../src/program.ts";

const c = (code: string, alternative = false): CatalogRow => ({ kind: "course", codes: [code], title: code, credits: null, alternative, footnotes: [] });
const t = (text: string): CatalogRow => ({ kind: "text", text, credits: null, footnotes: [] });
const h = (text: string): CatalogRow => ({ kind: "header", text, footnotes: [] });
const page = (name: string, rows: CatalogRow[]): ProgramPage => ({ name, lists: [{ heading: null, rows, total: "12", footnotes: {} }] });

const result = (name: string, rows: CatalogRow[] | null, kind: "major" | "minor" = "major"): DraftPageResult => {
  const program = { name, url: `https://example.edu/${name}/`, kind };
  if (!rows) return { program, drafts: [] };
  return { program, drafts: draftPrograms(page(name, rows), { id: name.toLowerCase(), catalogYear: "2026-27", source: name }) };
};

const results: DraftPageResult[] = [
  // 6 rows converted; the header is structural
  result("Alpha", [h("Core"), c("MATH140"), c("MATH141"), t("Select two of the following:"), c("CMSC411"), c("CMSC412"), c("CMSC414")]),
  // 1 converted, 4 to review (the pattern; the unrecognized rule and the 2 course rows under it)
  result("Beta", [c("HIST200"), t("STAT4xx"), t("Select one 3xx-level ARTT elective"), c("ARTT301"), c("ARTT302")], "minor"),
  // engine gap
  result("Gamma", [t("Select two of the following:"), c("CMSC426"), c("CMSC460"), c("CMSC466", true)]),
  // no tables
  result("Delta", null),
];

describe("summarizeDrafts", () => {
  const s = summarizeDrafts(results);

  it("counts rows converted, sent to review, and structural", () => {
    expect(s.rows).toEqual({ converted: 6 + 1, review: 4 + 4, structural: 1 });
  });

  it("counts programs with and without tables", () => {
    expect(s.programs).toEqual({ total: 4, withTables: 3, withoutTables: ["Delta"], errors: [] });
  });

  it("lists pages it couldn't read separately from pages with no table", () => {
    const withError = summarizeDrafts([...results, { program: { name: "Epsilon", url: "https://example.edu/e/", kind: "minor" }, drafts: [], error: "not cached" }]);
    expect(withError.programs).toEqual({ total: 5, withTables: 3, withoutTables: ["Delta"], errors: [{ name: "Epsilon", error: "not cached" }] });
  });

  it("ranks review reasons by rows sent to review, marking engine gaps", () => {
    expect(s.reasons[0]).toMatchObject({ reason: "exclusive-alternatives", items: 1, rows: 4, engineGap: true });
    expect(s.reasons).toContainEqual(expect.objectContaining({ reason: "course-pattern", items: 1, rows: 1, engineGap: false }));
  });

  it("lists engine gaps with counts", () => {
    expect(s.engineGaps).toEqual([expect.objectContaining({ reason: "exclusive-alternatives", items: 1, rows: 4, programs: ["Gamma"] })]);
  });

  it("gives one line per drafted table", () => {
    expect(s.tables.map((p) => [p.name, p.requirements, p.manual, p.converted, p.review])).toEqual([
      ["Alpha", 3, 0, 6, 0],
      ["Beta", 1, 2, 1, 4],
      ["Gamma", 0, 1, 0, 4],
    ]);
  });

  it("groups the rules it didn't recognize by phrasing", () => {
    expect(s.unrecognized).toEqual([{ phrase: "Select one Nxx-level ARTT elective", count: 1 }]);
  });
});

describe("renderDraftsReport", () => {
  const md = renderDraftsReport(summarizeDrafts(results), { generated: "2026-09-25" });

  it("states the overall share of rows converted automatically", () => {
    expect(md).toContain("**7 of 15** rule rows (**46.7%**)");
  });

  it("has a per-program table and an engine-gap section", () => {
    expect(md).toContain("| Alpha | major | 3 | 0 | 0 | 6/6 (100%) |");
    expect(md).toMatch(/## Engine gaps[\s\S]*exclusive-alternatives[\s\S]*\| 1 \| 4 \|/);
  });
});
