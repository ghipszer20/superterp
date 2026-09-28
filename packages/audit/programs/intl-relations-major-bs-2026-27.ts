// International Relations Major, Bachelor of Science, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/government-politics/international-relations-major/
// (fetched 2026-09-28); Department of Government and Politics, "International Relations Major
// Requirements - Bachelor of Science", https://gvpt.umd.edu/undergraduate/international-relations-major-requirements-bachelor-science
// (fetched 2026-09-28).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page. No disagreement was found between the two sources for this track;
// see reviewNotes below.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

/** Courses already claimed by a named requirement below; excluded from the GVPT department/level
 * filters below, per the source's "no course may satisfy more than one major requirement" rule. */
const BS_ALREADY_USED = ["GVPT170", "GVPT200", "GVPT201", "GVPT241", "GVPT280", "GVPT282", "GVPT320"];

export const intlRelationsMajorBs: Program = {
  id: "intl-relations-major-bs",
  name: "International Relations Major (Bachelor of Science)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, International Relations Major, " +
    "https://academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/government-politics/international-relations-major/ " +
    "(fetched 2026-09-28); Department of Government and Politics, \"International Relations Major Requirements - Bachelor of Science\", " +
    "https://gvpt.umd.edu/undergraduate/international-relations-major-requirements-bachelor-science (fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "No department-vs-catalog disagreement found on degree requirements: both sources agree on the College/Required Courses (GVPT170, math/stat, GVPT201, GVPT320), Foundational Courses, Methods Requirements (3 categories) and Courses of Choice (3 IR/Comparative upper-level courses, 9 credits), and Skills Requirements.",
    "Benchmark 1 (GVPT170, GVPT201, math/stat course) and Benchmark 2 (GVPT320) are not encoded as separate requirements: they are the same courses already required below as Required Courses. Their 'within two semesters'/'within one semester' timing gates are an engine gap (not encoded).",
    "Foundational Courses: GVPT200 and (GVPT280 or GVPT282) encoded as one `choose` requirement, count 2, `alternatives: [[\"GVPT280\", \"GVPT282\"]]`. The third Foundational component, 'One GVPT 100-200 level course (must be IR/Comparative topic)', has no enumerated list in the fetched source. The real approved list is unknown, so this is encoded as a department-and-level filter (any GVPT course numbered 100-299, excluding courses already claimed elsewhere), which is broader than the department's actual (unpublished) list -- flagged in docs/project/owner-review.md.",
    "Methods Requirements: the source names three distinct approved-list categories (a GVPT Methods Course, a GVPT IR/Comparative Quantitative Methods Course, and a GVPT Quantitative Methods Course, each upper-level 300-400) but never enumerates any of the three lists ('Methods course list', 'IR/Comparative Quantitative Methods course list', 'GVPT Quantitative Methods course list' are placeholder headings only). Since the lists can't be told apart from the source, all three are combined into one `choose` requirement, count 3, encoded as a department-and-level filter (any GVPT course numbered 300-400, excluding courses already claimed elsewhere) -- broader than the department's actual (unpublished) lists. Flagged in docs/project/owner-review.md for the owner to split into the three actual categories once the lists are available.",
    "GVPT IR/Comparative Courses of Choice (3 courses, upper-level 300-400, 9 credits): same unenumerated-list situation as Methods Requirements above; encoded with the same GVPT 300-400 department/level filter, excluding already-used courses. No claim is made about which GVPT 300-400 courses are actually IR/Comparative-classified, methods-classified, or quantitative-methods-classified by the department -- both this requirement and Methods Requirements draw on the same broad pool because the source gives no way to separate them; flagged in docs/project/owner-review.md.",
    "NOT encoded (unenumerable, flagged in docs/project/owner-review.md): the Skills Requirement's foreign language components (elementary sequence, 4-12 credits depending on language) and both the 'Quantitative Skills-B.S. track' course and the 'Additional Skills' course (an additional B.S.-track quantitative course OR an intermediate foreign language course) -- all are 'see GVPT website for approved list' footnotes with no course list in the fetched source. Only ECON200 (Microeconomics) is encoded.",
    "Not encoded (engine gap): the 36-42 credit hour band within GVPT (at least 18 upper-level), the 12 in-residence upper-level credit minimum, the program's own 52-61 total-credit range, and the catalog's C- minimum-grade GPA framing beyond the per-course minGrade encoded here -- the audit has no total-credit-range, residency or GPA-average concept.",
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
    { kind: "course", id: "methods-benchmark", name: "GVPT201 Scope and Methods for Political Science Research", options: ["GVPT201"] },
    { kind: "course", id: "gvpt320", name: "GVPT320 Advanced Empirical Research", options: ["GVPT320"] },
    {
      kind: "choose",
      id: "foundational-core",
      name: "Foundational Courses (GVPT200, GVPT280 or GVPT282)",
      count: 2,
      from: { courses: ["GVPT200", "GVPT280", "GVPT282"] },
      alternatives: [["GVPT280", "GVPT282"]],
    },
    {
      kind: "choose",
      id: "foundational-ir-comp-elective",
      name: "One GVPT 100-200 level IR/Comparative topic course",
      count: 1,
      from: { departments: ["GVPT"], minNumber: 100, maxNumber: 299, exclude: BS_ALREADY_USED },
    },
    {
      kind: "choose",
      id: "methods-requirements",
      name: "Methods Requirements (GVPT Methods, IR/Comparative Quantitative Methods, GVPT Quantitative Methods; 3 courses, upper-level)",
      count: 3,
      from: { departments: ["GVPT"], minNumber: 300, maxNumber: 499, exclude: BS_ALREADY_USED },
    },
    {
      kind: "choose",
      id: "choice-ir-comparative",
      name: "GVPT IR/Comparative Courses of Choice, upper-level (300-400), select 3",
      count: 3,
      from: { departments: ["GVPT"], minNumber: 300, maxNumber: 499, exclude: BS_ALREADY_USED },
    },
    { kind: "course", id: "econ200", name: "ECON200 Principles of Microeconomics", options: ["ECON200"] },
  ],
};

export const intlRelationsMajorBsMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "International Relations (B.S.)",
  major: "intl-relations",
  track: "B.S.",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/government-politics/international-relations-major/",
    department: "https://gvpt.umd.edu/undergraduate/international-relations-major-requirements-bachelor-science",
  },
};
