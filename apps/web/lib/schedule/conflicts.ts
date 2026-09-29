// Overlapping classes and tight walks, as decisions the UI just displays (owner, 2026-09-29):
// blocks never look different for a conflict; instead a note names the overlap and saving a
// schedule as a Plan is blocked until it is fixed. Cards in Browse layouts show a walk warning.

import type { Building } from "@superterp/campus-data/buildings";
import type { Section } from "@superterp/course-data/schedules";
import { conflictPairs } from "./sections";
import { dayWalks } from "./walks";

const DAY_NAMES = { M: "Mon", Tu: "Tue", W: "Wed", Th: "Thu", F: "Fri" } as const;

/** The overlapping course pairs that block saving these sections as a Plan (empty = fine to save). */
export const saveBlockedBy = (sections: Section[]): [string, string][] => conflictPairs(sections);

export const overlapNote = (pairs: [string, string][]): string =>
  `${pairs.map(([a, b]) => `${a} and ${b}`).join("; ")} overlap. Saving as a Plan is blocked until the overlap is fixed.`;

/** One short line for the first tight walk in a layout, or null. "Tight walk: ~12 min, CMSC131 → MATH141 on Mon". */
export function tightWalkLine(sections: Section[], buildings: readonly Building[]): string | null {
  const w = dayWalks(sections, buildings).find((x) => x.tight);
  return w ? `Tight walk: ~${w.minutes} min, ${w.fromCourse} → ${w.toCourse} on ${DAY_NAMES[w.day]}` : null;
}
