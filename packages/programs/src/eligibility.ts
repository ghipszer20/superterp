// Eligibility gates (owner ruling, docs/project/rulings.md "Minors"): a minor or certificate whose
// source says it isn't open to certain majors is blocked for students who have declared one.
// The gate itself lives in the program file's ProgramMeta.notOpenTo (packages/audit/src/audit.ts).

import type { ProgramEntry } from "./registry-types.ts";
import { PROGRAMS } from "./registry.generated.ts";

const byId = new Map(PROGRAMS.map((p) => [p.id, p]));
const registryLookup = (id: string) => byId.get(id);

/**
 * Why `entry` is closed to this student, or undefined when it's open. Only declared programs of
 * kind "major" can block; one matches the gate by its own id, its major key (every track of that
 * major), or its owning college.
 */
export function blockedReason(
  entry: ProgramEntry,
  declaredIds: readonly string[],
  lookup: (id: string) => ProgramEntry | undefined = registryLookup,
): string | undefined {
  const gate = entry.notOpenTo;
  if (!gate) return undefined;
  const programs = gate.programs ?? [];
  const colleges: readonly string[] = gate.colleges ?? [];
  for (const id of declaredIds) {
    const major = lookup(id);
    if (!major || major.kind !== "major") continue;
    if (programs.includes(major.id) || programs.includes(major.major ?? major.id) || colleges.includes(major.college)) return gate.reason;
  }
  return undefined;
}
