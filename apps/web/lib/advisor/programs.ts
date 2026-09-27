// The Programs a student can pick -- every entry in the program registry (@superterp/programs;
// only Verified Programs will ship) -- plus the Requirement Layers every student gets: Gen Ed and
// the university rules. The options carry metadata only; a Program's requirements load with
// import() when it's audited (runAnalysis, runWhatIf), so the picker never bundles them.

import type { Program } from "@superterp/audit";
import { genEd, university } from "@superterp/audit/programs/gen-ed-2026-27.ts";
import type { College } from "@superterp/plan/credit-caps";
import type { ProgramCandidate } from "@superterp/plan/notices";
import { findProgram, loadPrograms, majorKey, PROGRAMS, type ProgramEntry } from "@superterp/programs";

export type ProgramOption = ProgramEntry;

/** Majors, then minors, certificates and special programs, each major's default track first. */
export const PROGRAM_OPTIONS: ProgramOption[] = PROGRAMS;

/** Every student is checked against these too. */
export const AUTOMATIC_PROGRAMS: Program[] = [genEd, university];

export const CATALOG_YEARS = ["2026-27"] as const;

/** Adds or removes a program. Picking another track of a chosen major replaces it in place. */
export function toggleProgram(selected: string[], id: string): string[] {
  const picked = findProgram(id);
  if (!picked) return selected;
  if (selected.includes(id)) return selected.filter((x) => x !== id);
  const key = majorKey(picked);
  const sameMajor = selected.findIndex((x) => {
    const o = findProgram(x);
    return o !== undefined && majorKey(o) === key;
  });
  if (sameMajor >= 0) return selected.map((x, i) => (i === sameMajor ? id : x));
  return [...selected, id];
}

const chosen = (selected: string[]) => selected.map(findProgram).filter((o): o is ProgramOption => o !== undefined);

/** The chosen programs alone (majors, minors, special programs), without Gen Ed or the university
 * rules -- what a what-if comparison calls "current" or "proposed" (its `layers` are always
 * AUTOMATIC_PROGRAMS). */
export function majorPrograms(selected: string[]): Promise<Program[]> {
  return loadPrograms(chosen(selected).map((o) => o.id));
}

/** The chosen programs, then Gen Ed and the university rules. */
export async function auditedPrograms(selected: string[]): Promise<Program[]> {
  return [...(await majorPrograms(selected)), ...AUTOMATIC_PROGRAMS];
}

/**
 * Majors for the double-major / dual-degree notices: the chosen majors (declared, in order), then
 * the default track of each major the student hasn't chosen. Another track of a chosen major is
 * never a candidate, since two tracks of one major aren't a double major; minors and special
 * programs never take part.
 */
export async function noticeCandidates(selected: string[]): Promise<ProgramCandidate[]> {
  const mine = chosen(selected).filter((o) => o.kind === "major");
  if (mine.length === 0) return [];
  const majors = new Set(mine.map(majorKey));
  const others: ProgramOption[] = [];
  for (const o of PROGRAM_OPTIONS) {
    if (o.kind !== "major" || majors.has(majorKey(o))) continue;
    majors.add(majorKey(o));
    others.push(o);
  }
  const [declared, undeclared] = await Promise.all([loadPrograms(mine.map((o) => o.id)), loadPrograms(others.map((o) => o.id))]);
  return [...declared.map((program) => ({ program, declared: true })), ...undeclared.map((program) => ({ program, declared: false }))];
}

/** The Advisor's default college: the first declared major's college, in the order chosen (or the
 * first program's, with no major). Undefined with nothing chosen (or only unknown ids); the
 * student can pick a different one in setup ("College" in SetupView), stored on the plan and never
 * recomputed once set. */
export function collegeOf(selected: string[]): College | undefined {
  const mine = chosen(selected);
  return (mine.find((o) => o.kind === "major") ?? mine[0])?.college;
}

export function programsLabel(selected: string[]): string {
  const names = chosen(selected).map((o) => o.short ?? o.name);
  return names.length ? names.join(" + ") : "No major chosen";
}
