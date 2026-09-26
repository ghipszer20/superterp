// Checks a Plan term by term. Pure and synchronous: it runs in the student's browser on every
// edit, so all text parsing happens once, in buildCatalog.

import { checkRequirement, type CourseRecord, type Requirement } from "@superterp/course-data/prereqs";
import type { PlanCatalog } from "./catalog.ts";

/** A course in one term of the Plan: planned by default, or completed (from the transcript). */
export type PlanCourse = {
  id: string;
  status?: "planned" | "completed";
  grade?: string;
  /** Overrides the catalog's credits, e.g. for a variable-credit course. */
  credits?: number;
};

/** One term, named like "Fall 2026", "Winter 2027", "Spring 2027" or "Summer 2027". */
export type PlanTerm = { name: string; courses: PlanCourse[] };

/**
 * Credit the student has before the first term: AP/IB exams or dual enrollment. `CreditCourse`
 * records from @superterp/credit fit this shape.
 */
export type PriorCredit = { id: string; credits: number; grade?: string; genEd?: string[]; source?: string };

/** Terms in order, first to last. */
export type Plan = { terms: PlanTerm[]; priorCredit?: PriorCredit[] };

export type IssueKind = "prerequisite" | "corequisite" | "repeat" | "credit-load" | "light-load" | "unknown-course";

export type PlanIssue = {
  kind: IssueKind;
  /**
   * error: the plan has to change. warning: probably a mistake. confirm: something SuperTerp
   * can't check (a Manual Item), so the student checks it. info: worth knowing, nothing wrong.
   */
  severity: "error" | "warning" | "confirm" | "info";
  term: string;
  /** The course the issue is about; absent for whole-term issues (credit load). */
  course?: string;
  /** Plain language, for the student. */
  message: string;
};

export type Season = "Fall" | "Winter" | "Spring" | "Summer";

/**
 * Most credits a term may have before `credit-load` flags it. UNCONFIRMED: the owner still has
 * to confirm UMD's per-term cap (PROJECT_MEMORY open to-do). 20 for fall and spring and 4 for
 * winter are the commonly cited UMD limits; summer's 16 is a loose bound across its sessions.
 */
export const DEFAULT_MAX_CREDITS: Record<Season, number> = { Fall: 20, Winter: 4, Spring: 20, Summer: 16 };

/** Fewer credits than this in a fall or spring term gets an info note. */
export const FULL_TIME_CREDITS = 12;

export type CheckOptions = {
  /** Per-season caps; seasons left out use DEFAULT_MAX_CREDITS. */
  maxCredits?: Partial<Record<Season, number>>;
};

const SEASON = /^(Fall|Winter|Spring|Summer)\b/i;
function seasonOf(termName: string): Season | null {
  const m = SEASON.exec(termName.trim());
  return m ? ((m[1]![0]!.toUpperCase() + m[1]!.slice(1).toLowerCase()) as Season) : null;
}

/** Where each course sits: -1 for prior credit, else the index of every term it's in. */
type Placement = { at: Map<string, { terms: number[]; grade?: string }>; termNames: string[] };

const withGrade = (id: string, minGrade?: string) => (minGrade ? `${id} (${minGrade} or better)` : id);

function courseLeaves(req: Requirement): Extract<Requirement, { kind: "course" }>[] {
  if (req.kind === "course") return [req];
  if (req.kind === "manual") return [];
  return req.of.flatMap(courseLeaves);
}

/** What's still missing from an unmet requirement, in words: "CMSC250 (C- or better) and CMSC216". */
function describeMissing(req: Requirement, history: Record<string, CourseRecord>, nested = false): string {
  if (req.kind === "course") return withGrade(req.course, req.minGrade);
  if (req.kind === "manual") return req.text;
  if (req.kind === "all") {
    const parts = req.of.filter((r) => checkRequirement(r, history) === "unmet").map((r) => describeMissing(r, history, true));
    const text = listing(parts, "and");
    return nested && parts.length > 1 ? `(${text})` : text;
  }
  const grades = new Set(req.of.map((r) => (r.kind === "course" ? (r.minGrade ?? "") : null)));
  if (grades.size === 1 && !grades.has(null)) {
    const grade = [...grades][0] || undefined;
    const ids = req.of.map((r) => (r as { course: string }).course);
    return withGrade(`one of ${listing(ids, "or")}`, grade);
  }
  return `one of ${listing(req.of.map((r) => describeMissing(r, history, true)), "or")}`;
}

