import { describe, expect, it } from "vitest";
import { emptyPrior, newPlan, planReducer, termCourseIds, type AdvisorPlan } from "../advisor/plan-state";

const base = () => newPlan({ programs: ["cmsc-major"], catalogYear: "2026-27", startTerm: "Fall 2026" });
const courses = (plan: AdvisorPlan, term: string) => termCourseIds(plan, term);

describe("newPlan", () => {
  it("starts with eight empty fall and spring terms and no prior credit", () => {
    const plan = base();
    expect(plan.v).toBe(1);
    expect(plan.terms.map((t) => t.name)).toEqual([
      "Fall 2026",
      "Spring 2027",
      "Fall 2027",
      "Spring 2028",
      "Fall 2028",
      "Spring 2029",
      "Fall 2029",
      "Spring 2030",
    ]);
    expect(plan.terms.every((t) => t.courses.length === 0)).toBe(true);
    expect(plan.prior).toEqual(emptyPrior());
  });
});

describe("planReducer: courses", () => {
  it("adds a course to a term, upper-casing and trimming the id", () => {
    const plan = planReducer(base(), { type: "add-course", term: "Fall 2026", id: " cmsc131 " });
    expect(courses(plan, "Fall 2026")).toEqual(["CMSC131"]);
  });

  it("doesn't add the same course twice to one term", () => {
    let plan = planReducer(base(), { type: "add-course", term: "Fall 2026", id: "CMSC131" });
    plan = planReducer(plan, { type: "add-course", term: "Fall 2026", id: "CMSC131" });
    expect(courses(plan, "Fall 2026")).toEqual(["CMSC131"]);
  });

  it("ignores a term that isn't in the plan", () => {
    const plan = base();
    expect(planReducer(plan, { type: "add-course", term: "Fall 2040", id: "CMSC131" })).toBe(plan);
  });

  it("removes a course from one term only", () => {
    let plan = planReducer(base(), { type: "add-course", term: "Fall 2026", id: "CMSC131" });
    plan = planReducer(plan, { type: "add-course", term: "Spring 2027", id: "CMSC131" });
    plan = planReducer(plan, { type: "remove-course", term: "Fall 2026", id: "CMSC131" });
    expect(courses(plan, "Fall 2026")).toEqual([]);
    expect(courses(plan, "Spring 2027")).toEqual(["CMSC131"]);
  });

  it("moves a course to another term, at an index or at the end", () => {
    let plan = base();
    for (const id of ["CMSC131", "MATH140"]) plan = planReducer(plan, { type: "add-course", term: "Fall 2026", id });
    plan = planReducer(plan, { type: "add-course", term: "Spring 2027", id: "CMSC132" });
    plan = planReducer(plan, { type: "move-course", id: "MATH140", from: "Fall 2026", to: "Spring 2027", index: 0 });
    expect(courses(plan, "Fall 2026")).toEqual(["CMSC131"]);
    expect(courses(plan, "Spring 2027")).toEqual(["MATH140", "CMSC132"]);
    plan = planReducer(plan, { type: "move-course", id: "CMSC131", from: "Fall 2026", to: "Spring 2027" });
    expect(courses(plan, "Spring 2027")).toEqual(["MATH140", "CMSC132", "CMSC131"]);
  });

  it("reorders within a term", () => {
    let plan = base();
    for (const id of ["A", "B", "C"].map((x) => `CMSC13${x.charCodeAt(0) - 64}`))
      plan = planReducer(plan, { type: "add-course", term: "Fall 2026", id });
    plan = planReducer(plan, { type: "move-course", id: "CMSC133", from: "Fall 2026", to: "Fall 2026", index: 0 });
    expect(courses(plan, "Fall 2026")).toEqual(["CMSC133", "CMSC131", "CMSC132"]);
  });

  it("won't move a course onto a term that already has it", () => {
    let plan = planReducer(base(), { type: "add-course", term: "Fall 2026", id: "CMSC131" });
    plan = planReducer(plan, { type: "add-course", term: "Spring 2027", id: "CMSC131" });
    const next = planReducer(plan, { type: "move-course", id: "CMSC131", from: "Fall 2026", to: "Spring 2027" });
    expect(next).toBe(plan);
  });

  it("keeps a course's own fields (credits) when it moves", () => {
    let plan = planReducer(base(), { type: "add-course", term: "Fall 2026", id: "CMSC498", credits: 2 });
    plan = planReducer(plan, { type: "move-course", id: "CMSC498", from: "Fall 2026", to: "Fall 2027" });
    expect(plan.terms.find((t) => t.name === "Fall 2027")!.courses).toEqual([{ id: "CMSC498", credits: 2 }]);
  });

  it("sets a course's completion status and grade", () => {
    let plan = planReducer(base(), { type: "add-course", term: "Fall 2026", id: "CMSC131" });
    plan = planReducer(plan, { type: "set-course", term: "Fall 2026", id: "CMSC131", status: "completed", grade: "B+" });
    expect(plan.terms[0]!.courses).toEqual([{ id: "CMSC131", status: "completed", grade: "B+" }]);
  });

  it("clears a course's status and grade when set back to undefined", () => {
    let plan = planReducer(base(), { type: "add-course", term: "Fall 2026", id: "CMSC131" });
    plan = planReducer(plan, { type: "set-course", term: "Fall 2026", id: "CMSC131", status: "completed", grade: "F" });
    plan = planReducer(plan, { type: "set-course", term: "Fall 2026", id: "CMSC131", status: undefined, grade: undefined });
    expect(plan.terms[0]!.courses).toEqual([{ id: "CMSC131" }]);
  });

  it("leaves other courses and terms alone", () => {
    let plan = planReducer(base(), { type: "add-course", term: "Fall 2026", id: "CMSC131", credits: 4 });
    plan = planReducer(plan, { type: "add-course", term: "Fall 2026", id: "MATH140" });
    plan = planReducer(plan, { type: "set-course", term: "Fall 2026", id: "CMSC131", status: "completed", grade: "A" });
    expect(plan.terms[0]!.courses).toEqual([
      { id: "CMSC131", credits: 4, status: "completed", grade: "A" },
      { id: "MATH140" },
    ]);
  });

  it("ignores a course or term that isn't in the plan", () => {
    const plan = planReducer(base(), { type: "add-course", term: "Fall 2026", id: "CMSC131" });
    expect(planReducer(plan, { type: "set-course", term: "Fall 2026", id: "MATH140", status: "completed" })).toBe(plan);
    expect(planReducer(plan, { type: "set-course", term: "Fall 2040", id: "CMSC131", status: "completed" })).toBe(plan);
  });
});

