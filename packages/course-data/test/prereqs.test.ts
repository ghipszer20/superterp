// Inputs are real Testudo prerequisite sentences (Spring 2027); expected
// trees are written by hand.

import { describe, expect, it } from "vitest";
import { parsePrerequisite } from "../src/prereqs.ts";

describe("parsePrerequisite", () => {
  it("reads a bare course code", () => {
    expect(parsePrerequisite("MATH212.")).toEqual({ kind: "course", course: "MATH212" });
  });

  it("keeps the minimum grade", () => {
    expect(parsePrerequisite("Minimum grade of C- in MATH141.")).toEqual({
      kind: "course",
      course: "MATH141",
      minGrade: "C-",
    });
  });

  it("requires every course joined by 'and', each with the grade", () => {
    expect(parsePrerequisite("Minimum grade of C- in CMSC250 and CMSC216.")).toEqual({
      kind: "all",
      of: [
        { kind: "course", course: "CMSC250", minGrade: "C-" },
        { kind: "course", course: "CMSC216", minGrade: "C-" },
      ],
    });
  });

  it("accepts any course joined by 'or'", () => {
    expect(parsePrerequisite("Minimum grade of C- in STAT400 or STAT410.")).toEqual({
      kind: "any",
      of: [
        { kind: "course", course: "STAT400", minGrade: "C-" },
        { kind: "course", course: "STAT410", minGrade: "C-" },
      ],
    });
  });

  it("gives commas in a list the meaning of the list's final connector", () => {
    expect(parsePrerequisite("Minimum grade of C- in MATH240, MATH461 or MATH341.")).toEqual({
      kind: "any",
      of: [
        { kind: "course", course: "MATH240", minGrade: "C-" },
        { kind: "course", course: "MATH461", minGrade: "C-" },
        { kind: "course", course: "MATH341", minGrade: "C-" },
      ],
    });
  });

  it("keeps parenthesized groups together", () => {
    expect(parsePrerequisite("Minimum grade of C- in PHYS161, MATH141, CHEM135, and (ENES102 or ENAE222).")).toEqual({
      kind: "all",
      of: [
        { kind: "course", course: "PHYS161", minGrade: "C-" },
        { kind: "course", course: "MATH141", minGrade: "C-" },
        { kind: "course", course: "CHEM135", minGrade: "C-" },
        {
          kind: "any",
          of: [
            { kind: "course", course: "ENES102", minGrade: "C-" },
            { kind: "course", course: "ENAE222", minGrade: "C-" },
          ],
        },
      ],
    });
  });

  it("reads '1 course … from (list)' as a choice of one", () => {
    expect(parsePrerequisite("1 course with a minimum grade of C- from (MATH240, MATH341, MATH461, ENEE290).")).toEqual({
      kind: "any",
      of: [
        { kind: "course", course: "MATH240", minGrade: "C-" },
        { kind: "course", course: "MATH341", minGrade: "C-" },
        { kind: "course", course: "MATH461", minGrade: "C-" },
        { kind: "course", course: "ENEE290", minGrade: "C-" },
      ],
    });
  });
});
