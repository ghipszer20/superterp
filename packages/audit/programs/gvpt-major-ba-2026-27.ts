// Government and Politics Major, Bachelor of Arts Track, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/government-politics/government-politics-major/;
// Department of Government and Politics, "Government and Politics Major Requirements - Bachelor
// of Arts", https://gvpt.umd.edu/undergraduate/government-and-politics-major-requirements-bachelor-arts
// (fetched 2026-09-28). The department's "GVPT Major Requirements - No Concentration" page
// (https://gvpt.umd.edu/undergraduate/gvpt-major-requirements-no-concentration) is a verbatim
// duplicate of this B.A. page (same title, same body text) and adds nothing new.
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page; no such disagreement was found for this track.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

export const gvptMajorBa: Program = {
  id: "gvpt-major-ba",
  name: "Government and Politics Major (Bachelor of Arts)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Government and Politics Major; " +
    "Department of Government and Politics, Government and Politics Major Requirements - Bachelor of Arts, " +
    "https://gvpt.umd.edu/undergraduate/government-and-politics-major-requirements-bachelor-arts (fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Benchmark Requirements (GVPT170, one 200-level GVPT course, one of STAT100/MATH107/MATH113/MATH115/MATH120/MATH135/MATH136/MATH140, all within two semesters of entering the major) are a progress-to-continue-in-the-major gate, not a separate graduation requirement: GVPT170 and the math course are already required courses below, and the department page's own footnote says 'the 200-level Benchmark course may be used to satisfy one of the any-level GVPT Courses of Choice' -- so no separate 200-level requirement is encoded either. The 'not from AP/IB/CLEP credit' and 'within two semesters' timing rules are admission-progress gates the audit doesn't model (matches the ENGR majors' admission-gate precedent).",
    "GVPT Courses of Choice ('9 additional GVPT courses, at least 6 upper-level') is encoded as two `choose` requirements matching the catalog table's own split (9 credits any-level / 18 credits 300-400-level = 3 courses + 6 courses), the same split the department page itself describes ('9 additional... courses... with at least 6... taken at the upper level'). Both pools exclude GVPT170, GVPT241 and GVPT201 (the major's other required GVPT courses), per the catalog's 'a course used to fulfill one requirement for the major may not count towards any other GVPT major requirement' and the department page's own 'This course cannot double count as a GVPT Course of Choice' notes on GVPT241 and GVPT201.",
    "Not encoded (approved elective with no enumerable list in the fetched sources; flagged in docs/project/owner-review.md): the Elementary Foreign Language sequence, the Quantitative Skills course, and the Additional Skills course (a second quantitative skills course or an intermediate foreign language course). All three point to approved lists hosted elsewhere on the GVPT website ('See GVPT website for approved... course list') that weren't part of the fetched source file.",
    "No sample plan exists: the Feller Center's graduation-plans page (linked from the catalog) failed to fetch (site unreachable), so the sample plan below is constructed from this page's own requirements, flagged as constructed in docs/project/owner-review.md.",
    "Not encoded (engine gap): the major's overall 36-42 total GVPT credit band and 18-upper-level-credit minimum (these span multiple requirement categories, not a single per-requirement check); the 2.0 cumulative GPA and 120-total-credit graduation requirements referenced by the catalog's general policies; and residency rules.",
  ],
  requirements: [
    { kind: "course", id: "gvpt170", name: "American Government", options: ["GVPT170"] },
    {
      kind: "course",
      id: "math-benchmark",
      name: "Math/Statistics Benchmark (STAT100, MATH107, MATH113, MATH115, MATH120, MATH135, MATH136, or MATH140)",
      options: ["STAT100", "MATH107", "MATH113", "MATH115", "MATH120", "MATH135", "MATH136", "MATH140"],
    },
    { kind: "course", id: "gvpt241", name: "The Study of Political Philosophy: Ancient and Modern", options: ["GVPT241"] },
    { kind: "course", id: "gvpt201", name: "Scope and Methods for Political Science Research", options: ["GVPT201"] },
    {
      kind: "choose",
      id: "gvpt-choice-any",
      name: "GVPT Courses of Choice (any level)",
      count: 3,
      from: { departments: ["GVPT"], exclude: ["GVPT170", "GVPT241", "GVPT201"] },
    },
    {
      kind: "choose",
      id: "gvpt-choice-upper",
      name: "GVPT Courses of Choice (300-400 level)",
      count: 6,
      from: { departments: ["GVPT"], minNumber: 300, maxNumber: 499, exclude: ["GVPT170", "GVPT241", "GVPT201"] },
    },
    { kind: "course", id: "econ200", name: "Principles of Microeconomics", options: ["ECON200"] },
  ],
};

export const gvptMajorBaMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Government & Politics (B.A.)",
  major: "gvpt",
  track: "B.A.",
  defaultTrack: true,
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/government-politics/government-politics-major/",
    department: "https://gvpt.umd.edu/undergraduate/government-and-politics-major-requirements-bachelor-arts",
  },
};
