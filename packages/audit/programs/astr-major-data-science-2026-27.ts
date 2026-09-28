// Astronomy Major, Astronomy - Data Science Specialization, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/astronomy/astronomy-major/;
// Department of Astronomy, "Required Course List for BS Astronomy - Data Science Specialization"
// (Oct. 8, 2025), https://www.astro.umd.edu/sites/default/files/undergrad/bs-astronomy-data-science_requirements-and-4-year-plan.pdf
// (fetched 2026-09-27), and https://www.astro.umd.edu/education/undergraduate/astronomy-major.
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page; each such difference is recorded below citing both.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

// ASTR320 plus the 9 named 400-level ASTR courses (same 9 as astr-major-astrophysics's
// ASTR_400_LEVEL): this specialization's pool doesn't require ASTR320 on its own, so it's folded
// into the choosable list instead of being a separate required course.
const ADVANCED_ASTR_WITH_320 = ["ASTR320", "ASTR406", "ASTR410", "ASTR415", "ASTR421", "ASTR422", "ASTR430", "ASTR435", "ASTR450", "ASTR480"];

export const astrMajorDataScience: Program = {
  id: "astr-major-data-science",
  name: "Astronomy Major (Astronomy - Data Science Specialization)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Astronomy Major; " +
    "Department of Astronomy, Required Course List for BS Astronomy - Data Science Specialization (Oct. 8, 2025), " +
    "https://www.astro.umd.edu/sites/default/files/undergrad/bs-astronomy-data-science_requirements-and-4-year-plan.pdf (fetched 2026-09-27)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Department-vs-catalog difference (owner ruling: follow the department page): a garbled catalog-PDF pass this builder tried first listed the three-astronomy-course pool as ASTR320 plus the 9 named 400-level courses PLUS ASTR498; the department page's own list is exactly ASTR320 and the 9 named 400-level courses (10 items), with no ASTR498 (a variable-topics/independent-study course, not a distributive-area course). The department's 10-item list is used.",
    "'Three upper-level Astronomy courses' is encoded as `choose` count 3 over the 10-course pool; the department page's parenthetical ('ASTR320 is not required unless it is a pre-/corequisite for one of the 400-level courses taken') isn't separately enforced -- prerequisite checking is outside the audit engine.",
    "PHYS265 may be replaced by PHYS474 or ASTR415 (department page); if ASTR415 is used here it may not also count toward the three-astronomy-course pool above -- already true by construction, since a course counts toward at most one non-overlay requirement per program.",
    "MATH243 may be satisfied by MATH246 or MATH240/461 (department page: 'MATH 246 and MATH 240/461 will be accepted for MATH 243'); all three added as options.",
    "The department page notes students completing this specialization 'are set up for and expected to also complete the Data Science Minor', and that Computer Science majors may not select it; neither is enforced (the minor is a separate program the audit doesn't require, and CS-major exclusion needs cross-program declared-major data the engine doesn't have).",
    "Not encoded (engine gap, not a disagreement): the 'no more than one 300/400-level study-abroad course in place of an ASTR-prefix course' rule.",
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
    { kind: "choose", id: "advanced-astr", name: "Three upper-level Astronomy courses", count: 3, from: { courses: ADVANCED_ASTR_WITH_320 } },
    { kind: "course", id: "data320", name: "Introduction to Data Science", options: ["DATA320"] },
    { kind: "course", id: "data350", name: "Data Visualization and Presentation", options: ["DATA350"] },
    {
      kind: "choose",
      id: "data-math-elective",
      name: "Three of MATH416, MATH423, MATH464, STAT401, STAT430",
      count: 3,
      from: { courses: ["MATH416", "MATH423", "MATH464", "STAT401", "STAT430"] },
    },
  ],
};

export const astrMajorDataScienceMeta: ProgramMeta = { kind: "major", college: "CMNS", short: "Astronomy (Data Science)", major: "astr", track: "Astronomy - Data Science", sources: { catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/astronomy/astronomy-major/", department: "https://www.astro.umd.edu/sites/default/files/undergrad/bs-astronomy-data-science_requirements-and-4-year-plan.pdf" } };
