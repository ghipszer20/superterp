// Geology Major, Geophysics Track, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/geological-environmental-planetary-sciences/geology-major/;
// Department of Geological, Environmental, and Planetary Sciences, "B.S. Degree in Geology
// (Geophysics Track)", https://www.geol.umd.edu/undergraduate/majorgeophystrack2408.php (effective
// Fall 2024, fetched 2026-09-27; this replaced two older pages -- ugdgeophysmajor.php and
// majorgeophystrack2308.php -- which the department's own program-overview page marks outdated
// and which still used physics course numbers from before the Fall 2024 Physics renumbering
// (PHYS165/174/274); not used here).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page; each such difference is recorded below citing both.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program } from "../src/audit.ts";

export const geolMajorGeophysics: Program = {
  id: "geol-major-geophysics",
  name: "Geology Major (Geophysics Track)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Geology Major; " +
    "Department of Geological, Environmental, and Planetary Sciences, B.S. Degree in Geology (Geophysics Track), " +
    "https://www.geol.umd.edu/undergraduate/majorgeophystrack2408.php (fetched 2026-09-27)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "The 'Fields' and 'Waves' introductory physics courses each have two named options on the department page (PHYS272 or the older-sequence PHYS260; PHYS273 or PHYS270); encoded as `course` requirements with both options rather than collapsing to the modern-sequence course only, since the page names both explicitly for this track.",
    "'Mathematical Methods' is a `sets` choice: MATH243 + GEOL351, or MATH240 + MATH246 (the department page pairs a geoscience statistics course with the newer combined linear-algebra/DE course, or the older two-course math sequence with no statistics course).",
    "'Context Requirements: choose 2' includes 'any upper-level (300+) geology course with director approval' as a fourth option in the Geology half of the list; not encoded (approval-gated, unbounded) -- only the 9 named AOSC/ASTR/GEOL courses are encoded.",
    "Department-vs-catalog-adjacent gap, not a clean disagreement: the department page lists a Chemistry sequence (CHEM131/132 or CHEM135/136) under its own 'Recommended Courses' heading, separate from and worded more weakly than the 'Required' sections above it -- unlike the Professional and Earth & Environmental Sciences tracks, which require chemistry outright under 'Supporting Courses'. Taken at face value (department page wins, and its own wording here is 'recommended', not 'required'), chemistry is NOT encoded as a requirement for this track. Flagged for the owner to confirm this isn't a page-authoring inconsistency, since all three Geology tracks otherwise share a chemistry requirement.",
    "Not encoded (engine gap, both sources agree): 'a grade of C- or better in the required geology courses' is a per-course minGrade (already set), but the page's overall GPA/residency framing (120+ credit minimum, GenEd) isn't an audit concept beyond what's already modeled elsewhere.",
  ],
  requirements: [
    { kind: "course", id: "geol-intro", name: "Physical or Environmental Geology", options: ["GEOL100", "GEOL120"] },
    { kind: "course", id: "geol110", name: "Introductory Geology Laboratory", options: ["GEOL110"] },
    { kind: "course", id: "math140", name: "Calculus I", options: ["MATH140"] },
    { kind: "course", id: "math141", name: "Calculus II", options: ["MATH141"] },
    { kind: "course", id: "math241", name: "Calculus III", options: ["MATH241"] },
    { kind: "course", id: "phys-mechanics", name: "Introductory Physics: Mechanics", options: ["PHYS161", "PHYS171"] },
    { kind: "course", id: "phys265", name: "Introduction to Scientific Programming", options: ["PHYS265"] },
    { kind: "course", id: "phys-fields", name: "Fields", options: ["PHYS272", "PHYS260"] },
    { kind: "course", id: "phys-waves", name: "Waves", options: ["PHYS273", "PHYS270"] },
    { kind: "course", id: "phys275", name: "Experimental Physics I", options: ["PHYS275"] },
    { kind: "course", id: "phys276", name: "Experimental Physics II", options: ["PHYS276"] },
    { kind: "sets", id: "math-methods", name: "Mathematical methods", options: [["MATH243", "GEOL351"], ["MATH240", "MATH246"]] },
    { kind: "course", id: "geol393", name: "Senior Thesis I: Proposal", options: ["GEOL393"] },
    { kind: "course", id: "geol394", name: "Senior Thesis II: Research", options: ["GEOL394"] },
    { kind: "course", id: "geol446", name: "Geophysics", options: ["GEOL446"] },
    {
      kind: "choose",
      id: "depth",
      name: "Depth requirements (3 courses)",
      count: 3,
      from: { courses: ["GEOL447", "GEOL455", "GEOL456", "GEOL457", "GEOL460", "GEOL472"] },
    },
    {
      kind: "choose",
      id: "context",
      name: "Context requirements (2 courses)",
      count: 2,
      from: {
        courses: [
          "AOSC400", "AOSC424", "AOSC431", "AOSC432", "ASTR415", "ASTR430", "ASTR435",
          "GEOL322", "GEOL340", "GEOL341", "GEOL342", "GEOL412", "GEOL423", "GEOL443", "GEOL451", "GEOL463",
        ],
      },
    },
    {
      kind: "choose",
      id: "breadth",
      name: "Breadth requirements (2 courses)",
      count: 2,
      from: { courses: ["PHYS313", "PHYS371", "PHYS401", "PHYS404", "PHYS410", "PHYS413"] },
    },
  ],
};
