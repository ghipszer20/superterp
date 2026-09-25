import { describe, expect, it } from "vitest";
import { auditProgram, type Program } from "@superterp/audit";
import { creditForAp, creditForIb, CreditError, toStudentCourses } from "../src/index.ts";

describe("toStudentCourses", () => {
  it("turns AP Calculus BC 5 into two completed courses with no grade", () => {
    expect(toStudentCourses([creditForAp("Calculus BC", 5)])).toEqual({
      courses: [
        { id: "MATH140", credits: 4, status: "completed", genEd: ["FSMA", "FSAR"], source: "AP Calculus BC (5)" },
        { id: "MATH141", credits: 4, status: "completed", genEd: [], source: "AP Calculus BC (5)" },
      ],
      needsChoice: [],
    });
  });

  it("gives credit with no UMD course a placeholder id no course requirement can match", () => {
    const { courses } = toStudentCourses([creditForAp("Computer Science A", 4), creditForAp("Biology", 3), creditForIb("Psychology", "HL", 5)]);
    expect(courses).toEqual([
      { id: "L1:AP Computer Science A", credits: 3, status: "completed", genEd: [], source: "AP Computer Science A (4)" },
      { id: "DSNL:AP Biology", credits: 4, status: "completed", genEd: ["DSNL"], source: "AP Biology (3)" },
      { id: "DSHS:IB Psychology HL", credits: 3, status: "completed", genEd: ["DSHS"], source: "IB Psychology HL (5)" },
    ]);
  });

  it("numbers two placeholders from the same award", () => {
    const { courses } = toStudentCourses([creditForAp("English Literature and Composition", 5)]);
    expect(courses.map((c) => c.id)).toEqual(["ENGL278", "L1:AP English Literature and Composition"]);
    const twoElectives = toStudentCourses([
      { ...creditForAp("Seminar", 4), parts: [...creditForAp("Seminar", 4).parts, ...creditForAp("Seminar", 4).parts] },
    ]);
    expect(twoElectives.courses.map((c) => c.id)).toEqual(["L1:AP Seminar", "L1:AP Seminar #2"]);
  });

  it("skips awards that earn nothing", () => {
    expect(toStudentCourses([creditForAp("Calculus BC", 2)]).courses).toEqual([]);
  });

  it("holds back a choice until the student picks a course", () => {
    const history = creditForAp("United States History", 4);
    expect(toStudentCourses([history])).toEqual({
      courses: [],
      needsChoice: [{ source: "AP United States History (4)", credits: 3, options: ["HIST200", "HIST201"] }],
    });
    expect(toStudentCourses([history], { "AP United States History (4)": "HIST201" }).courses).toEqual([
      { id: "HIST201", credits: 3, status: "completed", genEd: ["DSHS", "DSHU", "DVUP"], source: "AP United States History (4)" },
    ]);
  });

  it("rejects a pick the chart doesn't offer", () => {
    expect(() => toStudentCourses([creditForAp("United States History", 4)], { "AP United States History (4)": "HIST110" })).toThrow(CreditError);
  });

  it("counts a course once when two exams award it", () => {
    const { courses } = toStudentCourses([creditForAp("Calculus AB", 5), creditForAp("Calculus BC", 5)]);
    expect(courses.map((c) => c.id)).toEqual(["MATH140", "MATH141"]);
  });
});

describe("in the degree audit", () => {
  const program: Program = {
    id: "demo",
    name: "Demo",
    requirements: [
      { kind: "course", id: "calc1", name: "Calculus I", options: ["MATH140"] },
      { kind: "choose", id: "lab", name: "Lab science", count: 1, from: { genEd: ["DSNL"] } },
      { kind: "choose", id: "cs", name: "A CMSC course", count: 1, from: { departments: ["CMSC"] } },
      { kind: "choose", id: "total", name: "Credits", credits: 15, from: { anyCourse: true }, overlay: true },
    ],
  };

  it("counts exam credit toward courses, Gen Ed and total credits, but not department requirements", async () => {
    const { courses } = toStudentCourses([creditForAp("Calculus BC", 5), creditForAp("Biology", 3), creditForAp("Computer Science A", 4)]);
    const status = Object.fromEntries((await auditProgram(program, courses)).requirements.map((r) => [r.id, r.status]));
    expect(status).toEqual({ calc1: "satisfied", lab: "satisfied", cs: "missing", total: "satisfied" });
  });
});
