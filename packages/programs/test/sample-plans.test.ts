// Requirements pipeline steps 4-5 for every registered program with a sample plan
// (sample-plans/<program-id>.json): the plan passes, and every drop/replace mutant fails on the
// requirement it targeted. A program that legitimately fails goes in docs/project/owner-review.md
// and in KNOWN_FAILURES below -- never an encoding bent to match (the department page wins).

import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { validateSamplePlan, type SamplePlan } from "../src/harness.ts";
import { PROGRAMS } from "../src/registry.ts";

const file = (id: string) => new URL(`../sample-plans/${id}.json`, import.meta.url);

/** Program id -> requirement ids its sample plan is known to leave unsatisfied (flagged). */
const KNOWN_FAILURES: Record<string, string[]> = {
  "artt-major-studio": ["support-arth-diversity-2"],
  "artt-major-advanced-specialization": ["support-arth-diversity-2"],
  "artt-major-graphic-design": ["support-arth-diversity-2"],
};

describe("sample plans", () => {
  it("every major, minor and certificate has one (official, or built from an official page)", () => {
    const missing = PROGRAMS.filter((p) => p.kind !== "special" && !existsSync(file(p.id))).map((p) => p.id);
    expect(missing).toEqual([]);
  });

  const withPlans = PROGRAMS.filter((p) => existsSync(file(p.id)));
  describe.each(withPlans.map((p) => [p.id, p] as const))("%s", (id, entry) => {
    const plan = JSON.parse(readFileSync(file(id), "utf8")) as SamplePlan;

    it("fixture names its program and source", () => {
      expect(plan.programId).toBe(id);
      expect(plan.source).toMatch(/^https:\/\//);
    });

    it("sample plan satisfies every requirement; each broken plan fails on its requirement", async () => {
      const v = await validateSamplePlan(await entry.load(), plan);
      expect(v.unsatisfied).toEqual(KNOWN_FAILURES[id] ?? []);
      expect(v.mutants.filter((m) => !m.broke || m.fillerCounted)).toEqual([]);
      expect(v.mutants.length).toBeGreaterThan(0);
    });
  });
});
