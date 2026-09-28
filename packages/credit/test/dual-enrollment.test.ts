// Examples mirror real rows of UMD's Transfer Course Database for Montgomery College (SOURCES.md).

import { describe, expect, it } from "vitest";
import { CreditError, dualEnrollmentToStudentCourses, type DualEnrollmentEntry } from "../src/index.ts";

const calc: DualEnrollmentEntry = {
  institution: "Montgomery College",
  course: "MATH181",
  credits: 4,
  umdEquivalent: [{ id: "MATH140", genEd: ["FSAR", "FSMA"] }],
};

describe("dualEnrollmentToStudentCourses", () => {
  it("gives the UMD equivalent the entry's credits and Gen Ed", () => {
    expect(dualEnrollmentToStudentCourses([calc])).toEqual([
      { id: "MATH140", credits: 4, status: "completed", genEd: ["FSAR", "FSMA"], source: "Montgomery College MATH181" },
    ]);
  });

  it("accepts course ids written with a space or in lowercase", () => {
    const entry = { ...calc, umdEquivalent: [{ id: "math 140" }] };
    expect(dualEnrollmentToStudentCourses([entry])[0]).toMatchObject({ id: "MATH140", genEd: [] });
  });

  it("turns elective credit into an L1 placeholder", () => {
    const java: DualEnrollmentEntry = { institution: "Montgomery College", course: "CMSC201", credits: 3, umdEquivalent: "elective credit" };
    expect(dualEnrollmentToStudentCourses([java])).toEqual([
      { id: "L1:Montgomery College CMSC201", credits: 3, status: "completed", genEd: [], source: "Montgomery College CMSC201" },
    ]);
  });

  it("splits one course into several UMD equivalents with their own credits", () => {
    const bio: DualEnrollmentEntry = {
      institution: "Montgomery College",
      course: "BIOL150",
      credits: 4,
      umdEquivalent: [
        { id: "BSCI170", credits: 3, genEd: ["DSNL"] },
        { id: "BSCI171", credits: 1 },
      ],
    };
    expect(dualEnrollmentToStudentCourses([bio]).map((c) => [c.id, c.credits, c.genEd])).toEqual([
      ["BSCI170", 3, ["DSNL"]],
      ["BSCI171", 1, []],
    ]);
  });

  it("rejects several equivalents whose credits don't add up to the course's", () => {
    const bad: DualEnrollmentEntry = { ...calc, umdEquivalent: [{ id: "BSCI170" }, { id: "BSCI171", credits: 1 }] };
    expect(() => dualEnrollmentToStudentCourses([bad])).toThrow(CreditError);
  });

  it("rejects something that isn't a UMD course id", () => {
    expect(() => dualEnrollmentToStudentCourses([{ ...calc, umdEquivalent: [{ id: "Calculus" }] }])).toThrow(CreditError);
  });

  it("rejects credits that aren't a positive number", () => {
    expect(() => dualEnrollmentToStudentCourses([{ ...calc, credits: 0 }])).toThrow(CreditError);
  });
});
