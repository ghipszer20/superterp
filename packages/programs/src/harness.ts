// The requirements pipeline's validation steps (4 and 5): a program's official 4-year sample plan
// must satisfy every requirement, and plans broken on purpose must fail on the right one.
// Each program with a sample plan (sample-plans/<program-id>.json) gets both checks from
// test/sample-plans.test.ts; nothing else to write per program.

import { auditProgram, slotKey, type AuditOptions, type Program, type StudentCourse } from "@superterp/audit";

/** A program's sample plan, as published (placeholders like "Math 4**" filled in `notes`). */
export type SamplePlan = {
  programId: string;
  /** Where the plan was published (4yearplans.umd.edu or the page it links to). */
  source: string;
  /** When it was fetched, YYYY-MM-DD. */
  fetched: string;
  /** false when UMD publishes no sample plan and this one was built from an official page
   * (flagged in docs/project/owner-review.md). */
  official: boolean;
  /** How each placeholder slot was filled, and anything else that isn't verbatim. */
  notes?: string[];
  /** Credits per course; 3 when not listed. */
  credits?: Record<string, number>;
  terms: { term: string; courses: string[] }[];
};

export type Mutant = {
  /** drop: the requirement's courses are removed; replace: swapped for courses that count for nothing. */
  kind: "drop" | "replace";
  requirement: string;
  /** Every course taken out, in plan order (more than the first assignment when spares took over). */
  removed: string[];
  /** Whether the audit then reported this requirement unsatisfied. */
  broke: boolean;
  /** Whether a replacement course was counted toward the requirement (it never should be). */
  fillerCounted: boolean;
};

export type Validation = {
  /** Requirement ids the sample plan leaves unsatisfied (should be none). */
  unsatisfied: string[];
  mutants: Mutant[];
};

export function planCourses(plan: SamplePlan): StudentCourse[] {
  return plan.terms.flatMap((t) => t.courses.map((id): StudentCourse => ({ id, credits: plan.credits?.[id] ?? 3, status: "planned" })));
}

/** Course ids that are not course codes at all, so no requirement can count them: not a course list,
 * and not a department filter (a department-shaped id like XXXX100 matched pools such as "any
 * department except SPAN"). */
const filler = (i: number, credits: number): StudentCourse => ({ id: `FILLER-${i}`, credits, status: "planned" });
const isFiller = (id: string) => id.startsWith("FILLER-");

/** How many rounds of removal before a requirement counts as unbreakable. */
const MAX_ROUNDS = 12;

/** A sample plan can't show an Open Slot's courses, so validation takes every one as confirmed. */
const allSlotsConfirmed = (program: Program): AuditOptions => ({
  confirmed: program.requirements.filter((r) => r.kind === "openSlot").map((r) => slotKey(program.id, r.id)),
});

async function mutate(program: Program, base: StudentCourse[], requirement: string, kind: Mutant["kind"]): Promise<Mutant> {
  let courses = base;
  const removed: string[] = [];
  let fillers = 0;
  for (let round = 0; round < MAX_ROUNDS; round++) {
    const result = (await auditProgram(program, courses, allSlotsConfirmed(program))).requirements.find((r) => r.id === requirement)!;
    const fillerCounted = result.assigned.some(isFiller);
    if (result.status !== "satisfied" || fillerCounted) {
      return { kind, requirement, removed: base.map((c) => c.id).filter((id) => removed.includes(id)), broke: result.status !== "satisfied", fillerCounted };
    }
    const take = new Set(result.assigned.filter((id) => !isFiller(id)));
    if (take.size === 0) break;
    removed.push(...take);
    const out = courses.filter((c) => take.has(c.id));
    courses = courses.filter((c) => !take.has(c.id));
    if (kind === "replace") courses = [...courses, ...out.map((c) => filler(fillers++, c.credits))];
  }
  return { kind, requirement, removed: base.map((c) => c.id).filter((id) => removed.includes(id)), broke: false, fillerCounted: false };
}

export async function validateSamplePlan(program: Program, plan: SamplePlan): Promise<Validation> {
  const courses = planCourses(plan);
  const result = await auditProgram(program, courses, allSlotsConfirmed(program));
  const slots = new Set(program.requirements.filter((r) => r.kind === "openSlot").map((r) => r.id));
  const unsatisfied = result.requirements.filter((r) => r.status !== "satisfied").map((r) => r.id);
  const mutants: Mutant[] = [];
  for (const r of result.requirements) {
    // An Open Slot holds no courses, so there's nothing to drop or replace.
    if (r.status !== "satisfied" || slots.has(r.id)) continue;
    for (const kind of ["drop", "replace"] as const) mutants.push(await mutate(program, courses, r.id, kind));
  }
  return { unsatisfied, mutants };
}