describe("planReducer: terms", () => {
  it("adds a winter or summer term in order", () => {
    let plan = planReducer(base(), { type: "add-term", name: "Summer 2027" });
    plan = planReducer(plan, { type: "add-term", name: "Winter 2027" });
    expect(plan.terms.slice(0, 4).map((t) => t.name)).toEqual(["Fall 2026", "Winter 2027", "Spring 2027", "Summer 2027"]);
  });

  it("adds an extra term after the last one", () => {
    const plan = planReducer(base(), { type: "add-term", name: "Fall 2030" });
    expect(plan.terms.at(-1)!.name).toBe("Fall 2030");
  });

  it("ignores a duplicate or malformed term", () => {
    const plan = base();
    expect(planReducer(plan, { type: "add-term", name: "Fall 2026" })).toBe(plan);
    expect(planReducer(plan, { type: "add-term", name: "Autumn 2026" })).toBe(plan);
  });

  it("removes a term with its courses", () => {
    let plan = planReducer(base(), { type: "add-term", name: "Summer 2027" });
    plan = planReducer(plan, { type: "add-course", term: "Summer 2027", id: "STAT400" });
    plan = planReducer(plan, { type: "remove-term", name: "Summer 2027" });
    expect(plan.terms.map((t) => t.name)).not.toContain("Summer 2027");
  });
});

