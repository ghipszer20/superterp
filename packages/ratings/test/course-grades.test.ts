// Per-course grade distributions, tested against trimmed real PlanetTerp
// /grades responses (test/fixtures, fetched 2026-09-25):
//   grades-cmsc351.json   8 sections by 4 professors
//   grades-math140-w.json Arijit Sehanobish (23% W) plus one section with a null professor
//   grades-missing.json   PlanetTerp's "course not found" body

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseGrades } from "../src/planetterp.ts";
import { summarizeCourseGrades } from "../src/course-grades.ts";

const rows = (name: string) =>
  parseGrades(JSON.parse(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8")));

describe("summarizeCourseGrades", () => {
  it("splits a course with several professors into one distribution each", () => {
    const g = summarizeCourseGrades("CMSC351", rows("grades-cmsc351.json"));
    expect(g.course).toBe("CMSC351");
    expect(Object.keys(g.byProfessor).sort()).toEqual([
      "Clyde Kruskal",
      "Evan Golub",
      "Justin Wyss-Gallifent",
      "Mohammad Nayeem Teli",
    ]);
    expect(g.byProfessor["Clyde Kruskal"]!.students).toBe(273);
    expect(g.overall.students).toBe(273 + 292 + 469 + 87);
  });

  it("gives each distribution its counts per grade, letter-group shares, GPA and students", () => {
    // Evan Golub, one real section: A+ 9, A 11, A- 2, B+ 2, B 18, B- 5, C+ 2, C 17, C- 3, D 1, D- 1, F 11, W 5.
    // Graded points 206.9 over 82 letter grades = 2.5232; shares are over all 87 students.
    const golub = summarizeCourseGrades("CMSC351", rows("grades-cmsc351.json")).byProfessor["Evan Golub"]!;
    expect(golub.counts).toEqual({
      "A+": 9, A: 11, "A-": 2, "B+": 2, B: 18, "B-": 5, "C+": 2, C: 17, "C-": 3,
      "D+": 0, D: 1, "D-": 1, F: 11, W: 5, Other: 0,
    });
    expect(golub.students).toBe(87);
    expect(golub.averageGpa).toBeCloseTo(206.9 / 82, 6);
    expect(golub.shares.A).toBeCloseTo(22 / 87, 6);
    expect(golub.shares.B).toBeCloseTo(25 / 87, 6);
    expect(golub.shares.F).toBeCloseTo(11 / 87, 6);
    expect(golub.shares.W).toBeCloseTo(5 / 87, 6);
    expect(golub.shares.Other).toBe(0);
  });

  it("keeps PlanetTerp's Other marks in the counts", () => {
    const wg = summarizeCourseGrades("CMSC351", rows("grades-cmsc351.json")).byProfessor["Justin Wyss-Gallifent"]!;
    expect(wg.counts.Other).toBe(26);
  });

  it("lists the terms covered, sorted and once each, per professor and for the course", () => {
    const g = summarizeCourseGrades("CMSC351", rows("grades-cmsc351.json"));
    expect(g.byProfessor["Clyde Kruskal"]!.terms).toEqual(["201208", "201301"]);
    expect(g.terms).toEqual(["201208", "201301", "201601", "201808", "202101", "202201"]);
    expect(g.overall.terms).toEqual(g.terms);
  });

  it("counts W in the shares but not in the GPA (W-heavy record)", () => {
    const s = summarizeCourseGrades("MATH140", rows("grades-math140-w.json")).byProfessor["Arijit Sehanobish"]!;
    expect(s.students).toBe(101);
    expect(s.counts.W).toBe(23);
    expect(s.shares.W).toBeCloseTo(23 / 101, 6);
    // Letter grades only: 78 students.
    const graded = 101 - 23;
    const points = 3 * 4 + 5 * 4 + 5 * 3.7 + 4 * 3.3 + 5 * 3 + 4 * 2.7 + 8 * 2.3 + 11 * 2 + 6 * 1.7 + 17 * 1 + 10 * 0;
    expect(s.averageGpa).toBeCloseTo(points / graded, 6);
  });

  it("counts sections with no known professor in the course total only", () => {
    const g = summarizeCourseGrades("MATH140", rows("grades-math140-w.json"));
    expect(Object.keys(g.byProfessor)).toEqual(["Arijit Sehanobish"]);
    expect(g.overall.students).toBe(101 + 8);
    expect(g.terms).toContain("201201");
  });

  it("returns an empty summary for a course PlanetTerp has no data for", () => {
    const g = summarizeCourseGrades("AIME100", rows("grades-missing.json"));
    expect(g).toEqual({
      course: "AIME100",
      overall: {
        counts: {
          "A+": 0, A: 0, "A-": 0, "B+": 0, B: 0, "B-": 0, "C+": 0, C: 0, "C-": 0,
          "D+": 0, D: 0, "D-": 0, F: 0, W: 0, Other: 0,
        },
        shares: { A: 0, B: 0, C: 0, D: 0, F: 0, W: 0, Other: 0 },
        averageGpa: null,
        students: 0,
        terms: [],
      },
      byProfessor: {},
      terms: [],
      names: { renamed: [], unmatched: [] },
    });
  });
});

describe("summarizeCourseGrades professor names", () => {
  const withSoc = (soc: string[]) => summarizeCourseGrades("CMSC351", rows("grades-cmsc351.json"), soc);

  it("keys a professor by the Schedule of Classes spelling when only case, spacing or punctuation differ", () => {
    const g = withSoc(["clyde  kruskal", "Justin Wyss Gallifent"]);
    expect(g.byProfessor["clyde  kruskal"]!.students).toBe(273);
    expect(g.byProfessor["Justin Wyss Gallifent"]!.counts.Other).toBe(26);
    expect(g.byProfessor["Clyde Kruskal"]).toBeUndefined();
    expect(g.names.renamed).toEqual([
      { planetTerp: "Clyde Kruskal", soc: "clyde  kruskal" },
      { planetTerp: "Justin Wyss-Gallifent", soc: "Justin Wyss Gallifent" },
    ]);
  });

  it("matches when the only difference is a middle name", () => {
    const g = withSoc(["Mohammad Teli"]);
    expect(g.byProfessor["Mohammad Teli"]!.students).toBe(292);
    expect(g.names.renamed).toEqual([{ planetTerp: "Mohammad Nayeem Teli", soc: "Mohammad Teli" }]);
  });

  it("ignores accents when matching", () => {
    const g = withSoc(["Évan Golub"]);
    expect(g.byProfessor["Évan Golub"]!.students).toBe(87);
  });

  it("leaves exact matches alone and reports nothing for them", () => {
    const g = withSoc(["Clyde Kruskal"]);
    expect(g.byProfessor["Clyde Kruskal"]!.students).toBe(273);
    expect(g.names).toEqual({ renamed: [], unmatched: [] });
  });

  it("reports SOC instructors with no PlanetTerp record, with same-last-name candidates", () => {
    const g = withSoc(["Ting Jiang", "Mark Golub", "Instructor: TBA"]);
    expect(g.names.unmatched).toEqual([
      { soc: "Ting Jiang", candidates: [] },
      { soc: "Mark Golub", candidates: ["Evan Golub"] },
    ]);
    expect(g.byProfessor["Evan Golub"]).toBeDefined();
  });
});
