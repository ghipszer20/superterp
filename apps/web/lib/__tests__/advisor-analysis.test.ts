import { readFileSync } from "node:fs";
import type { Course } from "@superterp/course-data";
import { buildCatalog } from "@superterp/plan/catalog";
import { checkPlan } from "@superterp/plan/check";
import { describe, expect, it } from "vitest";
import { runAnalysis } from "../advisor/analysis";
import { checkerPlan } from "../advisor/checker";
import { computePriorCredit } from "../advisor/prior-credit";
import { seedFromUrl } from "../advisor/seed";

const COURSES = (
  JSON.parse(readFileSync(new URL("../../../../packages/plan/test/fixtures/courses-202701.json", import.meta.url), "utf8")) as {
    courses: Course[];
  }
).courses;
const catalog = buildCatalog(COURSES);
const plan = seedFromUrl("?seed=owner", { NODE_ENV: "development" })!.plan!;
const prior = computePriorCredit(plan.prior, (id) => catalog.get(id)?.genEd ?? []);

describe("checkerPlan", () => {
  it("gives the plan checker the terms and the counted prior credit", () => {
    const p = checkerPlan(plan, prior.courses);
    expect(p.terms.map((t) => t.name)).toEqual(plan.terms.map((t) => t.name));
    expect(p.terms[0]!.courses[0]).toEqual({ id: "CMSC131" });
    expect(p.priorCredit!.map((c) => c.id)).toEqual(["MATH140", "MATH141"]);
  });

  it("makes the owner's plan check clean of errors", () => {
    const issues = checkPlan(checkerPlan(plan, prior.courses), catalog);
    expect(issues.filter((i) => i.severity === "error")).toEqual([]);
  });
});

describe("runAnalysis", () => {
  it("finds the double major, audits every layer and checks the CS gateway", async () => {
    const a = await runAnalysis({ plan, catalog, priorCourses: prior.courses });
    expect(a.notices.map((n) => n.message)).toContain(
      "Your plan completes both the Mathematics Major (Applied Mathematics Track) and the Computer Science Major: a double major.",
    );
    expect(a.audits.map((x) => x.program.id)).toEqual(["math-major-applied", "cmsc-major", "gen-ed", "university"]);
    const cs = a.audits.find((x) => x.program.id === "cmsc-major")!;
    expect(cs.requirements.every((r) => r.result.status === "satisfied")).toBe(true);
    expect(a.gateway?.rule.name).toBe("fall-2024-or-later");
    expect(a.gateway?.courses.map((c) => c.id)).toEqual(["MATH140", "CMSC131", "CMSC132"]);
  });

  it("describes what's missing when a course leaves the plan", async () => {
    const without = { ...plan, terms: plan.terms.map((t) => ({ ...t, courses: t.courses.filter((c) => c.id !== "CMSC351") })) };
    const a = await runAnalysis({ plan: without, catalog, priorCourses: prior.courses });
    const req = a.audits.find((x) => x.program.id === "cmsc-major")!.requirements.find((r) => r.requirement.id === "cmsc351")!;
    expect(req.result.status).toBe("missing");
    expect(req.gap).toEqual({ need: "Take CMSC351.", suggestions: ["CMSC351"] });
  });

  it("skips the gateway when CS isn't chosen", async () => {
    const a = await runAnalysis({ plan: { ...plan, programs: ["math-major-applied"] }, catalog, priorCourses: prior.courses });
    expect(a.gateway).toBeNull();
  });
});
