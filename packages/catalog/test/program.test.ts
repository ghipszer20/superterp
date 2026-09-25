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

  it("shares one footnote block among every table since the previous block", () => {
    // Shaped like the Astronomy Major page: four tables, then one block
    // defining the markers all four cite; then a table with no block.
    const page = parseProgramPage(`<h1 class="page-title">X Major</h1>
      <table class="sc_courselist"><tr><td class="codecol"><a class="code">ABCD100</a></td><td>A <sup>1</sup></td><td class="hourscol">3</td></tr></table>
      <table class="sc_courselist"><tr><td class="codecol"><a class="code">ABCD200</a></td><td>B <sup>2</sup></td><td class="hourscol">3</td></tr></table>
      <dl class="sc_footnotes"><dt><sup> 1 </sup></dt><dd><p>Only in fall.</p></dd><dt><sup> 2 </sup></dt><dd><p>Lab.</p></dd></dl>
      <table class="sc_courselist"><tr><td class="codecol"><a class="code">ABCD300</a></td><td>C</td><td class="hourscol">3</td></tr></table>`);
    const both = { "1": "Only in fall.", "2": "Lab." };
    expect(page.lists.map((l) => l.footnotes)).toEqual([both, both, {}]);
  });

  it("keeps a <sup> that holds words (not a marker) as part of the title", () => {
    // From the Agricultural and Resource Economics Major page.
    const page = parseProgramPage(`<table class="sc_courselist"><tr><td class="codecol"><a class="code">AREC445</a></td>
      <td>Agricultural Development <sup>Course may not double count toward upper level specialization requirements</sup></td><td class="hourscol"></td></tr></table>`);
    expect(page.lists[0]!.rows[0]).toMatchObject({
      title: "Agricultural Development Course may not double count toward upper level specialization requirements",
      footnotes: [],
    });
  });

  it("reads an unlinked course code in the code column as a course, not text", () => {
    // Real rows: <td class="codecol">PLSC235</td>, and "or PLSC275" on an or-row.
    const page = parseProgramPage(`<table class="sc_courselist">
      <tr><td class="codecol">PLSC235</td><td></td><td class="hourscol">3</td></tr>
      <tr class="orclass"><td class="codecol orclass">or PLSC275<sup>1</sup></td><td>Some Title</td><td class="hourscol"></td></tr>
      <tr><td class="codecol">STAT4xx</td><td></td><td class="hourscol">3</td></tr></table>`);
    expect(page.lists[0]!.rows).toEqual([
      { kind: "course", codes: ["PLSC235"], title: "", credits: "3", alternative: false, footnotes: [] },
      { kind: "course", codes: ["PLSC275"], title: "Some Title", credits: null, alternative: true, footnotes: ["1"] },
      { kind: "text", text: "STAT4xx", credits: "3", footnotes: [] },
    ]);
  });
});
