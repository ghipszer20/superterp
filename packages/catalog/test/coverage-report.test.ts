import { describe, expect, it } from "vitest";
import { normalizePhrase, renderReport, summarize, type PageResult } from "../scripts/coverage-report.ts";
import type { CatalogRow } from "../src/program.ts";

const course = (code: string, footnotes: string[] = []): CatalogRow => ({
  kind: "course",
  codes: [code],
  title: "T",
  credits: "3",
  alternative: false,
  footnotes,
});
const textRow = (text: string): CatalogRow => ({ kind: "text", text, credits: null, footnotes: [] });
const header = (text: string): CatalogRow => ({ kind: "header", text, footnotes: [] });
const link = (name: string, kind: "major" | "minor" | "certificate" | "other") => ({ name, url: `https://x/${name}/`, kind });

const results: PageResult[] = [
  {
    program: link("History Major", "major"),
    page: {
      name: "History Major",
      lists: [
        {
          heading: null,
          total: "36",
          footnotes: { "1": "Note." },
          rows: [
            header("Core"),
            course("HIST200", ["1"]),
            course("HIST201", ["2"]),
            textRow("Select one of the following:"),
            textRow("Select 2 courses from HIST300-HIST399"),
            textRow("HIST4xx"),
          ],
        },
      ],
    },
  },
  {
    program: link("Art Minor", "minor"),
    page: {
      name: "Art Minor",
      lists: [{ heading: null, total: null, footnotes: {}, rows: [textRow("Select one of the following:"), textRow("Select 3 courses from ARTT400-ARTT499")] }],
    },
  },
  { program: link("Honors Program", "other"), page: { name: "Honors Program", lists: [] } },
  { program: link("Aero Major", "major"), page: { name: "Aero Major", lists: [] }, planGrid: true },
  { program: link("Broken Certificate", "certificate"), error: "[catalog] HTTP 404 for https://x/Broken Certificate/" },
];

describe("normalizePhrase", () => {
  it("replaces course codes and numbers so phrasings group together", () => {
    expect(normalizePhrase("Select 2 courses from HIST300-HIST399")).toBe("Select N courses from COURSE-COURSE");
    expect(normalizePhrase("  Select one of   the following: ")).toBe("Select one of the following:");
  });
});

describe("summarize", () => {
  const s = summarize(results);

  it("counts programs by kind, including ones that failed", () => {
    expect(s.byKind).toEqual({ major: 2, minor: 1, certificate: 1, other: 1 });
  });

  it("separates programs with requirement tables from those without", () => {
    expect(s.withTables).toBe(2);
    expect(s.withoutTables.map((p) => p.name)).toEqual(["Honors Program"]);
  });

  it("sets apart pages whose requirements are only a four-year plan grid", () => {
    expect(s.planGridOnly.map((p) => p.name)).toEqual(["Aero Major"]);
  });

  it("totals rows by kind", () => {
    expect(s.rows).toEqual({ course: 2, text: 5, header: 1 });
  });

  it("ranks text-row phrasings, keeping course patterns like HIST4xx apart", () => {
    expect(s.phrasings).toEqual([
      { phrase: "Select N courses from COURSE-COURSE", count: 2, example: "Select 2 courses from HIST300-HIST399" },
      { phrase: "Select one of the following:", count: 2, example: "Select one of the following:" },
    ]);
    expect(s.coursePatterns).toEqual([{ phrase: "HIST4xx", count: 1, example: "HIST4xx" }]);
  });

  it("finds row footnote markers that their list has no footnote for", () => {
    expect(s.danglingMarkers).toEqual([{ program: "History Major", marker: "2" }]);
  });

  it("lists parse or fetch errors", () => {
    expect(s.errors).toEqual([{ program: "Broken Certificate", error: "[catalog] HTTP 404 for https://x/Broken Certificate/" }]);
  });
});

describe("renderReport", () => {
  it("writes the numbers and the prose-only programs as markdown", () => {
    const md = renderReport(summarize(results), { generated: "2026-09-25" });
    expect(md).toContain("# Catalog coverage report");
    expect(md).toContain("| major | 2 |");
    expect(md).toContain("[Honors Program](https://x/Honors Program/)");
    expect(md).toContain("| 2 | Select one of the following: |");
    expect(md).toContain("Broken Certificate");
    expect(md).toContain("[Aero Major](https://x/Aero Major/)");
  });
});
