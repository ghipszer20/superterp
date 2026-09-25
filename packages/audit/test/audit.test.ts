// Audit behavior on small, hand-built programs. Expected results are worked
// out by hand.

import { describe, expect, it } from "vitest";
import { auditProgram, type Program, type StudentCourse } from "../src/audit.ts";

const took = (...ids: string[]): StudentCourse[] => ids.map((id) => ({ id, credits: 3, status: "completed" }));

describe("auditProgram", () => {
  it("satisfies a required course the student completed", async () => {
    const program: Program = {
      id: "p",
      name: "Test",
      requirements: [{ kind: "course", id: "calc2", name: "Calculus II", options: ["MATH141"] }],
    };
    const result = await auditProgram(program, took("MATH141"));
    expect(result.requirements).toEqual([
      { id: "calc2", name: "Calculus II", status: "satisfied", assigned: ["MATH141"] },
    ]);
  });

  it("assigns each course once, choosing the assignment that satisfies the most requirements", async () => {
    const program: Program = {
      id: "p",
      name: "Test",
      requirements: [
        { kind: "course", id: "linalg", name: "Linear algebra", options: ["MATH461", "MATH240"] },
        { kind: "course", id: "adv", name: "Advanced linear algebra", options: ["MATH461"] },
      ],
    };
    const result = await auditProgram(program, took("MATH240", "MATH461"));
    expect(result.requirements).toEqual([
      { id: "linalg", name: "Linear algebra", status: "satisfied", assigned: ["MATH240"] },
      { id: "adv", name: "Advanced linear algebra", status: "satisfied", assigned: ["MATH461"] },
    ]);
  });

  it("fills 'choose N courses' from a department and level range, and reports leftovers as overshoot", async () => {
    const program: Program = {
      id: "p",
      name: "Test",
      requirements: [
        {
          kind: "choose",
          id: "upper",
          name: "Three 400-level MATH courses",
          count: 3,
          from: { departments: ["MATH"], minNumber: 400, maxNumber: 499 },
        },
      ],
    };
    const result = await auditProgram(program, took("MATH401", "MATH310", "MATH410", "MATH411", "MATH452", "HIST200"));
    expect(result.requirements[0]).toMatchObject({ status: "satisfied" });
    expect(result.requirements[0]!.assigned).toHaveLength(3);
    for (const c of result.requirements[0]!.assigned) expect(["MATH401", "MATH410", "MATH411", "MATH452"]).toContain(c);
    // MATH310 (300-level) and HIST200 don't qualify; one 400-level course is extra.
    expect(result.unused).toHaveLength(3);
    expect(result.unused).toEqual(expect.arrayContaining(["MATH310", "HIST200"]));
  });

  it("reports partial progress on a choose requirement", async () => {
    const program: Program = {
      id: "p",
      name: "Test",
      requirements: [
        { kind: "choose", id: "upper", name: "Three 400-level MATH", count: 3, from: { departments: ["MATH"], minNumber: 400, maxNumber: 499 } },
      ],
    };
    const result = await auditProgram(program, took("MATH410"));
    expect(result.requirements[0]).toMatchObject({ status: "partial", assigned: ["MATH410"] });
  });

  it("counts credits, not courses, for a credit requirement", async () => {
    const program: Program = {
      id: "p",
      name: "Test",
      requirements: [
        { kind: "choose", id: "cs400", name: "12 credits of 400-level CMSC", credits: 12, from: { departments: ["CMSC"], minNumber: 400, maxNumber: 499 } },
      ],
    };
    const fourCredit = (id: string): StudentCourse => ({ id, credits: 4, status: "completed" });
    const three = await auditProgram(program, [fourCredit("CMSC420"), fourCredit("CMSC421"), fourCredit("CMSC422")]);
    expect(three.requirements[0]).toMatchObject({ status: "satisfied" });
    expect(three.requirements[0]!.assigned).toHaveLength(3);

    const short = await auditProgram(program, took("CMSC420", "CMSC421", "CMSC422"));
    expect(short.requirements[0]).toMatchObject({ status: "partial" });
    expect(short.requirements[0]!.assigned).toHaveLength(3);
  });

  describe("area distribution (CS: five 400-level courses from at least three areas, at most three per area)", () => {
    const program: Program = {
      id: "cs",
      name: "CS",
      requirements: [
        {
          kind: "distribution",
          id: "areas",
          name: "Upper-level areas",
          count: 5,
          minAreas: 3,
          maxPerArea: 3,
          areas: [
            { name: "Systems", courses: ["CMSC411", "CMSC412", "CMSC414", "CMSC416", "CMSC417"] },
            { name: "Information Processing", courses: ["CMSC420", "CMSC421", "CMSC422", "CMSC471"] },
            { name: "Software Engineering", courses: ["CMSC430", "CMSC433", "CMSC435", "CMSC471"] },
            { name: "Theory", courses: ["CMSC451", "CMSC452", "CMSC456"] },
          ],
        },
      ],
    };

    it("is satisfied by five courses across three areas", async () => {
      const r = await auditProgram(program, took("CMSC411", "CMSC412", "CMSC414", "CMSC420", "CMSC451"));
      expect(r.requirements[0]).toMatchObject({ status: "satisfied" });
      expect(r.requirements[0]!.assigned).toHaveLength(5);
    });

    it("counts at most three courses from one area", async () => {
      const r = await auditProgram(program, took("CMSC411", "CMSC412", "CMSC414", "CMSC416", "CMSC420"));
      expect(r.requirements[0]).toMatchObject({ status: "partial" });
      expect(r.requirements[0]!.assigned).toHaveLength(4);
    });

    it("isn't satisfied with five courses from only two areas", async () => {
      const r = await auditProgram(program, took("CMSC411", "CMSC412", "CMSC414", "CMSC420", "CMSC421"));
      expect(r.requirements[0]).toMatchObject({ status: "partial" });
    });

    it("uses a course listed in two areas for whichever area completes the rule", async () => {
      // CMSC471 must count as Software Engineering to reach three areas.
      const r = await auditProgram(program, took("CMSC411", "CMSC412", "CMSC420", "CMSC421", "CMSC471"));
      expect(r.requirements[0]).toMatchObject({ status: "satisfied" });
    });
  });
});
