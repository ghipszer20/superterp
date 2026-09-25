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

  it("keeps a requirement with no course as something to confirm by hand", () => {
    expect(parsePrerequisite("Permission of CMNS-Mathematics department.")).toEqual({
      kind: "manual",
      text: "Permission of CMNS-Mathematics department",
    });
  });

  it("joins semicolon clauses by their leading connector, keeping manual alternatives", () => {
    expect(parsePrerequisite("Minimum grade of C- in CMSC330 and CMSC351; or permission of instructor.")).toEqual({
      kind: "any",
      of: [
        {
          kind: "all",
          of: [
            { kind: "course", course: "CMSC330", minGrade: "C-" },
            { kind: "course", course: "CMSC351", minGrade: "C-" },
          ],
        },
        { kind: "manual", text: "permission of instructor" },
      ],
    });
  });

  it("treats a sentence starting with 'Or' as an alternative to everything before it", () => {
    expect(
      parsePrerequisite(
        "Minimum grade of C- in CMSC351; and permission of CMNS-Computer Science department. Or must be in the (Computer Science (Doctoral), Computer Science (Master's)) program.",
      ),
    ).toEqual({
      kind: "any",
      of: [
        {
          kind: "all",
          of: [
            { kind: "course", course: "CMSC351", minGrade: "C-" },
            { kind: "manual", text: "permission of CMNS-Computer Science department" },
          ],
        },
        {
          kind: "manual",
          text: "must be in the (Computer Science (Doctoral), Computer Science (Master's)) program",
        },
      ],
    });
  });

  it("doesn't mistake an ordinary word and a number for a course", () => {
    expect(parsePrerequisite("Must have completed more than 300 hours of clinical work.")).toEqual({
      kind: "manual",
      text: "Must have completed more than 300 hours of clinical work",
    });
  });

  it("allows taking a course at the same time when the text says 'concurrently enrolled'", () => {
    expect(parsePrerequisite("Must have completed or be concurrently enrolled in CHEM481.")).toEqual({
      kind: "course",
      course: "CHEM481",
      concurrentOk: true,
    });
  });

  it("treats math eligibility as a placement to confirm, not a course to have taken", () => {
    expect(parsePrerequisite("Must have math eligibility of MATH120 or higher.")).toEqual({
      kind: "manual",
      text: "Must have math eligibility of MATH120 or higher",
    });
  });

  it("keeps a permission requirement that shares a clause with a course", () => {
    expect(parsePrerequisite("Minimum grade of C- in MATH340 and permission of CMNS-Mathematics department.")).toEqual({
      kind: "all",
      of: [
        { kind: "course", course: "MATH340", minGrade: "C-" },
        { kind: "manual", text: "permission of CMNS-Mathematics department" },
      ],
    });
  });
});
