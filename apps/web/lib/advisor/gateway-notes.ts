// A note for the CS gateway's course rows when a "below-minimum" result is actually credit with
// no letter grade (AP, IB or dual enrollment): the package correctly can't call that "met" against
// a letter-grade minimum, but showing it as an ordinary failing grade would mislead the student.
// This never changes the gateway's own status; it only explains a "below-minimum" result in words.

import type { GatewayCourseResult } from "@superterp/audit";

/**
 * `priorCourseIds` are course ids the student's AP/IB/dual-enrollment credit put on the record
 * (always completed, never with a grade). Returns null unless this course's "below-minimum"
 * comes from one of those.
 */
export function gatewayCourseNote(course: GatewayCourseResult, minGrade: string, priorCourseIds: ReadonlySet<string>): string | null {
  if (course.status !== "below-minimum") return null;
  if (!course.options.some((id) => priorCourseIds.has(id))) return null;
  return `${course.id} came from prior credit with no letter grade, so SuperTerp can't check it against the ${minGrade} gateway minimum. Confirm your CS gateway eligibility with CS advising.`;
}
