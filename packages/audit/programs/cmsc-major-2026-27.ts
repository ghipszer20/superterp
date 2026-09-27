// Computer Science Major (B.S.), 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/computer-science/computer-science-major/
// (packages/catalog/test/fixtures/cs-major.html); Department of Computer Science,
// https://undergrad.cs.umd.edu/degree-requirements-cs-major (fetched 2026-09-26; see
// program-sources/cmsc-major.md), with course lists from https://undergrad.cs.umd.edu/general-track-degree-requirements
// and exclusions from https://undergrad.cs.umd.edu/upper-level-concentration. Owner ruling
// (docs/project/rulings.md): where the department page and the catalog disagree, follow the
// department page; each such difference is recorded below citing both sources.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program } from "../src/audit.ts";

const AREAS = [
  { name: "Area 1: Systems", courses: ["CMSC411", "CMSC412", "CMSC414", "CMSC416", "CMSC417"] },
  {
    name: "Area 2: Information Processing",
    courses: ["CMSC420", "CMSC421", "CMSC422", "CMSC423", "CMSC424", "CMSC426", "CMSC427", "CMSC470", "CMSC471", "CMSC472"],
  },
  {
    name: "Area 3: Software Engineering and Programming Languages",
    // CMSC431 (department page only, see review notes below).
    courses: ["CMSC430", "CMSC431", "CMSC433", "CMSC434", "CMSC435", "CMSC436", "CMSC471"],
  },
  { name: "Area 4: Theory", courses: ["CMSC451", "CMSC452", "CMSC454", "CMSC456", "CMSC457", "CMSC474"] },
  { name: "Area 5: Numerical Analysis", courses: ["CMSC460", "CMSC466"] },
];

// Footnote 2 (catalog) / Math Requirements table (department page): the STAT4xx and
// MATH/AMSC/STAT elective slots "cannot be cross-listed with CMSC". Confirmed cross-listings
// (both sources agree these exist; not a department-vs-catalog difference, just an engine gap):
// AMSC460/AMSC466 (= CMSC460/CMSC466, department's Upper Level Concentration page and the
// Machine Learning specialization page, which writes "CMSC/AMSC 460"/"CMSC/AMSC 466"), MATH456
// (= CMSC456/ENEE456), MATH475 (= CMSC475), STAT426 (= CMSC320, "credit only granted for").
const CMSC_CROSSLISTS = ["AMSC460", "AMSC466", "MATH456", "MATH475", "STAT426"];

