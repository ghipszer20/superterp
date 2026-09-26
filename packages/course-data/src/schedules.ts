// Schedule generation: every conflict-free combination of one section per course.
// Lazy (a generator), so a student can scroll through millions of combinations
// without them all existing in memory at once. Filters (days off, workday windows, and
// the always-on "no full sections" rule) are per-section tests applied before the search.

import type { Meeting, Section } from "./soc.ts";

// Type-only, so browser code can import the schedule API without the SOC scraper (cheerio).
export type { Meeting, Section };

function meetingsOverlap(a: Meeting, b: Meeting): boolean {
  if (a.start === null || a.end === null || b.start === null || b.end === null) return false;
  if (!a.days.some((d) => b.days.includes(d))) return false;
  return a.start < b.end && b.start < a.end;
}

export function sectionsConflict(a: Section, b: Section): boolean {
  return a.meetings.some((m) => b.meetings.some((n) => meetingsOverlap(m, n)));
}

// ---- filters ----

export type Weekday = "M" | "Tu" | "W" | "Th" | "F";
export const WEEKDAYS: readonly Weekday[] = ["M", "Tu", "W", "Th", "F"];

/** "off": no class that day. A window: every class that day starts and ends inside it (minutes after midnight, inclusive). */
export type DayRule = "off" | { from: number; to: number };

export type ScheduleFilters = {
  /** Weekdays left out are unrestricted. Saturday and Sunday are never restricted. */
  days?: Partial<Record<Weekday, DayRule>>;
  /** Full sections (no open seats) are never generated (owner rule); true opts out, e.g. for a waitlist view. */
  includeFull?: boolean;
};

/** The "same hours every day" shortcut: one window for Monday to Friday. */
export function sameHoursEveryDay(from: number, to: number): Record<Weekday, DayRule> {
  return Object.fromEntries(WEEKDAYS.map((d) => [d, { from, to }])) as Record<Weekday, DayRule>;
}

/** Whether one meeting respects one day's rule (only called for days the meeting is on). */
export function meetingFitsRule(m: Meeting, rule: DayRule): boolean {
  if (rule === "off") return false;
  // A meeting without a set time can't be checked against a window, so it passes.
  if (m.start === null || m.end === null) return true;
  return m.start >= rule.from && m.end <= rule.to;
}

/** Whether a section's meetings respect the day rules (not seats). */
export function sectionFitsDays(s: Section, days: ScheduleFilters["days"]): boolean {
  if (!days) return true;
  return s.meetings.every((m) =>
    m.days.every((d) => {
      const rule = days[d as Weekday];
      return rule === undefined || meetingFitsRule(m, rule);
    }),
  );
}

export const hasOpenSeats = (s: Section) => s.seats.open > 0;

/**
 * Every filter is a property of one section on its own, so filtering each course's sections
 * before the search prunes every branch a failing section would have started.
 */
export function sectionPasses(s: Section, filters: ScheduleFilters = {}): boolean {
  return (filters.includeFull === true || hasOpenSeats(s)) && sectionFitsDays(s, filters.days);
}

// ---- generation ----

export function* generateSchedules(
  courseIds: string[],
  sections: Section[],
  filters: ScheduleFilters = {},
): Generator<Section[]> {
  const options = courseIds.map((id) => sections.filter((s) => s.courseId === id && sectionPasses(s, filters)));
  const chosen: Section[] = [];

  function* place(i: number): Generator<Section[]> {
    if (i === options.length) {
      yield [...chosen];
      return;
    }
    for (const s of options[i]!) {
      if (chosen.some((c) => sectionsConflict(c, s))) continue; // prune: nothing below can work
      chosen.push(s);
      yield* place(i + 1);
      chosen.pop();
    }
  }
  yield* place(0);
}

/** A distinct weekly layout: for each course, the sections that fit it interchangeably. */
export type Layout = Section[][];

/** Sections with the same meeting days and times are interchangeable for layout purposes. */
const timeKey = (s: Section) =>
  s.meetings
    .map((m) => `${m.days.join("")}@${m.start ?? "-"}-${m.end ?? "-"}`)
    .sort()
    .join("|");

function groupByTimes(sections: Section[]): Section[][] {
  const groups = new Map<string, Section[]>();
  for (const s of sections) {
    const key = timeKey(s);
    groups.set(key, [...(groups.get(key) ?? []), s]);
  }
  return [...groups.values()];
}

export function* generateLayouts(
  courseIds: string[],
  sections: Section[],
  filters: ScheduleFilters = {},
): Generator<Layout> {
  // Filtering before grouping keeps only the open sections inside a time group and drops groups left empty.
  const options = courseIds.map((id) =>
    groupByTimes(sections.filter((s) => s.courseId === id && sectionPasses(s, filters))),
  );
  const chosen: Section[][] = [];

  function* place(i: number): Generator<Layout> {
    if (i === options.length) {
      yield [...chosen];
      return;
    }
    for (const group of options[i]!) {
      // Every section in a group meets at the same times, so one stands in for all.
      if (chosen.some((c) => sectionsConflict(c[0]!, group[0]!))) continue;
      chosen.push(group);
      yield* place(i + 1);
      chosen.pop();
    }
  }
  yield* place(0);
}
