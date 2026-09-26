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

describe("runAnalysis: tracks", () => {
  it("audits a chosen track's requirements, like a program, without touching majors, notices or the gateway", async () => {
    const withTracks = { ...plan, tracks: ["pre-med"] };
    const [a, b] = await Promise.all([
      runAnalysis({ plan: withTracks, catalog, priorCourses: prior.courses }),
      runAnalysis({ plan, catalog, priorCourses: prior.courses }),
    ]);
    expect(a.audits).toEqual(b.audits);
    expect(a.notices).toEqual(b.notices);
    expect(a.gateway).toEqual(b.gateway);

    const preMed = a.tracks.find((t) => t.track.id === "pre-med")!;
    expect(preMed.requirements.length).toBeGreaterThan(0);
    expect(preMed.requirements.some((r) => r.result.status === "missing")).toBe(true);
    expect(preMed.milestones.length).toBeGreaterThan(0);
    expect(preMed.milestones.some((m) => m.milestone.id === "mcat")).toBe(true);
  });

  it("audits nothing extra when no track is chosen", async () => {
    const a = await runAnalysis({ plan, catalog, priorCourses: prior.courses });
    expect(a.tracks).toEqual([]);
  });

  it("resolves each course's credits from the catalog, so GPA protection (pre-law) actually fires", async () => {
    const withGpaProtection = {
      ...plan,
      programs: [],
      tracks: ["pre-law"],
      terms: [
        { name: "Fall 2026", courses: [{ id: "HIST200", status: "completed" as const, grade: "A" }] },
        { name: "Spring 2027", courses: [{ id: "CHEM131", status: "planned" as const }] },
      ],
      expectedGrades: { "Spring 2027": { CHEM131: "C-" } },
    };
    const a = await runAnalysis({ plan: withGpaProtection, catalog, priorCourses: [] });
    const preLaw = a.tracks.find((t) => t.track.id === "pre-law")!;
    const issue = preLaw.result.issues.find((i) => i.kind === "gpa-protection");
    expect(issue?.message).toContain("Spring 2027");
  });

  it("reports the science (BCPM) GPA when a graded science course exists", async () => {
    const withGrades = {
      ...plan,
      tracks: ["pre-med"],
      terms: [{ name: "Fall 2026", courses: [{ id: "CHEM131", status: "completed" as const, grade: "A" }] }],
    };
    const a = await runAnalysis({ plan: withGrades, catalog, priorCourses: [] });
    expect(a.scienceGpa.gpa).not.toBeNull();
    expect(a.scienceGpa.byCategory.chemistry.gpa).toBe(4.0);
  });
});
