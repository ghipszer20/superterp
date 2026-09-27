// The owner's first verification target: Math (Applied Mathematics Track) + CS
// double major (the owner's real combination), audited together. The plan is hand-built; the owner verifies it.

import { describe, expect, it } from "vitest";
import { auditPrograms, type StudentCourse } from "../src/audit.ts";
import { cmscMajor } from "../programs/cmsc-major-2026-27.ts";
import { mathMajorApplied } from "../programs/math-major-applied-2026-27.ts";

const c = (id: string, credits = 3): StudentCourse => ({ id, credits, status: "completed", grade: "B" });

// Shared foundation courses count toward both majors (UMD double majors allow this by default).
const plan: StudentCourse[] = [
  c("MATH140", 4), c("MATH141", 4), c("MATH240", 4), c("MATH241", 4), c("MATH310"), c("MATH246"),
  c("CMSC131", 4), c("CMSC132", 4), c("CMSC216", 4), c("CMSC250", 4), c("CMSC330"), c("CMSC351"),
  // Math 400-level: MATH410, STAT410, a STAT4xx (STAT420; STAT400 no longer counts -- department
  // page: "STAT4xx other than STAT400, STAT410, STAT464"), MATH401, AMSC460, applied list (MATH452),
  // depth MATH410–MATH411. The MATH ones are also the CS concentration (12+ credits of MATH at 300–400 level).
  c("MATH410"), c("MATH411"), c("MATH401"), c("AMSC460"), c("STAT420"), c("STAT410"), c("MATH452"), c("MATH463"),
  // CS upper level: five across three areas + two electives
  c("CMSC412"), c("CMSC414"), c("CMSC421"), c("CMSC422"), c("CMSC451"), c("CMSC320"), c("CMSC433"),
];

describe("Math + CS double major", () => {
  it("satisfies both majors with shared foundation courses", async () => {
    const [math, cs] = await auditPrograms([mathMajorApplied, cmscMajor], plan);
    for (const r of [...math!.requirements, ...cs!.requirements]) expect(`${r.id}: ${r.status}`).toBe(`${r.id}: satisfied`);
  });

  it("counts one STAT course toward CS's STAT requirement and Math's STAT requirements at the same time", async () => {
    const [math, cs] = await auditPrograms([mathMajorApplied, cmscMajor], plan);
    const mathAssigned = (id: string) => math!.requirements.find((r) => r.id === id)!.assigned;
    expect(mathAssigned("stat410")).toEqual(["STAT410"]);
    expect(mathAssigned("stat4xx")).toEqual(["STAT420"]);
    // CS may take either STAT course (a tie); whichever it takes also counts for Math.
    const csStat = cs!.requirements.find((r) => r.id === "stat4xx")!.assigned;
    expect(csStat).toHaveLength(1);
    expect([...mathAssigned("stat410"), ...mathAssigned("stat4xx")]).toContain(csStat[0]);
  });

  it("shows exactly which requirement breaks when a shared course is missing", async () => {
    const [math, cs] = await auditPrograms(
      [mathMajorApplied, cmscMajor],
      plan.filter((x) => x.id !== "MATH141"),
    );
    expect(math!.requirements.find((r) => r.id === "math141")!.status).toBe("missing");
    expect(cs!.requirements.find((r) => r.id === "math141")!.status).toBe("missing");
  });
});
