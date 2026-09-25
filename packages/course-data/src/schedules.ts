// Schedule generation: every conflict-free combination of one section per course.
// Lazy (a generator), so a student can scroll through millions of combinations
// without them all existing in memory at once.

import type { Meeting, Section } from "./soc.ts";

function meetingsOverlap(a: Meeting, b: Meeting): boolean {
  if (a.start === null || a.end === null || b.start === null || b.end === null) return false;
  if (!a.days.some((d) => b.days.includes(d))) return false;
  return a.start < b.end && b.start < a.end;
}

export function sectionsConflict(a: Section, b: Section): boolean {
  return a.meetings.some((m) => b.meetings.some((n) => meetingsOverlap(m, n)));
}

export function* generateSchedules(courseIds: string[], sections: Section[]): Generator<Section[]> {
  const options = courseIds.map((id) => sections.filter((s) => s.courseId === id));
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

export function* generateLayouts(courseIds: string[], sections: Section[]): Generator<Layout> {
  const options = courseIds.map((id) => groupByTimes(sections.filter((s) => s.courseId === id)));
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
