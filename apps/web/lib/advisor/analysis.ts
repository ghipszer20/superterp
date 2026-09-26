// The slower half of the Advisor: the degree audit (HiGHS), double-major / dual-degree notices
// and the CS gateway. Loaded with import() and run after edits settle, never on every keystroke.

import { auditPrograms, checkCsGateway, type GatewayResult, type Program, type Requirement, type RequirementResult } from "@superterp/audit";
import type { CreditCourse } from "@superterp/credit";
import type { PlanCatalog } from "@superterp/plan/catalog";
import type { Plan } from "@superterp/plan/check";
import { planCourses, programNotices, type ProgramNotice } from "@superterp/plan/notices";
// The heavy, solver-backed half of @superterp/tracks (checkTrack calls auditProgram); this file is
// already loaded with import() (see AdvisorApp.tsx), so it's fine for it to pull in HiGHS, the way
// it already pulls in @superterp/audit's auditPrograms/checkCsGateway above. Never import this
// module, or "@superterp/tracks" itself, from a file in the main bundle -- use
// "@superterp/tracks/list" (lib/advisor/tracks.ts) there instead.
import {
  checkTrack,
  scienceGpa,
  TRACKS,
  trackMilestoneTimings,
  trackProgram,
  type GradedCourse,
  type MilestoneTiming,
  type ScienceGpa,
  type Track,
  type TrackCheckResult,
} from "@superterp/tracks";
import { checkerPlan } from "./checker";
import type { AdvisorPlan } from "./plan-state";
import { auditedPrograms, noticeCandidates } from "./programs";
import { describeGap, type Gap } from "./requirements";
import { matriculationTermId } from "./terms";
import { resolvedPlan } from "./track-plan";

export type ProgramAudit = {
  program: Program;
  requirements: { requirement: Requirement; result: RequirementResult; gap: Gap | null }[];
  satisfied: number;
};

/** A chosen Track's audit, plain-language issues and requirement status -- never a degree
 * requirement (owner ruling): built alongside the major audits above, but from its own
 * trackProgram, and never fed into auditedPrograms or noticeCandidates. */
export type TrackAudit = {
  track: Track;
  result: TrackCheckResult;
  requirements: { requirement: Requirement; result: RequirementResult; gap: Gap | null }[];
  satisfied: number;
  /** Each milestone's timing on the plan's own timeline (see trackMilestoneTimings). */
  milestones: MilestoneTiming[];
};

export type Analysis = {
  notices: ProgramNotice[];
  audits: ProgramAudit[];
  /** Only when the Computer Science major is chosen. */
  gateway: GatewayResult | null;
  /** Every chosen pre-professional track (plan.tracks), in the order TRACKS lists them. */
  tracks: TrackAudit[];
  /** BCPM science GPA over every graded course (every attempt counts, unlike the audit's courses,
   * which count a repeated course once): meaningful for the health tracks, meaningless for pre-law. */
  scienceGpa: ScienceGpa;
  /** Milliseconds the audit and notices took. */
  ms: number;
};

/** Every graded course, prior credit and term courses, keeping every attempt of a repeat (AMCAS
 * and LSAC count each one; @superterp/plan/notices' planCourses counts a course once, so it can't
 * be reused here). */
function gradedCourses(plan: Plan): GradedCourse[] {
  const prior = (plan.priorCredit ?? []).filter((c) => c.grade).map((c) => ({ id: c.id, credits: c.credits, grade: c.grade }));
  const term = plan.terms.flatMap((t) => t.courses.filter((c) => c.grade).map((c) => ({ id: c.id, credits: c.credits ?? 0, grade: c.grade })));
  return [...prior, ...term];
}

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

  const chosenTrackIds = new Set(input.plan.tracks ?? []);
  const chosenTracks = TRACKS.filter((track) => chosenTrackIds.has(track.id));
  const trackPlan = resolvedPlan(plan, input.catalog);
  const tracks = await Promise.all(
    chosenTracks.map(async (track): Promise<TrackAudit> => {
      const result = await checkTrack(trackPlan, track, {
        ...(input.plan.examTerms ? { examTerms: input.plan.examTerms } : {}),
        ...(track.gpaProtection && input.plan.expectedGrades ? { expectedGrades: input.plan.expectedGrades } : {}),
      });
      const program = trackProgram(track);
      const requirements = program.requirements.map((requirement, r) => {
        const reqResult = result.audit.requirements[r]!;
        return { requirement, result: reqResult, gap: describeGap(requirement, reqResult, { courses, catalog: catalogList }) };
      });
      return {
        track,
        result,
        requirements,
        satisfied: requirements.filter((x) => x.result.status === "satisfied").length,
        milestones: trackMilestoneTimings(trackPlan, track),
      };
    }),
  );

  return { notices, audits, gateway, tracks, scienceGpa: scienceGpa(gradedCourses(trackPlan)), ms: performance.now() - t };
}