/** "A", "A and B", "A, B and C" */
function listing(items: string[], word: "and" | "or"): string {
  return items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} ${word} ${items.at(-1)}`;
}

/** Why each missing course doesn't count yet: later, same term, low grade, or absent. */
function whereNotes(req: Requirement, history: Record<string, CourseRecord>, placement: Placement, term: number): string[] {
  if (req.kind === "manual") return [];
  if (req.kind === "course") {
    const at = placement.at.get(req.course);
    const earlier = at?.terms.some((t) => t < term);
    if (earlier && at?.grade) return [`Your grade in ${req.course} was ${at.grade}.`];
    if (at?.terms.includes(term)) return [`${req.course} is in the same term; it has to come first.`];
    const later = at?.terms.find((t) => t > term);
    if (later !== undefined) return [`${req.course} is planned for ${placement.termNames[later]}, which is too late.`];
    return [`${req.course} isn't in your plan.`];
  }
  const unmet = req.of.filter((r) => checkRequirement(r, history) === "unmet");
  if (req.kind === "any" && courseLeaves(req).every((leaf) => !placement.at.has(leaf.course))) {
    return ["None of them is in your plan."];
  }
  const notes = unmet.flatMap((r) => whereNotes(r, history, placement, term));
  return req.kind === "any" ? notes.filter((n) => !n.endsWith("isn't in your plan.")) : notes;
}

/** The manual items that decide a "confirm" result, preferring the path whose courses are met. */
function confirmTexts(req: Requirement, history: Record<string, CourseRecord>): string[] {
  // Lowercase the first letter: the text continues a sentence ("Confirm it yourself: must have…").
  if (req.kind === "manual") return [req.text.charAt(0).toLowerCase() + req.text.slice(1)];
  if (req.kind === "course") return [];
  const confirming = req.of.filter((r) => checkRequirement(r, history) === "confirm");
  if (req.kind === "any") {
    const withCourses = confirming.filter((r) => courseLeaves(r).length > 0);
    return (withCourses.length > 0 ? withCourses.slice(0, 1) : confirming).flatMap((r) => confirmTexts(r, history));
  }
  return confirming.flatMap((r) => confirmTexts(r, history));
}

const count = (n: number) => (n === 2 ? "twice" : `${n} times`);

const gradeIs = (c: PlanCourse, grade: string) => c.grade?.trim().toUpperCase() === grade;

/**
 * Owner ruling ("Repeated courses"): a course may be in the plan again only after a completed
 * attempt graded F (failed) or W (withdrawn) — any other repeat is an error.
 */
export function allowsRetake(c: PlanCourse): boolean {
  return c.status === "completed" && (gradeIs(c, "F") || gradeIs(c, "W"));
}

