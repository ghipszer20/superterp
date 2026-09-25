// Tested against the requirements section of the real catalog pages
// (2026–27 catalog). Expected values are read off the pages by hand.

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseProgramPage } from "../src/program.ts";

const fixture = (name: string) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
const cs = parseProgramPage(fixture("cs-major.html"));
const math = parseProgramPage(fixture("math-major.html"));

describe("parseProgramPage", () => {
  it("reads the program name and one list per requirement table, with its heading", () => {
    expect(cs.name).toBe("Computer Science Major");
    expect(cs.lists.map((l) => l.heading)).toEqual([
      null,
      "Cybersecurity Specialization",
      "Data Science Specialization",
      "Machine Learning Specialization",
      "Quantum Information Specialization",
    ]);
    expect(math.lists[0]!.heading).toBe("Traditional Track");
  });

  it("reads header, course and text rows, separating footnote markers from text", () => {
    const rows = cs.lists[0]!.rows;
    expect(rows.slice(0, 5)).toEqual([
      { kind: "header", text: "Required Lower Level Courses (Unless Exempt)", footnotes: [] },
      { kind: "course", codes: ["MATH140"], title: "Calculus I (see your advisor)", credits: "4", alternative: false, footnotes: [] },
      { kind: "course", codes: ["MATH141"], title: "Calculus II", credits: "4", alternative: false, footnotes: [] },
      { kind: "course", codes: ["CMSC131"], title: "Object-Oriented Programming I", credits: "4", alternative: false, footnotes: ["1"] },
      { kind: "course", codes: ["CMSC132"], title: "Object-Oriented Programming II", credits: "4", alternative: false, footnotes: ["1"] },
    ]);
    expect(rows).toContainEqual({ kind: "header", text: "Upper Level Computer Science Courses", footnotes: ["3"] });
    expect(rows).toContainEqual({ kind: "text", text: "STAT4xx", credits: "3", footnotes: ["2"] });
    expect(rows).toContainEqual({
      kind: "text",
      text: "Select five 400 level courses from at least three of the following areas with no more than three courses in a given area:",
      credits: "15",
      footnotes: [],
    });
    expect(rows).toContainEqual({ kind: "text", text: "Area 1: Systems", credits: null, footnotes: [] });
  });

  it("marks 'or' rows as alternatives to the row above", () => {
    const rows = cs.lists.flatMap((l) => l.rows);
    expect(rows).toContainEqual({
      kind: "course",
      codes: ["CMSC466"],
      title: "Introduction to Numerical Analysis I",
      credits: null,
      alternative: true,
      footnotes: [],
    });
  });

  it("keeps every code on a combined row like 'MATH410 & MATH411'", () => {
    const row = math.lists[0]!.rows.find((r) => r.kind === "course" && r.codes.includes("MATH410") && r.codes.length > 1);
    expect(row).toMatchObject({ kind: "course", codes: ["MATH410", "MATH411"] });
  });

  it("reads each list's credit total", () => {
    expect(cs.lists[1]!.total).toBe("21-22");
  });
});

describe("parseProgramPage footnotes", () => {
  it("maps each footnote marker of a list to its text", () => {
    const notes = cs.lists[0]!.footnotes;
    expect(Object.keys(notes)).toEqual(["1", "2", "3", "4", "5"]);
    expect(notes["4"]).toBe("Credit will only be given for CMSC460 or CMSC466.");
    expect(notes["2"]).toBe("This course must have prerequisite of MATH141 or higher; cannot be cross-listed with CMSC.");
  });

  it("gives each list its own footnotes, not the first list's", () => {
    expect(cs.lists[2]!.footnotes["1"]).toMatch(/^Courses that fall within each area are listed in the General Track/);
    expect(math.lists[2]!.footnotes["3"]).toBe("May not include: MATH461,MATH478, MATH480-MATH484, or STAT464");
  });

  it("drops non-breaking spaces and trailing whitespace from footnote text", () => {
    expect(cs.lists[1]!.footnotes["1"]).toMatch(/Area 5: Numerical Analysis\.$/);
  });

  it("gives a list with no footnotes an empty map", () => {
    expect(math.lists).toHaveLength(8);
    expect(math.lists[4]!.footnotes).toEqual({});
  });

  it("attaches footnotes to the nearest table above them, even when an earlier table has none", () => {
    const page = parseProgramPage(`<h1 class="page-title">X Minor</h1>
      <table class="sc_courselist"><tr><td class="codecol"><a class="code">ABCD100</a></td><td>A</td><td class="hourscol">3</td></tr></table>
      <table class="sc_courselist"><tr><td class="codecol"><a class="code">ABCD200</a><sup>1</sup></td><td>B</td><td class="hourscol">3</td></tr></table>
      <dl class="sc_footnotes"><dt><sup> 1 </sup></dt><dd><p>Only in fall.</p></dd></dl>`);
    expect(page.lists.map((l) => l.footnotes)).toEqual([{}, { "1": "Only in fall." }]);
  });
});
