// Computer Science Major (B.S.), 2026–27 UMD Academic Catalog.
// Source: academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/computer-science/computer-science-major/
// Encoded by hand from the catalog's requirement table and footnotes. UNVERIFIED until the owner signs off.

import type { Program } from "../src/audit.ts";

const AREAS = [
  { name: "Area 1: Systems", courses: ["CMSC411", "CMSC412", "CMSC414", "CMSC416", "CMSC417"] },
  {
    name: "Area 2: Information Processing",
    courses: ["CMSC420", "CMSC421", "CMSC422", "CMSC423", "CMSC424", "CMSC426", "CMSC427", "CMSC470", "CMSC471", "CMSC472"],
  },
  {
    name: "Area 3: Software Engineering and Programming Languages",
    courses: ["CMSC430", "CMSC433", "CMSC434", "CMSC435", "CMSC436", "CMSC471"],
  },
  { name: "Area 4: Theory", courses: ["CMSC451", "CMSC452", "CMSC454", "CMSC456", "CMSC457", "CMSC474"] },
  { name: "Area 5: Numerical Analysis", courses: ["CMSC460", "CMSC466"] },
];

export const cmscMajor: Program = {
  id: "cmsc-major",
  name: "Computer Science Major",
  catalogYear: "2026-27",
  source: "UMD Academic Catalog 2026–27, Computer Science Major",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Footnote 2 ('MATH/AMSC/STAT xxx' must have MATH141 or higher as a prerequisite, not cross-listed with CMSC) is approximated as any MATH/AMSC/STAT course numbered 240+. Needs the real prerequisite check.",
    "'STAT4xx' is encoded as any STAT course numbered 400–499.",
    "Footnote 4 (credit for only one of CMSC460/CMSC466) is not enforced yet.",
    "Upper-level electives: footnote 3 says 6 credits at the 300/400 level, including 1-credit winter courses and independent study; encoded as 6 credits of CMSC 300–499 excluding CMSC330 and CMSC351.",
    "Footnote 5 concentration details not enforced yet: 2.0 average in the concentration, each course at least 3 credits, at most one special-topics/independent-study course, no CMSC cross-lists.",
    "Minimum grade C- applies to all major courses here; gateway courses need B- for students who started Fall 2024 or later (CS tracking sheet), handled separately by the gateway check.",
    "Specializations (Cybersecurity, Data Science, Machine Learning, Quantum Information) are separate programs, not encoded yet.",
  ],
  requirements: [
    // Required lower-level courses (unless exempt by proficiency exam, footnote 1)
    { kind: "course", id: "math140", name: "Calculus I", options: ["MATH140"] },
    { kind: "course", id: "math141", name: "Calculus II", options: ["MATH141"] },
    // Owner-confirmed 2026-09-25: CMSC141 counts for CMSC131 and CMSC142 for CMSC132.
    { kind: "course", id: "cmsc131", name: "Object-Oriented Programming I", options: ["CMSC131", "CMSC141"] },
    { kind: "course", id: "cmsc132", name: "Object-Oriented Programming II", options: ["CMSC132", "CMSC142"] },
    { kind: "course", id: "cmsc216", name: "Introduction to Computer Systems", options: ["CMSC216"] },
    { kind: "course", id: "cmsc250", name: "Discrete Structures", options: ["CMSC250"] },
    // Additional required courses
    { kind: "course", id: "cmsc330", name: "Organization of Programming Languages", options: ["CMSC330"] },
    { kind: "course", id: "cmsc351", name: "Algorithms", options: ["CMSC351"] },
    { kind: "choose", id: "stat4xx", name: "STAT 400-level course", count: 1, from: { departments: ["STAT"], minNumber: 400, maxNumber: 499 } },
    {
      kind: "choose",
      id: "mathxxx",
      name: "MATH/AMSC/STAT course (prerequisite MATH141 or higher)",
      count: 1,
      from: { departments: ["MATH", "AMSC", "STAT"], minNumber: 240, maxNumber: 499 },
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
    // Upper-level concentration (footnote 5)
    {
      kind: "concentration",
      id: "concentration",
      name: "12 credits of 300–400 level courses in one discipline outside CMSC",
      credits: 12,
      minNumber: 300,
      maxNumber: 499,
      excludeDepartments: ["CMSC"],
    },
  ],
};
