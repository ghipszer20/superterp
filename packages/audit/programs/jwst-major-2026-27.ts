// Jewish Studies Major, 2026-27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/jewish-studies/jewish-studies-major/;
// College of Arts and Humanities' official Jewish Studies Four Year Academic Plan (PDF, fetched
// 2026-09-28 via program-sources/jewish-studies-major.md -- Google Drive source of a fetch script).
// Owner ruling (docs/project/rulings.md): where the department page (the college's four-year plan
// counts as one) and the catalog disagree, follow the department page.
// Two tracks share the same 15-credit Foundations + Capstone core but differ in required courses
// for the Major Track (General Jewish Studies vs Language Enhanced), so this file has two
// Program/Meta pairs sharing major key "jwst-major".
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Area, Program, ProgramMeta, Requirement } from "../src/audit.ts";

const CATALOG_URL = "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/jewish-studies/jewish-studies-major/";
const COLLEGE_URL = "https://drive.google.com/uc?export=download&id=1PDQm3Yaw9ilNtPnjFPwD6U-3It5SrZ32#Music-Education---Jewish-Studies";

const SOURCE =
  "UMD Academic Catalog 2026-27, Jewish Studies Major (" +
  CATALOG_URL +
  "); College of Arts and Humanities Jewish Studies Four Year Academic Plan (department source), fetched 2026-09-28";

// Every course the catalog and the department plan name by number for Foundations and the
// Capstone. Used to exclude these from the Major Track's open-ended filters so a course can't be
// double-assigned to the wrong slot.
const NAMED_CORE_COURSES = [
  "JWST187",
  "JWST171",
  "JWST231",
  "JWST233",
  "JWST275",
  "ISRL289",
  "JWST272",
  "ISRL282",
  "JWST250",
  "JWST262",
  "ISRL249",
  "JWST409",
  "ISRL448",
];

const FOUNDATIONS_AREAS: Area[] = [
  { name: "History", courses: ["JWST231", "JWST233", "JWST275", "ISRL289"] },
  { name: "Literature and/or Film", courses: ["JWST272", "ISRL282"] },
  { name: "Thought, Culture, and/or Religion", courses: ["JWST250", "JWST262", "ISRL249"] },
];

const SHARED_NOTES = [
  "No disagreement found between the catalog and the department's four-year plan: both name the " +
    "same Big Question options (JWST187/JWST171), the same three Foundations areas and their " +
    "courses, the same Capstone options (JWST409/ISRL448), and the same two-track structure with " +
    "matching track requirements. The plan's college/university-layer items (ARHU 158, Global " +
    "Engagement, Gen Ed) are out of scope here.",
  "'Area of Emphasis... in One of the Core Jewish Studies Areas' (General Track footnote and " +
    "Language Enhanced Track footnote) restricts the 300-400 level Area of Emphasis courses to a " +
    "single one of the three Foundations areas (History; Literature and/or Film; Thought, Culture, " +
    "and/or Religion). Neither source publishes which specific 300-400 level courses belong to each " +
    "area, so this is approximated (like amst-major-2026-27.ts's Focus Area) as any 300-400 level " +
    "JWST or ISRL course excluding the named Foundations/Capstone courses -- broader than the " +
    "catalog's actual single-area restriction, since the engine has no requirement type that pins a " +
    "choose to one of several named areas. Flagged in docs/project/owner-review.md.",
  "'Up to two Hebrew or Yiddish language courses at any level can count toward the major (other " +
    "languages with the written permission of JWST advisor)' is a permissive cross-department " +
    "substitution capped at two courses; the engine has no mechanism to cap how many courses from an " +
    "outside department may substitute into a fixed-department filter (In-Major Electives here), so " +
    "this allowance is not encoded. Flagged in docs/project/owner-review.md.",
  "Hebrew and Yiddish language departments: HEBR (Hebrew) is a real UMD department code, confirmed " +
    "by other program sources already in this codebase (program-sources/hebrew-minor.md, " +
    "program-sources/israel-studies-minor.md list HEBR106/107/206/207/211/212/249/313/314/381/386/ " +
    "498/499). No Yiddish-specific undergraduate department code is confirmed anywhere in this " +
    "codebase's sources, so the Language Enhanced Track's Hebrew-or-Yiddish requirement below is " +
    "encoded against HEBR only; flagged in docs/project/owner-review.md for the owner to supply a " +
    "Yiddish department code if one exists.",
  "Not encoded (engine gaps): a 2.0 cumulative average in major requirements, residency rules (30 " +
    "credits at UMD, 15 of the final 30 credits at the 300-400 level, 12 upper-level major credits at " +
    "UMD), and the 120-credit/39 upper-level-credit graduation minimums. The audit engine checks " +
    "per-requirement course assignment and per-course minGrade, not GPA, residency, or credit totals.",
];

