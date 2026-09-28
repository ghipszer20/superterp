// Astronomy Major, Astrophysics Specialization, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/astronomy/astronomy-major/;
// Department of Astronomy, "Required Course List for BS Astrophysics Specialization"
// (Oct. 8, 2025), https://www.astro.umd.edu/sites/default/files/undergrad/bs-astrophysics_requirements-and-4-year-plan.pdf
// (fetched 2026-09-27), and https://www.astro.umd.edu/education/undergraduate/astronomy-major.
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page; each such difference is recorded below citing both.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program } from "../src/audit.ts";

// Advanced Astronomy Courses (the 9 named 400-level ASTR courses); shared with the other two
// Astronomy specializations, which also allow ASTR320 in this pool (see those files).
export const ASTR_400_LEVEL = ["ASTR406", "ASTR410", "ASTR415", "ASTR421", "ASTR422", "ASTR430", "ASTR435", "ASTR450", "ASTR480"];

export const astrMajorAstrophysics: Program = {
  id: "astr-major-astrophysics",
  name: "Astronomy Major (Astrophysics Specialization)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Astronomy Major; " +
    "Department of Astronomy, Required Course List for BS Astrophysics Specialization (Oct. 8, 2025), " +
    "https://www.astro.umd.edu/sites/default/files/undergrad/bs-astrophysics_requirements-and-4-year-plan.pdf (fetched 2026-09-27)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Department-vs-catalog-adjacent gap (not really a disagreement -- the catalog's PDF export was hard to parse cleanly, so the department's own page is used for these codes rather than re-guessed from the catalog): the department page's raw text names the experiential-learning options as ASTR288, ASTR498 and ASTR399; a garbled catalog-PDF pass this builder tried first turned up an extra, unverifiable 'ASTR086' with no such course found anywhere. The department's three-course list is used.",
    "Experiential learning (3 credits) is encoded as `choose` 3 credits from {ASTR288, ASTR399, ASTR498}, since each option is itself a variable 1-3 credit, repeatable course. The department page's narrower alternate path (a paid internship + zero-credit ASTR386 + one additional 400-level ASTR/PHYS course, advisor approval required) is not encoded -- too approval-gated for the engine. ASTR399 is 'by invitation of the department only'; not enforced (no invitation data on StudentCourse).",
    "PHYS265 may be replaced by PHYS474 or ASTR415 (department page); if ASTR415 is used here it may not also count toward the 400-level Astronomy requirement below -- already true by construction, since a course counts toward at most one non-overlay requirement per program.",
    "MATH243 may be satisfied by MATH246 or MATH240/461 (department page: 'MATH 246 and MATH 240/461 will be accepted for MATH 243'); all three added as options.",
    "Not encoded (engine gap, not a disagreement -- the catalog is silent on it): the 'no more than one 300/400-level study-abroad course in place of an ASTR-prefix course' rule, and the double-major restrictions (may not minor in Physics; may double-major in a Physics specialization or in Computer Science). These are advising rules, not per-course requirements the audit checks.",
  ],
  requirements: [
    { kind: "course", id: "astr130", name: "Astrophysics 1 - Foundations", options: ["ASTR130"] },
    { kind: "course", id: "astr131", name: "Astrophysics 2 - Planets and Stars", options: ["ASTR131"] },
    { kind: "course", id: "astr232", name: "Astrophysics 3 - Milky Way and Beyond", options: ["ASTR232"] },
    { kind: "course", id: "astr310", name: "Observational Astronomy", options: ["ASTR310"] },
    { kind: "course", id: "phys171", name: "Introductory Physics: Mechanics", options: ["PHYS171"] },
    { kind: "course", id: "phys265", name: "Introduction to Scientific Programming", options: ["PHYS265", "PHYS474", "ASTR415"] },
    { kind: "course", id: "phys272", name: "Introductory Physics: Fields", options: ["PHYS272"] },
    { kind: "course", id: "phys273", name: "Intermediate Oscillations and Waves", options: ["PHYS273"] },
    { kind: "course", id: "phys275", name: "Experimental Physics I", options: ["PHYS275"] },
    { kind: "course", id: "phys276", name: "Experimental Physics II", options: ["PHYS276"] },
    { kind: "course", id: "math140", name: "Calculus I", options: ["MATH140"] },
    { kind: "course", id: "math141", name: "Calculus II", options: ["MATH141"] },
    { kind: "course", id: "math241", name: "Calculus III", options: ["MATH241"] },
    { kind: "course", id: "math243", name: "Linear Algebra and Differential Equations", options: ["MATH243", "MATH246", "MATH240", "MATH461"] },
    { kind: "course", id: "astr320", name: "Theoretical Astrophysics", options: ["ASTR320"] },
    { kind: "choose", id: "advanced-astr", name: "Three 400-level Astronomy courses", count: 3, from: { courses: ASTR_400_LEVEL } },
    { kind: "choose", id: "experiential", name: "Experiential learning", credits: 3, from: { courses: ["ASTR288", "ASTR399", "ASTR498"] } },
    { kind: "course", id: "phys313", name: "Electricity and Magnetism I", options: ["PHYS313"] },
    { kind: "course", id: "phys371", name: "Modern Physics", options: ["PHYS371"] },
    { kind: "choose", id: "advanced-phys", name: "Two of PHYS401, PHYS404, PHYS410", count: 2, from: { courses: ["PHYS401", "PHYS404", "PHYS410"] } },
  ],
};
