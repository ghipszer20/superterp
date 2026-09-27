import type { Program } from "@superterp/audit";
import { describe, expect, it } from "vitest";
import { planCourses, validateSamplePlan, type SamplePlan } from "../src/harness.ts";

const program: Program = {
  id: "toy",
  name: "Toy Major",
  requirements: [
    { kind: "course", id: "intro", name: "Intro", options: ["TOYS101"] },
    { kind: "choose", id: "upper", name: "Two 400-level TOYS", count: 2, from: { departments: ["TOYS"], minNumber: 400, maxNumber: 499 } },
  ],
};

const plan = (courses: string[]): SamplePlan => ({
  programId: "toy",
  source: "https://example.edu/toy-plan",
  fetched: "2026-09-27",
  official: true,
  credits: { TOYS101: 4 },
  terms: [{ term: "Fall 1", courses }],
});

describe("planCourses", () => {
  it("turns every term's courses into planned courses, 3 credits unless listed", () => {
    expect(planCourses(plan(["TOYS101", "TOYS401"]))).toEqual([
      { id: "TOYS101", credits: 4, status: "planned" },
      { id: "TOYS401", credits: 3, status: "planned" },
    ]);
  });
});

describe("validateSamplePlan", () => {
  it("passes a complete plan and breaks each requirement it can by dropping or replacing its courses", async () => {
    const v = await validateSamplePlan(program, plan(["TOYS101", "TOYS401", "TOYS402", "ENGL101"]));
    expect(v.unsatisfied).toEqual([]);
    expect(v.mutants.map((m) => `${m.kind} ${m.requirement} -${m.removed.join(",")} ${m.broke}`)).toEqual([
      "drop intro -TOYS101 true",
      "replace intro -TOYS101 true",
      "drop upper -TOYS401,TOYS402 true",
      "replace upper -TOYS401,TOYS402 true",
    ]);
    expect(v.mutants.every((m) => !m.fillerCounted)).toBe(true);
  });

  it("keeps removing courses while spares still satisfy the requirement", async () => {
    const v = await validateSamplePlan(program, plan(["TOYS101", "TOYS401", "TOYS402", "TOYS403", "TOYS404"]));
    const drop = v.mutants.find((m) => m.kind === "drop" && m.requirement === "upper")!;
    expect(drop.broke).toBe(true);
    expect(drop.removed).toHaveLength(4);
  });

  it("reports the requirements an incomplete sample plan leaves unsatisfied", async () => {
    const v = await validateSamplePlan(program, plan(["TOYS401", "TOYS402"]));
    expect(v.unsatisfied).toEqual(["intro"]);
  });

  it("flags a requirement that stays satisfied with its courses gone", async () => {
    const vacuous: Program = { ...program, requirements: [{ kind: "choose", id: "none", name: "Zero courses", count: 0, from: { departments: ["TOYS"] } }] };
    const v = await validateSamplePlan(vacuous, plan(["TOYS101"]));
    expect(v.mutants.every((m) => m.broke === false)).toBe(true);
  });
});
