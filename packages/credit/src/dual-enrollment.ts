// College courses taken in high school, with the UMD equivalent the student found in UMD's
// Transfer Course Database (SOURCES.md describes it).

import { CreditError } from "./types.ts";
import type { CreditCourse } from "./student-courses.ts";

export type UmdEquivalent = {
  /** A UMD course id such as "MATH140" (spaces and case don't matter). */
  id: string;
  /** Needed when the course maps to several UMD courses; otherwise the entry's credits. */
  credits?: number;
  /** Gen Ed codes the database lists for this evaluation, e.g. ["FSAR", "FSMA"]. */
  genEd?: string[];
};

export type DualEnrollmentEntry = {
  institution: string;
  /** The course at that institution, e.g. "MATH181". */
  course: string;
  credits: number;
  /** The UMD course(s) it transfers as, or "elective credit" (UMD's L1, or a department's 1XX). */
  umdEquivalent: UmdEquivalent[] | "elective credit";
};

const COURSE_ID = /^[A-Z]{4}\d{3}[A-Z]?$/;

function courseId(raw: string, source: string): string {
  const id = raw.replace(/\s+/g, "").toUpperCase();
  if (!COURSE_ID.test(id)) throw new CreditError(`${source}: "${raw}" isn't a UMD course id like MATH140`);
  return id;
}

export function dualEnrollmentToStudentCourses(entries: DualEnrollmentEntry[]): CreditCourse[] {
  return entries.flatMap((entry): CreditCourse[] => {
    const source = `${entry.institution} ${entry.course}`;
    if (!(entry.credits > 0)) throw new CreditError(`${source}: credits must be a positive number, not ${entry.credits}`);
    const done = (id: string, credits: number, genEd: string[] = []): CreditCourse => ({ id, credits, status: "completed", genEd, source });

    if (entry.umdEquivalent === "elective credit") return [done(`L1:${source}`, entry.credits)];
    const equivalents = entry.umdEquivalent;
    if (equivalents.length === 1) {
      const [only] = equivalents as [UmdEquivalent];
      return [done(courseId(only.id, source), only.credits ?? entry.credits, only.genEd)];
    }
    const total = equivalents.reduce((sum, e) => sum + (e.credits ?? NaN), 0);
    if (total !== entry.credits)
      throw new CreditError(`${source}: give each UMD equivalent its credits, adding up to the course's ${entry.credits}`);
    return equivalents.map((e) => done(courseId(e.id, source), e.credits!, e.genEd));
  });
}
