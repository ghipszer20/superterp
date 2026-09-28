// International Relations Major, Bachelor of Arts, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/government-politics/international-relations-major/
// (fetched 2026-09-28); Department of Government and Politics, "International Relations Major
// Requirements - Bachelor of Arts", https://gvpt.umd.edu/undergraduate/international-relations-major-requirements-bachelor-arts
// (fetched 2026-09-28).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page. No disagreement was found between the two sources for this track;
// see reviewNotes below.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

/** Real undergraduate GVPT courses at the 300-400 level (umd.io, checked 2026-09-28), used below
 * wherever the source names an "approved list" or "courses of choice" category without enumerating
 * the actual course numbers (owner instruction, 2026-09-28). */
const GVPT_300_400 = [
  "GVPT306", "GVPT320", "GVPT354", "GVPT356", "GVPT357", "GVPT377", "GVPT388", "GVPT390",
  "GVPT396", "GVPT397", "GVPT404", "GVPT406", "GVPT410", "GVPT411", "GVPT412", "GVPT413",
  "GVPT414", "GVPT423", "GVPT431", "GVPT454", "GVPT457", "GVPT461", "GVPT474", "GVPT482",
];

/** Courses already claimed by a named requirement below; excluded from the Courses of Choice pools
 * per the department page's "cannot be double counted as GVPT Courses of Choice" language. */
const BA_ALREADY_USED = ["GVPT170", "GVPT200", "GVPT241", "GVPT280", "GVPT282", "GVPT201"];

export const intlRelationsMajorBa: Program = {
  id: "intl-relations-major-ba",
  name: "International Relations Major (Bachelor of Arts)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, International Relations Major, " +
    "https://academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/government-politics/international-relations-major/ " +
    "(fetched 2026-09-28); Department of Government and Politics, \"International Relations Major Requirements - Bachelor of Arts\", " +
    "https://gvpt.umd.edu/undergraduate/international-relations-major-requirements-bachelor-arts (fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "No department-vs-catalog disagreement found on degree requirements: both sources agree on the Required Courses, Foundational Courses, Methods Requirement, Courses of Choice split (1 any-level + 1 upper-level any-subfield + 5 IR/Comparative upper-level) and Skills Requirements. The department page's own Benchmark section says students must complete 'the following four courses' but then lists only three (GVPT170, one 200-level GVPT course, one math/stat course) -- a wording slip on the department's own page, not a catalog conflict.",
    "Benchmark courses (GVPT170, a 200-level GVPT course, the math/stat course) are not encoded as a separate requirement: they are the same courses already required by Required Courses/Foundational Courses below. The 'within two semesters of entering the major' timing gate is an engine gap (not encoded).",
    "Foundational Courses (GVPT200, GVPT241, and GVPT280 or GVPT282) encoded as one `choose` requirement, count 3, with `alternatives: [[\"GVPT280\", \"GVPT282\"]]` so only one of that pair counts, forcing GVPT200 + GVPT241 + one of GVPT280/GVPT282.",
    "GVPT Courses of Choice (any level, any subfield; and upper-level 300-400, any subfield) are each encoded as a `choose` requirement over the GVPT department, excluding every course already claimed by Required Courses, Foundational Courses and the Methods Requirement -- matching the department page's explicit 'cannot be double counted as GVPT Courses of Choice' language for Foundational and Methods courses.",
    "GVPT IR/Comparative Courses of Choice (5 courses, upper-level 300-400, 15 credits): neither source enumerates the actual 'list of approved courses' -- only a placeholder heading ('IR/Comparative 300/400 courses'). Encoded from the real 300-400-level undergraduate GVPT course list supplied by the owner (GVPT_300_400 above), not from the source itself; no claim is made about which of those are actually IR/Comparative-classified by the department.",
    "NOT encoded (unenumerable, flagged in docs/project/owner-review.md): the Skills Requirement's foreign language components (elementary sequence, 4-12 credits depending on language; and the intermediate-level course) and the Quantitative Skills course -- both are 'see GVPT website for approved list' footnotes with no course list in the fetched source. Only ECON200 (Microeconomics), the only Skills component the source names outright, is encoded.",
    "Not encoded (engine gap): the 36-42 credit hour band within GVPT (with at least 18 upper-level), the 12 in-residence upper-level credit minimum, the program's own 52-64 total-credit range, and the catalog's C- minimum-grade GPA framing beyond the per-course minGrade encoded here -- the audit has no total-credit-range, residency or GPA-average concept.",
  ],
  requirements: [
    { kind: "course", id: "gvpt170", name: "GVPT170 American Government", options: ["GVPT170"] },
    {
      kind: "choose",
      id: "math-benchmark",
      name: "Math/Statistics Benchmark (select one)",
      count: 1,
      from: { courses: ["STAT100", "MATH107", "MATH113", "MATH115", "MATH120", "MATH135", "MATH136", "MATH140"] },
    },
    {
      kind: "choose",
      id: "foundational",
      name: "Foundational Courses (GVPT200, GVPT241, GVPT280 or GVPT282)",
      count: 3,
      from: { courses: ["GVPT200", "GVPT241", "GVPT280", "GVPT282"] },
      alternatives: [["GVPT280", "GVPT282"]],
    },
    { kind: "course", id: "methods", name: "GVPT201 Scope and Methods for Political Science Research", options: ["GVPT201"] },
    {
      kind: "choose",
      id: "choice-any-level",
      name: "GVPT Course of Choice (any level, any subfield)",
      count: 1,
      from: { departments: ["GVPT"], exclude: BA_ALREADY_USED },
    },
    {
      kind: "choose",
      id: "choice-upper-level",
      name: "GVPT Course of Choice, upper-level (300-400), any subfield",
      count: 1,
      from: { departments: ["GVPT"], minNumber: 300, maxNumber: 499, exclude: BA_ALREADY_USED },
    },
    {
      kind: "choose",
      id: "choice-ir-comparative",
      name: "GVPT IR/Comparative Courses of Choice, upper-level (300-400), select 5",
      count: 5,
      from: { courses: GVPT_300_400, exclude: BA_ALREADY_USED },
    },
    { kind: "course", id: "econ200", name: "ECON200 Principles of Microeconomics", options: ["ECON200"] },
  ],
};

export const intlRelationsMajorBaMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "International Relations (B.A.)",
  major: "intl-relations",
  track: "B.A.",
  defaultTrack: true,
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/government-politics/international-relations-major/",
    department: "https://gvpt.umd.edu/undergraduate/international-relations-major-requirements-bachelor-arts",
  },
};
