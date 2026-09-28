// Psychology Major, Bachelor of Science Track, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/psychology/psychology-major/;
// Department of Psychology, "Degree Requirements (BS and BA)", https://psyc.umd.edu/undergraduate/degree-requirements-bs-and-ba;
// Feller Center (BSOS), "Psychology Major Checklist" (Internet Archive copy, effective Spring 2022,
// last updated 4/23/24) (fetched 2026-09-28).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree, follow
// the department page. No disagreement specific to the B.S. option was found beyond the shared
// math-gateway MATH136 note (see psyc-major-ba-2026-27.ts).
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

export const psycMajorBs: Program = {
  id: "psyc-major-bs",
  name: "Psychology Major (Bachelor of Science)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Psychology Major; " +
    "Department of Psychology, Degree Requirements (BS and BA), https://psyc.umd.edu/undergraduate/degree-requirements-bs-and-ba; " +
    "Feller Center, Psychology Major Checklist (Internet Archive, effective Spring 2022, updated 4/23/24) (fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "All of the B.A. requirements below also apply to the B.S. (both sources: 'Students who wish to pursue the Bachelor of Science degree (B.S.) must complete all of the BA requirements ...'); see psyc-major-ba-2026-27.ts's reviewNotes for the PSYC100/B- override, the MATH136 exclusion, the un-enumerated thematic areas, the psyc-total-credits overlay, the 400-level-lab approximation, and the admission-gate/engine-gap notes -- all identical here and not repeated.",
    "NOT encoded: the B.S.'s Additional Math and Science Requirement (5 courses/16 credits total in math and science, including the shared MATH120-or-140 and BSCI170 gateway courses, plus 3 more courses/10 credits of which at least 3 total are 'advanced' and at least 1 has a lab, with a 2.0 average across the 17-credit supporting sequence). Both sources point to a department-hosted approved list (psyc.umd.edu/undergraduate/degree-requirements) that wasn't part of the fetched source; the checklist's own B.S. section lists only placeholder rows ('BS Advanced Course 1/2/3'), naming no actual course. Per the builder brief, this isn't guessed from an unlisted department (could be MATH, BSCI, CHEM, PHYS, STAT or others) -- flagged in docs/project/owner-review.md instead. The B.S. Program below therefore encodes the identical checkable requirements as the B.A. track; the un-encoded math/science bucket is the only real difference between the two degrees.",
    "'PSYC courses counting towards the B.S. requirements will NOT count towards the thematic or 400-level requirements' and 'BS PSYC courses cannot count toward the 35 credits/11 course requirement' (both sources) can't be enforced either, since the B.S.-specific course pool itself isn't encoded (see above) -- there's nothing to wall off.",
  ],
  requirements: [
    {
      kind: "course",
      id: "psyc100",
      name: "Introduction to Psychology (PSYC100, or PSYC221 with AP/IB credit for PSYC100)",
      options: ["PSYC100", "PSYC221"],
      minGrade: "B-",
    },
    {
      kind: "course",
      id: "math-gateway",
      name: "Math Gateway (MATH120 or MATH140)",
      options: ["MATH120", "MATH140"],
    },
    { kind: "course", id: "bsci170", name: "Principles of Biology I", options: ["BSCI170"] },
    { kind: "course", id: "psyc200", name: "Statistical Methods in Psychology", options: ["PSYC200"] },
    { kind: "course", id: "psyc300", name: "Research Methods in Psychology Laboratory", options: ["PSYC300"] },
    {
      kind: "choose",
      id: "psyc-multicultural",
      name: "PSYC Multicultural Course",
      count: 1,
      from: { courses: ["PSYC232", "PSYC262", "PSYC336", "PSYC354", "PSYC391", "PSYC447", "PSYC489E", "PSYC489F"] },
    },
    {
      kind: "choose",
      id: "psyc-400-nonlab",
      name: "PSYC 400-Level Non-Lab Courses (2)",
      count: 2,
      from: { departments: ["PSYC"], minNumber: 400, maxNumber: 499 },
    },
    {
      kind: "choose",
      id: "psyc-400-lab",
      name: "PSYC 400-Level Lab Course",
      credits: 4,
      from: { departments: ["PSYC"], minNumber: 400, maxNumber: 499 },
    },
    {
      kind: "choose",
      id: "psyc-total-credits",
      name: "Total Psychology Credits (35, 11 courses)",
      credits: 35,
      from: { departments: ["PSYC"] },
      overlay: true,
    },
  ],
};

export const psycMajorBsMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Psychology (B.S.)",
  major: "psyc",
  track: "B.S.",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/psychology/psychology-major/",
    department: "https://psyc.umd.edu/undergraduate/degree-requirements-bs-and-ba",
  },
};
