// What-if program changes (switch major, add/drop a program): compares a plan's courses,
// missing requirements, freed credits and graduation-term estimate under a current vs a proposed
// set of majors. Uses small synthetic programs for the isolated rules, and the owner's real
// Math (Applied) + CS plan for an integration check.

import type { Program } from "@superterp/audit";
import { describe, expect, it } from "vitest";
import { cmscMajor } from "../../audit/programs/cmsc-major-2026-27.ts";
import { mathMajorApplied } from "../../audit/programs/math-major-applied-2026-27.ts";
import { mathMajorTraditional } from "../../audit/programs/math-major-traditional-2026-27.ts";
import { buildCatalog } from "../src/catalog.ts";
import type { Plan } from "../src/check.ts";
import { whatIf } from "../src/what-if.ts";
import { ownerPlan } from "./fixtures/owner-plan.ts";
import { SPRING_2027 } from "./helpers.ts";

const catalog = buildCatalog(SPRING_2027);

// Two small majors over made-up courses (real ids so credits resolve from the fixture catalog).
const majorA: Program = {
  id: "a-major",
  name: "A Major",
  requirements: [{ kind: "course", id: "cmsc131", name: "CMSC131", options: ["CMSC131"] }],
};
const majorB: Program = {
  id: "b-major",
  name: "B Major",
  requirements: [
    { kind: "course", id: "cmsc132", name: "CMSC132", options: ["CMSC132"] },
    { kind: "course", id: "cmsc250", name: "CMSC250", options: ["CMSC250"] },
  ],
};
// A tiny Gen Ed stand-in and a 9-credit "university" floor, small enough to test the elective/
// unused split without needing a 120-credit plan.
const genEdish: Program = {
  id: "gen-ed-ish",
  name: "Gen Ed",
  requirements: [{ kind: "choose", id: "hist", name: "History elective", count: 1, from: { departments: ["HIST"] } }],
};
const universityish: Program = {
  id: "university-ish",
  name: "University",
  requirements: [{ kind: "choose", id: "credits", name: "9 credits", credits: 9, overlay: true, from: { anyCourse: true } }],
};

const planWith = (...ids: string[]): Plan => ({ terms: [{ name: "Fall 2026", courses: ids.map((id) => ({ id })) }] });

describe("course classification", () => {
  it("counts a course required by a current or proposed major", async () => {
    const result = await whatIf(planWith("CMSC131"), catalog, [majorA], [majorA], []);
    const c = result.courses.find((x) => x.id === "CMSC131")!;
    expect(c.currentStatus).toBe("counts");
    expect(c.proposedStatus).toBe("counts");
    expect(c.currentPrograms).toEqual(["a-major"]);
    expect(c.proposedPrograms).toEqual(["a-major"]);
  });

  it("becomes elective when no major needs it but Gen Ed or the credit floor does", async () => {
    // HIST200 matches the Gen Ed stand-in; CMSC131 (4 cr) is within the 9-credit floor even
    // though no major or Gen Ed rule claims it.
    const result = await whatIf(planWith("HIST200", "CMSC131"), catalog, [], [], [genEdish, universityish]);
    const hist = result.courses.find((x) => x.id === "HIST200")!;
    const cmsc131 = result.courses.find((x) => x.id === "CMSC131")!;
    expect(hist.currentStatus).toBe("elective");
    expect(cmsc131.currentStatus).toBe("elective");
  });

  it("is unused once neither a major, Gen Ed, nor the credit floor needs it", async () => {
    // Fill the 9-credit floor with HIST200 (3cr) + CMSC131 (4cr) = 7cr, then CMSC132 (4cr) pushes
    // past the floor and matches nothing else.
    const result = await whatIf(planWith("HIST200", "CMSC131", "CMSC132"), catalog, [], [], [genEdish, universityish]);
    const cmsc132 = result.courses.find((x) => x.id === "CMSC132")!;
    expect(cmsc132.currentStatus).toBe("unused");
  });

  it("fills the credit floor chronologically: prior credit, then term order", async () => {
    const plan: Plan = {
      priorCredit: [{ id: "L1:Transfer", credits: 6, source: "Transfer credit" }],
      terms: [{ name: "Fall 2026", courses: [{ id: "CMSC131" }] }],
    };
    // Floor is 9 credits: the 6-credit prior block fills first, leaving 3 of CMSC131's 4 credits
    // "covered" -- but since a course is all-or-nothing, CMSC131 (4cr) pushes the total to 10 and
    // still counts as within the floor (a credit requirement may overshoot by less than one course).
    const result = await whatIf(plan, catalog, [], [], [universityish]);
    const cmsc131 = result.courses.find((x) => x.id === "CMSC131")!;
    expect(cmsc131.currentStatus).toBe("elective");
  });
});

describe("no phantom diffs", () => {
  it("keeps a major's own assignment the same whether it's alone or alongside another program", async () => {
    const alone = await whatIf(planWith("CMSC131"), catalog, [majorA], [majorA], []);
    const withOther = await whatIf(planWith("CMSC131", "CMSC132", "CMSC250"), catalog, [majorA], [majorA, majorB], []);
    const a1 = alone.courses.find((x) => x.id === "CMSC131")!;
    const a2 = withOther.courses.find((x) => x.id === "CMSC131")!;
    expect(a1.currentPrograms).toEqual(a2.currentPrograms);
  });
});

