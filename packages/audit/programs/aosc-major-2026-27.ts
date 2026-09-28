// Atmospheric and Oceanic Science Major, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/atmospheric-oceanic-science/atmospheric-oceanic-science-major/;
// Department of Atmospheric & Oceanic Science, "Major Requirements",
// https://aosc.umd.edu/education/undergrad-major/current-students/major (fetched 2026-09-27).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page; each such difference is recorded below citing both.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

const AOSC_400_ELECTIVES = ["AOSC400", "AOSC401", "AOSC420", "AOSC424", "AOSC433", "AOSC434", "AOSC447", "AOSC470", "AOSC472", "AOSC484"];
// "Required Supporting Electives" (department page): named cross-department courses, plus any
// additional AOSC 400-level course not already used for the four electives above (a course counts
// toward at most one non-overlay requirement per program, so this is automatic).
const SUPPORTING_ELECTIVES = [
  "AOSC375", "BSCI373", "BSCI375", "GEOG201", "GEOG472", "GEOG415",
  "GEOL120", "GEOL437", "GEOL451", "GEOL452",
  "MATH461", "MATH240", "MATH462", "STAT400", "STAT401", "CMSC460", "CMSC466",
];

export const aoscMajor: Program = {
  id: "aosc-major",
  name: "Atmospheric and Oceanic Science Major",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Atmospheric and Oceanic Science Major; " +
    "Department of Atmospheric & Oceanic Science, Major Requirements, " +
    "https://aosc.umd.edu/education/undergrad-major/current-students/major (fetched 2026-09-27)",
  minGrade: "C",
  verified: false,
  reviewNotes: [
    "Department-vs-catalog difference (owner ruling: follow the department page): the department's Major Requirements page says 'students must achieve a grade of C or higher in all courses applied to the major' -- a plain C, not C-. An earlier automated pass at the catalog page reported 'C- or better'; the department's own wording (C or higher) is used here.",
    "'200 level AOSC course (AOSC2xx)' is encoded as a `choose` filter over AOSC 200-299, excluding AOSC201 (the Weather and Climate Lab, which is separately required) so the two don't compete for the same course.",
    "'Required Supporting Electives' (at least 6 credits, 'inside the department or supporting courses outside the department, not already used to fulfill previous requirements') lists specific named courses plus 'a 400-level AOSC course not already fulfilling another requirement'; encoded as a `choose` credit pool over the named list plus any AOSC 400-499 course. The department page's fallback ('other courses not listed ... with prior approval from an academic advisor') is not encoded -- open-ended, advisor-gated.",
    "The department's own sample-plan spreadsheet (see the fixture) lists AOSC493 at 3 credits and AOSC494 at 1 credit in its course columns, the reverse of the Major Requirements page's own credit column (AOSC493 Seminar = 1 credit, AOSC494 Senior Research I = 3 credits). The requirements page's credits are used here and in the fixture; the spreadsheet looks like a stale swap.",
    "Not encoded (engine gap, not a disagreement -- both sources are informational only): 'AOSC major requirements will satisfy 25 of the General Education/CORE requirements' and the 120-credit/40-46-Gen-Ed framing; the audit only checks the major's own requirements.",
  ],
  requirements: [
    { kind: "course", id: "math140", name: "Calculus I", options: ["MATH140"] },
    { kind: "course", id: "math141", name: "Calculus II", options: ["MATH141"] },
    { kind: "course", id: "math241", name: "Calculus III", options: ["MATH241"] },
    { kind: "course", id: "math246", name: "Differential Equations for Scientists and Engineers", options: ["MATH246"] },
    { kind: "course", id: "chem135", name: "General Chemistry", options: ["CHEM135"] },
    { kind: "course", id: "chem132", name: "General Chemistry Laboratory", options: ["CHEM132"] },
    { kind: "course", id: "computer-programming", name: "Computer programming course", options: ["AOSC247", "AOSC447", "CMSC106", "CMSC131"] },
    { kind: "course", id: "phys161", name: "Mechanics and Particle Dynamics", options: ["PHYS161"] },
    { kind: "course", id: "phys260", name: "Vibration, Waves, Heat, Electricity and Magnetism", options: ["PHYS260"] },
    { kind: "course", id: "phys261", name: "Vibration, Waves, Heat, Electricity and Magnetism Laboratory", options: ["PHYS261"] },
    { kind: "course", id: "phys270", name: "Electrodynamics, Light, Relativity and Modern Physics", options: ["PHYS270"] },
    { kind: "course", id: "phys271", name: "Electrodynamics, Light, Relativity and Modern Physics Laboratory", options: ["PHYS271"] },
    { kind: "choose", id: "aosc-200-level", name: "200-level AOSC course", count: 1, from: { departments: ["AOSC"], minNumber: 200, maxNumber: 299, exclude: ["AOSC201"] } },
    { kind: "course", id: "aosc201", name: "Weather and Climate Laboratory", options: ["AOSC201"] },
    { kind: "course", id: "aosc431", name: "Atmospheric Thermodynamics", options: ["AOSC431"] },
    { kind: "course", id: "aosc432", name: "Large Scale Dynamics", options: ["AOSC432"] },
    { kind: "course", id: "aosc493", name: "AOSC Seminar", options: ["AOSC493"] },
    { kind: "course", id: "aosc494", name: "Senior Research I", options: ["AOSC494"] },
    { kind: "course", id: "aosc498", name: "Senior Research II", options: ["AOSC498"] },
    { kind: "choose", id: "aosc-400-elective", name: "Four AOSC 400-level elective courses", count: 4, from: { courses: AOSC_400_ELECTIVES } },
    { kind: "choose", id: "supporting-elective", name: "Supporting electives (6 credits)", credits: 6, from: { courses: SUPPORTING_ELECTIVES, departments: ["AOSC"], minNumber: 400, maxNumber: 499 } },
  ],
};

export const aoscMajorMeta: ProgramMeta = { kind: "major", college: "CMNS", short: "AOSC", sources: { catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/atmospheric-oceanic-science/atmospheric-oceanic-science-major/", department: "https://aosc.umd.edu/education/undergrad-major/current-students/major" } };
