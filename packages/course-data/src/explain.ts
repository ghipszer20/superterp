// Explaining an empty result: which course(s), under which filters, leave no layout.
//
// Cheap by construction: every filter is a per-section test, so a single course is checked
// without any search. Only when every course passes on its own do we search, and then a
// greedy deletion (drop a course; if still empty, leave it out) finds an irreducible set
// of courses, and the same deletion over the filters finds the ones that matter.

import { generateLayouts, sectionPasses, WEEKDAYS, type ScheduleFilters, type Weekday } from "./schedules.ts";
import type { Section } from "./soc.ts";

/** One filter the student set, in a form the UI can offer to relax. */
export type FilterConstraint =
  | { kind: "openSeats" }
  | { kind: "dayOff"; day: Weekday }
  | { kind: "window"; day: Weekday; from: number; to: number };

export type Blocker = {
  /** The smallest group of courses found that can't be scheduled. */
  courses: string[];
  /** The filters that, together, block them (empty: blocked with no filters at all). */
  filters: FilterConstraint[];
  message: string;
};

export type EmptyExplanation = { blockers: Blocker[]; message: string };

const DAY_NAMES: Record<Weekday, string> = { M: "Monday", Tu: "Tuesday", W: "Wednesday", Th: "Thursday", F: "Friday" };

function clock(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = String(minutes % 60).padStart(2, "0");
  return `${((h + 11) % 12) + 1}:${m}${h < 12 ? "am" : "pm"}`;
}

/** "A", "A and B", "A, B and C" */
function listing(items: string[]): string {
  return items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

function constraintsOf(filters: ScheduleFilters): FilterConstraint[] {
  const out: FilterConstraint[] = filters.includeFull ? [] : [{ kind: "openSeats" }];
  for (const day of WEEKDAYS) {
    const rule = filters.days?.[day];
    if (rule === undefined) continue;
    out.push(rule === "off" ? { kind: "dayOff", day } : { kind: "window", day, from: rule.from, to: rule.to });
  }
  return out;
}

function filtersOf(constraints: FilterConstraint[]): ScheduleFilters {
  const days: NonNullable<ScheduleFilters["days"]> = {};
  for (const c of constraints) {
    if (c.kind === "dayOff") days[c.day] = "off";
    else if (c.kind === "window") days[c.day] = { from: c.from, to: c.to };
  }
  return { days, includeFull: !constraints.some((c) => c.kind === "openSeats") };
}

/** Greedy deletion: drop each item in turn if the rest are still blocked. The result is irreducible. */
function minimize<T>(items: T[], blocked: (subset: T[]) => boolean): T[] {
  let kept = [...items];
  for (const item of items) {
    const without = kept.filter((x) => x !== item);
    if (blocked(without)) kept = without;
  }
  return kept;
}

const hasLayout = (courseIds: string[], sections: Section[], filters: ScheduleFilters) =>
  !generateLayouts(courseIds, sections, filters).next().done;

function describeCourse(courseId: string, filters: FilterConstraint[]): string {
  const phrases = filters.flatMap((c) =>
    c.kind === "dayOff"
      ? [`avoids ${DAY_NAMES[c.day]}`]
      : c.kind === "window"
        ? [`fits ${DAY_NAMES[c.day]} ${clock(c.from)}–${clock(c.to)}`]
        : [],
  );
  const open = filters.some((c) => c.kind === "openSeats");
  if (phrases.length === 0) return `${courseId}: every section is full.`;
  return `${courseId} has no ${open ? "open " : ""}section that ${listing(phrases)}.`;
}

function describeConflict(courseIds: string[], filters: FilterConstraint[]): string {
  const names = listing(courseIds);
  if (filters.length === 0) return `${names} always overlap.`;
  if (filters.every((c) => c.kind === "openSeats")) return `${names} can't fit together in sections with open seats.`;
  return `${names} can't fit together with your filters.`;
}

/**
 * Why `generateLayouts(courseIds, sections, filters)` is empty, or null when it isn't.
 * Courses that fail on their own are all named; otherwise one smallest clashing group is.
 */
export function explainNoLayouts(
  courseIds: string[],
  sections: Section[],
  filters: ScheduleFilters,
): EmptyExplanation | null {
  if (hasLayout(courseIds, sections, filters)) return null;
  const constraints = constraintsOf(filters);

  const blockers: Blocker[] = [];
  for (const courseId of courseIds) {
    const own = sections.filter((s) => s.courseId === courseId);
    if (own.length === 0) {
      blockers.push({ courses: [courseId], filters: [], message: `${courseId} has no sections this term.` });
      continue;
    }
    if (own.some((s) => sectionPasses(s, filters))) continue;
    const needed = minimize(constraints, (cs) => !own.some((s) => sectionPasses(s, filtersOf(cs))));
    blockers.push({ courses: [courseId], filters: needed, message: describeCourse(courseId, needed) });
  }

  if (blockers.length === 0) {
    const courses = minimize(courseIds, (ids) => !hasLayout(ids, sections, filters));
    const needed = minimize(constraints, (cs) => !hasLayout(courses, sections, filtersOf(cs)));
    blockers.push({ courses, filters: needed, message: describeConflict(courses, needed) });
  }

  return { blockers, message: blockers.map((b) => b.message).join(" ") };
}