describe("planReducer: setup", () => {
  it("changes programs and catalog year without touching the terms", () => {
    let plan = planReducer(base(), { type: "add-course", term: "Fall 2026", id: "CMSC131" });
    plan = planReducer(plan, { type: "setup", programs: ["math-major-applied"], catalogYear: "2026-27", startTerm: "Fall 2026" });
    expect(plan.programs).toEqual(["math-major-applied"]);
    expect(courses(plan, "Fall 2026")).toEqual(["CMSC131"]);
  });

  it("shifts every course with a new start term, keeping each course's position in the sequence", () => {
    let plan = planReducer(base(), { type: "add-course", term: "Fall 2026", id: "CMSC131" });
    plan = planReducer(plan, { type: "add-course", term: "Spring 2027", id: "CMSC132" });
    plan = planReducer(plan, { type: "setup", programs: ["cmsc-major"], catalogYear: "2026-27", startTerm: "Fall 2027" });
    expect(plan.startTerm).toBe("Fall 2027");
    expect(courses(plan, "Fall 2027")).toEqual(["CMSC131"]);
    expect(courses(plan, "Spring 2028")).toEqual(["CMSC132"]);
    expect(plan.terms).toHaveLength(8);
  });

  it("moves a winter or summer term's courses into the term before it when the start changes", () => {
    let plan = planReducer(base(), { type: "add-term", name: "Winter 2027" });
    plan = planReducer(plan, { type: "add-course", term: "Winter 2027", id: "MATH241" });
    plan = planReducer(plan, { type: "setup", programs: ["cmsc-major"], catalogYear: "2026-27", startTerm: "Spring 2027" });
    expect(courses(plan, "Spring 2027")).toEqual(["MATH241"]);
  });
});

describe("planReducer: term course list from the schedule builder", () => {
  it("replaces a term's courses, keeping fields of courses that stay (course level only)", () => {
    let plan = planReducer(base(), { type: "add-course", term: "Fall 2026", id: "CMSC498", credits: 2 });
    plan = planReducer(plan, { type: "add-course", term: "Fall 2026", id: "ENGL101" });
    plan = planReducer(plan, { type: "set-term-courses", term: "Fall 2026", ids: ["CMSC498", "MATH140"] });
    expect(plan.terms[0]!.courses).toEqual([{ id: "CMSC498", credits: 2 }, { id: "MATH140" }]);
  });

  it("creates the term, in sorted order, when the schedule builder's term isn't in the plan yet", () => {
    const plan = planReducer(base(), { type: "set-term-courses", term: "Fall 2030", ids: ["STAT400"] });
    expect(plan.terms.map((t) => t.name)).toEqual([
      "Fall 2026",
      "Spring 2027",
      "Fall 2027",
      "Spring 2028",
      "Fall 2028",
      "Spring 2029",
      "Fall 2029",
      "Spring 2030",
      "Fall 2030",
    ]);
    expect(plan.terms.at(-1)!.courses).toEqual([{ id: "STAT400" }]);
  });

  it("ignores a malformed term name it would otherwise have to create", () => {
    const plan = base();
    expect(planReducer(plan, { type: "set-term-courses", term: "Not A Term", ids: ["STAT400"] })).toBe(plan);
  });

  it("returns the same plan when the course ids are already what's asked for", () => {
    const plan = planReducer(base(), { type: "add-course", term: "Fall 2026", id: "CMSC131" });
    const next = planReducer(plan, { type: "set-term-courses", term: "Fall 2026", ids: ["CMSC131"] });
    expect(next).toBe(plan);
  });
});

describe("planReducer: prior credit and GPA", () => {
  it("stores the prior-credit inputs as entered", () => {
    const prior = { ...emptyPrior(), ap: [{ key: "a1", exam: "Calculus BC", score: 5 }] };
    const plan = planReducer(base(), { type: "set-prior", prior });
    expect(plan.prior).toEqual(prior);
  });

  it("stores a GPA and clears it", () => {
    let plan = planReducer(base(), { type: "set-gpa", gpa: 3.4 });
    expect(plan.gpa).toBe(3.4);
    plan = planReducer(plan, { type: "set-gpa", gpa: undefined });
    expect(plan).not.toHaveProperty("gpa");
  });
});
