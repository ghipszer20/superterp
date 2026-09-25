// The owner's first verification target: Math (Traditional) + CS double major,
// audited together. The plan is hand-built; the owner verifies it.

import { describe, expect, it } from "vitest";
import { auditPrograms, type StudentCourse } from "../src/audit.ts";
import { cmscMajor } from "../programs/cmsc-major-2026-27.ts";
import { mathMajorTraditional } from "../programs/math-major-2026-27.ts";

const c = (id: string, credits = 3): StudentCourse => ({ id, credits, status: "completed", grade: "B" });

// Shared foundation courses count toward both majors (UMD double majors allow this by default).
const plan: StudentCourse[] = [
  c("MATH140", 4), c("MATH141", 4), c("MATH240", 4), c("MATH241", 4), c("MATH310"), c("MATH246"),
  c("CMSC131", 4), c("CMSC132", 4), c("CMSC216", 4), c("CMSC250", 4), c("CMSC330"), c("CMSC351"),
  // Math 400-level (also the CS concentration: 12+ credits of MATH at 300–400 level)
  c("MATH410"), c("MATH411"), c("MATH403"), c("AMSC460"), c("STAT400"), c("MATH405"), c("MATH452"), c("MATH463"),
  // CS upper level: five across three areas + two electives
  c("CMSC412"), c("CMSC414"), c("CMSC421"), c("CMSC422"), c("CMSC451"), c("CMSC320"), c("CMSC433"),
];

describe("Math + CS double major", () => {
  it("satisfies both majors with shared foundation courses", async () => {
    const [math, cs] = await auditPrograms([mathMajorTraditional, cmscMajor], plan);
    for (const r of [...math!.requirements, ...cs!.requirements]) expect(`${r.id}: ${r.status}`).toBe(`${r.id}: satisfied`);
  });

  it("counts STAT400 toward CS's STAT requirement and Math's STAT requirement at the same time", async () => {
    const [math, cs] = await auditPrograms([mathMajorTraditional, cmscMajor], plan);
    expect(math!.requirements.find((r) => r.id === "stat4xx")!.assigned).toEqual(["STAT400"]);
    expect(cs!.requirements.find((r) => r.id === "stat4xx")!.assigned).toEqual(["STAT400"]);
  });

  it("shows exactly which requirement breaks when a shared course is missing", async () => {
    const [math, cs] = await auditPrograms(
      [mathMajorTraditional, cmscMajor],
      plan.filter((x) => x.id !== "MATH141"),
    );
    expect(math!.requirements.find((r) => r.id === "math141")!.status).toBe("missing");
    expect(cs!.requirements.find((r) => r.id === "math141")!.status).toBe("missing");
  });
});
