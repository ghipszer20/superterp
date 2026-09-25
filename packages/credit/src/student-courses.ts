// Turn exam credit into the audit's StudentCourse records.

import type { StudentCourse } from "@superterp/audit";
import { CreditError, type CreditAward } from "./types.ts";

/** A StudentCourse that remembers where the credit came from, e.g. "AP Calculus BC (5)". */
export type CreditCourse = StudentCourse & { source: string };

/** An award offering several courses ("HIST200 or HIST201") that waits for the student's pick. */
export type PendingChoice = { source: string; credits: number; options: string[] };

/**
 * Completed courses, without a letter grade, for every award part.
 * Credit with no UMD course gets a placeholder id such as "L1:AP Computer Science A" or
 * "DSNL:AP Biology": it counts toward Gen Ed (through its codes) and total credits, but can never
 * match a course, department or level requirement. A course two exams both award counts once.
 * `choices` maps an award's source label to the course picked from its options.
 */
export function toStudentCourses(
  awards: CreditAward[],
  choices: Record<string, string> = {},
): { courses: CreditCourse[]; needsChoice: PendingChoice[] } {
  const courses: CreditCourse[] = [];
  const needsChoice: PendingChoice[] = [];
  const add = (id: string, credits: number, genEd: string[], source: string) => {
    if (!courses.some((c) => c.id === id)) courses.push({ id, credits, status: "completed", genEd, source });
  };

  for (const award of awards) {
    const placeholderBase = award.source.replace(/ \(\d+\)$/, "");
    for (const part of award.parts) {
      if (part.kind === "course") add(part.id, part.credits, part.genEd, award.source);
      else if (part.kind === "choice") {
        const picked = choices[award.source];
        if (picked === undefined) {
          needsChoice.push({ source: award.source, credits: part.credits, options: part.options.map((o) => o.id) });
          continue;
        }
        const option = part.options.find((o) => o.id === picked);
        if (!option) throw new CreditError(`${award.source} offers ${part.options.map((o) => o.id).join(" or ")}, not ${picked}`);
        add(option.id, part.credits, option.genEd, award.source);
      } else {
        const base = `${part.genEd[0] ?? "L1"}:${placeholderBase}`;
        let id = base;
        for (let n = 2; courses.some((c) => c.id === id); n++) id = `${base} #${n}`;
        add(id, part.credits, part.genEd, award.source);
      }
    }
  }
  return { courses, needsChoice };
}
