// Golden tests for two representative departmental honors programs: History (a fixed
// four-course sequence) and Mathematics (a "choose" breadth list plus a credits-based
// thesis requirement). Each has a plan that completes the program and plans broken on
// purpose that must fail a named requirement.

import { describe, expect, it } from "vitest";
import { auditProgram, type Program, type StudentCourse } from "@superterp/audit";
import { deptHist } from "../special-programs/dept-hist-2026-27.ts";
import { deptMath } from "../special-programs/dept-math-2026-27.ts";

const c = (id: string, credits = 3, grade = "A"): StudentCourse => ({ id, credits, status: "completed", grade });

const statuses = async (program: Program, courses: StudentCourse[]) =>
  Object.fromEntries((await auditProgram(program, courses)).requirements.map((r) => [r.id, r.status]));

async function expectAllSatisfied(program: Program, courses: StudentCourse[]) {
  for (const [id, status] of Object.entries(await statuses(program, courses))) expect(`${id}: ${status}`).toBe(`${id}: satisfied`);
}

const replace = (plan: StudentCourse[], id: string, by: StudentCourse | null) =>
  plan.flatMap((x) => (x.id === id ? (by ? [by] : []) : [x]));

describe("Departmental Honors: History (2026-27)", () => {
  const plan = [c("HIST395"), c("HIST396"), c("HIST398"), c("HIST399")];

  it("passes a complete plan", async () => expectAllSatisfied(deptHist, plan));

  it("misses Honors Colloquium I when HIST395 is dropped", async () => {
    expect((await statuses(deptHist, replace(plan, "HIST395", null))).hist395).toBe("missing");
  });

  it("doesn't count a regular seminar in place of the senior thesis-writing course", async () => {
    expect((await statuses(deptHist, replace(plan, "HIST399", c("HIST409")))).hist399).toBe("missing");
  });
});

describe("Departmental Honors: Mathematics (2026-27)", () => {
  const plan = [c("MATH403"), c("MATH432"), c("MATH498", 3), c("MATH498", 3)];

  it("passes a complete plan", async () => expectAllSatisfied(deptMath, plan));

  it("needs two breadth courses, not one", async () => {
    expect((await statuses(deptMath, replace(plan, "MATH432", null))).breadth).toBe("partial");
  });

  it("doesn't count a course outside the breadth list", async () => {
    expect((await statuses(deptMath, replace(plan, "MATH432", c("MATH410")))).breadth).toBe("partial");
  });

  it("needs 6 credits of MATH498, not 3", async () => {
    const short = [c("MATH403"), c("MATH432"), c("MATH498", 3)];
    expect((await statuses(deptMath, short))["depth-thesis"]).toBe("partial");
  });
});
