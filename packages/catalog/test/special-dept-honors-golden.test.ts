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

  it("passes a complete plan (thesis option)", async () => expectAllSatisfied(deptMath, plan));

  it("needs two breadth courses, not one", async () => {
    expect((await statuses(deptMath, replace(plan, "MATH432", null))).breadth).toBe("partial");
  });

  it("doesn't count a course outside the breadth list", async () => {
    expect((await statuses(deptMath, replace(plan, "MATH432", c("MATH410")))).breadth).toBe("partial");
  });

  it("needs 6 credits (two courses) of MATH498 for the thesis option, not one", async () => {
    const short = [c("MATH403"), c("MATH432"), c("MATH498", 3)];
    expect((await statuses(deptMath, short)).depth).toBe("partial");
  });

  it("counts a 600-level MATH/AMSC/STAT course as a breadth substitute", async () => {
    const plan2 = [c("MATH630"), c("AMSC660"), c("MATH498", 3), c("MATH498", 3)];
    expect((await statuses(deptMath, plan2)).breadth).toBe("satisfied");
  });

  it("doesn't accept a 600-level course outside MATH/AMSC/STAT as a breadth substitute", async () => {
    const plan2 = [c("CMSC650"), c("MATH432"), c("MATH498", 3), c("MATH498", 3)];
    expect((await statuses(deptMath, plan2)).breadth).toBe("partial");
  });

  it("accepts the non-thesis option: breadth, one 600-level course, and one MATH498 reading course", async () => {
    const nonThesis = [c("MATH403"), c("MATH432"), c("STAT620"), c("MATH498", 3)];
    expect((await statuses(deptMath, nonThesis)).depth).toBe("satisfied");
  });

  it("accepts the non-thesis option's other alternative: a 600-level course plus a listed course", async () => {
    const nonThesis = [c("MATH403"), c("MATH432"), c("AMSC698"), c("MATH446")];
    expect((await statuses(deptMath, nonThesis)).depth).toBe("satisfied");
  });

  it("doesn't accept two ordinary breadth-list courses as the non-thesis depth (needs a 600-level course)", async () => {
    const notDepth = [c("MATH403"), c("MATH432"), c("MATH446"), c("MATH407")];
    expect((await statuses(deptMath, notDepth)).depth).not.toBe("satisfied");
  });
});
