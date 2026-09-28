// Criminology and Criminal Justice Major, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/criminology-criminal-justice/criminology-criminal-justice-major/;
// college checklist (Feller Center, "CCJS Major Checklist", fetched via Internet Archive 2026-09-28) and
// two-year plan (Feller Center, fetched via Internet Archive 2026-09-28); and the Department of
// Criminology and Criminal Justice's "CCJS Major Requirements" page, https://ccjs.umd.edu/undergraduate/ccjs-major-requirements
// (pasted by the owner 2026-09-26).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog/college checklist
// disagree, follow the department page; each such difference is recorded below citing both.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

export const ccjsMajor: Program = {
  id: "ccjs-major",
  name: "Criminology and Criminal Justice Major",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Criminology and Criminal Justice Major; " +
    "Department of Criminology and Criminal Justice, CCJS Major Requirements, " +
    "https://ccjs.umd.edu/undergraduate/ccjs-major-requirements (pasted by owner 2026-09-26); " +
    "Feller Center CCJS Major Checklist and Two-Year Plan (fetched via Internet Archive 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Department-vs-catalog difference: the Gateway Math calculus substitute. The department page " +
      "(ccjs-major.md, pasted 2026-09-26) and the college checklist both name MATH120, a MATH136-numbered " +
      "course, and MATH140 as substitutes for MATH107/STAT100 -- the department page says 'MATH 120, 136, " +
      "or 140'; the college checklist (embedded in the catalog source file) instead names MATH130, not " +
      "MATH136, alongside MATH120/MATH140. The department page wins: encoded with MATH136, not MATH130.",
    "Department-vs-catalog difference: the Advanced Statistics substitute list for CCJS200. The department " +
      "page's list (BIOM301, BMGT230, ECON230, EPIB315, GEOG306, GEOL351, GVPT422, INST314, JOUR405, " +
      "PSYC200, QMMS251/451 [formerly EDMS451], SOCY201) is much longer than the college checklist embedded " +
      "in the catalog source (CCJS200, SOCY201, PSYC200, BMGT230, or ECON321 -- note ECON321, not ECON230). " +
      "The department page wins and is encoded here; its list is corroborated by the college's own two-year " +
      "plan (same courses, ECON230 not ECON321, EDMS451 which the department page itself says is now " +
      "QMMS251/451) -- so the disagreement is really the college checklist's shorter table versus both other " +
      "department/college sources, not a 50/50 split.",
    "CCJS386 and CCJS332 are explicitly named by the department page as NOT fulfilling the CCJS Courses of " +
      "Choice requirement, so both are excluded from the Courses of Choice filters below even though neither " +
      "is itself a required course.",
    "CCJS Courses of Choice (12 credits / 4 courses) is encoded as two `choose` requirements matching the " +
      "department page's own split (2 courses at the 400 level, 2 courses at any level), mirroring the same " +
      "any-level/upper-level split pattern used for GVPT's Courses of Choice. Both pools exclude every " +
      "specifically-named CCJS requirement course (CCJS100, 105, 200, 230, 300, 340, 342, 345, 450, 451, 454) " +
      "plus CCJS386 and CCJS332, per the department page's 'cannot overlap (double count) courses fulfilling " +
      "CCJS major requirements with the CCJS Courses of Choice requirement' rule.",
    "Not encoded (engine gap, no sub-cap mechanism): the department page's note that Independent Study " +
      "(CCJS399) and Internship (CCJS359) may each contribute at most 3 credits toward Courses of Choice. " +
      "Both are real CCJS-department courses so they already satisfy the any-level `choose` filter as written; " +
      "a plan using multiple sections of either would still pass.",
    "Not encoded (engine gaps): the department's 2.0 combined GPA-in-the-major requirement, the catalog's " +
      "residency rules (30 credits at UMD, 15 of the final 30 at the 300-400 level, 12 upper-level major " +
      "credits at UMD), and the 120-credit graduation minimum (39 of which are the CCJS major itself). The " +
      "audit engine checks per-requirement course assignment and per-course minGrade, not GPA, residency, or " +
      "program/overall credit totals.",
  ],
  requirements: [
    { kind: "course", id: "ccjs100", name: "Introduction to Criminal Justice", options: ["CCJS100"] },
    { kind: "course", id: "ccjs105", name: "Introduction to Criminology", options: ["CCJS105"] },
    {
      kind: "course",
      id: "gateway-math",
      name: "Gateway Math (MATH107, STAT100, or a calculus course: MATH120, MATH136, MATH140)",
      options: ["MATH107", "STAT100", "MATH120", "MATH136", "MATH140"],
    },
    {
      kind: "course",
      id: "advanced-statistics",
      name: "Advanced Statistics (CCJS200 or an approved substitute)",
      options: [
        "CCJS200",
        "BIOM301",
        "BMGT230",
        "ECON230",
        "EPIB315",
        "GEOG306",
        "GEOL351",
        "GVPT422",
        "INST314",
        "JOUR405",
        "PSYC200",
        "QMMS251",
        "QMMS451",
        "SOCY201",
      ],
    },
    { kind: "course", id: "ccjs230", name: "Criminal Law in Action", options: ["CCJS230"] },
    { kind: "course", id: "ccjs300", name: "Criminological and Criminal Justice Research Methods", options: ["CCJS300"] },
    {
      kind: "choose",
      id: "ccjs-criminal-justice",
      name: "CCJS Criminal Justice Courses (select two of CCJS340, CCJS342, CCJS345)",
      count: 2,
      from: { courses: ["CCJS340", "CCJS342", "CCJS345"] },
    },
    {
      kind: "choose",
      id: "ccjs-criminology-theory",
      name: "CCJS Criminology/Theory Course (select one of CCJS450, CCJS451, CCJS454)",
      count: 1,
      from: { courses: ["CCJS450", "CCJS451", "CCJS454"] },
    },
    {
      kind: "choose",
      id: "ccjs-choice-upper",
      name: "CCJS Courses of Choice (400-level)",
      count: 2,
      from: {
        departments: ["CCJS"],
        minNumber: 400,
        maxNumber: 499,
        exclude: [
          "CCJS100", "CCJS105", "CCJS200", "CCJS230", "CCJS300",
          "CCJS340", "CCJS342", "CCJS345", "CCJS450", "CCJS451", "CCJS454",
          "CCJS386", "CCJS332",
        ],
      },
    },
    {
      kind: "choose",
      id: "ccjs-choice-any",
      name: "CCJS Courses of Choice (any level)",
      count: 2,
      from: {
        departments: ["CCJS"],
        exclude: [
          "CCJS100", "CCJS105", "CCJS200", "CCJS230", "CCJS300",
          "CCJS340", "CCJS342", "CCJS345", "CCJS450", "CCJS451", "CCJS454",
          "CCJS386", "CCJS332",
        ],
      },
    },
  ],
};

export const ccjsMajorMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Criminology & Criminal Justice",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/criminology-criminal-justice/criminology-criminal-justice-major/",
    department: "https://ccjs.umd.edu/undergraduate/ccjs-major-requirements",
  },
};
