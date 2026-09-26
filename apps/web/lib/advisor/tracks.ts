// The pre-professional Tracks a student can pick in Setup, and small pure helpers the UI uses.
// Owner ruling: a Track is a prerequisite for applying to a professional school, not a degree
// requirement; it can be added to any major. So this module -- and every track id in
// AdvisorPlan.tracks -- is never passed to @superterp/plan/notices or @superterp/audit's program
// list (see lib/advisor/programs.ts, which only reads plan.programs). TRACKS and examMilestone
// come from "@superterp/tracks/list", which has no runtime @superterp/audit import, so this file
// stays out of the main bundle's solver code; only lib/advisor/analysis.ts (code-split) imports
// the full "@superterp/tracks" (checkTrack, scienceGpa).

export { examMilestone, TRACKS, type Track } from "@superterp/tracks/list";

/** Adds or removes a track id, keeping the others' order. */
export function toggleTrack(selected: string[], id: string): string[] {
  return selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
}
