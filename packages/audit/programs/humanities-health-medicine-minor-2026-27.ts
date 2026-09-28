// Humanities, Health, and Medicine Minor (History), 2026-27 UMD Academic Catalog.
// Source: academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/history/
// humanities-health-medicine-minor/ (fetched 2026-09-28). No department page was provided.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

export const hhmMinor: Program = {
  id: "hhm-minor",
  name: "Humanities, Health, and Medicine Minor",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Humanities, Health, and Medicine Minor " +
    "(https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/history/humanities-health-medicine-minor/), fetched 2026-09-28",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Department page not checked: none was provided. Encoded from the catalog alone.",
    "OPEN SLOT: four courses (12 credits) in at least three of five core areas. The catalog points to an approved-course list per area (a link, not in the source) and names no course or range, so the slot is left out of requirements rather than narrowed or opened to any course. The three-of-five-areas rule, the Gen Ed diversity co-requirement on one of the four, the 300/400-level minimum ('six of the nine credits', a catalog inconsistency with the 12-credit slot) and the 3-credit internship allowance are manual.",
    "ENGL395 (or ENGL390) and ENGL390H: the footnote allows ENGL390H for the same writing slot; all three are accepted.",
    "Minor GPA and other eligibility rules are not stated in the source; C- is the standard minor grade floor. No sharing cap stated; none is set.",
  ],
  requirements: [
    { kind: "course", id: "intro", name: "Introduction to Humanities, Health, and Medicine", options: ["ARHU230"] },
    {
      kind: "course",
      id: "writing",
      name: "Writing for Health Professions, or Science Writing",
      options: ["ENGL395", "ENGL390", "ENGL390H"],
    },
  ],
};

export const hhmMinorMeta: ProgramMeta = {
  kind: "minor",
  college: "ARHU",
  short: "Humanities, Health, and Medicine",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/history/humanities-health-medicine-minor/",
  },
};
