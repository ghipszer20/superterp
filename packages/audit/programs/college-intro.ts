// College intro courses: each college's first-semester course, a college requirement for
// students who enter as freshmen (owner ruling 2026-09-29; research in
// docs/project/college-intro-courses.md). Only the REQUIRED rows are audit requirements; the
// recommended ones (INFO's INST101, UNIV100 for other colleges) only go into sample plans.

import type { Program } from "../src/audit.ts";

/** Course options that satisfy the requirement, by college code. */
export const COLLEGE_INTRO_REQUIRED: Record<string, string[]> = {
  CMNS: ["CMNS100", "UNIV100"],
  ARHU: ["ARHU158"],
  SPHL: ["UNIV100"],
};

/** The college's requirement layer, or null when the college has none or the student transferred in. */
export function collegeIntro(college: string, entry: "freshman" | "transfer" = "freshman"): Program | null {
  const options = COLLEGE_INTRO_REQUIRED[college];
  if (!options || entry === "transfer") return null;
  return {
    id: `college-intro-${college.toLowerCase()}`,
    name: "College requirements",
    layer: "college",
    catalogYear: "2026-27",
    source: "UMD Academic Catalog 2026–27, approved courses",
    verified: false,
    reviewNotes: ["Applies to students who enter UMD as freshmen; transfer students are exempt."],
    requirements: [{ kind: "course", id: "college-intro", name: `College intro course (${options.join(" or ")})`, options }],
  };
}