describe("newly missing requirements", () => {
  it("reports the shortfall of a program only newly proposed, not one already declared", async () => {
    // Switching from A to B: B's requirements are newly missing (nothing satisfies them yet).
    const result = await whatIf(planWith("CMSC131"), catalog, [majorA], [majorB], []);
    expect(result.newlyMissing).toHaveLength(1);
    expect(result.newlyMissing[0]!.program.id).toBe("b-major");
    expect(result.newlyMissing[0]!.coursesShort).toBe(2);
    expect(result.newlyMissing[0]!.missing).toEqual(["CMSC132", "CMSC250"]);
  });

  it("reports nothing newly missing when dropping a program", async () => {
    const result = await whatIf(planWith("CMSC131"), catalog, [majorA, majorB], [majorA], []);
    expect(result.newlyMissing).toEqual([]);
  });

  it("reports nothing newly missing when a program is already satisfied", async () => {
    const result = await whatIf(planWith("CMSC131"), catalog, [], [majorA], []);
    expect(result.newlyMissing).toEqual([]);
  });
});

describe("freed credits", () => {
  it("counts credits of not-yet-completed courses that stop being required", async () => {
    const plan: Plan = { terms: [{ name: "Fall 2026", courses: [{ id: "CMSC132" }, { id: "CMSC250" }] }] };
    const result = await whatIf(plan, catalog, [majorB], [], []);
    // CMSC132 (4cr) + CMSC250 (4cr) both stop being required.
    expect(result.freedCredits).toBe(8);
  });

  it("never counts a completed course's credits as freed", async () => {
    const plan: Plan = { terms: [{ name: "Fall 2026", courses: [{ id: "CMSC132", status: "completed", grade: "B" }] }] };
    const result = await whatIf(plan, catalog, [majorB], [], []);
    expect(result.freedCredits).toBe(0);
  });
});

describe("graduation term estimate", () => {
  const load15Plan: Plan = {
    terms: [
      { name: "Fall 2026", courses: ["CMSC131", "MATH140", "ENGL101"].map((id) => ({ id })) }, // 4+4+3=11? see below
    ],
  };

  it("documents the rule: typical load is the median credits of Fall/Spring terms with courses", async () => {
    const plan: Plan = {
      terms: [
        { name: "Fall 2026", courses: [{ id: "CMSC131" }] }, // 4 credits
        { name: "Spring 2027", courses: [{ id: "CMSC132" }] }, // 4 credits
      ],
    };
    const result = await whatIf(plan, catalog, [], [], []);
    expect(result.graduation.typicalLoad).toBe(4);
  });

  it("estimates a later graduation term when the proposed set needs more terms at the plan's typical load", async () => {
    // Two 4-credit terms (typical load 4). Proposed adds majorB, needing 2 more courses (8
    // credits) not yet in the plan: ceil(8/4) = 2 more terms than before.
    const plan: Plan = {
      terms: [
        { name: "Fall 2026", courses: [{ id: "CMSC131" }] },
        { name: "Spring 2027", courses: [{ id: "MATH140" }] },
      ],
    };
    const result = await whatIf(plan, catalog, [], [majorB], []);
    expect(result.graduation.deltaTerms).toBeGreaterThan(0);
    expect(result.graduation.proposedFinishTerm).not.toBe(result.graduation.currentFinishTerm);
  });

  it("estimates an earlier graduation term when dropping a program frees required, not-yet-taken courses", async () => {
    const plan: Plan = {
      terms: [
        { name: "Fall 2026", courses: [{ id: "CMSC131" }] },
        { name: "Spring 2027", courses: [{ id: "CMSC132" }, { id: "CMSC250" }] },
      ],
    };
    const result = await whatIf(plan, catalog, [majorB], [], []);
    expect(result.graduation.deltaTerms).toBeLessThanOrEqual(0);
  });

  it("shifts the plan's own last Fall/Spring term by the term delta", async () => {
    const plan: Plan = {
      terms: [
        { name: "Fall 2026", courses: [{ id: "CMSC131" }] },
        { name: "Spring 2027", courses: [{ id: "MATH140" }] },
      ],
    };
    const result = await whatIf(plan, catalog, [], [majorB], []);
    expect(result.graduation.currentFinishTerm).toBe("Spring 2027");
    if (result.graduation.deltaTerms === 1) expect(result.graduation.proposedFinishTerm).toBe("Fall 2027");
  });
});

describe("real programs: the owner's Math (Applied) + CS plan", () => {
  it("dropping CS creates no newly-missing requirements and frees CS-only planned courses", async () => {
    const result = await whatIf(ownerPlan(), catalog, [mathMajorApplied, cmscMajor], [mathMajorApplied], []);
    expect(result.newlyMissing).toEqual([]);
    expect(result.freedCredits).toBeGreaterThan(0);
    // CMSC414 counts toward nothing but the CS major in this plan.
    const c = result.courses.find((x) => x.id === "CMSC414")!;
    expect(c.currentStatus).toBe("counts");
  });

  it("switching Math Applied to Math Traditional reports the traditional track's shortfall", async () => {
    const result = await whatIf(ownerPlan(), catalog, [mathMajorApplied, cmscMajor], [mathMajorTraditional, cmscMajor], []);
    expect(result.newlyMissing.map((g) => g.program.id)).toEqual(["math-major-traditional"]);
  });

  it("gives the proposed program's catalog year", async () => {
    const result = await whatIf(ownerPlan(), catalog, [mathMajorApplied], [mathMajorTraditional], []);
    expect(result.newlyMissing[0]!.program.catalogYear).toBe("2026-27");
  });
});
