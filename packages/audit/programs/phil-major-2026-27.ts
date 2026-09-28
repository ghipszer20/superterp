// Philosophy Major, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/philosophy/philosophy-major/;
// College of Arts and Humanities' official Philosophy Four Year Academic Plan (PDF, fetched 2026-09-28
// via program-sources/philosophy-major.md -- Google Drive source of docs.google.com fetch script).
// Owner ruling (docs/project/rulings.md): where the department page (the college's four-year plan counts as
// one) and the catalog disagree, follow the department page.
// Encoded by hand. UNVERIFIED until the owner signs off.
// Not Philosophy, Politics, and Economics (a separate program, built in parallel).

import type { Program, ProgramMeta } from "../src/audit.ts";

export const philMajor: Program = {
  id: "phil-major",
  name: "Philosophy Major",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Philosophy Major " +
    "(https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/philosophy/philosophy-major/); " +
    "College of Arts and Humanities Philosophy Four Year Academic Plan (department source), fetched 2026-09-28",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Main session, 2026-09-28: requirements restructured to one 12-course PHIL total plus overlays for the level and topic minimums. The logic overlay uses PHIL170/171/470 (logic courses in the Academic Catalog list; the catalog names none, flagged). The notes below that describe 100/200/300 bands refer to the builder's earlier encoding.",
    "12 PHIL courses (36 credits) distributed per the catalog: one in logic (any level); two or more each " +
      "(2xx-level or above) in history of pre-twentieth-century philosophy, value theory, and metaphysics/" +
      "epistemology (>=6 combined); and 'five additional courses in the major' (the department plan's own " +
      "'Philosophy Electives' label). 1 + 6 + 5 = 12.",
    "None of logic, history-of-pre-20th-century-philosophy, value theory, or metaphysics/epistemology has a " +
      "named course list in either source (just prose topic descriptions), so the audit can't verify a " +
      "chosen course is actually about a given topic -- only its department and number. Two encoding " +
      "consequences, both flagged in docs/project/owner-review.md: (1) the three 2xx+ topic categories " +
      "(history, value theory, metaphysics/epistemology) are collapsed into one 'history-value-metaphysics' " +
      "requirement needing 6 courses at 2xx+, rather than three separate 2-course requirements -- the " +
      "engine can't tell the three topics apart anyway, so three identical, fully-overlapping 2xx+ filters " +
      "would let it silently swap a course meant for one topic into another, masking a real gap; the 2/2/2 " +
      "split across topics isn't separately enforced. (2) logic, the combined topics bucket, and the " +
      "electives bucket are each given a disjoint PHIL number band (100-199 / 200-299 / 300-499) instead of " +
      "the catalog's true, overlapping ranges (logic at any level, topics at 2xx-or-above with no ceiling, " +
      "electives at any level) -- again so the three buckets can't trade courses with each other and hide a " +
      "shortfall. This is stricter than the catalog in each direction and would misclassify some real " +
      "courses: a hypothetical 3xx/4xx logic course, a 3xx/4xx history/value-theory/metaphysics course (the " +
      "catalog explicitly allows 'or above'), or a 100-level elective (the four-year plan's own 'PHIL 1xx-" +
      "4xx' elective slots) would all be misassigned or rejected by this banding. Please confirm this " +
      "tradeoff (verifiable-but-approximate vs. faithful-but-unenforceable) is the right call.",
    "Department-vs-catalog disagreement, NOT encoded either way (flagged in docs/project/owner-review.md): " +
      "the catalog states 'Four courses at 3xx-level or above' and 'Two courses at 4xx-level or above' as " +
      "two lines within the same 12-course list, most naturally read as 4 total courses at 3xx+, of which 2 " +
      "are 4xx+. The department plan's own footnote instead says 'Two of the 12 PHIL courses required for " +
      "the major must be taken at the 4xx level; an additional four PHIL courses must be taken at the 3xx " +
      "or 4xx level' -- 'additional' implies 2 + 4 = 6 total courses at 3xx+ (at least 2 of them 4xx+), not " +
      "4. Engine gap (same shape as amst-major's flagged level/credit aggregate): no requirement type " +
      "aggregates a level minimum across the three buckets that make up the 12 required courses, so a " +
      "'total across buckets' constraint can't be layered on top of them without double-counting or " +
      "arbitrarily forcing one bucket to carry it. The sample plan happens to use enough 3xx/4xx electives " +
      "to satisfy either reading, but this isn't checked by the audit.",
    "Catalog footnote 'Up to nine credits from outside of PHIL may be counted towards the philosophy degree " +
      "upon departmental approval' (matches the department plan's '3 of the 5 [elective] courses may be " +
      "taken in another department') is a permissive allowance with no named non-PHIL courses; not encoded " +
      "(every bucket here requires PHIL). Flagged in docs/project/owner-review.md.",
    "PHIL386 (internship, up to 3 credits toward the major per the catalog footnote, matching the department " +
      "plan's '1 of the 5 [elective] courses may be PHIL386') needs no special-case encoding: it already " +
      "falls within the Philosophy Electives bucket's 300-499 band (assuming a 3-credit-or-fewer offering; " +
      "the catalog doesn't give PHIL386 a fixed number range).",
    "Not encoded (engine gaps): the catalog's 'average of all grades counted toward the major must be 2.0 or " +
      "greater' (per-course C- minimum is encoded; a GPA average across the major's courses is not); " +
      "residency rules (the department plan's 'At least 30 credits at UMD', '15 of the final 30 credits at " +
      "300-400 level', '12 upper level major credits at UMD'); and the 120-credit graduation minimum.",
  ],
  requirements: [
    // Main session, 2026-09-28: the catalog is "12 PHIL courses distributed as follows", so one
    // consuming 12-course PHIL requirement carries the total and each distribution rule is an
    // overlay (checked, not consumed). This replaces the builder's disjoint 100/200/300 bands,
    // which would have failed real students (e.g. a 4xx metaphysics course counting as a topic).
    {
      kind: "choose",
      id: "phil-courses",
      name: "12 courses in philosophy (36 credits)",
      count: 12,
      from: { departments: ["PHIL"], minNumber: 100, maxNumber: 499 },
    },
    {
      kind: "choose",
      id: "phil-3xx",
      name: "Four courses at 3xx-level or above",
      overlay: true,
      count: 4,
      from: { departments: ["PHIL"], minNumber: 300, maxNumber: 499 },
    },
    {
      kind: "choose",
      id: "phil-4xx",
      name: "Two courses at 4xx-level or above",
      overlay: true,
      count: 2,
      from: { departments: ["PHIL"], minNumber: 400, maxNumber: 499 },
    },
    {
      kind: "choose",
      id: "logic",
      name: "One course in logic at any level (PHIL170, PHIL171 or PHIL470; see reviewNotes)",
      overlay: true,
      count: 1,
      from: { courses: ["PHIL170", "PHIL171", "PHIL470"] },
    },
    {
      kind: "choose",
      id: "history-value-metaphysics",
      name: "Six courses at 2xx-level or above: two each in history of pre-twentieth-century philosophy, " +
        "value theory, and metaphysics or epistemology (the per-area split is not checked; see reviewNotes)",
      overlay: true,
      count: 6,
      from: { departments: ["PHIL"], minNumber: 200, maxNumber: 499 },
    },
  ],
};

export const philMajorMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Philosophy",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/philosophy/philosophy-major/",
    department: "https://drive.google.com/uc?export=download&id=1kH1bnxhyH-0GSKpI-WH_4SgdmDLdlJTt#Philosophy",
  },
};
