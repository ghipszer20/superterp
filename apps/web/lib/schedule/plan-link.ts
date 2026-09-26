// Links the schedule builder's term (a Testudo id, e.g. "202701") to the student's 4-year plan
// (a term name, e.g. "Spring 2027"). Owner ruling: "There is one plan model. The builder for a
// term is a view of that term in the 4-year plan, plus the chosen sections." So once a plan
// exists, the plan's course list for the matching term IS the builder's course list — derived,
// never copied — and sections stay builder-only (saved.ts).

import { termCourseIds, type AdvisorPlan } from "../advisor/plan-state";
import { sortTerms, termFromMatriculationId } from "../advisor/terms";

/** The plan's term name for the builder's schedule term, or null if it can't be parsed. */
export const planTermName = (scheduleTerm: string): string | null => termFromMatriculationId(scheduleTerm);

/** The plan's course ids for `termName`, or [] when the plan has no such term (yet). */
export const planCourseIds = (plan: AdvisorPlan, termName: string): string[] => termCourseIds(plan, termName);

/**
 * Other plan terms (sorted) that also have `courseId`, excluding `termName`. Owner ruling:
 * "the same course in another plan term: ask nothing; show a small note in the builder."
 */
export function otherPlannedTerms(plan: AdvisorPlan, termName: string, courseId: string): string[] {
  const names = plan.terms.filter((t) => t.name !== termName && t.courses.some((c) => c.id === courseId)).map((t) => t.name);
  return sortTerms(names);
}

/**
 * A `?c=` link's courses, applied safely: replaces the list for a standalone builder (today's
 * behavior), but only adds to a plan-linked term — a stale or shared link must never delete a
 * course the plan already has for that term.
 */
export function applyQueryCourses(current: string[], query: string[], linked: boolean): string[] {
  return linked ? [...new Set([...current, ...query])] : [...query];
}
