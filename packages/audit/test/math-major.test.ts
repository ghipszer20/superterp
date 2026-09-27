// Golden tests for the Math major, Traditional Track (2026–27 catalog).
// The plan is hand-built from the catalog's rules; the owner verifies it.

import { describe, expect, it } from "vitest";
import { auditProgram, type StudentCourse } from "../src/audit.ts";
import { mathMajorTraditional } from "../programs/math-major-2026-27.ts";

const c = (id: string, credits = 3): StudentCourse => ({ id, credits, status: "completed", grade: "B" });

const completePlan: StudentCourse[] = [
  // Introductory sequence
  c("MATH140", 4), c("MATH141", 4), c("MATH240", 4), c("MATH241", 4), c("MATH310"), c("MATH246"),
  // Eight 400-level MATH/AMSC/STAT, including MATH410, an algebra course, AMSC460/466, a STAT 400-level, a depth sequence
  c("MATH410"), c("MATH411"), c("MATH403"), c("AMSC460"), c("STAT400"), c("MATH405"), c("MATH452"), c("MATH463"),
  // Programming
  c("CMSC131", 4),
  // Supporting sequence (Sequence Four: CMSC131, CMSC132, CMSC216)
  c("CMSC132", 4), c("CMSC216", 4),
];

const statusOf = async (courses: StudentCourse[]) =>
  Object.fromEntries((await auditProgram(mathMajorTraditional, courses)).requirements.map((r) => [r.id, r.status]));
const without = (...ids: string[]) => completePlan.filter((x) => !ids.includes(x.id));

describe("Math major, Traditional Track, 2026–27", () => {
  it("passes a complete plan", async () => {
    const statuses = await statusOf(completePlan);
    for (const [id, status] of Object.entries(statuses)) expect(`${id}: ${status}`).toBe(`${id}: satisfied`);
  });

  it("is unverified until the owner signs off", () => {
    expect(mathMajorTraditional.verified).toBe(false);
  });

  it("flags a missing MATH410", async () => {
    expect((await statusOf(without("MATH410", "MATH411"))).math410).toBe("missing");
  });

  it("flags a missing depth sequence", async () => {
    // Without MATH411, MATH463, MATH404 and MATH405, no depth pair is complete.
    const statuses = await statusOf(without("MATH411", "MATH463", "MATH404", "MATH405"));
    expect(statuses.depth).not.toBe("satisfied");
  });

  it("flags fewer than eight 400-level courses", async () => {
    expect((await statusOf(without("MATH452"))).eight).toBe("partial");
  });

  it("doesn't count excluded courses (MATH461, STAT464) toward the eight", async () => {
    const plan = [...without("MATH452"), c("MATH461")];
    expect((await statusOf(plan)).eight).toBe("partial");
  });

  it("flags an incomplete supporting sequence", async () => {
    expect((await statusOf(without("CMSC216"))).supporting).not.toBe("satisfied");
  });

  it("accepts the honors sequence MATH340–MATH341 in place of MATH240, MATH241 and MATH246", async () => {
    const plan = [...without("MATH240", "MATH241", "MATH246"), c("MATH340", 4), c("MATH341", 4)];
    const statuses = await statusOf(plan);
    expect([statuses.math240, statuses.math241, statuses.intro3]).toEqual(["satisfied", "satisfied", "satisfied"]);
  });

  // Assumption (PROJECT_MEMORY section 17, open question 4): same substitutes as the Applied track.
  it("accepts CMSC141/CMSC142 for CMSC131/CMSC132 in Sequence Four", async () => {
    const plan = [...without("CMSC131", "CMSC132"), c("CMSC141", 4), c("CMSC142", 4)];
    const statuses = await statusOf(plan);
    expect([statuses.programming, statuses.supporting]).toEqual(["satisfied", "satisfied"]);
  });

  it("accepts a mixed Sequence Four: CMSC141, CMSC132, CMSC216", async () => {
    const plan = [...without("CMSC131"), c("CMSC141", 4)];
    expect((await statusOf(plan)).supporting).toBe("satisfied");
  });

  it("accepts MATH461 in place of MATH240 (department page)", async () => {
    const plan = [...without("MATH240"), c("MATH461")];
    expect((await statusOf(plan)).math240).toBe("satisfied");
  });

  it("accepts the department page's expanded programming list (e.g. AOSC247)", async () => {
    const plan = [...without("CMSC131", "CMSC132"), c("AOSC247")];
    expect((await statusOf(plan)).programming).toBe("satisfied");
  });

  it("accepts the department page's extra supporting sequences (Nine: BSCI, Ten: ASTR)", async () => {
    const withSupporting = (...ids: string[]) => [...without("CMSC132", "CMSC216"), ...ids.map((id) => c(id))];
    expect((await statusOf(withSupporting("BSCI170", "BSCI160", "BSCI180", "CHEM131", "CHEM132"))).supporting).toBe("satisfied");
    expect((await statusOf(withSupporting("ASTR130", "ASTR131", "ASTR232"))).supporting).toBe("satisfied");
  });

  it("accepts the department page's extra supporting sequences (Eleven: GEOL, Twelve: AOSC)", async () => {
    const withSupporting = (...ids: string[]) => [...without("CMSC132", "CMSC216"), ...ids.map((id) => c(id))];
    expect((await statusOf(withSupporting("GEOL100", "GEOL110", "GEOL340", "GEOL375"))).supporting).toBe("satisfied");
    expect((await statusOf(withSupporting("AOSC200", "AOSC201", "AOSC431", "AOSC432"))).supporting).toBe("satisfied");
  });

  it("documents the unencoded major-GPA requirement", () => {
    expect(mathMajorTraditional.reviewNotes!.some((n) => n.includes("2.000"))).toBe(true);
  });
});
