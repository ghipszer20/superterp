// Golden tests for the CS major (2026–27 catalog): a complete, realistic
// plan must pass, and each deliberate break must show the matching gap.
// The plan is hand-built from the catalog's rules; the owner verifies it.

import { describe, expect, it } from "vitest";
import { auditProgram, type StudentCourse } from "../src/audit.ts";
import { cmscMajor } from "../programs/cmsc-major-2026-27.ts";

const c = (id: string, credits = 3): StudentCourse => ({ id, credits, status: "completed", grade: "B" });

const completePlan: StudentCourse[] = [
  // Lower level
  c("MATH140", 4), c("MATH141", 4), c("CMSC131", 4), c("CMSC132", 4), c("CMSC216", 4), c("CMSC250", 4),
  // Additional required
  c("CMSC330"), c("CMSC351"), c("STAT400"), c("MATH240", 4),
  // Five 400-level CMSC from three areas (Systems ×2, Info Processing ×2, Theory ×1)
  c("CMSC412"), c("CMSC414"), c("CMSC421"), c("CMSC422"), c("CMSC451"),
  // Two upper-level CMSC electives (6 credits)
  c("CMSC320"), c("CMSC433"),
  // Concentration: 12 credits of 300–400 level in one department outside CMSC
  c("MATH310"), c("MATH401"), c("MATH403"), c("MATH410"),
];

const statusOf = async (courses: StudentCourse[]) =>
  Object.fromEntries((await auditProgram(cmscMajor, courses)).requirements.map((r) => [r.id, r.status]));
const without = (...ids: string[]) => completePlan.filter((x) => !ids.includes(x.id));

describe("CS major 2026–27", () => {
  it("passes a complete plan", async () => {
    const statuses = await statusOf(completePlan);
    for (const [id, status] of Object.entries(statuses)) expect(`${id}: ${status}`).toBe(`${id}: satisfied`);
  });

  it("is unverified until the owner signs off", () => {
    expect(cmscMajor.verified).toBe(false);
    expect(cmscMajor.reviewNotes!.length).toBeGreaterThan(0);
  });

  it("flags a missing required course", async () => {
    expect((await statusOf(without("CMSC351"))).cmsc351).toBe("missing");
  });

  it("flags a D in a major course (C- minimum)", async () => {
    const plan = completePlan.map((x) => (x.id === "CMSC330" ? { ...x, grade: "D+" } : x));
    expect((await statusOf(plan)).cmsc330).toBe("missing");
  });

  it("flags upper-level courses from only two areas", async () => {
    // Systems ×3 (412, 414, 416), Information Processing ×2 (421, 422); CMSC388 keeps electives full.
    const plan = [...without("CMSC451", "CMSC433"), c("CMSC416"), c("CMSC388")];
    const statuses = await statusOf(plan);
    expect(statuses.areas).toBe("partial");
    expect(statuses.electives).toBe("satisfied");
  });

  it("accepts CMSC141 and CMSC142 for CMSC131 and CMSC132 (owner-confirmed)", async () => {
    const plan = [...without("CMSC131", "CMSC132"), c("CMSC141", 4), c("CMSC142", 4)];
    const statuses = await statusOf(plan);
    expect(statuses.cmsc131).toBe("satisfied");
    expect(statuses.cmsc132).toBe("satisfied");
  });

  it("flags a concentration split across two departments", async () => {
    const plan = [...without("MATH403", "MATH410"), c("STAT401"), c("STAT410")];
    expect((await statusOf(plan)).concentration).toBe("partial");
  });

  it("flags a plan 6 upper-level CMSC credits short", async () => {
    // Five 400-level courses can't cover both the area rule and the electives, so
    // exactly one of the two must show as unfinished; either is a correct report.
    const statuses = await statusOf(without("CMSC320", "CMSC433"));
    const unfinished = [statuses.areas, statuses.electives].filter((s) => s !== "satisfied");
    expect(unfinished).toHaveLength(1);
  });
});
