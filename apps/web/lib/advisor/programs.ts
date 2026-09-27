// The Programs a student can pick (for now, the encoded ones; only Verified Programs will ship),
// plus the Requirement Layers every student gets: Gen Ed and the university rules.

import type { Program } from "@superterp/audit";
import { cmscMajor } from "@superterp/audit/programs/cmsc-major-2026-27.ts";
import { genEd, university } from "@superterp/audit/programs/gen-ed-2026-27.ts";
import { mathMajorTraditional } from "@superterp/audit/programs/math-major-2026-27.ts";
import { mathMajorApplied } from "@superterp/audit/programs/math-major-applied-2026-27.ts";
import type { College } from "@superterp/plan/credit-caps";
import type { ProgramCandidate } from "@superterp/plan/notices";

export type ProgramOption = {
  id: string;
  /** Tracks of one major share this key; a student has one track per major. */
  major: string;
  /** Short name for headers, e.g. "Math (Applied)". */
  short: string;
  /** Name of the track within its major, if any. */
  track?: string;
  program: Program;
  /**
   * The college that owns this major's catalog page, for the credit-cap check
   * (packages/plan/src/credit-caps.ts). New entries: read it off the major's catalog URL's
   * `colleges-schools/<slug>/` segment (see packages/catalog/src/review.ts's HAND_ENCODED list,
   * which already records that URL for each hand-encoded program).
   */
  college: College;
};

/** Listed with each major's default track first. All three are hand-encoded from catalog pages
 * under colleges-schools/computer-mathematical-natural-sciences/ (packages/catalog/src/review.ts). */
export const PROGRAM_OPTIONS: ProgramOption[] = [
  { id: cmscMajor.id, major: "cmsc", short: "Computer Science", program: cmscMajor, college: "CMNS" },
  { id: mathMajorTraditional.id, major: "math", short: "Math (Traditional)", track: "Traditional", program: mathMajorTraditional, college: "CMNS" },
  { id: mathMajorApplied.id, major: "math", short: "Math (Applied)", track: "Applied Mathematics", program: mathMajorApplied, college: "CMNS" },
];

/** Every student is checked against these too. */
export const AUTOMATIC_PROGRAMS: Program[] = [genEd, university];

export const CATALOG_YEARS = ["2026-27"] as const;

const option = (id: string) => PROGRAM_OPTIONS.find((o) => o.id === id);

/** Adds or removes a program. Picking another track of a chosen major replaces it in place. */
export function toggleProgram(selected: string[], id: string): string[] {
  const picked = option(id);
  if (!picked) return selected;
  if (selected.includes(id)) return selected.filter((x) => x !== id);
  const sameMajor = selected.findIndex((x) => option(x)?.major === picked.major);
  if (sameMajor >= 0) return selected.map((x, i) => (i === sameMajor ? id : x));
  return [...selected, id];
}

const chosen = (selected: string[]) => selected.map(option).filter((o): o is ProgramOption => o !== undefined);

/** The chosen majors alone, without Gen Ed or the university rules -- what a what-if comparison
 * calls "current" or "proposed" (its `layers` are always AUTOMATIC_PROGRAMS). */
export function majorPrograms(selected: string[]): Program[] {
  return chosen(selected).map((o) => o.program);
}

/** The chosen majors, then Gen Ed and the university rules. */
export function auditedPrograms(selected: string[]): Program[] {
  return [...majorPrograms(selected), ...AUTOMATIC_PROGRAMS];
}

/**
 * Majors for the double-major / dual-degree notices: the chosen ones (declared, in order), then
 * the default track of each major the student hasn't chosen. Another track of a chosen major is
 * never a candidate, since two tracks of one major aren't a double major.
 */
export function noticeCandidates(selected: string[]): ProgramCandidate[] {
  const mine = chosen(selected);
  const majors = new Set(mine.map((o) => o.major));
  const others: ProgramOption[] = [];
  for (const o of PROGRAM_OPTIONS) {
    if (majors.has(o.major)) continue;
    majors.add(o.major);
    others.push(o);
  }
  if (mine.length === 0) return [];
  return [...mine.map((o) => ({ program: o.program, declared: true })), ...others.map((o) => ({ program: o.program, declared: false }))];
}

/** The Advisor's default college: the first declared major's college, in the order chosen.
 * Undefined with no majors (or only unknown ids); the student can pick a different one in setup
 * ("College" in SetupView), stored on the plan and never recomputed once set. */
export function collegeOf(selected: string[]): College | undefined {
  return chosen(selected)[0]?.college;
}

export function programsLabel(selected: string[]): string {
  const names = chosen(selected).map((o) => o.short);
  return names.length ? names.join(" + ") : "No major chosen";
}
