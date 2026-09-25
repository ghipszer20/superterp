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
});
