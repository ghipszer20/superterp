// Grad courses as an undergrad (feature-modules.md; owner ruling 2026-09-27, rulings.md ~line 81):
// checkPlan's grad-course issues. Uses a bare (empty) catalog since these checks work from the
// course id alone -- see grad-courses.test.ts for the underlying pure logic.

import { describe, expect, it } from "vitest";
import type { PlanCatalog } from "../src/catalog.ts";
import { checkPlan, type Plan, type PlanIssue } from "../src/check.ts";

const EMPTY_CATALOG: PlanCatalog = new Map();

function plan(terms: Plan["terms"], mastersCredits?: number): Plan {
  return { terms, ...(mastersCredits === undefined ? {} : { mastersCredits }) };
}

const of = (issues: PlanIssue[], kind: PlanIssue["kind"]) => issues.filter((i) => i.kind === kind);

describe("grad-course permission and range", () => {
  it("warns that every planned 600-897 course (not 799) needs advisor permission, never blocking it", () => {
    const issues = checkPlan(plan([{ name: "Fall 2026", courses: [{ id: "CMSC616", credits: 3 }] }]), EMPTY_CATALOG);
    const permission = of(issues, "grad-permission");
    expect(permission).toHaveLength(1);
    expect(permission[0]).toMatchObject({ severity: "warning", course: "CMSC616", term: "Fall 2026" });
    expect(of(issues, "grad-restricted")).toEqual([]);
  });

  it("errors on 799 (thesis research), 898 and 899, but still doesn't remove the course", () => {
    for (const id of ["CMSC799", "CMSC898", "CMSC899"]) {
      const issues = checkPlan(plan([{ name: "Fall 2026", courses: [{ id, credits: 3 }] }]), EMPTY_CATALOG);
      const restricted = of(issues, "grad-restricted");
      expect(restricted).toHaveLength(1);
      expect(restricted[0]).toMatchObject({ severity: "error", course: id });
      expect(of(issues, "grad-permission")).toEqual([]);
    }
  });

  it("doesn't flag an undergrad-level course", () => {
    const issues = checkPlan(plan([{ name: "Fall 2026", courses: [{ id: "CMSC131", credits: 4 }] }]), EMPTY_CATALOG);
    expect(of(issues, "grad-permission")).toEqual([]);
    expect(of(issues, "grad-restricted")).toEqual([]);
  });
});

describe("graduate-only credit cap", () => {
  const gradOnly = (credits: number) => ({ id: "CMSC616", credits, gradTag: "graduate-only" as const });

  it("is silent at or under 9 credits", () => {
    const issues = checkPlan(plan([{ name: "Fall 2026", courses: [gradOnly(9)] }]), EMPTY_CATALOG);
    expect(of(issues, "grad-only-cap")).toEqual([]);
  });

  it("warns between 9 and 12 credits, mentioning the petition", () => {
    const issues = checkPlan(
      plan([
        { name: "Fall 2026", courses: [gradOnly(9)] },
        { name: "Spring 2027", courses: [{ id: "CMSC624", credits: 3, gradTag: "graduate-only" as const }] },
      ]),
      EMPTY_CATALOG,
    );
    const cap = of(issues, "grad-only-cap");
    expect(cap).toHaveLength(1);
    expect(cap[0]?.severity).toBe("warning");
    expect(cap[0]?.message).toMatch(/petition/i);
  });

  it("errors above 12 credits (the petitioned cap)", () => {
    const issues = checkPlan(
      plan([
        { name: "Fall 2026", courses: [gradOnly(9)] },
        { name: "Spring 2027", courses: [{ id: "CMSC624", credits: 4, gradTag: "graduate-only" as const }] },
      ]),
      EMPTY_CATALOG,
    );
    const cap = of(issues, "grad-only-cap");
    expect(cap).toHaveLength(1);
    expect(cap[0]?.severity).toBe("error");
  });

  it("doesn't count toward the cap when the course is tagged undergrad credit (no tag)", () => {
    const issues = checkPlan(plan([{ name: "Fall 2026", courses: [{ id: "CMSC616", credits: 15 }] }]), EMPTY_CATALOG);
    expect(of(issues, "grad-only-cap")).toEqual([]);
  });
});

describe("BS/MS double-count cap and grade rule", () => {
  const bsMs = (credits: number, extra: { status?: "planned" | "completed"; grade?: string } = {}) => ({
    id: "CMSC616",
    credits,
    gradTag: "bs-ms" as const,
    ...extra,
  });

  it("shows an info note when no master's-credit total is set", () => {
    const issues = checkPlan(plan([{ name: "Fall 2026", courses: [bsMs(3)] }]), EMPTY_CATALOG);
    const cap = of(issues, "grad-double-count-cap");
    expect(cap).toHaveLength(1);
    expect(cap[0]?.severity).toBe("info");
  });

  it("warns above the 35% cap once master's credits are set", () => {
    // 30 masters credits -> 10.5-credit cap; 12 double-counted credits is over it.
    const issues = checkPlan(plan([{ name: "Fall 2026", courses: [bsMs(12)] }], 30), EMPTY_CATALOG);
    const cap = of(issues, "grad-double-count-cap");
    expect(cap).toHaveLength(1);
    expect(cap[0]?.severity).toBe("warning");
    expect(cap[0]?.message).toMatch(/10\.5/);
  });

  it("is silent at or under the cap", () => {
    const issues = checkPlan(plan([{ name: "Fall 2026", courses: [bsMs(9)] }], 30), EMPTY_CATALOG);
    expect(of(issues, "grad-double-count-cap")).toEqual([]);
  });

  it("flags a planned (not yet graded) bs-ms course as needing B- or better", () => {
    const issues = checkPlan(plan([{ name: "Fall 2026", courses: [bsMs(3, { status: "planned" })] }]), EMPTY_CATALOG);
    const grade = of(issues, "grad-double-count-grade");
    expect(grade).toHaveLength(1);
    expect(grade[0]?.severity).toBe("info");
  });

  it("warns when a completed bs-ms course's grade doesn't meet B- or better", () => {
    const issues = checkPlan(plan([{ name: "Fall 2026", courses: [bsMs(3, { status: "completed", grade: "C+" })] }]), EMPTY_CATALOG);
    const grade = of(issues, "grad-double-count-grade");
    expect(grade).toHaveLength(1);
    expect(grade[0]?.severity).toBe("warning");
  });

  it("doesn't flag a completed bs-ms course graded B- or better", () => {
    const issues = checkPlan(plan([{ name: "Fall 2026", courses: [bsMs(3, { status: "completed", grade: "B-" })] }]), EMPTY_CATALOG);
    expect(of(issues, "grad-double-count-grade")).toEqual([]);
  });
});