function foundations(): Requirement[] {
  return [
    {
      kind: "choose",
      id: "big-question",
      name: "Big Question course (JWST187 or JWST171)",
      count: 1,
      from: { courses: ["JWST187", "JWST171"] },
    },
    {
      kind: "distribution",
      id: "foundations-areas",
      name: "Three courses from at least two of: History, Literature and/or Film, Thought/Culture/Religion",
      count: 3,
      minAreas: 2,
      maxPerArea: 2,
      areas: FOUNDATIONS_AREAS,
    },
    {
      kind: "course",
      id: "capstone",
      name: "Capstone (JWST409 Research Seminar in Jewish Studies or ISRL448 Seminar in Israel Studies)",
      options: ["JWST409", "ISRL448"],
    },
  ];
}

function inMajorElectives(): Requirement {
  return {
    kind: "choose",
    id: "in-major-electives",
    name: "In-Major Electives: three courses in Jewish Studies",
    count: 3,
    from: { departments: ["JWST"], exclude: NAMED_CORE_COURSES },
  };
}

// ---------------------------------------------------------------------------------------------
// General Jewish Studies Track (default)
// ---------------------------------------------------------------------------------------------

export const jwstMajor: Program = {
  id: "jwst-major",
  name: "Jewish Studies Major (General Jewish Studies Track)",
  catalogYear: "2026-27",
  source: SOURCE,
  minGrade: "C-",
  verified: false,
  reviewNotes: [...SHARED_NOTES],
  requirements: [
    ...foundations(),
    {
      kind: "choose",
      id: "area-of-emphasis",
      name: "Area of Emphasis: four courses at the 300-400 level in one Core Jewish Studies area",
      count: 4,
      from: { departments: ["JWST", "ISRL"], minNumber: 300, maxNumber: 499, exclude: NAMED_CORE_COURSES },
    },
    inMajorElectives(),
  ],
};

export const jwstMajorMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Jewish Studies",
  major: "jwst-major",
  track: "General Jewish Studies",
  defaultTrack: true,
  sources: { catalog: CATALOG_URL, department: COLLEGE_URL },
};

// ---------------------------------------------------------------------------------------------
// Language Enhanced Track
// ---------------------------------------------------------------------------------------------

export const jwstMajorLanguageEnhanced: Program = {
  id: "jwst-major-language-enhanced",
  name: "Jewish Studies Major (Language Enhanced Track)",
  catalogYear: "2026-27",
  source: SOURCE,
  minGrade: "C-",
  verified: false,
  reviewNotes: [...SHARED_NOTES],
  requirements: [
    ...foundations(),
    {
      kind: "choose",
      id: "hebrew-or-yiddish",
      name: "Six credits at the 3XX-4XX level in Hebrew or Yiddish (other languages by written permission of the JWST advisor)",
      credits: 6,
      from: { departments: ["HEBR"], minNumber: 300, maxNumber: 499 },
    },
    {
      kind: "choose",
      id: "area-of-emphasis",
      name: "Nine credits at the 300-400 level in one Core Jewish Studies area",
      credits: 9,
      from: { departments: ["JWST", "ISRL"], minNumber: 300, maxNumber: 499, exclude: NAMED_CORE_COURSES },
    },
    inMajorElectives(),
  ],
};

export const jwstMajorLanguageEnhancedMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Jewish Studies",
  major: "jwst-major",
  track: "Language Enhanced",
  sources: { catalog: CATALOG_URL, department: COLLEGE_URL },
};
