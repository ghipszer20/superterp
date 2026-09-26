// The catalog of encoded Tracks, and the pure, framework-free helpers a UI needs to list and pick
// them. Deliberately free of @superterp/audit's solver (only its types): a picker screen can
// import this entry ("@superterp/tracks/list") without pulling HiGHS into its bundle. checkTrack
// itself (src/check.ts), which does call the solver, imports trackProgram from here too.

import type { Program } from "@superterp/audit";
import { preDental } from "../tracks/pre-dental.ts";
import { preLaw } from "../tracks/pre-law.ts";
import { preMed } from "../tracks/pre-med.ts";
import { preNursing } from "../tracks/pre-nursing.ts";
import { preOptometry } from "../tracks/pre-optometry.ts";
import { preOt } from "../tracks/pre-ot.ts";
import { prePa } from "../tracks/pre-pa.ts";
import { prePharmacy } from "../tracks/pre-pharmacy.ts";
import { prePodiatry } from "../tracks/pre-podiatry.ts";
import { prePt } from "../tracks/pre-pt.ts";
import { preVet } from "../tracks/pre-vet.ts";
import type { Milestone, Track } from "./types.ts";

export * from "./types.ts";

export const TRACKS: Track[] = [
  preMed,
  preDental,
  prePa,
  preVet,
  prePharmacy,
  preOptometry,
  prePodiatry,
  prePt,
  preOt,
  preNursing,
  preLaw,
];

/**
 * Turns a Track's categories into a Program the audit can check. Categories without a
 * `requirement` (a Manual Item like medical terminology) aren't checkable by the audit and are
 * left out; `checkTrack` reports on those separately.
 */
export function trackProgram(track: Track): Program {
  return {
    id: track.id,
    name: track.name,
    requirements: track.categories.flatMap((c) => (c.requirement ? [c.requirement] : [])),
    minGrade: track.minGrade,
    source: track.sources.join(", "),
    verified: false,
    reviewNotes: track.reviewNotes,
  };
}

/**
 * The exam a track's categories reference via `examContent`, when there's exactly one and it's
 * one of the track's own milestones (e.g. pre-med's MCAT). Undefined when a track's categories
 * name no exam (pre-law's LSAT isn't content-linked to any category), or name more than one.
 */
export function examMilestone(track: Track): Milestone | undefined {
  const ids = new Set(track.categories.flatMap((c) => (c.examContent ? [c.examContent] : [])));
  if (ids.size !== 1) return undefined;
  const [id] = ids;
  return track.milestones.find((m) => m.id === id);
}
