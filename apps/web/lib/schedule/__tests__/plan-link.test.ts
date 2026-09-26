import { describe, expect, it } from "vitest";
import { newPlan, planReducer, type AdvisorPlan } from "../../advisor/plan-state";
import { applyQueryCourses, otherPlannedTerms, planCourseIds, planTermName } from "../plan-link";

const base = (): AdvisorPlan => newPlan({ programs: ["cmsc-major"], catalogYear: "2026-27", startTerm: "Fall 2026" });

describe("planTermName", () => {
  it("maps the schedule builder's Testudo term id to the plan's term name", () => {
    expect(planTermName("202701")).toBe("Spring 2027");
  });

  it("is null for an id the plan's term names can't express", () => {
    expect(planTermName("not-a-term")).toBeNull();
  });
});

describe("planCourseIds", () => {
  it("gives the plan term's course ids", () => {
    const plan = planReducer(base(), { type: "add-course", term: "Spring 2027", id: "CMSC132" });
    expect(planCourseIds(plan, "Spring 2027")).toEqual(["CMSC132"]);
  });

  it("is empty when the plan has no such term yet", () => {
    expect(planCourseIds(base(), "Fall 2040")).toEqual([]);
  });
});

describe("otherPlannedTerms", () => {
  it("lists the other terms (sorted) that also have the course", () => {
    let plan = planReducer(base(), { type: "add-course", term: "Fall 2026", id: "CMSC216" });
    plan = planReducer(plan, { type: "add-course", term: "Fall 2027", id: "CMSC216" });
    plan = planReducer(plan, { type: "add-course", term: "Spring 2027", id: "CMSC216" });
    expect(otherPlannedTerms(plan, "Spring 2027", "CMSC216")).toEqual(["Fall 2026", "Fall 2027"]);
  });

  it("excludes the term being asked about, even if it has the course", () => {
    const plan = planReducer(base(), { type: "add-course", term: "Fall 2026", id: "CMSC216" });
    expect(otherPlannedTerms(plan, "Fall 2026", "CMSC216")).toEqual([]);
  });

  it("is empty when no other term has the course", () => {
    const plan = planReducer(base(), { type: "add-course", term: "Fall 2026", id: "CMSC216" });
    expect(otherPlannedTerms(plan, "Spring 2027", "MATH140")).toEqual([]);
  });
});

describe("applyQueryCourses", () => {
  it("replaces the list for a standalone builder (no plan)", () => {
    expect(applyQueryCourses(["CMSC131"], ["STAT400"], false)).toEqual(["STAT400"]);
  });

  it("only adds to a plan-linked term, so a stale link can never delete a plan's courses", () => {
    expect(applyQueryCourses(["CMSC131", "MATH140"], ["STAT400"], true)).toEqual(["CMSC131", "MATH140", "STAT400"]);
  });

  it("doesn't duplicate a course the link already asks for", () => {
    expect(applyQueryCourses(["CMSC131"], ["CMSC131"], true)).toEqual(["CMSC131"]);
  });
});
