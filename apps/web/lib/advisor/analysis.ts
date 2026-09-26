// The slower half of the Advisor: the degree audit (HiGHS), double-major / dual-degree notices
// and the CS gateway. Loaded with import() and run after edits settle, never on every keystroke.

import { auditPrograms, checkCsGateway, type GatewayResult, type Program, type Requirement, type RequirementResult } from "@superterp/audit";
import type { CreditCourse } from "@superterp/credit";
import type { PlanCatalog } from "@superterp/plan/catalog";
import { planCourses, programNotices, type ProgramNotice } from "@superterp/plan/notices";
import { checkerPlan } from "./checker";
import type { AdvisorPlan } from "./plan-state";
import { auditedPrograms, noticeCandidates } from "./programs";
import { describeGap, type Gap } from "./requirements";
import { matriculationTermId } from "./terms";

export type ProgramAudit = {
  program: Program;
  requirements: { requirement: Requirement; result: RequirementResult; gap: Gap | null }[];
  satisfied: number;
};

export type Analysis = {
  notices: ProgramNotice[];
  audits: ProgramAudit[];
  /** Only when the Computer Science major is chosen. */
  gateway: GatewayResult | null;
  /** Milliseconds the audit and notices took. */
  ms: number;
};

export async function runAnalysis(input: { plan: AdvisorPlan; catalog: PlanCatalog; priorCourses: CreditCourse[] }): Promise<Analysis> {
  const t = performance.now();
  const plan = checkerPlan(input.plan, input.priorCourses);
  const courses = planCourses(plan, input.catalog);
  const programs = auditedPrograms(input.plan.programs);
  const [results, notices] = await Promise.all([
    auditPrograms(programs, courses),
    programNotices(plan, input.catalog, noticeCandidates(input.plan.programs)),
  ]);
  const catalogList = [...input.catalog.values()].map((c) => ({ id: c.id, genEd: c.genEd }));
  const audits = programs.map((program, p): ProgramAudit => {
    const requirements = program.requirements.map((requirement, r) => {
      const result = results[p]!.requirements[r]!;
      return { requirement, result, gap: describeGap(requirement, result, { courses, catalog: catalogList }) };
    });
    return { program, requirements, satisfied: requirements.filter((x) => x.result.status === "satisfied").length };
  });

  const term = matriculationTermId(input.plan.startTerm);
  const gateway =
    input.plan.programs.includes("cmsc-major") && term
      ? checkCsGateway({ matriculationTerm: term, courses, ...(input.plan.gpa !== undefined ? { cumulativeGpa: input.plan.gpa } : {}) })
      : null;
  return { notices, audits, gateway, ms: performance.now() - t };
}