export function checkPlan(plan: Plan, catalog: PlanCatalog, options: CheckOptions = {}): PlanIssue[] {
  const issues: PlanIssue[] = [];
  const maxCredits = { ...DEFAULT_MAX_CREDITS, ...options.maxCredits };
  const prior = new Map((plan.priorCredit ?? []).map((c) => [c.id, c]));
  const creditsOf = (c: PlanCourse) => c.credits ?? catalog.get(c.id)?.credits.min ?? 0;

  const placement: Placement = { at: new Map(), termNames: plan.terms.map((t) => t.name) };
  const place = (id: string, term: number, grade?: string) => {
    const at = placement.at.get(id) ?? { terms: [] };
    at.terms.push(term);
    if (grade !== undefined) at.grade = grade;
    placement.at.set(id, at);
  };
  for (const c of prior.values()) place(c.id, -1, c.grade);
  plan.terms.forEach((t, i) => t.courses.forEach((c) => place(c.id, i, c.status === "completed" ? c.grade : undefined)));

  // Finished before the current term: prior credit, then each earlier term as we go.
  const before: Record<string, CourseRecord> = {};
  for (const c of prior.values()) before[c.id] = c.grade ? { grade: c.grade } : {};

  plan.terms.forEach((term, i) => {
    // Same-term courses count only where the prerequisite allows concurrent enrollment;
    // a corequisite is met by the same term or an earlier one.
    const prereqHistory: Record<string, CourseRecord> = { ...before };
    const coreqHistory: Record<string, CourseRecord> = { ...before };
    for (const c of term.courses) {
      prereqHistory[c.id] ??= { concurrent: true };
      coreqHistory[c.id] ??= {};
    }

    for (const course of term.courses) {
      const info = catalog.get(course.id);
      const at = { term: term.name, course: course.id };
      const where = `${course.id} (${term.name})`;
      if (!info) {
        issues.push({
          kind: "unknown-course",
          severity: "warning",
          ...at,
          message: `${course.id} isn't in the course data SuperTerp has. Check the course number; if it's right, SuperTerp can't check its prerequisites or credits yet.`,
        });
        continue;
      }
      if (course.status === "completed") continue;

      if (info.prerequisite) {
        const result = checkRequirement(info.prerequisite, prereqHistory);
        if (result === "unmet") {
          const missing = describeMissing(info.prerequisite, prereqHistory);
          const notes = whereNotes(info.prerequisite, prereqHistory, placement, i);
          issues.push({
            kind: "prerequisite",
            severity: "error",
            ...at,
            message: [`${where} needs ${missing} finished in an earlier term.`, ...notes].join(" "),
          });
        } else if (result === "confirm") {
          issues.push({
            kind: "prerequisite",
            severity: "confirm",
            ...at,
            message: `${where} also needs something SuperTerp can't check. Confirm it yourself: ${confirmTexts(info.prerequisite, prereqHistory).join("; ")}.`,
          });
        }
      }

      if (info.corequisite) {
        const result = checkRequirement(info.corequisite, coreqHistory);
        if (result === "unmet") {
          const missing = describeMissing(info.corequisite, coreqHistory);
          const notes = whereNotes(info.corequisite, coreqHistory, placement, i);
          issues.push({
            kind: "corequisite",
            severity: "error",
            ...at,
            message: [`${where} must be taken with ${missing} in the same term, or after it.`, ...notes].join(" "),
          });
        } else if (result === "confirm") {
          issues.push({
            kind: "corequisite",
            severity: "confirm",
            ...at,
            message: `${where} also has a corequisite SuperTerp can't check. Confirm it yourself: ${confirmTexts(info.corequisite, coreqHistory).join("; ")}.`,
          });
        }
      }
    }

    for (const c of term.courses) before[c.id] = c.status === "completed" && c.grade ? { grade: c.grade } : {};
  });

  issues.push(...repeatIssues(plan, catalog, prior, creditsOf));

  plan.terms.forEach((term) => {
    const season = seasonOf(term.name);
    if (!season) return;
    const credits = term.courses.reduce((t, c) => t + creditsOf(c), 0);
    const cap = maxCredits[season];
    if (credits > cap) {
      issues.push({
        kind: "credit-load",
        severity: "error",
        term: term.name,
        message: `${term.name} has ${credits} credits, over the ${cap}-credit limit for a ${season.toLowerCase()} term. Going over usually needs approval from your college.`,
      });
    } else if ((season === "Fall" || season === "Spring") && credits < FULL_TIME_CREDITS) {
      issues.push({
        kind: "light-load",
        severity: "info",
        term: term.name,
        message: `${term.name} has ${credits} credits. Full-time students take at least ${FULL_TIME_CREDITS} in a fall or spring term; fewer can affect financial aid, housing and your graduation date.`,
      });
    }
  });
  return issues;
}

function repeatIssues(
  plan: Plan,
  catalog: PlanCatalog,
  prior: Map<string, PriorCredit>,
  creditsOf: (c: PlanCourse) => number,
): PlanIssue[] {
  const issues: PlanIssue[] = [];
  const taken = new Map<string, { term: string; credits: number; course: PlanCourse }[]>();
  for (const term of plan.terms) {
    for (const course of term.courses) {
      const info = catalog.get(course.id);
      if (!info) continue;
      const earlier = prior.get(course.id);
      if (earlier) {
        issues.push({
          kind: "repeat",
          severity: "warning",
          term: term.name,
          course: course.id,
          message: `You already have credit for ${course.id}${earlier.source ? ` (${earlier.source})` : ""}. Taking it again counts only once, so these credits won't add to your total.`,
        });
      }
      const list = taken.get(course.id) ?? [];
      list.push({ term: term.name, credits: creditsOf(course), course });
      taken.set(course.id, list);
    }
  }

  for (const [id, list] of taken) {
    if (list.length < 2) continue;
    const repeat = catalog.get(id)!.repeat;
    const terms = listing(list.map((x) => x.term), "and");
    const last = { kind: "repeat" as const, term: list.at(-1)!.term, course: id };
    if (repeat.kind === "unknown") {
      // Owner ruling: every attempt after the first must follow a failed or withdrawn one.
      const allowed = list.every((_, k) => k === 0 || allowsRetake(list[k - 1]!.course));
      if (!allowed) {
        issues.push({
          ...last,
          severity: "error",
          message: `${id} is in your plan ${count(list.length)} (${terms}). You can only retake a course you failed or withdrew from.`,
        });
      }
      continue;
    }
    const total = list.reduce((t, x) => t + x.credits, 0);
    if (repeat.maxCredits !== undefined && total > repeat.maxCredits) {
      issues.push({
        ...last,
        severity: "error",
        message: `${id} can count for at most ${repeat.maxCredits} credits, but your plan has ${total} (${terms}).`,
      });
    }
  }
  return issues;
}
