// CS Limited Enrollment Program (LEP) gateway check: can this student apply
// to the Computer Science major yet?
//
// Owner-confirmed rule (UMD CS tracking sheet, PROJECT_MEMORY.md):
// - Matriculated Fall 2024 (202408) or later: every gateway course B- or
//   better, cumulative UMD GPA 3.0 or higher.
// - Matriculated Summer 2024 (202405) or earlier: C- or better, GPA 2.7.
// Gateway courses: MATH140, CMSC131 (or CMSC141), CMSC132 (or CMSC142).
// The substitutes match cmsc-major-2026-27.ts.
//
// Kept separate from audit.ts. The major's program uses a single C- minimum,
// while the gateway minimum depends on when the student matriculated.

import type { StudentCourse } from "./audit.ts";

/** Which rule applies, based on the matriculation term. */
export type GatewayRule =
  | { name: "fall-2024-or-later"; minGrade: "B-"; minGpa: 3.0 }
  | { name: "spring-2024-or-earlier"; minGrade: "C-"; minGpa: 2.7 };

const NEW_RULE: GatewayRule = { name: "fall-2024-or-later", minGrade: "B-", minGpa: 3.0 };
const OLD_RULE: GatewayRule = { name: "spring-2024-or-earlier", minGrade: "C-", minGpa: 2.7 };
/** First term under the new rule (Fall 2024). Numeric order of term ids is chronological. */
const NEW_RULE_FROM_TERM = 202408;

const GATEWAY_COURSES = [
  { id: "MATH140", name: "Calculus I", options: ["MATH140"] },
  { id: "CMSC131", name: "Object-Oriented Programming I", options: ["CMSC131", "CMSC141"] },
  { id: "CMSC132", name: "Object-Oriented Programming II", options: ["CMSC132", "CMSC142"] },
];

// UMD letter grades, lowest to highest (same order as audit.ts, which doesn't export it).
const GRADE_ORDER = ["F", "D-", "D", "D+", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+"];
const gradeRank = (g: string) => GRADE_ORDER.indexOf(g.trim().toUpperCase());

/**
 * ASSUMPTION (PROJECT_MEMORY section 17, open question 1; owner to confirm): a gateway course
 * completed without a letter grade (AP/IB exam or transfer credit, which @superterp/credit
 * records with no grade) meets the gateway. Set this to false to make such credit not count.
 */
const NO_GRADE_CREDIT_MEETS_GATEWAY = true;

/**
 * ASSUMPTION (PROJECT_MEMORY section 17, open question 2; owner to confirm): a W is ignored,
 * as if the course was never taken. A W alone is "missing", not "below-minimum". Set this to false
 * here to count a W as a below-minimum attempt again.
 */
const W_MEANS_NOT_TAKEN = true;
const isWithdrawal = (c: StudentCourse) => c.grade?.trim().toUpperCase() === "W";

function meetsGatewayGrade(c: StudentCourse, minRank: number): boolean {
  if (c.status !== "completed") return false;
  if (c.grade === undefined) return NO_GRADE_CREDIT_MEETS_GATEWAY;
  return gradeRank(c.grade) >= 0 && gradeRank(c.grade) >= minRank;
}

/**
 * One gateway course, checked against the rule's minimum grade. Every attempt
 * of the course or its substitute counts. Checked in this order:
 * - "met": some completed attempt has a letter grade at or above the minimum.
 *   Uses the best attempt, so a passing retake counts whatever the list order
 *   (StudentCourse has no term). `satisfiedBy` names that course.
 * - "planned": not met, and an attempt is in the Plan. This covers a first
 *   attempt and a planned retake of a below-minimum grade.
 * - "below-minimum": only completed attempts, none meeting the minimum. Pass/fail
 *   and other non-letter grades never meet a letter minimum.
 * - "missing": neither completed nor planned.
 * Assumptions (see NO_GRADE_CREDIT_MEETS_GATEWAY and W_MEANS_NOT_TAKEN): a completed
 * course with no grade (AP/IB/transfer credit) is "met"; a W is ignored, so a W alone
 * is "missing".
 */
export type GatewayCourseStatus = "met" | "below-minimum" | "missing" | "planned";

export type GatewayCourseResult = {
  /** The gateway's primary course id, e.g. "CMSC131". */
  id: string;
  name: string;
  /** Courses that satisfy this gateway, e.g. ["CMSC131", "CMSC141"]. */
  options: string[];
  status: GatewayCourseStatus;
  /** The course that met the gateway (only when status is "met"). */
  satisfiedBy?: string;
};

/**
 * Cumulative UMD GPA against the rule's minimum (inclusive):
 * "met" if at or above it, "below" if under it, "unknown" if no GPA was given.
 */
export type GatewayGpaStatus = "met" | "below" | "unknown";

/**
 * - "eligible": every gateway is "met" and the GPA is "met". The student can apply.
 * - "ineligible": some gateway is "below-minimum", with no passing attempt and
 *   no planned retake. The student can't apply as the record stands. Planning a
 *   passing retake changes this to "not-yet". Takes precedence over "not-yet".
 * - "not-yet": everything else. A gateway is planned or missing, or the GPA is
 *   below or unknown. A low GPA gives "not-yet", not "ineligible", because it
 *   can still rise.
 */
export type GatewayOverallStatus = "eligible" | "not-yet" | "ineligible";

export type GatewayInput = {
  /** Testudo term id the student started at UMD, YYYYMM with MM 01 spring, 05 summer, 08 fall, 12 winter. */
  matriculationTerm: string;
  courses: StudentCourse[];
  /** Cumulative UMD GPA; omit when unknown. */
  cumulativeGpa?: number;
};

export type GatewayResult = {
  rule: GatewayRule;
  /** MATH140, CMSC131, CMSC132, in that order. */
  courses: GatewayCourseResult[];
  gpa: GatewayGpaStatus;
  overall: GatewayOverallStatus;
};

/** Checks CS LEP gateway eligibility. Throws on a malformed matriculation term id. */
export function checkCsGateway(input: GatewayInput): GatewayResult {
  if (!/^\d{4}(01|05|08|12)$/.test(input.matriculationTerm)) {
    throw new Error(`Invalid matriculation term id "${input.matriculationTerm}": expected YYYYMM with MM 01, 05, 08 or 12`);
  }
  const rule = Number(input.matriculationTerm) >= NEW_RULE_FROM_TERM ? NEW_RULE : OLD_RULE;
  const minRank = gradeRank(rule.minGrade);

  const courses = GATEWAY_COURSES.map((g): GatewayCourseResult => {
    const attempts = input.courses.filter((c) => g.options.includes(c.id) && !(W_MEANS_NOT_TAKEN && isWithdrawal(c)));
    const passing = attempts.find((c) => meetsGatewayGrade(c, minRank));
    if (passing) return { ...g, status: "met", satisfiedBy: passing.id };
    if (attempts.some((c) => c.status === "planned")) return { ...g, status: "planned" };
    if (attempts.some((c) => c.status === "completed")) return { ...g, status: "below-minimum" };
    return { ...g, status: "missing" };
  });

  const gpa: GatewayGpaStatus =
    input.cumulativeGpa === undefined ? "unknown" : input.cumulativeGpa >= rule.minGpa ? "met" : "below";

  const overall: GatewayOverallStatus = courses.some((c) => c.status === "below-minimum")
    ? "ineligible"
    : courses.every((c) => c.status === "met") && gpa === "met"
      ? "eligible"
      : "not-yet";

  return { rule, courses, gpa, overall };
}
