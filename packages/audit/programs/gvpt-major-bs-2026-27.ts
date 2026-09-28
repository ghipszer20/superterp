// Government and Politics Major, Bachelor of Science Track, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/government-politics/government-politics-major/;
// Department of Government and Politics, "Government and Politics Major Requirements - Bachelor
// of Science", https://gvpt.umd.edu/undergraduate/government-and-politics-major-requirements-bachelor-science
// (fetched 2026-09-28).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page; no such disagreement was found for this track.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

export const gvptMajorBs: Program = {
  id: "gvpt-major-bs",
  name: "Government and Politics Major (Bachelor of Science)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Government and Politics Major; " +
    "Department of Government and Politics, Government and Politics Major Requirements - Bachelor of Science, " +
    "https://gvpt.umd.edu/undergraduate/government-and-politics-major-requirements-bachelor-science (fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Benchmark Requirements (Benchmark 1: GVPT170, GVPT201, one of STAT100/MATH107/MATH113/MATH115/MATH120/MATH135/MATH136/MATH140, within two semesters of entering the major; Benchmark 2: GVPT320, within one semester of completing Benchmark 1) are a progress-to-continue-in-the-major gate, not a separate graduation requirement -- all four courses are already required below. The timing rules are an admission-progress gate the audit doesn't model (matches the ENGR majors' admission-gate precedent).",
    "GVPT Foundational Course Requirement (select one of GVPT200, GVPT280, GVPT282) is enumerable and encoded as a `course` requirement with all three as options.",
    "Not encoded (approved elective with no enumerable list in the fetched sources; flagged in docs/project/owner-review.md): the GVPT Methods Course (300-400 level, 1 course) and the GVPT Quantitative Methods Courses (300-400 level, 2 courses) -- both point to a 'Methods course list' / 'Quantitative Methods course list' hosted elsewhere on the GVPT website that wasn't part of the fetched source file; the Elementary Foreign Language sequence; and the two Quantitative Skills-B.S. track courses -- also an 'approved list of B.S. track options' not included in the fetched source. Together these unencoded skills/methods requirements total 3 (methods) + 6 (quant methods) + 4-12 (language) + 6 (quant skills) = 19-27 credits of the degree.",
    "GVPT Courses of Choice ('2 any-level + 3 upper-level') is encoded as two `choose` requirements matching the catalog table's own split (6 credits any-level = 2 courses / 9 credits 300-400-level = 3 courses). Both pools exclude GVPT170, GVPT201, GVPT320 and the three Foundational Course options (GVPT200, GVPT280, GVPT282), per the catalog's 'a course used to fulfill one requirement for the major may not count towards any other GVPT major requirement.'",
    "No sample plan exists: the Feller Center's graduation-plans page (linked from the catalog) failed to fetch (site unreachable); the department B.S. page's own text also points there ('Sample Graduation Plans can be accessed through the Feller Center Website'), so no official plan was available for either track. The sample plan below is constructed from this page's own requirements, flagged as constructed in docs/project/owner-review.md.",
    "Not encoded (engine gap): the major's overall 36-42 total GVPT credit band and 18-upper-level-credit minimum (these span multiple requirement categories, not a single per-requirement check); the 2.0 cumulative GPA and 120-total-credit graduation requirements referenced by the catalog's general policies; and residency rules.",
    "Re-checked against the GVPT BS Checklist (Feller Center, dated 6/3/25, program-sources/government-politics-major.md 'GVPT BS Checklist' section, fetched as garbled/font-shifted OCR text) -- checked, matches: it confirms the same requirement structure already encoded (GVPT170/201/320, the GVPT200/280/282 Foundational Course, 2 any-level + 3 upper-level Courses of Choice) but does not itself name the approved-elective courses -- the Methods Course, the two Quantitative Methods Courses, the Foreign Language sequence and the two Quantitative Skills-B.S.-track courses all still point out to external pages (go.umd.edu/gvptbs, go.umd.edu/gvptskills) rather than listing courses. The ~19-27-credit unenumerable flag above stands unresolved.",
  ],
  requirements: [
    { kind: "course", id: "gvpt170", name: "American Government", options: ["GVPT170"] },
    {
      kind: "course",
      id: "math-benchmark",
      name: "Math/Statistics Benchmark (STAT100, MATH107, MATH113, MATH115, MATH120, MATH135, MATH136, or MATH140)",
      options: ["STAT100", "MATH107", "MATH113", "MATH115", "MATH120", "MATH135", "MATH136", "MATH140"],
    },
    { kind: "course", id: "gvpt201", name: "Scope and Methods for Political Science Research", options: ["GVPT201"] },
    { kind: "course", id: "gvpt320", name: "Advanced Empirical Research", options: ["GVPT320"] },
    {
      kind: "course",
      id: "gvpt-foundational",
      name: "GVPT Foundational Course (GVPT200, GVPT280, or GVPT282)",
      options: ["GVPT200", "GVPT280", "GVPT282"],
    },
    {
      kind: "choose",
      id: "gvpt-choice-any",
      name: "GVPT Courses of Choice (any level)",
      count: 2,
      from: { departments: ["GVPT"], exclude: ["GVPT170", "GVPT201", "GVPT320", "GVPT200", "GVPT280", "GVPT282"] },
    },
    {
      kind: "choose",
      id: "gvpt-choice-upper",
      name: "GVPT Courses of Choice (300-400 level)",
      count: 3,
      from: { departments: ["GVPT"], minNumber: 300, maxNumber: 499, exclude: ["GVPT170", "GVPT201", "GVPT320", "GVPT200", "GVPT280", "GVPT282"] },
    },
    { kind: "course", id: "econ200", name: "Principles of Microeconomics", options: ["ECON200"] },
  ],
};

export const gvptMajorBsMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Government & Politics (B.S.)",
  major: "gvpt",
  track: "B.S.",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/government-politics/government-politics-major/",
    department: "https://gvpt.umd.edu/undergraduate/government-and-politics-major-requirements-bachelor-science",
  },
};
