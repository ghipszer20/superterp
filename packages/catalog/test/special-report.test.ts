import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderSpecialReport } from "../scripts/special-report.ts";
import type { SpecialEntry } from "../special-programs/registry.ts";
import { specialPrograms } from "../special-programs/registry.ts";

const entries: SpecialEntry[] = [
  {
    name: "Alpha Scholars",
    kind: "scholars",
    source: "https://example.edu/a",
    drafting: "hand",
    program: {
      id: "a",
      name: "Alpha Scholars",
      verified: false,
      reviewNotes: ["[manual] GPA", "[check] list", "[check] other"],
      requirements: [
        { kind: "course", id: "x", name: "X", options: ["ABCD100"] },
        { kind: "choose", id: "y", name: "Y", count: 1, from: { courses: ["ABCD200"] } },
      ],
    },
  },
  { name: "Beta House", kind: "llp", source: "https://example.edu/b", drafting: "none", why: "No public requirements page." },
];

describe("renderSpecialReport", () => {
  const report = renderSpecialReport(entries, { generated: "2026-09-25" });

  it("counts programs by kind and by how they were drafted", () => {
    expect(report).toContain("| Scholars | 1 | 1 | 0 |");
    expect(report).toContain("| Other LLP | 1 | 0 | 1 |");
    expect(report).toContain("| **Total** | **2** | **1** | **1** |");
  });

  it("lists each program with requirement and review-note counts, split manual/check", () => {
    expect(report).toContain("| Alpha Scholars | Scholars | hand | 2 | 3 | 1 | 2 |");
    expect(report).toContain("| Beta House | Other LLP | none: No public requirements page. | 0 | 0 | 0 | 0 |");
  });

  it("is committed up to date with the registry", () => {
    const committed = readFileSync(new URL("../special-programs/report.md", import.meta.url), "utf8");
    const generated = /Generated (\d{4}-\d{2}-\d{2})/.exec(committed)?.[1] ?? "";
    expect(committed).toBe(renderSpecialReport(specialPrograms, { generated }));
  });
});
