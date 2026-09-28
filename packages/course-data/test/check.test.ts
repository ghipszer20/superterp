// Checking a parsed prerequisite against a student's course history.
// Expected answers are worked out by hand.

import { describe, expect, it } from "vitest";
import { checkRequirement } from "../src/prereqs.ts";

describe("checkRequirement", () => {
  it("is met when the course was completed", () => {
    expect(checkRequirement({ kind: "course", course: "MATH141" }, { MATH141: { grade: "B" } })).toBe("met");
  });

  it("is unmet when the grade is below the minimum, and met at or above it", () => {
    const req = { kind: "course", course: "CMSC216", minGrade: "C-" } as const;
    expect(checkRequirement(req, { CMSC216: { grade: "D+" } })).toBe("unmet");
    expect(checkRequirement(req, { CMSC216: { grade: "C-" } })).toBe("met");
    expect(checkRequirement(req, { CMSC216: { grade: "A+" } })).toBe("met");
  });

  it("counts a course in progress only when the prerequisite allows concurrent enrollment", () => {
    const history = { CHEM481: { concurrent: true } };
    expect(checkRequirement({ kind: "course", course: "CHEM481", concurrentOk: true }, history)).toBe("met");
    expect(checkRequirement({ kind: "course", course: "CHEM481" }, history)).toBe("unmet");
  });

  it("combines and/or with manual items: unmet beats confirm in 'all', met beats confirm in 'any'", () => {
    const took = { CMSC330: { grade: "B" } };
    const course330 = { kind: "course", course: "CMSC330" } as const;
    const course351 = { kind: "course", course: "CMSC351" } as const;
    const permission = { kind: "manual", text: "permission of instructor" } as const;

    expect(checkRequirement(permission, took)).toBe("confirm");
    expect(checkRequirement({ kind: "all", of: [course330, permission] }, took)).toBe("confirm");
    expect(checkRequirement({ kind: "all", of: [course330, course351, permission] }, took)).toBe("unmet");
    expect(checkRequirement({ kind: "any", of: [course351, permission] }, took)).toBe("confirm");
    expect(checkRequirement({ kind: "any", of: [course330, permission] }, took)).toBe("met");
    expect(checkRequirement({ kind: "any", of: [course351] }, took)).toBe("unmet");
  });
});