export const cmscMajor: Program = {
  id: "cmsc-major",
  name: "Computer Science Major",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Computer Science Major; " +
    "Department of Computer Science, https://undergrad.cs.umd.edu/degree-requirements-cs-major (fetched 2026-09-26)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Footnote 2 ('MATH/AMSC/STAT xxx' must have MATH141 or higher as a prerequisite, not cross-listed with CMSC) is approximated as any MATH/AMSC/STAT course numbered 240+. Needs the real prerequisite check. The department page's own Math Requirements table says 'MATH/STATXXX' (no AMSC) for this slot, but its LEP Benchmarks section on the same page says 'MATH/AMSC/STAT course' for the equivalent 75-credit checkpoint -- the department page disagrees with itself, so this isn't a clean department-vs-catalog case. AMSC is kept (catalog's reading; flagged for the owner as unclear wording rather than acted on).",
    "'STAT4xx' is encoded as any STAT course numbered 400–499.",
    "Cross-listed-with-CMSC exclusion (engine gap the catalog and department page both call for, not a disagreement between them; see CMSC_CROSSLISTS above): AMSC460, AMSC466, MATH456, MATH475 and STAT426 are excluded from stat4xx/mathxxx. This list is only as complete as what could be confirmed (department course pages, PlanetTerp/Testudo listings) -- not necessarily exhaustive.",
    "Footnote 4 (credit for only one of CMSC460/CMSC466) is not enforced yet.",
    "Upper-level electives: footnote 3 says 6 credits at the 300/400 level, including 1-credit winter courses and independent study; encoded as 6 credits of CMSC 300–499 excluding CMSC330 and CMSC351. The department's General Track page lists specific eligible electives (CMSC320, 335, 388/389/398 STICs, 395, 396, 401, 425, 437, 473, 475, 476, 477, 488A, 498, 498A, 499A) -- all within this range, so no widening or narrowing needed. CMSC395 (TAs only) and CMSC396 (Dept Honors only) have eligibility gates the audit can't check (no TA/Honors data on StudentCourse); not enforced.",
    "Department-vs-catalog difference (owner ruling: follow the department page): the department's main requirements page lists 'CMSC131 (4) Object-Oriented Programming I* or CMSC133 (2) Object-Oriented Programming I Beyond Fundamentals'; the academic catalog's required-courses table lists only CMSC131. CMSC133 is added to cmsc131's options, alongside the owner-confirmed CMSC141. Flagged for the owner: gateway.ts's GATEWAY_COURSES comment says 'The substitutes match cmsc-major-2026-27.ts' but only lists CMSC131/CMSC141 for the LEP gateway -- CMSC133 now diverges from that comment (gateway.ts is out of scope here; not changed).",
    "Department-vs-catalog difference (owner ruling: follow the department page): the department's General Track distributive-areas page and its Cybersecurity specialization page both list 'CMSC431 (3) Privacy Engineering (formerly CMSC498G)' under Area 3; the academic catalog's Area 3 table (and its Cybersecurity table) omit it. Added to Area 3.",
    "The department's distributive-area lists also count several CMSC498* 'Selected Topics' sections toward specific areas, but only for the semester(s) each was offered (e.g. 'CMSC498C ... Spring 2024, Spring 2025, Spring 2026, and Fall 2026 only'). StudentCourse has no term field, so the audit can't check when a course was taken; these semester-limited area credits are not encoded. Manual check until StudentCourse gains a term.",
    "Department-vs-catalog difference (owner ruling: follow the department page): the department's Upper Level Concentration page ('Not Eligible for ULC') excludes Data Science (DATA), Honors (HONR/HNUH), Information Science (INST) and College Park Scholars (CPSP) from ever being the outside-CMSC discipline; the academic catalog's footnote 5 only says 'no course in or cross-listed with CMSC'. Added to the concentration's excludeDepartments. The same page also lists 'Computer Engineering' and 'Quantum Science Engineering' as ineligible disciplines, but doesn't give them a distinct course prefix (their courses are largely ENEE/PHYS, which the page bans only course-by-course, not wholesale) -- not encoded; manual check. INST's narrow exception (declared in one of two specific Shady Grove minors) also isn't encoded -- INST is excluded outright here.",
    "The same Upper Level Concentration page gives a worked example that a course 'cross-listed as CMSC' is ineligible even outside the CMSC department (e.g. AMSC460) and lists dozens more course-specific exclusions across AOSC, AREC, BIOE, BSCI, BMGT, ECON, ENEE, ENGL, GEOG, GEOL, IMDM, MATH, PHIL, PHPE, PHYS, PSYC and STAT -- explicitly captioned 'not exhaustive; updated with new courses regularly' and 'send the syllabus to your advisor for review'. The concentration requirement only supports whole-department exclusion (excludeDepartments), not a per-course list, and this table is advisor-maintained rather than a fixed rule; not encoded. Manual check (see program-sources/cmsc-major.md for the full list as fetched).",
    "Both sources require a minimum GPA in the outside-CMSC concentration coursework, but disagree on the number: the department's Upper Level Concentration page says 'a cumulative GPA of 1.7 or higher'; the academic catalog's footnote 5 says 'an overall 2.0 average'. Department-vs-catalog difference (owner ruling: follow the department page) -- 1.7 is the number to use once the engine can check it. The audit engine has no GPA-average concept, only per-course minGrade, so this stays a manual check either way.",
    "Footnote 5 / the concentration page also require: each course at least 3 credits, at most one independent-study/experiential-learning course, up to 6 transfer credits, and no course also used for the CS major (the last one is already true by construction -- a course counts toward at most one non-overlay requirement per program). None of the credit/count limits are enforced; manual check.",
    "LEP Benchmarks (department page): a 45-credit checkpoint (CMSC131, CMSC132, MATH140, each C- or better, 2.0 cumulative GPA) and a 75-credit checkpoint (CMSC330, CMSC351, one of STAT4xx/MATH-AMSC-STAT xxx, C- or better, 2.0 cumulative GPA). This is a progress-checkpoint concept (tied to credits-earned-so-far) the audit engine doesn't model at all (it only reports gaps against the finished requirement list, not by checkpoint); not encoded. Flagged for the owner: this page's 2.0 GPA differs from gateway.ts's Fall-2024-or-later rule of a 3.0 cumulative GPA -- gateway.ts is out of scope here (not changed), but the two pages may describe different things (an ongoing-major benchmark vs. LEP admission) or one may be stale; worth the owner's attention.",
    "No CS-specific residency requirement is stated on the department's requirements pages (only the general university residency policy would apply, which the audit engine doesn't model at all).",
    "Minimum grade C- applies to all major courses here; gateway courses need B- for students who started Fall 2024 or later (CS tracking sheet), handled separately by the gateway check.",
    "Specializations (Cybersecurity, Data Science, Machine Learning, Quantum Information) are separate programs, not encoded yet (see report/follow-ups). The academic catalog's tables for these are also stale relative to the department's specialization pages: Cybersecurity's 'choose four' list is missing CMSC431; Data Science's 'choose two' list is missing CMSC431 and CMSC471; and the department adds MATH461 and MATH341 as Linear Algebra options alongside MATH240 for Data Science, Machine Learning and Quantum Information (the catalog only lists MATH240 for these tracks' supporting math).",
  ],
  requirements: [
    // Required lower-level courses (unless exempt by proficiency exam, footnote 1)
    { kind: "course", id: "math140", name: "Calculus I", options: ["MATH140"] },
    { kind: "course", id: "math141", name: "Calculus II", options: ["MATH141"] },
    // Owner-confirmed 2026-09-25: CMSC141 counts for CMSC131 and CMSC142 for CMSC132.
    // CMSC133 (department page, see review notes): "CMSC131 or CMSC133".
    { kind: "course", id: "cmsc131", name: "Object-Oriented Programming I", options: ["CMSC131", "CMSC141", "CMSC133"] },
    { kind: "course", id: "cmsc132", name: "Object-Oriented Programming II", options: ["CMSC132", "CMSC142"] },
    { kind: "course", id: "cmsc216", name: "Introduction to Computer Systems", options: ["CMSC216"] },
    { kind: "course", id: "cmsc250", name: "Discrete Structures", options: ["CMSC250"] },
    // Additional required courses
    { kind: "course", id: "cmsc330", name: "Organization of Programming Languages", options: ["CMSC330"] },
    { kind: "course", id: "cmsc351", name: "Algorithms", options: ["CMSC351"] },
    {
      kind: "choose",
      id: "stat4xx",
      name: "STAT 400-level course",
      count: 1,
      from: { departments: ["STAT"], minNumber: 400, maxNumber: 499, exclude: CMSC_CROSSLISTS },
    },
    {
      kind: "choose",
      id: "mathxxx",
      name: "MATH/AMSC/STAT course (prerequisite MATH141 or higher)",
      count: 1,
      from: { departments: ["MATH", "AMSC", "STAT"], minNumber: 240, maxNumber: 499, exclude: CMSC_CROSSLISTS },
    },
    // Upper level: five 400-level courses from at least three areas, at most three per area (footnote 3)
    { kind: "distribution", id: "areas", name: "Five 400-level CMSC courses across three areas", count: 5, minAreas: 3, maxPerArea: 3, areas: AREAS },
    {
      kind: "choose",
      id: "electives",
      name: "Upper-level CMSC electives (6 credits)",
      credits: 6,
      from: { departments: ["CMSC"], minNumber: 300, maxNumber: 499, exclude: ["CMSC330", "CMSC351"] },
    },
    // Upper-level concentration (footnote 5; department page: "Upper Level Concentration")
    {
      kind: "concentration",
      id: "concentration",
      name: "12 credits of 300–400 level courses in one discipline outside CMSC",
      credits: 12,
      minNumber: 300,
      maxNumber: 499,
      // CMSC excluded by both sources; DATA/HONR/HNUH/INST/CPSP excluded by the department
      // page only (see review notes above).
      excludeDepartments: ["CMSC", "DATA", "HONR", "HNUH", "INST", "CPSP"],
    },
  ],
};
