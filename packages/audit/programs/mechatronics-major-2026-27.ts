// Mechatronics Engineering Major, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/aerospace-engineering/mechatronics-engineering-major/;
// Department of Mechatronics Engineering (Universities at Shady Grove) page, https://mechatronics.umd.edu/;
// its Curriculum page, https://mechatronics.umd.edu/curriculum (both fetched 2026-09-28); and the
// A. James Clark School of Engineering's official Fall 2026 graduation plan,
// https://eng.umd.edu/sites/clark.umd.edu/files/resource_documents/mechatronics_fall_2026_gradplan_0.pdf
// (fetched 2026-09-28).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

export const mechatronicsMajor: Program = {
  id: "mechatronics-major",
  name: "Mechatronics Engineering Major",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Mechatronics Engineering Major; " +
    "Department of Mechatronics Engineering page, https://mechatronics.umd.edu/ (fetched 2026-09-28); " +
    "Curriculum page, https://mechatronics.umd.edu/curriculum (fetched 2026-09-28); " +
    "official Fall 2026 graduation plan, " +
    "https://eng.umd.edu/sites/clark.umd.edu/files/resource_documents/mechatronics_fall_2026_gradplan_0.pdf (fetched 2026-09-28)",
  verified: false,
  reviewNotes: [
    "This is a Universities at Shady Grove cohort program: students complete the 'Prior Study' " +
      "prerequisites below (lower-level math/science/Gen Ed, ~60 credits) at College Park or elsewhere, " +
      "then apply for Fall-only direct admission into the two-year junior/senior Mechatronics cohort. " +
      "The Prior Study courses are encoded as required courses anyway (same treatment as " +
      "cpse-major-hardware's own prior-study prerequisites), since the official graduation plan's Year " +
      "1/2 terms print them as part of the degree plan itself, not just an admission gate. The admission " +
      "process itself (Fall-only, direct-admission cohort) is out of scope for the audit.",
    "'ENGL39X (Professional Writing)' is one of the 18 line items in the catalog's own 'Required " +
      "Foundation Courses | 54' credit total (18 x 3 = 54, verified by summing the table), so it's part " +
      "of the major's own credits, not a generic Gen Ed slot (same reasoning as biocomp-major's ENGL393). " +
      "The department's Curriculum page names the specific course: 'ENGL393 | Technical Writing' in its " +
      "Semester 2 table. Encoded as ENGL393.",
    "'ENME202 or ENAE202 (Computing Fundamentals for Engineers)' (catalog, Prior Study table): encoded as " +
      "a `course` requirement with both options. The graduation plan's Year 1 Spring term uses ENAE202.",
    "Department-vs-catalog naming differences only (not real conflicts; no encoding effect): ENMT471 is " +
      "titled 'Advanced Manufacturing and Automation' in the catalog vs. 'Manufacturing Processes' on the " +
      "Curriculum page (same course code; Curriculum page's title used per the department-wins ruling). " +
      "The 3 open elective slots are labeled '2 Technical Elective + 1 Program Elective' in the catalog's " +
      "Required Foundation Courses table vs. '2 ENXX4XX Mechatronics/Engineering Elective + 1 Technical " +
      "Elective' in the Curriculum page's Semester 4 table -- same count (3) and same total credits (9); " +
      "see below, neither is encoded regardless.",
    "Not encoded (unenumerable, flagged in docs/project/owner-review.md): the 3 open elective slots -- " +
      "catalog: 'TECHNICAL ELECTIVE (Any approved 300 or 400 level course)' x2 and 'PROGRAM ELECTIVE " +
      "(Program-Specific Elective)' x1; Curriculum page: 'ENXX4XX Mechatronics/Engineering Elective' x2 " +
      "and 'Technical Elective' x1; graduation plan's own Year 4 Spring term grid: 'ENMT 4xx' x2 and " +
      "'ENXX 4xx' x1. All three sources agree on the count (3) and total credits (9), but none names a " +
      "department, a number floor tied to a department list, or any concrete course list for any of the " +
      "three -- the engine's `choose` filter can't express an unrestricted 'any department, 300+/400+' " +
      "floor (its `anyCourse` flag bypasses `minNumber` entirely). Left out of the sample plan entirely " +
      "(same treatment as civil-major's Open Elective / aero-major's unencoded Technical Elective).",
    "'MATH 240 or MATH 461' (Linear Algebra): the catalog's Prior Study table lists MATH240 alone, but " +
      "the official graduation plan names both the Major Requirements panel AND its own Year 2 Spring " +
      "term grid ('MATH 240 or MATH 461  4 or 3') -- not just the boilerplate panel. This is the same " +
      "source-only-from-the-graduation-plan situation as compe-major's and mse-major's CHEM135-or-" +
      "CHEM131&134 alternate (compe-major's own reviewNotes: 'sourced only from the graduation plan's " +
      "overview page, not corroborated by the catalog or department page'), so it's encoded the same way: " +
      "a `course` requirement with both options.",
    "'CHEM 135 - Chem for Eng OR 131 & 134-Fund & Prin' (graduation plan's Major Requirements panel; " +
      "catalog names only CHEM135): same treatment as compe-major's and mse-major's identical chemistry " +
      "alternate, sourced only from the graduation plan. Encoded as a `sets` requirement, " +
      "options [['CHEM135'], ['CHEM131', 'CHEM134']] (CHEM134's own lab is folded into that path, as " +
      "compe-major and mse-major both do -- no separate chemistry-lab course is named for Mechatronics " +
      "on any source, unlike MSE's CHEM136).",
    "Department-vs-catalog credit mismatch (department followed, informational only -- no encoding " +
      "effect since `course`-kind requirements don't carry a credit weight): ENMT484 (capstone) is 3 " +
      "credits in the catalog's Required Courses table and in the graduation plan's own term grid, but " +
      "4 credits on the Curriculum page's Semester 4 table.",
    "Engine gaps (not enforced): the 2.00/2.0 cumulative UMD GPA requirements, residency rules (final 30 " +
      "credits at UMD, 15 of the final 30 at the 300-400 level, 12 upper-level major credits at UMD), and " +
      "the total-credit minimum (catalog: 121; graduation plan's own boilerplate box: 124 -- both figures " +
      "informational only, neither enforced).",
  ],
  requirements: [
    { kind: "course", id: "engl101", name: "Academic Writing", options: ["ENGL101"] },
    { kind: "course", id: "math140", name: "Calculus I", options: ["MATH140"] },
    { kind: "course", id: "math141", name: "Calculus II", options: ["MATH141"] },
    { kind: "course", id: "math241", name: "Calculus III", options: ["MATH241"] },
    { kind: "course", id: "math246", name: "Differential Equations for Scientists and Engineers", options: ["MATH246"] },
    { kind: "course", id: "math240-or-461", name: "Introduction to Linear Algebra (MATH240 or MATH461)", options: ["MATH240", "MATH461"] },
    {
      kind: "sets",
      id: "chem-lecture",
      name: "Chemistry (CHEM135, or CHEM131 and CHEM134)",
      options: [["CHEM135"], ["CHEM131", "CHEM134"]],
    },
    { kind: "course", id: "phys161", name: "General Physics: Mechanics and Particle Dynamics", options: ["PHYS161"] },
    { kind: "course", id: "phys260", name: "General Physics: Electricity, Magnetism and Thermodynamics", options: ["PHYS260"] },
    { kind: "course", id: "phys261", name: "General Physics: Mechanics, Vibrations, Waves, Heat (Laboratory)", options: ["PHYS261"] },
    { kind: "course", id: "phys270", name: "General Physics: Waves, Optics, Relativity and Modern Physics", options: ["PHYS270"] },
    { kind: "course", id: "phys271", name: "General Physics: Electrodynamics, Light, Relativity and Modern Physics (Laboratory)", options: ["PHYS271"] },
    { kind: "course", id: "enes100", name: "Introduction to Engineering Design", options: ["ENES100"] },
    { kind: "course", id: "enes102", name: "Mechanics I", options: ["ENES102"] },
    { kind: "course", id: "enes220", name: "Mechanics II", options: ["ENES220"] },
    { kind: "course", id: "enes232", name: "Thermodynamics", options: ["ENES232"] },
    {
      kind: "course",
      id: "enme202-or-enae202",
      name: "Computing Fundamentals for Engineers (ENME202 or ENAE202)",
      options: ["ENME202", "ENAE202"],
    },
    { kind: "course", id: "enmt301", name: "Structural Dynamics", options: ["ENMT301"] },
    { kind: "course", id: "enmt313", name: "Real Time Software Systems and Microprocessors", options: ["ENMT313"] },
    { kind: "course", id: "enmt322", name: "Discrete Signal Analysis", options: ["ENMT322"] },
    { kind: "course", id: "enmt332", name: "Classical Control Theory", options: ["ENMT332"] },
    { kind: "course", id: "enmt361", name: "Mechatronics and Controls Lab I", options: ["ENMT361"] },
    { kind: "course", id: "enmt362", name: "Mechatronics and Controls Lab II", options: ["ENMT362"] },
    { kind: "course", id: "enmt372", name: "Robotic Systems", options: ["ENMT372"] },
    { kind: "course", id: "enmt380", name: "Intro to Robotics", options: ["ENMT380"] },
    { kind: "course", id: "enmt450", name: "Robotics Programming", options: ["ENMT450"] },
    { kind: "course", id: "enmt471", name: "Manufacturing Processes", options: ["ENMT471"] },
    { kind: "course", id: "enmt473", name: "Motion Planning for Autonomous Systems", options: ["ENMT473"] },
    { kind: "course", id: "enmt477", name: "Machine Learning in Mechatronics Engineering", options: ["ENMT477"] },
    { kind: "course", id: "enmt483", name: "Mechatronic Systems I", options: ["ENMT483"] },
    { kind: "course", id: "engl393", name: "Technical Writing (Professional Writing)", options: ["ENGL393"] },
    { kind: "course", id: "enmt484", name: "Mechatronic Systems II", options: ["ENMT484"] },
  ],
};

export const mechatronicsMajorMeta: ProgramMeta = {
  kind: "major",
  college: "ENGR",
  short: "Mechatronics Eng.",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/aerospace-engineering/mechatronics-engineering-major/",
    department: "https://mechatronics.umd.edu/",
  },
};
